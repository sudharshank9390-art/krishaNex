import React from 'react';
import { Inbox } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon
}) => (
  <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-900/60 border border-slate-800 rounded-2xl gap-4">
    <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400">
      {icon || <Inbox className="w-7 h-7" />}
    </div>
    <div className="max-w-md flex flex-col gap-1">
      <h4 className="font-heading font-bold text-lg text-white">{title}</h4>
      <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
    </div>
    {actionLabel && onAction && (
      <Button onClick={onAction} size="sm">
        {actionLabel}
      </Button>
    )}
  </div>
);
