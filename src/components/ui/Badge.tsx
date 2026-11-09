import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'label' | 'status' | 'counter';
  className?: string;
  style?: React.CSSProperties;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'label',
  className,
  style,
}) => {
  const base = 'inline-flex items-center font-medium leading-none select-none transition-colors';

  const variants = {
    label: 'bg-[#E8E4DC] text-[#4A4D3B] text-[11px] px-2 py-0.5 rounded-md tracking-tight',
    status: 'bg-stone-100 text-stone-700 text-xs px-2.5 py-1 rounded-full',
    counter: 'bg-stone-100 text-stone-600 text-xs px-2 py-0.5 rounded-full font-semibold',
  };

  return (
    <span
      style={style}
      className={twMerge(clsx(base, variants[variant], className))}
    >
      {children}
    </span>
  );
};

