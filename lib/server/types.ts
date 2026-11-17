export type UserRole = 'worker' | 'workforce' | 'admin';

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthday?: string;
  address?: string;
  avatarPath?: string;
  avatarMimeType?: 'image/jpeg' | 'image/png' | 'image/webp';
  passwordHash: string;
  role: UserRole;
  createdAt: string;
}

export type PublicUser = Omit<StoredUser, 'passwordHash'>;

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  /** When the worker accepted the department conditions (null for staff tracks). */
  conditionsAcceptedAt: string | null;
  /** Workforce department selected when the member applied. */
  departmentSlug?: string;
}

export interface LessonProgress {
  userId: string;
  courseId: string;
  lessonId: string;
  positionSeconds: number;
  completedAt: string | null;
  notes?: string;
  updatedAt: string;
}

export type AttemptStatus = 'in_progress' | 'submitted' | 'expired';

export type SubmitReason = 'submitted' | 'tab_left' | 'time_expired';

export interface Attempt {
  id: string;
  userId: string;
  courseId: string;
  /** Present for module-specific exams; absent for the course certification exam. */
  moduleId?: string;
  questionIds: string[];
  startedAt: string;
  expiresAt: string;
  submittedAt: string | null;
  status: AttemptStatus;
  answers: Record<string, number> | null;
  score: number | null;
  passed: boolean | null;
  reason: SubmitReason | null;
  /** Set after the third failed module-exam attempt. */
  lockoutUntil?: string;
}

export interface Certificate {
  id: string;
  code: string;
  userId: string;
  courseId: string;
  attemptId: string;
  score: number;
  issuedAt: string;
  /** Snapshot of the workforce department at the time of certification. */
  departmentName?: string;
}

export interface Database {
  version: 1;
  seededAt: string;
  users: StoredUser[];
  enrollments: Enrollment[];
  progress: LessonProgress[];
  attempts: Attempt[];
  certificates: Certificate[];
}

export interface AdminWorkerEnrollment {
  courseSlug: string;
  courseTitle: string;
  courseCode: string;
  track: string;
  enrolledAt: string;
  conditionsAcceptedAt: string | null;
  completedCount: number;
  totalLessons: number;
  percent: number;
  status: 'certified' | 'exam_ready' | 'in_progress' | 'not_started';
  lessons: Array<{
    id: string;
    title: string;
    isCompleted: boolean;
    completedAt: string | null;
    positionSeconds: number;
    notes?: string;
  }>;
  attempt: {
    status: string;
    score: number | null;
    passed: boolean | null;
    submittedAt: string | null;
  } | null;
  certificate: {
    code: string;
    score: number;
    issuedAt: string;
    departmentName?: string;
  } | null;
}

export interface AdminWorkerProgress {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    birthday?: string;
    address?: string;
    avatarPath?: string;
    role: UserRole;
    createdAt: string;
  };
  enrollments: AdminWorkerEnrollment[];
  totalCompletedLessons: number;
  lastActiveAt: string | null;
}

export interface AdminMonitorData {
  workers: AdminWorkerProgress[];
  summary: {
    totalWorkers: number;
    activeEnrolled: number;
    completedTracks: number;
    totalCertificates: number;
  };
}

export interface WorkforceApplicantDepartment {
  courseSlug: string;
  courseTitle: string;
  courseCode: string;
  shortTitle: string;
  enrolledAt: string;
  conditionsAcceptedAt: string | null;
  completedCount: number;
  totalLessons: number;
  percent: number;
  status: 'certified' | 'exam_ready' | 'in_progress' | 'not_started';
  lessons: Array<{
    id: string;
    title: string;
    isCompleted: boolean;
    completedAt: string | null;
    positionSeconds: number;
    notes?: string;
  }>;
  attempt: {
    status: string;
    score: number | null;
    passed: boolean | null;
    submittedAt: string | null;
    reason: string | null;
  } | null;
  certificate: {
    code: string;
    score: number;
    issuedAt: string;
    departmentName?: string;
  } | null;
}

export interface WorkforceApplicant {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    birthday?: string;
    address?: string;
    avatarPath?: string;
    role: UserRole;
    createdAt: string;
  };
  departments: WorkforceApplicantDepartment[];
  totalDepartments: number;
  overallStatus: 'certified' | 'exam_ready' | 'in_progress' | 'applied';
  latestActivityAt: string;
  highestScore: number | null;
}

export interface AdminWorkforceDashboardData {
  applicants: WorkforceApplicant[];
  summary: {
    totalApplicants: number;
    withDepartments: number;
    inTraining: number;
    examReady: number;
    certified: number;
    departmentCounts: Record<string, number>;
  };
}
