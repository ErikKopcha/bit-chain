'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  withText?: boolean;
}

export function Logo({ className, size = 'md', withText = true }: LogoProps) {
  const sizeMap = {
    sm: 24,
    md: 32,
    lg: 48,
  };

  const logoSize = sizeMap[size];

  return (
    <Link href="/" className={cn('flex items-center gap-2', className)}>
      <div className="relative overflow-hidden">
        <Image
          src="/logo.svg"
          alt="Trading Journal Logo"
          width={logoSize}
          height={logoSize}
          className="object-contain"
        />
      </div>
      {withText && (
        <span
          className={cn('font-medium', {
            'text-sm': size === 'sm',
            'text-base': size === 'md',
            'text-lg': size === 'lg',
          })}
        >
          Trading Journal
        </span>
      )}
    </Link>
  );
}
