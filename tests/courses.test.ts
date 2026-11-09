import { describe, it, expect } from 'vitest';
import {
  COURSES,
  getAllLessons,
  getCourse,
  getLessonCount,
  formatLessonDuration,
} from '@/lib/courses';
import { getExamDefinition } from '@/lib/exam-bank';

describe('URPN training catalogue', () => {
  it('ships the three required tracks in order', () => {
    expect(COURSES.map((course) => course.slug)).toEqual(['foundation', 'ministers', 'pastors']);
    expect(COURSES.map((course) => course.title)).toEqual([
      'URPN Foundation Class',
      'URPN Ministers Training',
      'URPN Pastors Training',
    ]);
  });

  it('has unique lesson ids and non-empty modules', () => {
    const ids = getAllLessons(getCourse('foundation')!);
    const allIds = COURSES.flatMap((course) => getAllLessons(course).map((lesson) => lesson.id));
    expect(new Set(allIds).size).toBe(allIds.length);
    expect(ids.length).toBeGreaterThan(0);
    for (const course of COURSES) {
      expect(course.modules.length).toBeGreaterThan(0);
      for (const module of course.modules) {
        expect(module.lessons.length).toBeGreaterThan(0);
      }
    }
  });

  it('gives every streamed lesson a positive duration and private file', () => {
    for (const course of COURSES) {
      for (const lesson of getAllLessons(course)) {
        if (lesson.kind === 'reading') continue;
        expect(lesson.media?.durationSeconds).toBeGreaterThan(0);
        expect(lesson.media?.file).toMatch(/\.(mp4|m4a)$/);
        expect(lesson.media?.file).not.toContain('..');
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
    const lesson = getAllLessons(getCourse('foundation')!).find(
      (item) => item.kind === 'video'
    )!;
    expect(formatLessonDuration(lesson)).toMatch(/sec|min/);
  });
});
