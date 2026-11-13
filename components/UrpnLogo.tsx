import React from 'react';
import Image from 'next/image';

interface UrpnLogoProps {
  className?: string;
  showWordmark?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: { box: 'h-7 w-7', title: 'text-[13px]' },
  md: { box: 'h-9 w-9', title: 'text-[15px]' },
  lg: { box: 'h-12 w-12', title: 'text-xl' },
};

/**
 * The URPN mark (transparent, cropped from the official emblem) plus a clean
 * sans wordmark. The gold lives in the emblem only; the interface stays
 * neutral so the brand does not overwhelm the content.
 */
export const UrpnLogo: React.FC<UrpnLogoProps> = ({
  className = '',
  showWordmark = true,
  size = 'md',
}) => {
  const s = sizeMap[size];

  return (
    <div className={`flex select-none items-center gap-2.5 ${className}`}>
      <span className={`relative ${s.box} shrink-0`}>
        <Image
          src="/brand/urpn-mark.png"
          alt="URPN emblem"
          fill
          sizes="48px"
          priority
          className="object-contain"
        />
      </span>

      {showWordmark && (
        <div className="flex items-center leading-none">
          <span className={`font-semibold tracking-[-0.02em] text-cream-50 ${s.title}`}>
            URPN
          </span>
        </div>
      )}
    </div>
  );
};
