'use client';

import { useEffect, useState } from 'react';
import { Download, Share, Smartphone, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

type Variant = 'primary' | 'secondary' | 'ghost' | 'link';

interface InstallAppButtonProps {
  className?: string;
  label?: string;
  variant?: Variant;
}

const variantClass: Record<Variant, string> = {
  primary: 'btn btn-primary',
  secondary: 'btn btn-secondary',
  ghost: 'btn btn-ghost',
  link: 'inline-flex items-center gap-2 text-sm text-cream-300 hover:text-cream-50 transition-colors',
};

export function InstallAppButton({
  className = '',
  label = 'Install app',
  variant = 'secondary',
}: InstallAppButtonProps) {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    setIsStandalone(standalone);

    const ua = window.navigator.userAgent.toLowerCase();
    setIsIos(/iphone|ipad|ipod/.test(ua) && !/crios|fxios/.test(ua));

    const onPrompt = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setPromptEvent(null);
      setShowHelp(false);
    };

    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (isStandalone) return null;

  const handleClick = async () => {
    if (promptEvent) {
      await promptEvent.prompt();
      const choice = await promptEvent.userChoice;
      if (choice.outcome === 'accepted') {
        setInstalled(true);
        setPromptEvent(null);
      }
      return;
    }
    setShowHelp(true);
  };

  return (
    <>
      <button type="button" onClick={handleClick} className={`${variantClass[variant]} ${className}`}>
        <Download className="h-4 w-4" aria-hidden="true" />
        <span>{installed ? 'Installed' : label}</span>
      </button>

      {showHelp && (
        <div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-label="How to install the URPN app"
        >
          <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="mono-label mb-2 text-accent">Install URPN</p>
                <h2 className="text-xl font-semibold text-cream-50">Keep the portal on your phone</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowHelp(false)}
                className="rounded-full border border-line p-2 text-cream-400 hover:text-cream-50"
                aria-label="Close install instructions"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 text-sm leading-relaxed text-cream-300">
              {isIos ? (
                <>
                  <div className="flex gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line bg-surface-raised text-accent">
                      1
                    </span>
                    <p>
                      Open this page in <strong className="text-cream-50">Safari</strong>, then tap the
                      Share button
                      <Share className="mx-1 inline h-3.5 w-3.5 text-cream-300" aria-hidden="true" />
                      in the toolbar.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line bg-surface-raised text-accent">
                      2
                    </span>
                    <p>
                      Scroll down and choose{' '}
                      <strong className="text-cream-50">Add to Home Screen</strong>, then tap{' '}
                      <strong className="text-cream-50">Add</strong>.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line bg-surface-raised text-accent">
                      1
                    </span>
                    <p>
                      Open the browser menu (<Smartphone className="mx-1 inline h-3.5 w-3.5" />).
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line bg-surface-raised text-accent">
                      2
                    </span>
                    <p>
                      Choose <strong className="text-cream-50">Install app</strong> or{' '}
                      <strong className="text-cream-50">Add to Home screen</strong>.
                    </p>
                  </div>
                </>
              )}
              <p className="rounded-xl border border-line bg-canvas/60 p-3 text-xs text-cream-400">
                The app opens the worker portal, remembers your sign-in, and keeps your training
                progress at hand.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowHelp(false)}
              className="btn btn-primary mt-6 w-full"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
