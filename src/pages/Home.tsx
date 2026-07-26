import { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  ListChecks,
  Loader2,
  Plus,
  Sparkles,
  TrendingUp,
  AlertCircle,
  CalendarClock,
  ArrowRight,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Page, StudyTask } from '@/types';
import { formatDate, isOverdue, priorityConfig, statusConfig } from '@/lib/taskUtils';

interface HomeProps {
  onNavigate: (page: Page) => void;
}

interface Stats {
  total: number;
  done: number;
  inProgress: number;
  overdue: number;
}

export default function Home({ onNavigate }: HomeProps) {
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const { data, error } = await supabase
        .from('study_tasks')
        .select('*')
        .order('created_at', { ascending: false });
      if (cancelled) return;
      if (error) {
        setError('Could not load your tasks. Please try again.');
        setTasks([]);
      } else {
        setTasks((data as StudyTask[]) ?? []);
        setError(null);
      }
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const stats: Stats = useMemo(() => {
    return tasks.reduce(
      (acc, t) => {
        acc.total += 1;
        if (t.status === 'done') acc.done += 1;
        if (t.status === 'in-progress') acc.inProgress += 1;
        if (isOverdue(t.due_date, t.status)) acc.overdue += 1;
        return acc;
      },
      { total: 0, done: 0, inProgress: 0, overdue: 0 }
    );
  }, [tasks]);

  const completionRate = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

  const upcomingTasks = useMemo(() => {
    return tasks
      .filter((t) => t.status !== 'done')
      .sort((a, b) => {
        const aOverdue = isOverdue(a.due_date, a.status) ? 0 : 1;
        const bOverdue = isOverdue(b.due_date, b.status) ? 0 : 1;
        if (aOverdue !== bOverdue) return aOverdue - bOverdue;
        if (a.due_date && b.due_date) return a.due_date.localeCompare(b.due_date);
        if (a.due_date) return -1;
        if (b.due_date) return 1;
        return 0;
      })
      .slice(0, 5);
  }, [tasks]);

  const statCards = [
    {
      label: 'Total Tasks',
      value: stats.total,
      icon: ListChecks,
      tint: 'from-brand-500 to-brand-600',
      bg: 'bg-brand-50',
      text: 'text-brand-700',
    },
    {
      label: 'Completed',
      value: stats.done,
      icon: CheckCircle2,
      tint: 'from-emerald-500 to-emerald-600',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
    },
    {
      label: 'In Progress',
      value: stats.inProgress,
      icon: Loader2,
      tint: 'from-sky-500 to-sky-600',
      bg: 'bg-sky-50',
      text: 'text-sky-700',
    },
    {
      label: 'Overdue',
      value: stats.overdue,
      icon: AlertCircle,
      tint: 'from-rose-500 to-rose-600',
      bg: 'bg-rose-50',
      text: 'text-rose-700',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 px-6 py-10 sm:px-10 sm:py-14 text-white shadow-glow animate-fade-in">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -translate-y-24 translate-x-24 blur-2xl" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-brand-400/20 rounded-full translate-y-20 blur-2xl" />
        <div className="relative">
          <p className="text-brand-100 font-medium text-sm mb-2">Welcome back to your study hub</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            Plan smarter. Study better.
          </h1>
          <p className="text-brand-100/90 max-w-lg text-sm sm:text-base leading-relaxed mb-6">
            Track your assignments, manage deadlines, and get instant study guidance from your AI assistant.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('tasks')}
              className="inline-flex items-center gap-2 bg-white text-brand-700 font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-brand-50 transition-colors shadow-soft"
            >
              <Plus className="w-4 h-4" />
              Add a Task
            </button>
            <button
              onClick={() => onNavigate('assistant')}
              className="inline-flex items-center gap-2 bg-brand-500/30 text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-brand-500/50 transition-colors border border-white/20"
            >
              <Sparkles className="w-4 h-4" />
              Ask AI Assistant
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-card hover:shadow-glow transition-shadow animate-slide-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${card.text}`} />
              </div>
              <p className="text-3xl font-bold text-slate-800 leading-none">{card.value}</p>
              <p className="text-sm text-slate-500 mt-1.5">{card.label}</p>
            </div>
          );
        })}
      </section>

      {/* Progress + Upcoming */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Progress card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-card animate-slide-up">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-brand-600" />
            <h2 className="text-lg font-semibold text-slate-800">Completion Progress</h2>
          </div>
          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative w-36 h-36">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="10"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="url(#progressGrad)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${(completionRate / 100) * 327} 327`}
                  className="transition-all duration-700"
                />
                <defs>
                  <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#1d4ed8" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-slate-800">{completionRate}%</span>
                <span className="text-xs text-slate-500">complete</span>
              </div>
            </div>
            <p className="text-sm text-slate-600 mt-4 text-center">
              {stats.total === 0
                ? 'Add tasks to start tracking progress'
                : `${stats.done} of ${stats.total} tasks completed`}
            </p>
          </div>
        </div>

        {/* Upcoming tasks */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-card animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CalendarClock className="w-5 h-5 text-brand-600" />
              <h2 className="text-lg font-semibold text-slate-800">Upcoming & Overdue</h2>
            </div>
            <button
              onClick={() => onNavigate('tasks')}
              className="text-sm font-medium text-brand-600 hover:text-brand-700 inline-flex items-center gap-1"
            >
              View all
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {error && (
            <div className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          {!error && loading && (
            <div className="flex items-center justify-center py-10 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          )}

          {!error && !loading && upcomingTasks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center mb-3">
                <Circle className="w-7 h-7 text-brand-400" />
              </div>
              <p className="text-sm font-medium text-slate-700">All caught up!</p>
              <p className="text-sm text-slate-500 mt-1">No pending tasks right now.</p>
            </div>
          )}

          {!error && !loading && upcomingTasks.length > 0 && (
            <ul className="space-y-2.5">
              {upcomingTasks.map((task) => {
                const pCfg = priorityConfig[task.priority];
                const sCfg = statusConfig[task.status];
                const overdue = isOverdue(task.due_date, task.status);
                return (
                  <li
                    key={task.id}
                    className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-brand-200 hover:bg-brand-50/40 transition-colors"
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${pCfg.dot} flex-shrink-0`} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-800 truncate">{task.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{task.subject}</p>
                    </div>
                    <span
                      className={`hidden sm:inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full border ${sCfg.classes}`}
                    >
                      {sCfg.label}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-medium whitespace-nowrap ${
                        overdue ? 'text-rose-600' : 'text-slate-500'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      {formatDate(task.due_date)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      {/* Quick tips */}
      <section className="mt-8 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-card animate-slide-up">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-brand-600" />
          <h2 className="text-lg font-semibold text-slate-800">Study Tips</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              title: 'Use Active Recall',
              body: 'Test yourself instead of re-reading. It strengthens memory far more effectively.',
            },
            {
              title: 'Try Pomodoro',
              body: 'Work 25 minutes, rest 5. After four rounds, take a longer break.',
            },
            {
              title: 'Space It Out',
              body: 'Review material over increasing intervals to beat the forgetting curve.',
            },
          ].map((tip) => (
            <div
              key={tip.title}
              className="rounded-xl bg-brand-50/50 border border-brand-100 p-4 hover:bg-brand-50 transition-colors"
            >
              <p className="text-sm font-semibold text-brand-800">{tip.title}</p>
              <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{tip.body}</p>
            </div>
          ))}
        </div>
        <button
          onClick={() => onNavigate('assistant')}
          className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-700"
        >
          Get more help from the AI Assistant
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
}
