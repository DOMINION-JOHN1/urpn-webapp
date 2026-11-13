'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, Copy, Download, Loader2, Printer, Share2 } from 'lucide-react';

type CertificateShareData = {
  fullName: string;
  courseTitle: string;
  issued: string;
  score: number;
  year: number;
  code: string;
  verifyUrl: string;
  avatarUrl: string | null;
};

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = src;
  });
}

function drawWrappedText(
  context: CanvasRenderingContext2D,
  value: string,
  centerX: number,
  startY: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = value.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (line && context.measureText(candidate).width > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  lines.forEach((entry, index) => context.fillText(entry, centerX, startY + index * lineHeight));
  return startY + lines.length * lineHeight;
}

function drawImageCover(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number
) {
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const sourceWidth = width / scale;
  const sourceHeight = height / scale;
  const sourceX = (image.naturalWidth - sourceWidth) / 2;
  const sourceY = (image.naturalHeight - sourceHeight) / 2;
  context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height);
}

async function buildCertificateImage(data: CertificateShareData): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = 1600;
  canvas.height = 1120;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Your browser could not prepare the certificate image.');

  context.fillStyle = '#fffdf9';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = '#8f7a51';
  context.lineWidth = 3;
  context.strokeRect(36, 36, 1528, 1048);
  context.strokeStyle = '#6a1557';
  context.lineWidth = 1;
  context.strokeRect(52, 52, 1496, 1016);

  const logo = await loadImage('/brand/urpn-mark.png');
  if (logo) context.drawImage(logo, 746, 78, 108, 108);

  const center = canvas.width / 2;
  context.textAlign = 'center';
  context.fillStyle = '#321a30';
  context.font = '600 23px Arial, sans-serif';
  context.fillText('UNIQUE REVIVAL PRAYER NETWORK', center, 220);
  context.fillStyle = '#6a1557';
  context.font = '600 19px Arial, sans-serif';
  context.fillText('CERTIFICATE OF COMPLETION', center, 300);
  context.fillStyle = '#685b61';
  context.font = 'italic 20px Georgia, serif';
  context.fillText('This is to certify that', center, 354);

  const portrait = data.avatarUrl ? await loadImage(data.avatarUrl) : null;
  context.save();
  context.beginPath();
  context.arc(center, 450, 66, 0, Math.PI * 2);
  context.closePath();
  context.clip();
  if (portrait) {
    drawImageCover(context, portrait, center - 66, 384, 132, 132);
  } else {
    context.fillStyle = '#f0e8ef';
    context.fillRect(center - 66, 384, 132, 132);
    context.fillStyle = '#6a1557';
    context.font = '600 44px Arial, sans-serif';
    context.fillText(
      data.fullName.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase(),
      center,
      465
    );
  }
  context.restore();
  context.strokeStyle = '#8f7a51';
  context.lineWidth = 2;
  context.beginPath();
  context.arc(center, 450, 68, 0, Math.PI * 2);
  context.stroke();

  context.fillStyle = '#231722';
  context.font = 'bold 46px Georgia, serif';
  const nameBottom = drawWrappedText(context, data.fullName, center, 560, 1250, 56);
  context.fillStyle = '#685b61';
  context.font = '20px Georgia, serif';
  const descriptionBottom = drawWrappedText(
    context,
    'has successfully completed the training and certification requirements for',
    center,
    nameBottom + 18,
    1100,
    30
  );
  context.fillStyle = '#321a30';
  context.font = 'bold 32px Georgia, serif';
  const courseBottom = drawWrappedText(context, data.courseTitle, center, descriptionBottom + 20, 1250, 40);

  context.fillStyle = '#6a1557';
  context.font = '600 18px Arial, sans-serif';
  const scoreY = courseBottom + 30;
  context.fillText(`FINAL SCORE  ·  ${data.score}%  ·  PASSED`, center, scoreY);

  context.strokeStyle = '#d8cfbe';
  context.lineWidth = 1;
  context.beginPath();
  const dividerY = scoreY + 50;
  context.moveTo(150, dividerY);
  context.lineTo(1450, dividerY);
  context.stroke();

  context.textAlign = 'left';
  context.fillStyle = '#685b61';
  context.font = '16px Arial, sans-serif';
  context.fillText(`Issued ${data.issued}`, 150, dividerY + 50);
  context.fillText(`Certificate ${data.code}`, 150, dividerY + 82);
  context.textAlign = 'right';
  context.fillText(`URPN · ${data.year}`, 1450, dividerY + 50);
  context.font = '13px Arial, sans-serif';
  context.fillText(data.verifyUrl, 1450, dividerY + 82);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Your browser could not create the certificate image.'));
    }, 'image/png');
  });
}

export function CertificateActions({
  verifyUrl,
  fullName,
  courseTitle,
  issued,
  score,
  year,
  code,
  avatarUrl,
  profileComplete,
}: CertificateShareData & { profileComplete: boolean }) {
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState<'download' | 'share' | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(verifyUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setMessage('Copying is not available in this browser. You can copy the verification link from the certificate.');
    }
  };

  const download = async () => {
    setBusy('download');
    setMessage(null);
    try {
      const blob = await buildCertificateImage({
        verifyUrl,
        fullName,
        courseTitle,
        issued,
        score,
        year,
        code,
        avatarUrl,
      });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `URPN-Certificate-${code}.png`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setMessage('Certificate downloaded as a PNG image.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not download the certificate.');
    } finally {
      setBusy(null);
    }
  };

  const share = async () => {
    setBusy('share');
    setMessage(null);
    try {
      if (typeof navigator.share !== 'function') {
        await navigator.clipboard.writeText(verifyUrl);
        setMessage('Sharing is not available here. The verification link has been copied.');
        return;
      }
      const blob = await buildCertificateImage({
        verifyUrl,
        fullName,
        courseTitle,
        issued,
        score,
        year,
        code,
        avatarUrl,
      });
      const file = new File([blob], `URPN-Certificate-${code}.png`, { type: 'image/png' });
      const shareData = {
        title: `${fullName} · URPN certificate`,
        text: `Certificate of completion · ${courseTitle}`,
        url: verifyUrl,
        files: [file],
      };
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share(shareData);
        setMessage('Certificate shared.');
      } else {
        await navigator.share({ title: shareData.title, text: shareData.text, url: verifyUrl });
        setMessage('Verification link shared.');
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      setMessage(error instanceof Error ? error.message : 'Could not share the certificate.');
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="print-hide flex flex-col gap-2 sm:flex-row sm:flex-wrap">
      <button type="button" onClick={() => window.print()} disabled={!profileComplete} className="btn btn-secondary">
        <Printer className="h-4 w-4" aria-hidden="true" />
        Save as PDF
      </button>
      <button type="button" onClick={download} disabled={!profileComplete || busy !== null} className="btn btn-primary">
        {busy === 'download' ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Download className="h-4 w-4" aria-hidden="true" />}
        Download PNG
      </button>
      <button type="button" onClick={share} disabled={!profileComplete || busy !== null} className="btn btn-secondary">
        {busy === 'share' ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Share2 className="h-4 w-4" aria-hidden="true" />}
        Share certificate
      </button>
      <button type="button" onClick={copy} className="btn btn-secondary">
        {copied ? <Check className="h-4 w-4 text-accent" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
        {copied ? 'Link copied' : 'Copy verification link'}
      </button>
      {!profileComplete && (
        <p className="basis-full text-[11px] leading-relaxed text-cream-500">
          Add your name, birthday, address, and profile photo before downloading or sharing the certificate.{' '}
          <Link href="/portal/profile" className="font-medium text-accent underline underline-offset-2">
            Complete profile
          </Link>
        </p>
      )}
      {message && <p role="status" className="basis-full text-[11px] text-cream-400">{message}</p>}
    </div>
  );
}
