import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ProgressBarProps {
  value: number; // 0 to 100
  colorHex?: string;
  className?: string;
  heightClass?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  colorHex = '#4E7D65',
  className,
  heightClass = 'h-1.5',
}) => {
  const clampedValue = Math.min(Math.max(value, 0), 100);

  return (
    <div
      className={twMerge(
        clsx('w-full bg-stone-100 rounded-full overflow-hidden', heightClass, className)
      )}
    >
      <div
        className="h-full rounded-full transition-all duration-500 ease-out"
        style={{
          width: `${clampedValue}%`,
          backgroundColor: colorHex,
        }}
      />
    </div>
  );
};

