'use client';

import React, { useEffect, useRef } from 'react';

interface AudioWaveformVisualizerProps {
  stream: MediaStream | null;
  isRecording: boolean;
  className?: string;
}

export const AudioWaveformVisualizer: React.FC<AudioWaveformVisualizerProps> = ({
  stream,
  isRecording,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    if (!isRecording || !stream) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const draw = () => {
        if (!isRecording) return;
        animationFrameRef.current = requestAnimationFrame(draw);

        analyser.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 1.5;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = Math.max(4, (dataArray[i] / 255) * canvas.height * 0.85);

          // Gold gradient for the testimony recorder
          const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
          gradient.addColorStop(0, '#E7C98C');
          gradient.addColorStop(1, '#B9954F');

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.roundRect(
            x,
            (canvas.height - barHeight) / 2,
            barWidth - 2,
            barHeight,
            2
          );
          ctx.fill();

          x += barWidth;
        }
      };

      draw();
    } catch (err) {
      console.warn('Audio visualizer could not start:', err);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, [isRecording, stream]);

  return (
    <div className={`w-full flex items-center justify-center ${className}`}>
      <canvas
        ref={canvasRef}
        width={320}
        height={64}
        className="w-full max-w-xs h-14 rounded-lg bg-ink-950/50 backdrop-blur-sm border border-line-soft"
      />
    </div>
  );
};
