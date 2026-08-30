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

    expect(screen.getByRole('button', { name: /^Voice$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Video$/i })).toBeInTheDocument();
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

    const videoTab = screen.getByRole('button', { name: /^Video$/i });
    fireEvent.click(videoTab);

    expect(screen.getByRole('button', { name: /Start Video Recording/i })).toBeInTheDocument();
    expect(screen.getByText(/Up to 7 minutes for a video/i)).toBeInTheDocument();
  });
});
