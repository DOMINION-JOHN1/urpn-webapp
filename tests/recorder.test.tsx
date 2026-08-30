// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MediaRecorderComponent } from '@/components/MediaRecorderComponent';

describe('MediaRecorderComponent UI', () => {
  it('renders mode switch buttons for Voice and Video recording', () => {
    const handleComplete = vi.fn();
    const handleReset = vi.fn();

    render(
      <MediaRecorderComponent
        onRecordingComplete={handleComplete}
        onReset={handleReset}
      />
    );

    expect(screen.getByRole('button', { name: /Voice Recording \(10 min\)/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Video Recording \(7 min max\)/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Start Voice Recording/i })).toBeInTheDocument();
  });

  it('switches to Video mode when clicking Video tab', () => {
    const handleComplete = vi.fn();
    const handleReset = vi.fn();

    render(
      <MediaRecorderComponent
        onRecordingComplete={handleComplete}
        onReset={handleReset}
      />
    );

    const videoTab = screen.getByRole('button', { name: /Video Recording \(7 min max\)/i });
    fireEvent.click(videoTab);

    expect(screen.getByRole('button', { name: /Start Video Recording/i })).toBeInTheDocument();
    expect(screen.getByText(/Limit: 7 minutes for video testimony/i)).toBeInTheDocument();
  });
});
