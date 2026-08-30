import React from 'react';

/**
 * Hero backdrop — a deep, dark warm field (near-black with a whisper of
 * royal purple up top and a warm gold glow rising from the base). No hard
 * lines: a soft halo behind the emblem, a gentle vignette, and faint grain
 * give it depth without ever competing with the headline.
 */
export const HeroBackdrop: React.FC = () => (
  <svg
    className="absolute inset-0 w-full h-full"
    viewBox="0 0 1440 810"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
  >
    <defs>
      {/* Deep, dark base — subtle purple at top easing to warm near-black */}
      <linearGradient id="hbBase" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stopColor="#190b20" />
        <stop offset="46%" stopColor="#110912" />
        <stop offset="100%" stopColor="#0c0710" />
      </linearGradient>

      {/* Whisper of deep royal purple across the top */}
      <radialGradient id="hbTop" cx="50%" cy="0%" r="62%">
        <stop offset="0%" stopColor="#6e1c5c" stopOpacity="0.30" />
        <stop offset="55%" stopColor="#4a1650" stopOpacity="0.08" />
        <stop offset="100%" stopColor="#4a1650" stopOpacity="0" />
      </radialGradient>

      {/* Soft golden halo behind the emblem */}
      <radialGradient id="hbHalo" cx="50%" cy="26%" r="34%">
        <stop offset="0%" stopColor="#F6C64A" stopOpacity="0.12" />
        <stop offset="45%" stopColor="#E7A11E" stopOpacity="0.05" />
        <stop offset="100%" stopColor="#E7A11E" stopOpacity="0" />
      </radialGradient>

      {/* Warm gold glow rising from the base */}
      <radialGradient id="hbGoldWash" cx="50%" cy="106%" r="72%">
        <stop offset="0%" stopColor="#E7A11E" stopOpacity="0.30" />
        <stop offset="50%" stopColor="#B9720F" stopOpacity="0.10" />
        <stop offset="100%" stopColor="#B9720F" stopOpacity="0" />
      </radialGradient>

      {/* Gentle vignette to frame the composition */}
      <radialGradient id="hbVignette" cx="50%" cy="46%" r="78%">
        <stop offset="0%" stopColor="#000000" stopOpacity="0" />
        <stop offset="72%" stopColor="#000000" stopOpacity="0" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0.55" />
      </radialGradient>

      {/* Faint film grain for premium texture */}
      <filter id="hbGrain" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="n" />
        <feColorMatrix in="n" type="saturate" values="0" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.05" />
        </feComponentTransfer>
      </filter>
    </defs>

    <rect width="1440" height="810" fill="url(#hbBase)" />
    <rect width="1440" height="810" fill="url(#hbTop)" />
    <rect width="1440" height="810" fill="url(#hbHalo)" />
    <rect width="1440" height="810" fill="url(#hbGoldWash)" />
    <rect width="1440" height="810" fill="url(#hbVignette)" />
    <rect width="1440" height="810" filter="url(#hbGrain)" />
  </svg>
);
