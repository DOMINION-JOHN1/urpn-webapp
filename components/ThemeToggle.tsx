'use client';

import { Moon, Sun } from 'lucide-react';

/**
 * Toggles the `light` class on <html>. The initial theme is applied by an
 * inline script in the root layout before paint, so there is no flash.
 */
export function ThemeToggle({ className = '' }: { className?: string }) {
  const toggle = () => {
    const root = document.documentElement;
    const next = root.classList.contains('light') ? 'dark' : 'light';
    root.classList.toggle('light', next === 'light');
    root.style.colorScheme = next;

    try {
      localStorage.setItem('urpn-theme', next);
    } catch {
      // Storage can be unavailable in private contexts.
    }

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', next === 'light' ? '#F6F2F4' : '#0D0C0F');
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={`flex h-9 w-9 items-center justify-center rounded-full border border-line text-cream-400 transition-colors hover:border-line-strong hover:text-cream-50 ${className}`}
      aria-label="Toggle light or dark theme"
      title="Toggle light / dark theme"
    >
      <Moon className="h-4 w-4 light:hidden" aria-hidden="true" />
      <Sun className="hidden h-4 w-4 light:block" aria-hidden="true" />
    </button>
  );
}
