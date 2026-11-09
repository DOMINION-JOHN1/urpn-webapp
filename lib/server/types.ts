export type UserRole = 'worker' | 'workforce' | 'admin';

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  phone: string;
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
}

export interface LessonProgress {
  userId: string;
  courseId: string;
  lessonId: string;
  positionSeconds: number;
  completedAt: string | null;
  updatedAt: string;
}

export type AttemptStatus = 'in_progress' | 'submitted' | 'expired';

export type SubmitReason = 'submitted' | 'tab_left' | 'time_expired';

export interface Attempt {
  id: string;
  userId: string;
  courseId: string;
  questionIds: string[];
  startedAt: string;
  expiresAt: string;
  submittedAt: string | null;
  status: AttemptStatus;
  answers: Record<string, number> | null;
  score: number | null;
  passed: boolean | null;
  reason: SubmitReason | null;
}

export interface Certificate {
  id: string;
  code: string;
  userId: string;
  courseId: string;
  attemptId: string;
  score: number;
  issuedAt: string;
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
