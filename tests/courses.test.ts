import { describe, it, expect } from 'vitest';
import {
  COURSES,
  LEADERSHIP_COURSES,
  WORKFORCE_COURSES,
  getAllLessons,
  getCourse,
  getLessonCount,
  formatLessonDuration,
} from '@/lib/courses';
import { getExamDefinition } from '@/lib/exam-bank';

describe('URPN training catalogue', () => {
  it('ships leadership tracks and workforce departments', () => {
    expect(LEADERSHIP_COURSES.map((course) => course.slug)).toEqual(['ministers', 'pastors']);
    expect(LEADERSHIP_COURSES.map((course) => course.title)).toEqual([
      'URPN Ministers Training',
      'URPN Pastors Training',
    ]);
    expect(WORKFORCE_COURSES.map((course) => course.slug)).toEqual([
      'media',
      'technical',
      'ushering',
      'protocol',
      'choir',
      'welfare',
      'children',
    ]);
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
});
