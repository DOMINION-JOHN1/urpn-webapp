'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Mic,
  Video,
  Square,
  RotateCcw,
  AlertCircle,
  Volume2,
  Camera,
  CheckCircle2,
  Clock,
  SwitchCamera,
} from 'lucide-react';
import { AudioWaveformVisualizer } from './AudioWaveformVisualizer';

export type MediaType = 'audio' | 'video';

interface MediaRecorderComponentProps {
  onRecordingComplete: (blob: Blob, mediaType: MediaType, durationSeconds: number) => void;
  onReset: () => void;
  disabled?: boolean;
  maxAudioSeconds?: number;
  maxVideoSeconds?: number;
}

export const MediaRecorderComponent: React.FC<MediaRecorderComponentProps> = ({
  onRecordingComplete,
  onReset,
  disabled = false,
  maxAudioSeconds = 600, // 10 minutes
  maxVideoSeconds = 420, // 7 minutes
}) => {
  const [mediaType, setMediaType] = useState<MediaType>('audio');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('user');
  const [hasCameraOptions, setHasCameraOptions] = useState<boolean>(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const videoLiveRef = useRef<HTMLVideoElement | null>(null);
  const playbackAudioRef = useRef<HTMLAudioElement | null>(null);
  const playbackVideoRef = useRef<HTMLVideoElement | null>(null);

  const currentMaxSeconds = mediaType === 'video' ? maxVideoSeconds : maxAudioSeconds;
  const remainingSeconds = Math.max(0, currentMaxSeconds - recordingDuration);

  // Check if multiple camera devices exist
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.mediaDevices?.enumerateDevices) {
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
          const videoInputs = devices.filter((d) => d.kind === 'videoinput');
          setHasCameraOptions(videoInputs.length > 1);
        })
        .catch(() => {});
    }
  }, []);

  // Format seconds into MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Clean up streams & timers on unmount
  const cleanupStream = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoLiveRef.current) {
      videoLiveRef.current.srcObject = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      cleanupStream();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (recordedUrl) URL.revokeObjectURL(recordedUrl);
    };
  }, [cleanupStream, recordedUrl]);

  // Start live viewfinder for video mode when not recorded yet
  useEffect(() => {
    if (mediaType === 'video' && !recordedBlob && !isRecording) {
      startCameraPreview();
    } else if (mediaType === 'audio' && !isRecording) {
      cleanupStream();
    }
  }, [mediaType, recordedBlob, cameraFacing]);

  const startCameraPreview = async () => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      return;
    }
    try {
      setPermissionError(null);
      cleanupStream();

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: cameraFacing,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: true,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      mediaStreamRef.current = stream;

      if (videoLiveRef.current) {
        videoLiveRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.warn('Camera preview error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setPermissionError(
          'Camera and microphone access was denied. Please click the lock or camera icon in your browser address bar to allow permissions, then refresh.'
        );
      }
    }
  };

  // Determine best supported MIME type
  const getSupportedMimeType = (type: MediaType): string => {
    if (type === 'video') {
      const videoTypes = [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm',
        'video/mp4',
      ];
      for (const t of videoTypes) {
        if (MediaRecorder.isTypeSupported(t)) return t;
      }
      return 'video/webm';
    } else {
      const audioTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/ogg;codecs=opus',
        'audio/wav',
      ];
      for (const t of audioTypes) {
        if (MediaRecorder.isTypeSupported(t)) return t;
      }
      return 'audio/webm';
    }
  };

  // Start Recording
  const startRecording = async () => {
    try {
      setPermissionError(null);
      cleanupStream();
      audioChunksRef.current = [];
      setRecordingDuration(0);

      const constraints: MediaStreamConstraints =
        mediaType === 'video'
          ? {
              video: {
                facingMode: cameraFacing,
                width: { ideal: 1280 },
                height: { ideal: 720 },
              },
              audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
              },
            }
          : {
              audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
              },
              video: false,
            };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      mediaStreamRef.current = stream;

      if (mediaType === 'video' && videoLiveRef.current) {
        videoLiveRef.current.srcObject = stream;
      }

      const mimeType = getSupportedMimeType(mediaType);
      const recorder = new MediaRecorder(stream, {
        mimeType: mimeType || undefined,
        audioBitsPerSecond: 128000,
        videoBitsPerSecond: mediaType === 'video' ? 1500000 : undefined,
      });

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const finalBlob = new Blob(audioChunksRef.current, {
          type: mimeType || (mediaType === 'video' ? 'video/webm' : 'audio/webm'),
        });
        const url = URL.createObjectURL(finalBlob);
        setRecordedBlob(finalBlob);
        setRecordedUrl(url);
        setIsRecording(false);
        cleanupStream();

        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
        }

        onRecordingComplete(finalBlob, mediaType, recordingDuration);
      };

      mediaRecorderRef.current = recorder;
      recorder.start(1000); // 1-second slices
      setIsRecording(true);

      // Start duration counter
      const startTimestamp = Date.now();
      timerIntervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimestamp) / 1000);
        setRecordingDuration(elapsed);

        // Auto-stop when reaching max limit
        if (elapsed >= currentMaxSeconds) {
          stopRecording();
        }
      }, 500);
    } catch (err: any) {
      console.error('Failed to start recording:', err);
      setIsRecording(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setPermissionError(
          `Permission denied. Please allow ${
            mediaType === 'video' ? 'camera and microphone' : 'microphone'
          } access in your browser settings to record your testimony.`
        );
      } else {
        setPermissionError(
          `Unable to access recording devices (${err.message || 'unknown device error'}). Please check your device and try again.`
        );
      }
    }
  };

  // Stop Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    setIsRecording(false);
  };

  // Reset / Re-record
  const handleReset = () => {
    if (isRecording) {
      stopRecording();
    }
    if (recordedUrl) {
      URL.revokeObjectURL(recordedUrl);
    }
    setRecordedBlob(null);
    setRecordedUrl(null);
    setRecordingDuration(0);
    setIsPlaying(false);
    onReset();
    if (mediaType === 'video') {
      startCameraPreview();
    }
  };

  const toggleCameraFacing = () => {
    setCameraFacing((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Mode Switcher Tabs */}
      {!recordedBlob && !isRecording && (
        <div className="flex items-center gap-1.5 p-1 bg-ink-950/60 border border-white/10 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => {
              setMediaType('audio');
              setPermissionError(null);
            }}
            disabled={disabled}
            className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              mediaType === 'audio'
                ? 'bg-gold-sheen text-ink-950 shadow-glow-gold'
                : 'text-cream-400 hover:text-cream-100 hover:bg-white/5'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>Voice</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMediaType('video');
              setPermissionError(null);
            }}
            disabled={disabled}
            className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              mediaType === 'video'
                ? 'bg-gold-sheen text-ink-950 shadow-glow-gold'
                : 'text-cream-400 hover:text-cream-100 hover:bg-white/5'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Video</span>
          </button>
        </div>
      )}

      {/* Permission Error Notification */}
      {permissionError && (
        <div className="w-full max-w-md p-4 mb-6 bg-red-950/50 border border-red-800/60 rounded-2xl text-red-200 text-sm flex items-start gap-3 animate-fade-in">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold text-red-300 mb-1">Permission Required</p>
            <p className="text-xs leading-relaxed">{permissionError}</p>
            <button
              type="button"
              onClick={() => (mediaType === 'video' ? startCameraPreview() : startRecording())}
              className="mt-2 text-xs font-bold text-gold-300 hover:underline"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 1. STATE: NOT RECORDED YET */}
      {/* ------------------------------------------------------------- */}
      {!recordedBlob && (
        <div className="w-full flex flex-col items-center">
          {/* Video Live Viewfinder */}
          {mediaType === 'video' && (
            <div className="relative w-full max-w-md aspect-video bg-black rounded-3xl overflow-hidden border border-white/10 shadow-elevate mb-6 flex items-center justify-center">
              <video
                ref={videoLiveRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${cameraFacing === 'user' ? 'scale-x-[-1]' : ''}`}
              />

              {!isRecording && (
                <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold text-white border border-white/20 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-gold-400" />
                  <span>Live Camera</span>
                </div>
              )}

              {/* Mobile Camera Switcher */}
              {hasCameraOptions && !isRecording && (
                <button
                  type="button"
                  onClick={toggleCameraFacing}
                  className="absolute top-3 right-3 p-2 bg-black/75 backdrop-blur-md rounded-full text-white border border-white/20 hover:scale-110 active:scale-95 transition"
                  title="Switch Camera (Front / Rear)"
                >
                  <SwitchCamera className="w-4 h-4" />
                </button>
              )}

              {/* Video Recording Status Overlay */}
              {isRecording && (
                <div className="absolute top-3 left-3 flex items-center gap-2 bg-red-600 text-white px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider animate-pulse shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  <span>REC {formatTime(recordingDuration)}</span>
                </div>
              )}

              {/* Limit Counter on Video Overlay */}
              {isRecording && (
                <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-mono font-semibold text-gold-300 border border-white/10">
                  {formatTime(remainingSeconds)} left
                </div>
              )}
            </div>
          )}

          {/* Audio Waveform Live Visualizer */}
          {mediaType === 'audio' && isRecording && (
            <div className="w-full max-w-sm mb-6 flex flex-col items-center">
              <AudioWaveformVisualizer
                stream={mediaStreamRef.current}
                isRecording={isRecording}
                className="mb-2"
              />
              <div className="flex items-center gap-2 text-cream-400 text-xs font-medium">
                <Volume2 className="w-4 h-4 text-gold-400 animate-pulse" />
                <span>Listening • speak clearly from your heart</span>
              </div>
            </div>
          )}

          {/* Recording Timer & Limit Bar */}
          {isRecording && (
            <div className="flex flex-col items-center mb-6 w-full max-w-xs">
              <div className="text-5xl font-mono font-extrabold tracking-tight text-gold-300 drop-shadow-[0_2px_16px_rgba(237,165,30,0.35)] mb-2">
                {formatTime(recordingDuration)}
              </div>

              <div className="w-full bg-ink-950 h-2.5 rounded-full overflow-hidden border border-white/10 mb-1.5">
                <div
                  className={`h-full transition-all duration-300 ${
                    remainingSeconds < 60 ? 'bg-red-500' : 'bg-gold-sheen'
                  }`}
                  style={{
                    width: `${Math.min(100, (recordingDuration / currentMaxSeconds) * 100)}%`,
                  }}
                />
              </div>

              <div className="flex justify-between w-full text-[11px] text-cream-500 font-semibold">
                <span>00:00</span>
                <span className={remainingSeconds < 60 ? 'text-red-400 font-bold' : ''}>
                  {remainingSeconds < 60 ? `${remainingSeconds}s left` : `Max ${formatTime(currentMaxSeconds)}`}
                </span>
              </div>
            </div>
          )}

          {/* Start / Stop Button Controls */}
          {!isRecording ? (
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={startRecording}
                disabled={disabled}
                className="group relative flex items-center justify-center gap-3 px-9 sm:px-11 py-4 bg-gold-sheen bg-[length:200%_auto] hover:bg-right text-ink-950 font-semibold text-base sm:text-lg rounded-2xl shadow-glow-gold-lg hover:scale-[1.04] active:scale-95 transition-all duration-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="w-8 h-8 rounded-full bg-ink-950/15 flex items-center justify-center">
                  {mediaType === 'video' ? (
                    <Video className="w-5 h-5 text-ink-950" />
                  ) : (
                    <Mic className="w-5 h-5 text-ink-950" />
                  )}
                </div>
                <span>Start {mediaType === 'video' ? 'Video' : 'Voice'} Recording</span>
              </button>
              <p className="mt-3 text-xs text-cream-500 flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-gold-400" />
                <span>
                  {mediaType === 'video'
                    ? 'Up to 7 minutes for a video'
                    : 'Up to 10 minutes for a voice note'}
                </span>
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={stopRecording}
                className="group relative flex items-center justify-center gap-3 px-9 sm:px-11 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold text-base sm:text-lg rounded-2xl shadow-lg hover:scale-[1.04] active:scale-95 transition-all duration-200 cursor-pointer animate-pulse"
              >
                <Square className="w-5 h-5 fill-white" />
                <span>Stop Recording</span>
              </button>
              <p className="mt-3 text-xs text-cream-500 font-medium">
                Tap to finish and review before submitting
              </p>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. STATE: RECORDED & REVIEW PLAYBACK */}
      {/* ------------------------------------------------------------- */}
      {recordedBlob && recordedUrl && (
        <div className="w-full max-w-md panel rounded-3xl p-5 shadow-elevate flex flex-col items-center animate-fade-in">
          {/* Header Tag */}
          <div className="flex items-center justify-between w-full mb-4 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2 text-gold-300 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Recording Ready</span>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-ink-950 text-cream-300 border border-white/10">
              {formatTime(recordingDuration)} · {mediaType.toUpperCase()}
            </span>
          </div>

          {/* Video Playback Element */}
          {mediaType === 'video' && (
            <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden mb-4 border border-white/10">
              <video
                ref={playbackVideoRef}
                src={recordedUrl}
                playsInline
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
                className="w-full h-full object-cover"
                controls
              />
            </div>
          )}

          {/* Audio Playback Element */}
          {mediaType === 'audio' && (
            <div className="w-full flex flex-col items-center mb-4 p-4 bg-ink-950/60 rounded-2xl border border-white/10">
              <audio
                ref={playbackAudioRef}
                src={recordedUrl}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
                className="w-full mb-2"
                controls
              />
              <p className="text-xs text-cream-400 flex items-center gap-1.5 mt-1 font-medium">
                <Volume2 className="w-3.5 h-3.5 text-gold-400" />
                <span>Listen back before submitting</span>
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-3 w-full pt-1">
            <button
              type="button"
              onClick={handleReset}
              disabled={disabled}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-cream-200 text-sm font-semibold transition cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className="w-4 h-4 text-gold-400" />
              <span>Re-record</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
