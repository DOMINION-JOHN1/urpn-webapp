'use client';

import { useState } from 'react';
import { Check, Copy, Printer } from 'lucide-react';

export function CertificateActions({ verifyUrl }: { verifyUrl: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(verifyUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be denied; the URL is visible on the certificate.
    }
  };

  return (
    <div className="print-hide flex flex-col gap-2 sm:flex-row">
      <button type="button" onClick={() => window.print()} className="btn btn-primary">
        <Printer className="h-4 w-4" aria-hidden="true" />
        Print / save as PDF
      </button>
      <button type="button" onClick={copy} className="btn btn-secondary">
        {copied ? (
          <Check className="h-4 w-4 text-accent" aria-hidden="true" />
        ) : (
          <Copy className="h-4 w-4" aria-hidden="true" />
        )}
        {copied ? 'Link copied' : 'Copy verification link'}
      </button>
    </div>
  );
}
