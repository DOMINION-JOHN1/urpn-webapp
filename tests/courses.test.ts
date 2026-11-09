import { describe, it, expect } from 'vitest';
import {
  COURSES,
  ALL_COURSES,
  LEADERSHIP_COURSES,
  WORKFORCE_COURSES,
  getAllLessons,
  getCourse,
  getCoursesForRole,
  getLessonCount,
  formatLessonDuration,
  extractDriveFileId,
} from '@/lib/courses';
import { getExamDefinition } from '@/lib/exam-bank';
import {
  isLessonUnlocked,
  getFirstUnlockedIncompleteLesson,
} from '@/lib/server/learning';

describe('URPN training catalogue', () => {
  it('ships leadership tracks and workforce departments', () => {
    expect(LEADERSHIP_COURSES.map((course) => course.slug)).toEqual(['ministers', 'pastors']);
    expect(LEADERSHIP_COURSES.map((course) => course.title)).toEqual([
      'URPN Ministers Training',
      'URPN Pastors Training',
    ]);
    expect(WORKFORCE_COURSES.map((course) => course.slug)).toEqual([
      'aesthetics',
      'pr',
      'protocol',
      'ushering',
      'technical',
      'media',
      'choir',
      'welfare',
      'prayer',
      'counseling',
      'transport',
      'medical',
      'security',
      'children',
      'publications',
      'drama',
    ]);
  });

  it('includes all courses in ALL_COURSES and retrieves them via getCourse', () => {
    expect(ALL_COURSES.length).toBe(19);
    expect(getCourse('foundation')).toBeDefined();
    expect(getCourse('ministers')).toBeDefined();
    expect(getCourse('pastors')).toBeDefined();
    expect(getCourse('aesthetics')).toBeDefined();
    expect(getCourse('pr')).toBeDefined();
    expect(getCourse('prayer')).toBeDefined();
    expect(getCourse('counseling')).toBeDefined();
    expect(getCourse('transport')).toBeDefined();
    expect(getCourse('medical')).toBeDefined();
    expect(getCourse('security')).toBeDefined();
    expect(getCourse('publications')).toBeDefined();
    expect(getCourse('drama')).toBeDefined();
    expect(getCourse('media')).toBeDefined();
    expect(getCourse('children')).toBeDefined();
  });

  it('filters courses correctly by user role', () => {
    const workforceCourses = getCoursesForRole('workforce');
    expect(workforceCourses.map((c) => c.slug)).toEqual(WORKFORCE_COURSES.map((c) => c.slug));

    const workerCourses = getCoursesForRole('worker');
    expect(workerCourses.map((c) => c.slug)).toEqual(['ministers', 'pastors']);

    const adminCourses = getCoursesForRole('admin');
    expect(adminCourses.map((c) => c.slug)).toEqual(['ministers', 'pastors']);
  });

  it('requires department conditions for all workforce courses', () => {
    for (const course of WORKFORCE_COURSES) {
      expect(course.track).toBe('workforce');
      expect(course.conditions.length).toBeGreaterThan(0);
      for (const condition of course.conditions) {
        expect(condition.length).toBeGreaterThan(5);
      }
    }
  });

  it('attaches comprehensive job description and HOD specs to all workforce courses', () => {
    for (const course of WORKFORCE_COURSES) {
      expect(course.jobDescription).toBeDefined();
      expect(course.jobDescription?.departmentName).toBeTruthy();
      expect(course.jobDescription?.overview).toBeTruthy();
      expect(course.jobDescription?.responsibilities.length).toBeGreaterThan(0);
      expect(course.jobDescription?.keyAttributes.length).toBeGreaterThan(0);
      expect(course.jobDescription?.headOfDepartment.title).toBeTruthy();
      expect(course.jobDescription?.headOfDepartment.summary).toBeTruthy();
      expect(course.jobDescription?.headOfDepartment.responsibilities.length).toBeGreaterThan(0);
      expect(course.jobDescription?.headOfDepartment.kpis.length).toBeGreaterThan(0);
    }
  });

  it('correctly extracts Google Drive file IDs from various link formats', () => {
    const id = '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptbfs';
    expect(extractDriveFileId(id)).toBe(id);
    expect(extractDriveFileId(`https://drive.google.com/file/d/${id}/view?usp=sharing`)).toBe(id);
    expect(extractDriveFileId(`https://drive.google.com/open?id=${id}`)).toBe(id);
    expect(extractDriveFileId(`https://drive.google.com/uc?id=${id}&export=download`)).toBe(id);
    expect(extractDriveFileId('media-01.m4a')).toBeNull();
    expect(extractDriveFileId(undefined)).toBeNull();
  });

  it('has unique lesson ids and non-empty modules across courses', () => {
    const allIds = COURSES.flatMap((course) => getAllLessons(course).map((lesson) => lesson.id));
    expect(new Set(allIds).size).toBe(allIds.length);
    for (const course of COURSES) {
      expect(course.modules.length).toBeGreaterThan(0);
      for (const module of course.modules) {
        expect(module.lessons.length).toBeGreaterThan(0);
      }
    }
  });

  it('gives every streamed lesson a positive duration', () => {
    for (const course of COURSES) {
      for (const lesson of getAllLessons(course)) {
        if (lesson.kind === 'reading') continue;
        expect(lesson.media?.durationSeconds).toBeGreaterThan(0);
        if (lesson.media?.file) {
          expect(lesson.media.file).toMatch(/\.(mp4|m4a)$/);
          expect(lesson.media.file).not.toContain('..');
        }
      }
    }
  });

  it('aligns each exam metadata with the question bank', () => {
    for (const course of COURSES) {
      const questions = getExamDefinition(course.slug).questions;
      expect(questions.length).toBe(course.exam.questionCount);
      for (const question of questions) {
        expect(question.options).toHaveLength(4);
        expect(question.answer).toBeGreaterThanOrEqual(0);
        expect(question.answer).toBeLessThan(4);
        expect(question.prompt.length).toBeGreaterThan(10);
        expect(question.explanation.length).toBeGreaterThan(10);
      }
    }
    expect(getLessonCount(getCourse('pastors')!)).toBe(9);
  });

  it('formats media lengths for the UI', () => {
    const lesson = getAllLessons(getCourse('ministers')!).find(
      (item) => item.kind === 'video' || item.kind === 'audio'
    )!;
    expect(formatLessonDuration(lesson)).toMatch(/sec|min/);
  });

  it('strictly enforces sequential lesson progression and locking', () => {
    const course = getCourse('media')!;
    const lessons = getAllLessons(course);
    expect(lessons.length).toBeGreaterThan(1);

    const lesson0 = lessons[0].id;
    const lesson1 = lessons[1].id;

    // Lesson 0 is always unlocked
    expect(isLessonUnlocked(course, [], lesson0)).toBe(true);

    // Lesson 1 is locked when lesson 0 is not completed
    expect(isLessonUnlocked(course, [], lesson1)).toBe(false);

    // Lesson 1 unlocks once lesson 0 is marked complete
    expect(isLessonUnlocked(course, [lesson0], lesson1)).toBe(true);

    // getFirstUnlockedIncompleteLesson returns lesson 0 when no progress
    expect(getFirstUnlockedIncompleteLesson(course, [])?.id).toBe(lesson0);

    // getFirstUnlockedIncompleteLesson returns lesson 1 when lesson 0 is complete
    expect(getFirstUnlockedIncompleteLesson(course, [lesson0])?.id).toBe(lesson1);
  });
});
