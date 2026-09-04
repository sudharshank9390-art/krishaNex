import React from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  icon,
  className,
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="text-xs font-bold uppercase tracking-wider text-slate-300">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3 text-slate-400 pointer-events-none w-5 h-5 flex items-center justify-center">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={clsx(
            'w-full bg-slate-950 border text-sm text-slate-100 placeholder-slate-500 rounded-xl px-4 py-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50',
            icon ? 'pl-10' : 'pl-4',
            error ? 'border-rose-500 focus:border-rose-500' : 'border-slate-800 focus:border-emerald-500',
            className
          )}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-rose-400 font-medium">{error}</span>}
      {!error && helperText && <span className="text-xs text-slate-500">{helperText}</span>}
    </div>
  );
};
