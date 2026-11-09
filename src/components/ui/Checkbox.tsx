import React from 'react';
import { Check } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  disabled = false,
  className,
  size = 'md',
}) => {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) onChange(!checked);
      }}
      className={twMerge(
        clsx(
          'relative flex items-center justify-center rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#3D5A40]',
          size === 'sm' ? 'w-4 h-4' : 'w-5 h-5',
          checked
            ? 'bg-[#3D5A40] border-[#3D5A40] text-white'
            : 'border border-stone-300 hover:border-stone-400 bg-white/80',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )
      )}
    >
      <Check
        className={clsx(
          'transition-transform duration-200 stroke-[3]',
          size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5',
          checked ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
        )}
      />
    </button>
  );
};

