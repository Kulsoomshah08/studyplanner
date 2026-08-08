import { useEffect, useState } from 'react';
import {
  Plus,
  Loader2,
  Trash2,
  CheckCircle2,
  Circle,
  Clock3,
  ListChecks,
  AlertCircle,
  X,
  CalendarDays,
  Tag,
  Flag,
  StickyNote,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthContext';
import type { Priority, Status, StudyTask, StudyTaskInput } from '@/types';
import { formatDate, isOverdue, priorityConfig, statusConfig, todayISO } from '@/lib/taskUtils';

const emptyForm: StudyTaskInput = {
  title: '',
  subject: '',
  priority: 'medium',
  due_date: null,
  status: 'todo',
  notes: null,
};

type Filter = 'all' | 'active' | 'done';

export default function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<StudyTaskInput>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState<Filter>('all');

  async function loadTasks() {
    setLoading(true);
    const { data, error } = await supabase
      .from('study_tasks')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      setError('Could not load tasks. Please try again.');
      setTasks([]);
    } else {
      setTasks((data as StudyTask[]) ?? []);
      setError(null);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (user?.id) loadTasks();
  }, [user?.id]);

  function openForm() {
    setForm(emptyForm);
    setFormError(null);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setFormError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.subject.trim()) {
      setFormError('Title and subject are required.');
      return;
    }
    setSubmitting(true);
    const payload: StudyTaskInput = {
      title: form.title.trim(),
      subject: form.subject.trim(),
      priority: form.priority,
      due_date: form.due_date || null,
      status: form.status,
      notes: form.notes?.trim() || null,
    };
    const { data, error } = await supabase
      .from('study_tasks')
      .insert(payload)
      .select()
      .single();
    setSubmitting(false);
    if (error || !data) {
      setFormError('Could not save the task. Please try again.');
      return;
    }
    setTasks((prev) => [data as StudyTask, ...prev]);
    closeForm();
  }

  async function cycleStatus(task: StudyTask) {
    const next: Record<Status, Status> = {
      todo: 'in-progress',
      'in-progress': 'done',
      done: 'todo',
    };
    const newStatus = next[task.status];
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t)));
    await supabase.from('study_tasks').update({ status: newStatus }).eq('id', task.id);
  }

  async function deleteTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    await supabase.from('study_tasks').delete().eq('id', id);
  }

  const filtered = tasks.filter((t) => {
    if (filter === 'active') return t.status !== 'done';
    if (filter === 'done') return t.status === 'done';
    return true;
  });

  const counts = {
    all: tasks.length,
    active: tasks.filter((t) => t.status !== 'done').length,
    done: tasks.filter((t) => t.status === 'done').length,
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Study Tasks</h1>
          <p className="text-sm text-slate-400 mt-1.5">Add and organize everything you need to study.</p>
        </div>
        <button
          onClick={openForm}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-600 to-accent-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:from-brand-500 hover:to-accent-500 transition-all shadow-soft"
        >
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6 bg-ink-900 border border-ink-700/60 rounded-xl p-1.5 shadow-card w-fit">
        {(['all', 'active', 'done'] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
              filter === f
                ? 'bg-gradient-to-r from-brand-600 to-accent-600 text-white shadow-soft'
                : 'text-slate-400 hover:bg-ink-800'
            }`}
          >
            {f} <span className="opacity-70">({counts[f]})</span>
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-rose-300 bg-rose-500/10 border border-rose-500/25 rounded-lg px-4 py-3 mb-4">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-500">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-ink-900 rounded-2xl border border-ink-700/60 shadow-card">
          <div className="w-16 h-16 rounded-2xl bg-brand-500/10 flex items-center justify-center mb-4">
            <ListChecks className="w-8 h-8 text-brand-400/60" />
          </div>
          <p className="text-base font-semibold text-slate-200">
            {filter === 'done' ? 'No completed tasks yet' : 'No tasks here yet'}
          </p>
          <p className="text-sm text-slate-500 mt-1 mb-5 text-center max-w-xs">
            {filter === 'done'
              ? 'Finish a task to see it appear here.'
              : 'Add your first study task to get organized.'}
          </p>
          {filter !== 'done' && (
            <button
              onClick={openForm}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-600 to-accent-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:from-brand-500 hover:to-accent-500 transition-all shadow-soft"
            >
              <Plus className="w-4 h-4" />
              Add a Task
            </button>
          )}
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((task, i) => {
            const pCfg = priorityConfig[task.priority];
            const sCfg = statusConfig[task.status];
            const overdue = isOverdue(task.due_date, task.status);
            const isDone = task.status === 'done';
            return (
              <li
                key={task.id}
                className="group bg-ink-900 rounded-2xl border border-ink-700/60 p-4 sm:p-5 shadow-card hover:border-brand-500/30 transition-colors animate-fade-in"
                style={{ animationDelay: `${Math.min(i * 40, 300)}ms` }}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <button
                    onClick={() => cycleStatus(task)}
                    className="mt-0.5 flex-shrink-0 transition-transform hover:scale-110"
                    title={`Status: ${sCfg.label} (click to advance)`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    ) : (
                      <Circle className={`w-6 h-6 ${task.status === 'in-progress' ? 'text-brand-400' : 'text-slate-600 hover:text-brand-400'}`} />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3
                        className={`text-sm sm:text-base font-semibold ${
                          isDone ? 'text-slate-500 line-through' : 'text-slate-100'
                        }`}
                      >
                        {task.title}
                      </h3>
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${pCfg.classes}`}
                      >
                        <Flag className="w-3 h-3" />
                        {pCfg.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
                      <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                        <Tag className="w-3.5 h-3.5" />
                        {task.subject}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs">
                        <Clock3 className="w-3.5 h-3.5 text-slate-600" />
                        <span className={overdue ? 'text-rose-400 font-medium' : 'text-slate-400'}>
                          {formatDate(task.due_date)}
                        </span>
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${sCfg.classes}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${sCfg.dot}`} />
                        {sCfg.label}
                      </span>
                    </div>
                    {task.notes && (
                      <p className="text-sm text-slate-400 mt-2 leading-relaxed bg-ink-850 rounded-lg px-3 py-2">
                        {task.notes}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="flex-shrink-0 p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Add task modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={closeForm}
          />
          <div className="relative w-full sm:max-w-lg bg-ink-900 rounded-t-3xl sm:rounded-3xl shadow-glow animate-slide-up max-h-[92vh] overflow-y-auto border border-ink-700/60">
            <div className="flex items-center justify-between p-6 border-b border-ink-800 sticky top-0 bg-ink-900 rounded-t-3xl z-10">
              <h2 className="text-lg font-bold text-white">New Study Task</h2>
              <button
                onClick={closeForm}
                className="p-2 rounded-lg text-slate-400 hover:bg-ink-800 hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {formError && (
                <div className="flex items-center gap-2 text-sm text-rose-300 bg-rose-500/10 border border-rose-500/25 rounded-lg px-4 py-3">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Task title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Read Chapter 5 - Organic Chemistry"
                  className="w-full px-4 py-2.5 rounded-xl bg-ink-850 border border-ink-700 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/50 transition-colors"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Subject <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="e.g. Chemistry, Calculus, History"
                  className="w-full px-4 py-2.5 rounded-xl bg-ink-850 border border-ink-700 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/50 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Priority</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['low', 'medium', 'high'] as Priority[]).map((p) => {
                      const cfg = priorityConfig[p];
                      const active = form.priority === p;
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setForm({ ...form, priority: p })}
                          className={`px-2 py-2 rounded-lg text-xs font-medium border transition-all ${
                            active
                              ? cfg.classes + ' ring-2 ring-offset-1 ring-offset-ink-900 ring-brand-400/50'
                              : 'border-ink-700 text-slate-400 hover:bg-ink-800'
                          }`}
                        >
                          {cfg.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as Status })}
                    className="w-full px-4 py-2.5 rounded-xl bg-ink-850 border border-ink-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/50 transition-colors"
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-slate-300 mb-1.5">
                  <CalendarDays className="w-4 h-4 text-slate-500" />
                  Due date
                </label>
                <input
                  type="date"
                  value={form.due_date ?? ''}
                  min={todayISO()}
                  onChange={(e) => setForm({ ...form, due_date: e.target.value || null })}
                  className="w-full px-4 py-2.5 rounded-xl bg-ink-850 border border-ink-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/50 transition-colors"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-slate-300 mb-1.5">
                  <StickyNote className="w-4 h-4 text-slate-500" />
                  Notes <span className="text-slate-500 font-normal">(optional)</span>
                </label>
                <textarea
                  value={form.notes ?? ''}
                  onChange={(e) => setForm({ ...form, notes: e.target.value || null })}
                  placeholder="Any extra details, page numbers, or reminders..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl bg-ink-850 border border-ink-700 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/50 transition-colors resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 border border-ink-700 hover:bg-ink-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 transition-all shadow-soft disabled:opacity-60"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  {submitting ? 'Saving...' : 'Add Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
