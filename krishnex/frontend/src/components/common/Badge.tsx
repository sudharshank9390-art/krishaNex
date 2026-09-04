import React from 'react';
import { clsx } from 'clsx';
import { TokenStatus } from '../../types';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'emerald' | 'cyan' | 'amber' | 'purple' | 'slate' | 'rose';
  status?: TokenStatus;
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant,
  status,
  className,
  size = 'md'
}) => {
  let resolvedVariant = variant || 'emerald';

  if (status) {
    switch (status) {
      case 'PAID':
      case 'PROCURED':
        resolvedVariant = 'emerald';
        break;
      case 'WEIGHED':
      case 'QUALITY_CHECKED':
        resolvedVariant = 'cyan';
        break;
      case 'BOOKED':
      case 'ARRIVED':
        resolvedVariant = 'amber';
        break;
      case 'GENERATED':
        resolvedVariant = 'purple';
        break;
      case 'CANCELLED':
        resolvedVariant = 'rose';
        break;
      default:
        resolvedVariant = 'slate';
    }
  }

  const variantStyles = {
    emerald: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    cyan: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    amber: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    purple: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    slate: 'bg-slate-800 text-slate-300 border-slate-700',
    rose: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 font-mono font-bold uppercase tracking-wider rounded-full border',
        variantStyles[resolvedVariant],
        sizeStyles[size],
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      <span>{children || status}</span>
    </span>
  );
};
