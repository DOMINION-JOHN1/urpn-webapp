'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';

type Mode = 'signin' | 'register';

export function AuthForm({
  initialMode = 'signin',
  showDemo = true,
  nextPath = '/portal',
}: {
  initialMode?: Mode;
  showDemo?: boolean;
  nextPath?: string;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const switchMode = (next: Mode) => {
    setMode(next);
    setError(null);
    setPassword('');
    setConfirm('');
  };

  const fillDemo = () => {
    setMode('signin');
    setEmail('worker@urpn.org');
    setPassword('urpn2026');
    setError(null);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (mode === 'register') {
      if (name.trim().length < 2) {
        setError('Please enter your full name.');
        return;
      }
      if (password.length < 8) {
        setError('Password must be at least 8 characters.');
        return;
      }
      if (password !== confirm) {
        setError('Those passwords do not match.');
        return;
      }
    }

    setLoading(true);
    try {
      const endpoint = mode === 'signin' ? '/api/auth/login' : '/api/auth/register';
      const payload =
        mode === 'signin'
          ? { email: email.trim(), password }
          : { name: name.trim(), email: email.trim(), password };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      router.replace(nextPath);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <div className="flex items-center gap-3">
        <span className="h-px w-6 bg-gold-500/70" />
        <span className="mono-label text-gold-300">Worker portal</span>
      </div>

      <h1 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.04em] text-cream-50 sm:text-[36px]">
        {mode === 'signin' ? 'Welcome back.' : 'Create your account.'}
      </h1>
      <p className="mt-3 text-[13.5px] leading-relaxed text-cream-400">
        {mode === 'signin'
          ? 'Sign in to continue your formation, pick up a lesson, or sit your final exam.'
          : 'Create a worker account to begin the Foundation Class, Ministers Training, or Pastors Training.'}
      </p>

      <form onSubmit={submit} className="mt-8 space-y-4" noValidate>
        {mode === 'register' && (
          <div>
            <label htmlFor="name" className="mb-1.5 block text-xs text-cream-300">
              Full name
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Grace Adeyemi"
              className="field"
              disabled={loading}
            />
          </div>
        )}

        <div>
          <label htmlFor="email" className="mb-1.5 block text-xs text-cream-300">
            Email address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="field"
            disabled={loading}
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-xs text-cream-300">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={mode === 'register' ? 'At least 8 characters' : 'Your password'}
              className="field pr-11"
              disabled={loading}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-cream-500 transition-colors hover:text-cream-50"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {mode === 'register' && (
          <div>
            <label htmlFor="confirm" className="mb-1.5 block text-xs text-cream-300">
              Confirm password
            </label>
            <input
              id="confirm"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
              placeholder="Repeat your password"
              className="field"
              disabled={loading}
              required
            />
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-900/60 bg-red-950/40 px-3.5 py-3 text-xs leading-relaxed text-red-200"
          >
            {error}
          </div>
        )}

        <button type="submit" disabled={loading} className="btn btn-primary w-full !py-3.5">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              {mode === 'signin' ? 'Signing in…' : 'Creating account…'}
            </>
          ) : (
            <>
              {mode === 'signin' ? 'Sign in' : 'Create account'}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </button>
      </form>

      <p className="mt-5 text-center text-xs text-cream-500">
        {mode === 'signin' ? 'New to the worker portal?' : 'Already have an account?'}{' '}
        <button
          type="button"
          onClick={() => switchMode(mode === 'signin' ? 'register' : 'signin')}
          className="font-medium text-cream-200 underline-offset-4 hover:text-cream-50 hover:underline"
        >
          {mode === 'signin' ? 'Create an account' : 'Sign in'}
        </button>
      </p>

      {mode === 'signin' && showDemo && (
        <div className="mt-8 rounded-xl border border-line bg-surface/50 p-3.5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="mono-label !text-[9px]">Demo worker</p>
              <p className="mt-1 font-mono text-[11px] text-cream-300">
                worker@urpn.org · urpn2026
              </p>
            </div>
            <button
              type="button"
              onClick={fillDemo}
              className="shrink-0 rounded-full border border-line px-3 py-1.5 text-[11px] text-cream-300 transition-colors hover:border-line-strong hover:text-cream-50"
            >
              Use demo
            </button>
          </div>
        </div>
      )}

      <p className="mt-6 text-center text-[10.5px] leading-relaxed text-cream-600">
        Accounts are for the URPN family. By continuing you agree to keep training material
        private to the network.
      </p>
    </div>
  );
}
