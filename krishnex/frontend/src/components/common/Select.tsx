import React from 'react';
import { clsx } from 'clsx';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
  error?: string;
  helperText?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  helperText,
  className,
  id,
  ...props
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={selectId} className="text-xs font-bold uppercase tracking-wider text-slate-300">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={clsx(
          'w-full bg-slate-950 border text-sm text-slate-100 rounded-xl px-4 py-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer',
          error ? 'border-rose-500' : 'border-slate-800 focus:border-emerald-500',
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-100">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-rose-400 font-medium">{error}</span>}
      {!error && helperText && <span className="text-xs text-slate-500">{helperText}</span>}
    </div>
  );
};
