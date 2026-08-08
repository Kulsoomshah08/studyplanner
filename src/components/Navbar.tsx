import { BookOpenCheck, Home, ListChecks, Sparkles, Menu, X, LogOut } from 'lucide-react';
import { useState } from 'react';
import type { Page } from '@/types';
import { useAuth } from '@/components/AuthContext';

interface NavbarProps {
  current: Page;
  onNavigate: (page: Page) => void;
}

const navItems: { id: Page; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Dashboard', icon: Home },
  { id: 'tasks', label: 'Study Tasks', icon: ListChecks },
  { id: 'assistant', label: 'AI Assistant', icon: Sparkles },
];

export default function Navbar({ current, onNavigate }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut } = useAuth();

  const handleNavigate = (page: Page) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  const initials = (user?.email ?? '?').charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-40 bg-ink-900/80 backdrop-blur-xl border-b border-ink-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => handleNavigate('home')}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center shadow-soft group-hover:shadow-glow transition-shadow">
              <BookOpenCheck className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col items-start leading-none">
              <span className="text-base font-bold text-white">StudyPlanner</span>
              <span className="text-[10px] font-medium text-slate-500 tracking-wide">AI POWERED</span>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = current === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'bg-brand-500/15 text-brand-300'
                      : 'text-slate-400 hover:bg-ink-800 hover:text-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center text-sm font-semibold text-white">
                {initials}
              </div>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-rose-400 px-3 py-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden lg:inline">Sign out</span>
              </button>
            </div>

            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:bg-ink-800 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <nav className="md:hidden border-t border-ink-800 bg-ink-900 animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = current === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-brand-500/15 text-brand-300'
                      : 'text-slate-400 hover:bg-ink-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
            <div className="pt-2 mt-2 border-t border-ink-800 flex items-center justify-between px-4">
              <span className="text-xs text-slate-500 truncate max-w-[60%]">{user?.email}</span>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-1.5 text-sm font-medium text-rose-400 px-3 py-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
