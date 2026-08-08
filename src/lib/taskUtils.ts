import type { Priority, Status } from '@/types';

export const priorityConfig: Record<Priority, { label: string; classes: string; dot: string }> = {
  low: {
    label: 'Low',
    classes: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
    dot: 'bg-emerald-500',
  },
  medium: {
    label: 'Medium',
    classes: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
    dot: 'bg-amber-500',
  },
  high: {
    label: 'High',
    classes: 'bg-rose-500/10 text-rose-400 border-rose-500/25',
    dot: 'bg-rose-500',
  },
};

export const statusConfig: Record<Status, { label: string; classes: string; dot: string }> = {
  todo: {
    label: 'To Do',
    classes: 'bg-slate-500/10 text-slate-300 border-slate-500/25',
    dot: 'bg-slate-400',
  },
  'in-progress': {
    label: 'In Progress',
    classes: 'bg-brand-500/15 text-brand-300 border-brand-500/30',
    dot: 'bg-brand-500',
  },
  done: {
    label: 'Done',
    classes: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
    dot: 'bg-emerald-500',
  },
};

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'No due date';
  const date = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const diffDays = Math.round((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
  if (diffDays <= 7) return `In ${diffDays} days`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function isOverdue(dateStr: string | null, status: Status): boolean {
  if (!dateStr || status === 'done') return false;
  const date = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date.getTime() < today.getTime();
}

export function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}
