import { randomBytes } from 'node:crypto';
import type {
  Attempt,
  Certificate,
  Database,
  LessonProgress,
  SubmitReason,
  AdminMonitorData,
  AdminWorkerProgress,
  AdminWorkerEnrollment,
} from './types';
import { mutateDb, newId, readDb } from './db';
import {
  COURSES,
  ALL_COURSES,
  getCourse,
  getAllLessons,
  getLesson,
  getCoursesForRole,
  type Course,
  type CourseSlug,
  type Lesson,
} from '../courses';
import { getExamDefinition, type ExamQuestion } from '../exam-bank';

export const EXAM_GRACE_SECONDS = 60;

export interface PublicExamQuestion {
  id: string;
  prompt: string;
  options: string[];
}

export interface CourseOverview {
  course: Course;
  enrolled: boolean;
  conditionsAccepted: boolean;
  conditionsAcceptedAt: string | null;
  completedLessonIds: string[];
  completedCount: number;
  totalLessons: number;
  percent: number;
  nextLesson: Lesson | null;
  positions: Record<string, number>;
  notes: Record<string, string>;
  attempt: Attempt | null;
  certificate: Certificate | null;
  examUnlocked: boolean;
}

export interface DashboardCourse extends CourseOverview {
  enrollmentDate: string | null;
}

export interface DashboardData {
  courses: DashboardCourse[];
  enrolledCount: number;
  lessonsCompleted: number;
  certificates: Array<{ certificate: Certificate; course: Course | undefined }>;
  continueLesson: {
    course: Course;
    lesson: Lesson;
    index: number;
    total: number;
    positionSeconds: number;
  } | null;
}

function completedIds(db: Database, userId: string, course: Course): string[] {
  return db.progress
    .filter(
      (entry) =>
        entry.userId === userId && entry.courseId === course.slug && entry.completedAt !== null
    )
    .map((entry) => entry.lessonId);
}

function courseOverviewFromDb(
  db: Database,
  userId: string,
  course: Course
): CourseOverview {
  const lessons = getAllLessons(course);
  const completed = completedIds(db, userId, course);
  const completedSet = new Set(completed);
  const nextLesson = lessons.find((lesson) => !completedSet.has(lesson.id)) ?? null;
  const enrollment = db.enrollments.find(
    (entry) => entry.userId === userId && entry.courseId === course.slug
  );
  const attempt =
    db.attempts
      .filter((entry) => entry.userId === userId && entry.courseId === course.slug)
      .sort((a, b) => Date.parse(b.startedAt) - Date.parse(a.startedAt))[0] ?? null;
  const certificate =
    db.certificates.find(
      (entry) => entry.userId === userId && entry.courseId === course.slug
    ) ?? null;

  const positions: Record<string, number> = {};
  const notes: Record<string, string> = {};
  for (const entry of db.progress) {
    if (entry.userId === userId && entry.courseId === course.slug) {
      positions[entry.lessonId] = entry.positionSeconds;
      if (entry.notes) {
        notes[entry.lessonId] = entry.notes;
      }
    }
  }

  const conditionsAccepted = Boolean(
    enrollment && (enrollment.conditionsAcceptedAt || course.track === 'leadership')
  );

  return {
    course,
    enrolled: Boolean(enrollment),
    conditionsAccepted,
    conditionsAcceptedAt: enrollment?.conditionsAcceptedAt ?? null,
    completedLessonIds: completed,
    completedCount: completed.length,
    totalLessons: lessons.length,
    percent: lessons.length ? Math.round((completed.length / lessons.length) * 100) : 0,
    nextLesson,
    positions,
    notes,
    attempt,
    certificate,
    examUnlocked: completed.length === lessons.length && !certificate,
  };
}

export async function getCourseOverview(
  userId: string,
  course: Course
): Promise<CourseOverview> {
  const db = await readDb();
  return courseOverviewFromDb(db, userId, course);
}

export async function isEnrolled(userId: string, courseSlug: string): Promise<boolean> {
  const db = await readDb();
  return db.enrollments.some(
    (entry) => entry.userId === userId && entry.courseId === courseSlug
  );
}

/**
 * Sequential progression: Lesson 0 is always unlocked.
 * Any subsequent lesson is unlocked IF AND ONLY IF all preceding lessons are completed.
 */
export function isLessonUnlocked(
  course: Course,
  completedLessonIds: string[],
  lessonId: string
): boolean {
  const lessons = getAllLessons(course);
  const targetIndex = lessons.findIndex((l) => l.id === lessonId);
  if (targetIndex <= 0) return true;

  const completedSet = new Set(completedLessonIds);
  // Every lesson before the target must be completed!
  for (let i = 0; i < targetIndex; i++) {
    if (!completedSet.has(lessons[i].id)) {
      return false;
    }
  }
  return true;
}

export function getFirstUnlockedIncompleteLesson(
  course: Course,
  completedLessonIds: string[]
): Lesson | null {
  const lessons = getAllLessons(course);
  const completedSet = new Set(completedLessonIds);
  return lessons.find((l) => !completedSet.has(l.id)) ?? null;
}

export async function getDashboardData(userId: string): Promise<DashboardData> {
  const db = await readDb();
  const user = db.users.find((entry) => entry.id === userId);
  const role = user?.role ?? 'workforce';
  const roleCourses = getCoursesForRole(role);

  const courses = roleCourses.map((course) => {
    const overview = courseOverviewFromDb(db, userId, course);
    const enrollment = db.enrollments.find(
      (entry) => entry.userId === userId && entry.courseId === course.slug
    );
    return {
      ...overview,
      enrollmentDate: enrollment?.enrolledAt ?? null,
    };
  });

  const enrolled = courses.filter((course) => course.enrolled);
  const lessonsCompleted = enrolled.reduce((sum, course) => sum + course.completedCount, 0);

  const certificates = db.certificates
    .filter((entry) => entry.userId === userId)
    .sort((a, b) => Date.parse(b.issuedAt) - Date.parse(a.issuedAt))
    .map((certificate) => ({
      certificate,
      course: ALL_COURSES.find((course) => course.slug === certificate.courseId),
    }));

  // Continue at the first unfinished lesson in the first enrolled track.
  const candidate = enrolled.find((course) => course.nextLesson) ?? null;
  let continueLesson: DashboardData['continueLesson'] = null;
  if (candidate && candidate.nextLesson) {
    const lessons = getAllLessons(candidate.course);
    const index = lessons.findIndex((lesson) => lesson.id === candidate.nextLesson!.id);
    continueLesson = {
      course: candidate.course,
      lesson: candidate.nextLesson,
      index,
      total: lessons.length,
      positionSeconds: candidate.positions[candidate.nextLesson.id] ?? 0,
    };
  }

  return {
    courses,
    enrolledCount: enrolled.length,
    lessonsCompleted,
    certificates,
    continueLesson,
  };
}

export async function enrollInCourse(
  userId: string,
  courseSlug: string,
  acceptConditions = true
): Promise<{ ok: true } | { ok: false; error: string }> {
  const course = getCourse(courseSlug);
  if (!course) return { ok: false, error: 'Course not found.' };

  await mutateDb((db) => {
    const existing = db.enrollments.find(
      (entry) => entry.userId === userId && entry.courseId === course.slug
    );
    if (existing) {
      if (!existing.conditionsAcceptedAt && acceptConditions) {
        existing.conditionsAcceptedAt = new Date().toISOString();
      }
      return;
    }
    db.enrollments.push({
      id: newId('enr'),
      userId,
      courseId: course.slug,
      enrolledAt: new Date().toISOString(),
      conditionsAcceptedAt: acceptConditions ? new Date().toISOString() : null,
    });
  });

  return { ok: true };
}

interface RecordProgressInput {
  userId: string;
  courseSlug: string;
  lessonId: string;
  positionSeconds?: number;
  markComplete?: boolean;
  notes?: string;
}

export async function recordLessonProgress(
  input: RecordProgressInput
): Promise<
  | {
      ok: true;
      completed: boolean;
      positionSeconds: number;
      percent: number;
      completedCount: number;
      totalLessons: number;
      notes?: string;
    }
  | { ok: false; error: string }
> {
  const course = getCourse(input.courseSlug);
  if (!course) return { ok: false, error: 'Course not found.' };
  const found = getLesson(course, input.lessonId);
  if (!found) return { ok: false, error: 'Lesson not found.' };
  const { lesson } = found;

  return mutateDb((db) => {
    const enrolled = db.enrollments.some(
      (entry) => entry.userId === input.userId && entry.courseId === course.slug
    );
    if (!enrolled) return { ok: false, error: 'You are not enrolled in this course.' };

    const now = new Date().toISOString();
    const existing = db.progress.find(
      (entry) =>
        entry.userId === input.userId &&
        entry.courseId === course.slug &&
        entry.lessonId === lesson.id
    );

    const duration = lesson.media?.durationSeconds ?? 0;
    const requestedPosition = Number.isFinite(input.positionSeconds)
      ? Math.max(0, Math.min(input.positionSeconds ?? 0, duration || 10_000))
      : 0;

    let completedAt = existing?.completedAt ?? null;

    // Both reading and audio lessons can be marked complete explicitly
    // (e.g. user downloaded and listened offline, or finished listening)
    if (input.markComplete) {
      completedAt = completedAt ?? now;
    } else if (!completedAt && duration > 0) {
      // Automatic completion after 90% of duration streamed
      if (requestedPosition >= duration * 0.9) {
        completedAt = now;
      }
    }

    const finalPosition = Math.max(existing?.positionSeconds ?? 0, requestedPosition);
    const notes = input.notes !== undefined ? input.notes : existing?.notes;

    if (existing) {
      existing.positionSeconds = finalPosition;
      existing.completedAt = completedAt;
      if (notes !== undefined) existing.notes = notes;
      existing.updatedAt = now;
    } else {
      const entry: LessonProgress = {
        userId: input.userId,
        courseId: course.slug,
        lessonId: lesson.id,
        positionSeconds: finalPosition,
        completedAt,
        notes,
        updatedAt: now,
      };
      db.progress.push(entry);
    }

    const allLessons = getAllLessons(course);
    const done = db.progress.filter(
      (entry) =>
        entry.userId === input.userId &&
        entry.courseId === course.slug &&
        entry.completedAt !== null
    ).length;

    return {
      ok: true,
      completed: Boolean(completedAt),
      positionSeconds: finalPosition,
      completedCount: done,
      totalLessons: allLessons.length,
      percent: Math.round((done / allLessons.length) * 100),
      notes,
    };
  });
}

function publicQuestions(slug: CourseSlug, ids?: string[]): PublicExamQuestion[] {
  const questions = getExamDefinition(slug).questions;
  const selected = ids
    ? questions.filter((question) => ids.includes(question.id))
    : questions;
  return selected.map(({ id, prompt, options }) => ({ id, prompt, options }));
}

export type StartAttemptResult =
  | {
      ok: true;
      attempt: Attempt;
      questions: PublicExamQuestion[];
      remainingSeconds: number;
      resumed: boolean;
    }
  | {
      ok: false;
      error: 'not_enrolled' | 'incomplete' | 'already_attempted' | 'not_found';
      missingLessons?: number;
      attempt?: Attempt | null;
    };

export async function startExamAttempt(
  userId: string,
  courseSlug: string
): Promise<StartAttemptResult> {
  const course = getCourse(courseSlug);
  if (!course) return { ok: false, error: 'not_found' };

  return mutateDb((db): StartAttemptResult => {
    const enrolled = db.enrollments.some(
      (entry) => entry.userId === userId && entry.courseId === course.slug
    );
    if (!enrolled) return { ok: false, error: 'not_enrolled' };

    const existing = db.attempts.find(
      (entry) => entry.userId === userId && entry.courseId === course.slug
    );
    const now = Date.now();

    if (existing) {
      const expires = Date.parse(existing.expiresAt);
      if (existing.status === 'in_progress' && expires > now) {
        return {
          ok: true,
          attempt: existing,
          questions: publicQuestions(course.slug, existing.questionIds),
          remainingSeconds: Math.ceil((expires - now) / 1000),
          resumed: true,
        };
      }
      if (existing.status === 'in_progress') {
        existing.status = 'expired';
        existing.submittedAt = new Date(now).toISOString();
        existing.score = existing.score ?? 0;
        existing.passed = false;
        existing.reason = 'time_expired';
      }
      return { ok: false, error: 'already_attempted', attempt: existing };
    }

    const lessons = getAllLessons(course);
    const done = completedIds(db, userId, course);
    if (done.length < lessons.length) {
      return { ok: false, error: 'incomplete', missingLessons: lessons.length - done.length };
    }

    const definition = getExamDefinition(course.slug);
    const questionIds = definition.questions.map((question) => question.id);
    const startedAt = new Date(now).toISOString();
    const attempt: Attempt = {
      id: newId('att'),
      userId,
      courseId: course.slug,
      questionIds,
      startedAt,
      expiresAt: new Date(now + course.exam.durationMinutes * 60 * 1000).toISOString(),
      submittedAt: null,
      status: 'in_progress',
      answers: null,
      score: null,
      passed: null,
      reason: null,
    };
    db.attempts.push(attempt);

    return {
      ok: true,
      attempt,
      questions: publicQuestions(course.slug, questionIds),
      remainingSeconds: course.exam.durationMinutes * 60,
      resumed: false,
    };
  });
}

function gradeAttempt(
  course: Course,
  attempt: Attempt,
  answers: Record<string, number>,
  status: 'submitted' | 'expired',
  reason: SubmitReason
): { correct: number; total: number; unanswered: number; score: number; passed: boolean } {
  const questions: ExamQuestion[] = getExamDefinition(course.slug).questions.filter(
    (question) => attempt.questionIds.includes(question.id)
  );
  let correct = 0;
  let unanswered = 0;
  for (const question of questions) {
    const answer = answers[question.id];
    if (typeof answer !== 'number' || !Number.isInteger(answer)) {
      unanswered += 1;
      continue;
    }
    if (answer === question.answer) correct += 1;
  }
  const total = questions.length;
  const score = total ? Math.round((correct / total) * 100) : 0;
  const passed = status === 'submitted' && score >= course.exam.passMark;
  attempt.answers = answers;
  attempt.score = score;
  attempt.passed = passed;
  attempt.status = status;
  attempt.reason = reason;
  return { correct, total, unanswered, score, passed };
}

function issueCertificate(
  db: Database,
  userId: string,
  courseSlug: CourseSlug,
  attemptId: string,
  score: number
): Certificate {
  const existing = db.certificates.find(
    (entry) => entry.userId === userId && entry.courseId === courseSlug
  );
  if (existing) return existing;

  const code = `URPN-${randomBytes(2).toString('hex').toUpperCase()}-${randomBytes(2)
    .toString('hex')
    .toUpperCase()}`;
  const certificate: Certificate = {
    id: newId('cert'),
    code,
    userId,
    courseId: courseSlug,
    attemptId,
    score,
    issuedAt: new Date().toISOString(),
  };
  db.certificates.push(certificate);
  return certificate;
}

export interface SubmitAttemptResult {
  ok: boolean;
  error?: string;
  attempt?: Attempt;
  certificate?: Certificate | null;
  correct?: number;
  total?: number;
  unanswered?: number;
  alreadySubmitted?: boolean;
}

export async function submitExamAttempt(input: {
  userId: string;
  attemptId: string;
  answers: Record<string, number>;
  reason: SubmitReason;
}): Promise<SubmitAttemptResult> {
  return mutateDb((db): SubmitAttemptResult => {
    const attempt = db.attempts.find(
      (entry) => entry.id === input.attemptId && entry.userId === input.userId
    );
    if (!attempt) return { ok: false, error: 'Attempt not found.' };
    const course = getCourse(attempt.courseId);
    if (!course) return { ok: false, error: 'Course not found.' };

    if (attempt.status !== 'in_progress') {
      const certificate =
        db.certificates.find(
          (entry) => entry.userId === input.userId && entry.courseId === attempt.courseId
        ) ?? null;
      return {
        ok: true,
        attempt,
        certificate,
        alreadySubmitted: true,
        correct: attempt.score === null ? 0 : Math.round((attempt.score / 100) * attempt.questionIds.length),
        total: attempt.questionIds.length,
        unanswered: 0,
      };
    }

    const cleanAnswers: Record<string, number> = {};
    for (const id of attempt.questionIds) {
      const value = input.answers[id];
      if (typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 3) {
        cleanAnswers[id] = value;
      }
    }

    const now = Date.now();
    const expires = Date.parse(attempt.expiresAt);
    const late = now > expires + EXAM_GRACE_SECONDS * 1000;
    const status = late ? 'expired' : 'submitted';
    const reason: SubmitReason = late ? 'time_expired' : input.reason;
    const graded = gradeAttempt(course, attempt, cleanAnswers, status, reason);
    attempt.submittedAt = new Date(now).toISOString();

    const certificate =
      graded.passed && !late
        ? issueCertificate(db, input.userId, course.slug, attempt.id, graded.score)
        : null;

    return {
      ok: true,
      attempt,
      certificate,
      correct: graded.correct,
      total: graded.total,
      unanswered: graded.unanswered,
    };
  });
}

export async function getAttemptForUser(
  userId: string,
  attemptId: string
): Promise<{
  attempt: Attempt;
  course: Course;
  certificate: Certificate | null;
  correct: number;
  total: number;
} | null> {
  const db = await readDb();
  const attempt = db.attempts.find(
    (entry) => entry.id === attemptId && entry.userId === userId
  );
  if (!attempt) return null;
  const course = getCourse(attempt.courseId);
  if (!course) return null;
  const certificate =
    db.certificates.find(
      (entry) => entry.userId === userId && entry.courseId === attempt.courseId
    ) ?? null;
  const total = attempt.questionIds.length;
  const correct =
    attempt.score === null ? 0 : Math.round((attempt.score / 100) * total);
  return { attempt, course, certificate, correct, total };
}

export async function getCertificateForUser(
  userId: string,
  code: string
): Promise<{ certificate: Certificate; course: Course | undefined; name: string } | null> {
  const db = await readDb();
  const certificate = db.certificates.find(
    (entry) => entry.userId === userId && entry.code === code
  );
  if (!certificate) return null;
  const user = db.users.find((entry) => entry.id === userId);
  if (!user) return null;
  return {
    certificate,
    course: ALL_COURSES.find((course) => course.slug === certificate.courseId),
    name: user.name,
  };
}

export async function getCertificateByCode(code: string): Promise<{
  certificate: Certificate;
  course: Course | undefined;
  name: string;
} | null> {
  const db = await readDb();
  const certificate = db.certificates.find(
    (entry) => entry.code.toUpperCase() === code.toUpperCase()
  );
  if (!certificate) return null;
  const user = db.users.find((entry) => entry.id === certificate.userId);
  if (!user) return null;
  return {
    certificate,
    course: ALL_COURSES.find((course) => course.slug === certificate.courseId),
    name: user.name,
  };
}

export async function listCertificatesForUser(
  userId: string
): Promise<Array<{ certificate: Certificate; course: Course | undefined }>> {
  const db = await readDb();
  return db.certificates
    .filter((entry) => entry.userId === userId)
    .sort((a, b) => Date.parse(b.issuedAt) - Date.parse(a.issuedAt))
    .map((certificate) => ({
      certificate,
      course: ALL_COURSES.find((course) => course.slug === certificate.courseId),
    }));
}

export async function getAdminProgressData(): Promise<AdminMonitorData> {
  const db = await readDb();

  const workers: AdminWorkerProgress[] = db.users.map((user) => {
    const userEnrollments = db.enrollments.filter((e) => e.userId === user.id);
    const userProgress = db.progress.filter((p) => p.userId === user.id);
    const userAttempts = db.attempts.filter((a) => a.userId === user.id);
    const userCertificates = db.certificates.filter((c) => c.userId === user.id);

    let totalCompleted = 0;
    let latestActivity: string | null = null;

    for (const p of userProgress) {
      if (p.completedAt) totalCompleted++;
      if (!latestActivity || Date.parse(p.updatedAt) > Date.parse(latestActivity)) {
        latestActivity = p.updatedAt;
      }
    }

    const enrollmentDetails: AdminWorkerEnrollment[] = userEnrollments.map((enr) => {
      const course = ALL_COURSES.find((c) => c.slug === enr.courseId);
      const allLessons = course ? getAllLessons(course) : [];
      const courseProgress = userProgress.filter((p) => p.courseId === enr.courseId);
      const progressMap = new Map(courseProgress.map((p) => [p.lessonId, p]));

      const completedCount = allLessons.filter((l) => progressMap.get(l.id)?.completedAt).length;
      const cert = userCertificates.find((c) => c.courseId === enr.courseId) ?? null;
      const attempt = userAttempts
        .filter((a) => a.courseId === enr.courseId)
        .sort((a, b) => Date.parse(b.startedAt) - Date.parse(a.startedAt))[0] ?? null;

      const percent =
        allLessons.length > 0 ? Math.round((completedCount / allLessons.length) * 100) : 0;
      const status: 'certified' | 'exam_ready' | 'in_progress' | 'not_started' = cert
        ? 'certified'
        : percent === 100
          ? 'exam_ready'
          : completedCount > 0
            ? 'in_progress'
            : 'not_started';

      return {
        courseSlug: enr.courseId,
        courseTitle: course?.title ?? enr.courseId,
        courseCode: course?.code ?? '',
        track: course?.track ?? 'workforce',
        enrolledAt: enr.enrolledAt,
        conditionsAcceptedAt: enr.conditionsAcceptedAt,
        completedCount,
        totalLessons: allLessons.length,
        percent,
        status,
        lessons: allLessons.map((l) => {
          const p = progressMap.get(l.id);
          return {
            id: l.id,
            title: l.title,
            isCompleted: Boolean(p?.completedAt),
            completedAt: p?.completedAt ?? null,
            positionSeconds: p?.positionSeconds ?? 0,
            notes: p?.notes,
          };
        }),
        attempt: attempt
          ? {
              status: attempt.status,
              score: attempt.score,
              passed: attempt.passed,
              submittedAt: attempt.submittedAt,
            }
          : null,
        certificate: cert
          ? {
              code: cert.code,
              score: cert.score,
              issuedAt: cert.issuedAt,
            }
          : null,
      };
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
      },
      enrollments: enrollmentDetails,
      totalCompletedLessons: totalCompleted,
      lastActiveAt: latestActivity ?? user.createdAt,
    };
  });

  const totalWorkers = db.users.length;
  const activeEnrolled = db.enrollments.length;
  const completedTracks = workers.reduce(
    (sum, w) => sum + w.enrollments.filter((e) => e.percent === 100).length,
    0
  );
  const totalCertificates = db.certificates.length;

  return {
    workers: workers.sort(
      (a, b) => Date.parse(b.lastActiveAt ?? '') - Date.parse(a.lastActiveAt ?? '')
    ),
    summary: {
      totalWorkers,
      activeEnrolled,
      completedTracks,
      totalCertificates,
    },
  };
}
