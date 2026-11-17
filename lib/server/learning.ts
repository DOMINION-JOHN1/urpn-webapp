import { randomBytes, randomInt } from 'node:crypto';
import type {
  Attempt,
  Certificate,
  Database,
  LessonProgress,
  SubmitReason,
  AdminMonitorData,
  AdminWorkerProgress,
  AdminWorkerEnrollment,
  AdminWorkforceDashboardData,
  WorkforceApplicant,
  WorkforceApplicantDepartment,
} from './types';
import { mutateDb, newId, readDb } from './db';
import {
  COURSES,
  ALL_COURSES,
  WORKFORCE_DEPARTMENTS,
  WORKFORCE_TRAINING,
  getCourse,
  getAllLessons,
  getLesson,
  getCoursesForRole,
  isModuleExamUnlocked,
  type Course,
  type CourseModule,
  type ExamSettings,
  type CourseSlug,
  type Lesson,
} from '../courses';
import { getExamDefinition, type ExamQuestion } from '../exam-bank';
import { getModuleExamDefinition } from '../module-exam-bank';

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
  departmentSlug: string | null;
  completedLessonIds: string[];
  completedCount: number;
  totalLessons: number;
  percent: number;
  nextLesson: Lesson | null;
  positions: Record<string, number>;
  notes: Record<string, string>;
  attempt: Attempt | null;
  moduleExamStatuses: Record<string, ModuleExamStatus>;
  passedModuleExamIds: string[];
  certificate: Certificate | null;
  examUnlocked: boolean;
}

export interface ModuleExamStatus {
  attemptId: string | null;
  attemptStatus: Attempt['status'] | null;
  score: number | null;
  passed: boolean;
  creditedByCertificate: boolean;
  attemptCount: number;
  lockedUntil: string | null;
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

function moduleExamStatusesForCourse(
  db: Database,
  userId: string,
  course: Course,
  hasCertificate: boolean
): Record<string, ModuleExamStatus> {
  const statuses: Record<string, ModuleExamStatus> = {};
  for (const module of course.modules) {
    if (!module.exam) continue;
    const attempts = db.attempts
      .filter(
        (entry) =>
          entry.userId === userId &&
          entry.courseId === course.slug &&
          entry.moduleId === module.id
      )
      .sort((a, b) => Date.parse(a.startedAt) - Date.parse(b.startedAt));
    const latest = attempts[attempts.length - 1] ?? null;
    const passedAttempt = attempts.find((entry) => entry.passed === true) ?? null;
    const lockoutAttempt = [...attempts].reverse().find((entry) => entry.lockoutUntil) ?? null;
    statuses[module.id] = {
      attemptId: latest?.id ?? null,
      attemptStatus: latest?.status ?? null,
      score: latest?.score ?? null,
      passed: Boolean(passedAttempt || hasCertificate),
      creditedByCertificate: Boolean(hasCertificate && !passedAttempt),
      attemptCount: attempts.length,
      lockedUntil: lockoutAttempt?.lockoutUntil ?? null,
    };
  }
  return statuses;
}

function courseOverviewFromDb(
  db: Database,
  userId: string,
  course: Course
): CourseOverview {
  const lessons = getAllLessons(course);
  const completed = completedIds(db, userId, course);
  const completedSet = new Set(completed);
  const enrollment = db.enrollments.find(
    (entry) => entry.userId === userId && entry.courseId === course.slug
  );
  const certificate =
    db.certificates.find(
      (entry) => entry.userId === userId && entry.courseId === course.slug
    ) ?? null;
  const courseAttempts = db.attempts
    .filter((entry) => entry.userId === userId && entry.courseId === course.slug);
  const attempt =
    courseAttempts
      .filter((entry) => !entry.moduleId)
      .sort((a, b) => Date.parse(b.startedAt) - Date.parse(a.startedAt))[0] ?? null;
  const moduleExamStatuses = moduleExamStatusesForCourse(
    db,
    userId,
    course,
    Boolean(certificate)
  );
  const passedModuleExamIds = Object.entries(moduleExamStatuses)
    .filter(([, status]) => status.passed)
    .map(([moduleId]) => moduleId);
  const nextLesson = getFirstUnlockedIncompleteLesson(course, completed, passedModuleExamIds);
  const allModuleExamsPassed = Object.values(moduleExamStatuses).every((status) => status.passed);

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
    departmentSlug: enrollment?.departmentSlug ?? null,
    completedLessonIds: completed,
    completedCount: completed.length,
    totalLessons: lessons.length,
    percent: lessons.length ? Math.round((completed.length / lessons.length) * 100) : 0,
    nextLesson,
    positions,
    notes,
    attempt,
    moduleExamStatuses,
    passedModuleExamIds,
    certificate,
    examUnlocked: completed.length === lessons.length && allModuleExamsPassed && !certificate,
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
  lessonId: string,
  passedModuleExamIds: string[] = []
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
  const targetModule = getLesson(course, lessonId)?.module;
  const targetModuleIndex = targetModule
    ? course.modules.findIndex((module) => module.id === targetModule.id)
    : -1;
  if (targetModuleIndex >= 0) {
    const passed = new Set(passedModuleExamIds);
    if (
      course.modules
        .slice(0, targetModuleIndex)
        .some((module) => module.exam && !passed.has(module.id))
    ) {
      return false;
    }
  }
  return true;
}

export function getFirstUnlockedIncompleteLesson(
  course: Course,
  completedLessonIds: string[],
  passedModuleExamIds: string[] = []
): Lesson | null {
  const lessons = getAllLessons(course);
  const completedSet = new Set(completedLessonIds);
  return (
    lessons.find(
      (lesson) =>
        !completedSet.has(lesson.id) &&
        isLessonUnlocked(course, completedLessonIds, lesson.id, passedModuleExamIds)
    ) ?? null
  );
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
  acceptConditions = true,
  departmentSlug?: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const course = getCourse(courseSlug);
  if (!course) return { ok: false, error: 'Course not found.' };
  const isSharedWorkforceCourse = course.slug === WORKFORCE_TRAINING.slug;
  const selectedDepartment = departmentSlug
    ? WORKFORCE_DEPARTMENTS.find((department) => department.slug === departmentSlug)
    : undefined;
  if (isSharedWorkforceCourse && !selectedDepartment) {
    return { ok: false, error: 'Choose a ministry department before applying.' };
  }

  await mutateDb((db) => {
    const existing = db.enrollments.find(
      (entry) => entry.userId === userId && entry.courseId === course.slug
    );
    if (existing) {
      if (!existing.conditionsAcceptedAt && acceptConditions) {
        existing.conditionsAcceptedAt = new Date().toISOString();
      }
      if (isSharedWorkforceCourse && !existing.departmentSlug && selectedDepartment) {
        existing.departmentSlug = selectedDepartment.slug;
      }
      return;
    }
    db.enrollments.push({
      id: newId('enr'),
      userId,
      courseId: course.slug,
      enrolledAt: new Date().toISOString(),
      conditionsAcceptedAt: acceptConditions ? new Date().toISOString() : null,
      ...(isSharedWorkforceCourse && selectedDepartment
        ? { departmentSlug: selectedDepartment.slug }
        : {}),
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

    const completedBefore = completedIds(db, input.userId, course);
    const hasCertificate = db.certificates.some(
      (entry) => entry.userId === input.userId && entry.courseId === course.slug
    );
    const passedBefore = Object.entries(
      moduleExamStatusesForCourse(db, input.userId, course, hasCertificate)
    )
      .filter(([, status]) => status.passed)
      .map(([moduleId]) => moduleId);
    if (!isLessonUnlocked(course, completedBefore, lesson.id, passedBefore)) {
      return { ok: false, error: 'Complete the earlier lessons and module exams first.' };
    }

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

function questionBank(course: Course, moduleId?: string): ExamQuestion[] {
  if (moduleId) return getModuleExamDefinition(moduleId)?.questions ?? [];
  return getExamDefinition(course.slug).questions;
}

function examSettings(course: Course, moduleId?: string): ExamSettings | undefined {
  if (!moduleId) return course.exam;
  return course.modules.find((module) => module.id === moduleId)?.exam;
}

function publicQuestions(
  course: Course,
  ids?: string[],
  moduleId?: string,
  optionOrders?: Record<string, number[]>
): PublicExamQuestion[] {
  const questions = questionBank(course, moduleId);
  const questionById = new Map(questions.map((question) => [question.id, question]));
  const selected = ids
    ? ids.map((id) => questionById.get(id)).filter((question): question is ExamQuestion => Boolean(question))
    : questions;
  return selected.map(({ id, prompt, options }) => {
    const order = optionOrders?.[id];
    const validOrder = order?.length === options.length
      && new Set(order).size === options.length
      && order.every((index) => Number.isInteger(index) && index >= 0 && index < options.length);
    return {
      id,
      prompt,
      options: validOrder
        ? order.map((index) => options[index]).filter((option): option is string => option !== undefined)
        : options,
    };
  });
}

function createOptionOrders(questions: ExamQuestion[], questionIds: string[]): Record<string, number[]> {
  const questionsById = new Map(questions.map((question) => [question.id, question]));
  const selectedQuestions = questionIds
    .map((id) => questionsById.get(id))
    .filter((question): question is ExamQuestion => Boolean(question));
  return Object.fromEntries(selectedQuestions.map((question) => {
    const answerPosition = randomInt(question.options.length);
    const distractors = shuffle(question.options
      .map((_, index) => index)
      .filter((index) => index !== question.answer));
    const order = Array<number>(question.options.length);
    order[answerPosition] = question.answer;
    let distractorIndex = 0;
    for (let index = 0; index < order.length; index += 1) {
      if (index !== answerPosition) order[index] = distractors[distractorIndex++];
    }
    return [question.id, order];
  }));
}

function attemptsForExam(
  db: Database,
  userId: string,
  course: Course,
  moduleId?: string
): Attempt[] {
  return db.attempts
    .filter(
      (entry) =>
        entry.userId === userId &&
        entry.courseId === course.slug &&
        (moduleId ? entry.moduleId === moduleId : !entry.moduleId)
    )
    .sort((a, b) => Date.parse(a.startedAt) - Date.parse(b.startedAt));
}

function applyModuleLockout(db: Database, attempt: Attempt, now: number): void {
  if (!attempt.moduleId || attempt.passed !== false) return;
  const history = attemptsForExam(db, attempt.userId, getCourse(attempt.courseId)!, attempt.moduleId);
  const currentIndex = history.findIndex((entry) => entry.id === attempt.id);
  const earlier = history.slice(0, currentIndex);
  let lastLockoutIndex = -1;
  for (let index = earlier.length - 1; index >= 0; index -= 1) {
    if (earlier[index].lockoutUntil) {
      lastLockoutIndex = index;
      break;
    }
  }
  const failuresSinceLockout = history
    .slice(lastLockoutIndex + 1, currentIndex + 1)
    .filter((entry) => entry.passed === false && entry.status !== 'in_progress').length;
  if (failuresSinceLockout >= 3) {
    attempt.lockoutUntil = new Date(now + 24 * 60 * 60 * 1000).toISOString();
  }
}

function shuffle<T>(values: T[]): T[] {
  const shuffled = [...values];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const other = randomInt(index + 1);
    [shuffled[index], shuffled[other]] = [shuffled[other], shuffled[index]];
  }
  return shuffled;
}

function pickRotatedQuestions(
  questions: ExamQuestion[],
  count: number,
  earlierAttempts: Attempt[]
): string[] {
  const previousSets = new Set(
    earlierAttempts.map((attempt) => [...attempt.questionIds].sort().join('|'))
  );
  let selection: string[] = [];
  for (let tries = 0; tries < 12; tries += 1) {
    selection = shuffle(questions.map((question) => question.id)).slice(0, count);
    if (!previousSets.has([...selection].sort().join('|'))) return selection;
  }
  return selection;
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
      error:
        | 'not_enrolled'
        | 'incomplete'
        | 'already_attempted'
        | 'already_passed'
        | 'locked'
        | 'not_found';
      missingLessons?: number;
      lockedUntil?: string;
      attempt?: Attempt | null;
    };

export async function startExamAttempt(
  userId: string,
  courseSlug: string,
  moduleId?: string
): Promise<StartAttemptResult> {
  const course = getCourse(courseSlug);
  if (!course) return { ok: false, error: 'not_found' };
  const module = moduleId ? course.modules.find((entry) => entry.id === moduleId) : undefined;
  const settings = examSettings(course, moduleId);
  const questions = questionBank(course, moduleId);
  if (moduleId && (!module?.exam || !questions.length)) {
    return { ok: false, error: 'not_found' };
  }
  if (!settings || questions.length < settings.questionCount) {
    return { ok: false, error: 'not_found' };
  }

  return mutateDb((db): StartAttemptResult => {
    const enrolled = db.enrollments.some(
      (entry) => entry.userId === userId && entry.courseId === course.slug
    );
    if (!enrolled) return { ok: false, error: 'not_enrolled' };

    const history = attemptsForExam(db, userId, course, moduleId);
    const now = Date.now();
    const active = [...history].reverse().find((entry) => entry.status === 'in_progress');
    if (active) {
      const expires = Date.parse(active.expiresAt);
      if (expires > now) {
        return {
          ok: true,
          attempt: active,
          questions: publicQuestions(course, active.questionIds, moduleId, active.optionOrders),
          remainingSeconds: Math.ceil((expires - now) / 1000),
          resumed: true,
        };
      }
      active.status = 'expired';
      active.submittedAt = new Date(now).toISOString();
      active.score = active.score ?? 0;
      active.passed = false;
      active.reason = 'time_expired';
      applyModuleLockout(db, active, now);
    }

    if (moduleId && module) {
      if (db.certificates.some((entry) => entry.userId === userId && entry.courseId === course.slug)) {
        return { ok: false, error: 'already_passed', attempt: history.find((entry) => entry.passed) ?? null };
      }
      if (history.some((entry) => entry.passed === true)) {
        return { ok: false, error: 'already_passed', attempt: history.find((entry) => entry.passed) ?? null };
      }
      const lockout = [...history].reverse().find((entry) => entry.lockoutUntil);
      if (lockout?.lockoutUntil && Date.parse(lockout.lockoutUntil) > now) {
        return { ok: false, error: 'locked', lockedUntil: lockout.lockoutUntil, attempt: lockout };
      }

      const completed = completedIds(db, userId, course);
      const certified = db.certificates.some(
        (entry) => entry.userId === userId && entry.courseId === course.slug
      );
      const passedIds = Object.entries(
        moduleExamStatusesForCourse(db, userId, course, certified)
      )
        .filter(([, status]) => status.passed)
        .map(([id]) => id);
      if (!isModuleExamUnlocked(course, moduleId, completed, passedIds)) {
        const moduleIndex = course.modules.findIndex((entry) => entry.id === moduleId);
        const neededLessons = course.modules
          .slice(0, moduleIndex + 1)
          .flatMap((entry) => entry.lessons)
          .filter((lesson) => !completed.includes(lesson.id)).length;
        return { ok: false, error: 'incomplete', missingLessons: neededLessons };
      }
    } else {
      const existing = history[history.length - 1];
      if (existing) return { ok: false, error: 'already_attempted', attempt: existing };

      const completed = completedIds(db, userId, course);
      const lessons = getAllLessons(course);
      const certified = db.certificates.some(
        (entry) => entry.userId === userId && entry.courseId === course.slug
      );
      const passedIds = Object.entries(
        moduleExamStatusesForCourse(db, userId, course, certified)
      )
        .filter(([, status]) => status.passed)
        .map(([id]) => id);
      if (
        completed.length < lessons.length ||
        course.modules.some((entry) => entry.exam && !passedIds.includes(entry.id))
      ) {
        return { ok: false, error: 'incomplete', missingLessons: lessons.length - completed.length };
      }
    }

    const questionIds = moduleId
      ? pickRotatedQuestions(questions, settings.questionCount, history)
      : questions.map((question) => question.id);
    const optionOrders = createOptionOrders(questions, questionIds);
    const startedAt = new Date(now).toISOString();
    const attempt: Attempt = {
      id: newId('att'),
      userId,
      courseId: course.slug,
      ...(moduleId ? { moduleId } : {}),
      questionIds,
      optionOrders,
      startedAt,
      expiresAt: new Date(now + settings.durationMinutes * 60 * 1000).toISOString(),
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
      questions: publicQuestions(course, questionIds, moduleId, optionOrders),
      remainingSeconds: settings.durationMinutes * 60,
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
  const settings = examSettings(course, attempt.moduleId);
  const questions: ExamQuestion[] = questionBank(course, attempt.moduleId).filter((question) =>
    attempt.questionIds.includes(question.id)
  );
  let correct = 0;
  let unanswered = 0;
  for (const question of questions) {
    const answer = answers[question.id];
    if (typeof answer !== 'number' || !Number.isInteger(answer)) {
      unanswered += 1;
      continue;
    }
    const originalAnswerIndex = attempt.optionOrders?.[question.id]?.[answer] ?? answer;
    if (originalAnswerIndex === question.answer) correct += 1;
  }
  const total = questions.length;
  const score = total ? Math.round((correct / total) * 100) : 0;
  const passed = status === 'submitted' && score >= (settings?.passMark ?? course.exam.passMark);
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
  const enrollment = db.enrollments.find(
    (entry) => entry.userId === userId && entry.courseId === courseSlug
  );
  const departmentName = enrollment?.departmentSlug
    ? WORKFORCE_DEPARTMENTS.find((department) => department.slug === enrollment.departmentSlug)?.title
    : undefined;
  const certificate: Certificate = {
    id: newId('cert'),
    code,
    userId,
    courseId: courseSlug,
    attemptId,
    score,
    issuedAt: new Date().toISOString(),
    ...(departmentName ? { departmentName } : {}),
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
    if (attempt.moduleId && !graded.passed) {
      applyModuleLockout(db, attempt, now);
    }

    const certificate =
      graded.passed && !late && !attempt.moduleId
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
  module: CourseModule | null;
  exam: ExamSettings;
  attemptNumber: number;
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
  const module = attempt.moduleId
    ? course.modules.find((entry) => entry.id === attempt.moduleId) ?? null
    : null;
  const exam = examSettings(course, attempt.moduleId);
  if (!exam) return null;
  const history = attemptsForExam(db, userId, course, attempt.moduleId);
  const certificate =
    db.certificates.find(
      (entry) => entry.userId === userId && entry.courseId === attempt.courseId
    ) ?? null;
  const total = attempt.questionIds.length;
  const correct =
    attempt.score === null ? 0 : Math.round((attempt.score / 100) * total);
  return {
    attempt,
    course,
    module,
    exam,
    attemptNumber: history.findIndex((entry) => entry.id === attempt.id) + 1,
    certificate,
    correct,
    total,
  };
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
        .filter((a) => a.courseId === enr.courseId && !a.moduleId)
        .sort((a, b) => Date.parse(b.startedAt) - Date.parse(a.startedAt))[0] ?? null;

      const percent =
        allLessons.length > 0 ? Math.round((completedCount / allLessons.length) * 100) : 0;
      const moduleExamsPassed =
        !course ||
        course.modules.every(
          (module) =>
            !module.exam ||
            Boolean(
              cert ||
                userAttempts.some(
                  (entry) =>
                    entry.courseId === course.slug &&
                    entry.moduleId === module.id &&
                    entry.passed === true
                )
            )
        );
      const status: 'certified' | 'exam_ready' | 'in_progress' | 'not_started' = cert
        ? 'certified'
        : percent === 100 && moduleExamsPassed
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
              departmentName: cert.departmentName,
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

export async function getAdminWorkforceData(): Promise<AdminWorkforceDashboardData> {
  const db = await readDb();

  // Everyone who has applied for workforce:
  // Either their user role is 'workforce', or they have registered enrollments in workforce/departments.
  const workforceUsers = db.users.filter(
    (u) =>
      u.role === 'workforce' ||
      db.enrollments.some(
        (e) =>
          e.userId === u.id &&
          (e.courseId === WORKFORCE_TRAINING.slug ||
            WORKFORCE_DEPARTMENTS.some((dept) => dept.slug === e.courseId))
      )
  );

  const departmentCounts: Record<string, number> = {};
  for (const dept of WORKFORCE_DEPARTMENTS) {
    departmentCounts[dept.slug] = 0;
  }

  const sharedWorkforceLessons = getAllLessons(WORKFORCE_TRAINING);

  const applicants: WorkforceApplicant[] = workforceUsers.map((user) => {
    const userEnrollments = db.enrollments.filter((e) => e.userId === user.id);
    const userProgress = db.progress.filter((p) => p.userId === user.id);
    const userAttempts = db.attempts.filter((a) => a.userId === user.id);
    const userCertificates = db.certificates.filter((c) => c.userId === user.id);

    let latestActivity: string | null = null;
    let highestScore: number | null = null;

    for (const p of userProgress) {
      if (!latestActivity || Date.parse(p.updatedAt) > Date.parse(latestActivity)) {
        latestActivity = p.updatedAt;
      }
    }
    for (const a of userAttempts) {
      if (a.score !== null && (highestScore === null || a.score > highestScore)) {
        highestScore = a.score;
      }
      if (!latestActivity || Date.parse(a.startedAt) > Date.parse(latestActivity)) {
        latestActivity = a.startedAt;
      }
    }
    for (const cert of userCertificates) {
      if (highestScore === null || cert.score > highestScore) {
        highestScore = cert.score;
      }
      if (!latestActivity || Date.parse(cert.issuedAt) > Date.parse(latestActivity)) {
        latestActivity = cert.issuedAt;
      }
    }

    // Map each enrollment to department progress
    const departments: WorkforceApplicantDepartment[] = userEnrollments
      .filter((enr) => {
        return (
          enr.courseId === WORKFORCE_TRAINING.slug ||
          WORKFORCE_DEPARTMENTS.some((dept) => dept.slug === enr.courseId) ||
          ALL_COURSES.some((c) => c.slug === enr.courseId)
        );
      })
      .map((enr) => {
        const isSharedWorkforceEnrollment = enr.courseId === WORKFORCE_TRAINING.slug;
        const deptSlug = isSharedWorkforceEnrollment
          ? enr.departmentSlug
          : enr.courseId;
        const deptMeta = WORKFORCE_DEPARTMENTS.find((d) => d.slug === deptSlug);
        const matchedCourse = ALL_COURSES.find((c) => c.slug === enr.courseId) ?? WORKFORCE_TRAINING;

        if (deptMeta) {
          departmentCounts[deptMeta.slug] = (departmentCounts[deptMeta.slug] || 0) + 1;
        }

        const courseLessons = getAllLessons(matchedCourse);
        // Include progress matching either this course slug or the shared workforce training slug
        const courseProgress = userProgress.filter(
          (p) => p.courseId === enr.courseId || p.courseId === matchedCourse.slug || p.courseId === WORKFORCE_TRAINING.slug
        );
        const progressMap = new Map(courseProgress.map((p) => [p.lessonId, p]));

        const completedCount = courseLessons.filter((l) => progressMap.get(l.id)?.completedAt).length;
        const cert =
          userCertificates.find(
            (c) => c.courseId === enr.courseId || c.courseId === matchedCourse.slug || c.courseId === WORKFORCE_TRAINING.slug
          ) ?? null;
        const attempt =
          userAttempts
            .filter(
              (a) =>
                !a.moduleId &&
                (a.courseId === enr.courseId ||
                  a.courseId === matchedCourse.slug ||
                  a.courseId === WORKFORCE_TRAINING.slug)
            )
            .sort((a, b) => Date.parse(b.startedAt) - Date.parse(a.startedAt))[0] ?? null;

        const percent = courseLessons.length > 0 ? Math.round((completedCount / courseLessons.length) * 100) : 0;
        const moduleStatusMap = moduleExamStatusesForCourse(db, user.id, matchedCourse, Boolean(cert));
        const passedModuleExamIds = Object.entries(moduleStatusMap)
          .filter(([, status]) => status.passed)
          .map(([moduleId]) => moduleId);
        const courseCompletedLessonIds = courseLessons
          .filter((lesson) => progressMap.get(lesson.id)?.completedAt)
          .map((lesson) => lesson.id);
        const moduleExams = matchedCourse.modules.flatMap((module) => {
          if (!module.exam) return [];
          const status = moduleStatusMap[module.id];
          const lockedUntil = status?.lockedUntil ?? null;
          const examStatus: WorkforceApplicantDepartment['moduleExams'][number]['status'] =
            status?.passed
              ? 'passed'
              : status?.attemptStatus === 'in_progress'
                ? 'in_progress'
                : lockedUntil && Date.parse(lockedUntil) > Date.now()
                  ? 'locked_out'
                  : isModuleExamUnlocked(
                        matchedCourse,
                        module.id,
                        courseCompletedLessonIds,
                        passedModuleExamIds
                      )
                    ? 'ready'
                    : 'locked';
          return [{
            moduleId: module.id,
            title: module.title,
            status: examStatus,
            attemptCount: status?.attemptCount ?? 0,
            score: status?.score ?? null,
            lockedUntil,
          }];
        });
        const moduleExamsPassed = matchedCourse.modules.every(
          (module) =>
            !module.exam ||
            Boolean(
              cert ||
                userAttempts.some(
                  (entry) =>
                    entry.courseId === matchedCourse.slug &&
                    entry.moduleId === module.id &&
                    entry.passed === true
                )
            )
        );
        const status: 'certified' | 'exam_ready' | 'in_progress' | 'not_started' = cert
          ? 'certified'
          : percent === 100 && moduleExamsPassed
            ? 'exam_ready'
            : completedCount > 0
              ? 'in_progress'
              : 'not_started';

        return {
          courseSlug: deptMeta?.slug ?? (isSharedWorkforceEnrollment ? 'unassigned' : enr.courseId),
          courseTitle: deptMeta
            ? deptMeta.title
            : isSharedWorkforceEnrollment
              ? 'Awaiting department selection'
              : matchedCourse.title,
          courseCode: deptMeta?.code ?? matchedCourse.code,
          shortTitle: deptMeta?.shortTitle ?? matchedCourse.shortTitle,
          enrolledAt: enr.enrolledAt,
          conditionsAcceptedAt: enr.conditionsAcceptedAt,
          completedCount,
          totalLessons: courseLessons.length,
          percent,
          status,
          moduleExams,
          lessons: courseLessons.map((l) => {
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
                reason: attempt.reason,
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

    // Check shared progress if not enrolled specifically in department yet
    const sharedProgress = userProgress.filter((p) => p.courseId === WORKFORCE_TRAINING.slug);
    const sharedCompleted = sharedWorkforceLessons.filter((l) =>
      sharedProgress.some((p) => p.lessonId === l.id && p.completedAt)
    ).length;

    let overallStatus: 'certified' | 'exam_ready' | 'in_progress' | 'applied' = 'applied';
    if (departments.some((d) => d.status === 'certified') || userCertificates.length > 0) {
      overallStatus = 'certified';
    } else if (
      departments.some((d) => d.status === 'exam_ready') ||
      sharedCompleted === sharedWorkforceLessons.length
    ) {
      overallStatus = 'exam_ready';
    } else if (
      departments.some((d) => d.status === 'in_progress') ||
      sharedCompleted > 0 ||
      userProgress.length > 0
    ) {
      overallStatus = 'in_progress';
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        birthday: user.birthday,
        address: user.address,
        avatarPath: user.avatarPath,
        role: user.role,
        createdAt: user.createdAt,
      },
      departments,
      totalDepartments: departments.filter((department) => department.courseSlug !== 'unassigned').length,
      overallStatus,
      latestActivityAt: latestActivity ?? user.createdAt,
      highestScore,
    };
  });

  applicants.sort((a, b) => Date.parse(b.user.createdAt) - Date.parse(a.user.createdAt));

  const totalApplicants = applicants.length;
  const withDepartments = applicants.filter((a) => a.totalDepartments > 0).length;
  const inTraining = applicants.filter((a) => a.overallStatus === 'in_progress').length;
  const examReady = applicants.filter((a) => a.overallStatus === 'exam_ready').length;
  const certified = applicants.filter((a) => a.overallStatus === 'certified').length;

  return {
    applicants,
    summary: {
      totalApplicants,
      withDepartments,
      inTraining,
      examReady,
      certified,
      departmentCounts,
    },
  };
}
