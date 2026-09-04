import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  variant?: 'default' | 'bordered' | 'accent' | 'cyan';
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  action,
  className,
  headerClassName,
  bodyClassName,
  variant = 'default'
}) => {
  const variantStyles = {
    default: 'bg-slate-900 border border-slate-800',
    bordered: 'bg-slate-900/90 border-2 border-slate-800 hover:border-slate-700',
    accent: 'bg-slate-900 border-2 border-emerald-500/40 hover:border-emerald-400 shadow-xl shadow-emerald-950/20',
    cyan: 'bg-slate-900 border-2 border-cyan-500/40 hover:border-cyan-400 shadow-xl shadow-cyan-950/20',
  };

  return (
    <div className={clsx('rounded-2xl overflow-hidden transition-all duration-200', variantStyles[variant], className)}>
      {(title || action) && (
        <div className={clsx('px-6 py-4 border-b border-slate-800/80 flex items-center justify-between gap-4', headerClassName)}>
          <div>
            {typeof title === 'string' ? (
              <h3 className="font-heading font-bold text-lg text-white tracking-tight">{title}</h3>
            ) : (
              title
            )}
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={clsx('p-6', bodyClassName)}>
        {children}
      </div>
    </div>
  );
};
