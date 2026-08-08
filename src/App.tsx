import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Home from '@/pages/Home';
import Tasks from '@/pages/Tasks';
import Assistant from '@/pages/Assistant';
import Login from '@/pages/Login';
import { AuthProvider, useAuth } from '@/components/AuthContext';
import { Loader2 } from 'lucide-react';
import type { Page } from '@/types';

function AppShell() {
  const { user, loading } = useAuth();
  const [page, setPage] = useState<Page>('home');

  useEffect(() => {
    if (!user) return;
    const hash = window.location.hash.replace('#', '') as Page;
    if (hash === 'home' || hash === 'tasks' || hash === 'assistant') {
      setPage(hash);
    }
  }, [user]);

  function navigate(next: Page) {
    setPage(next);
    window.location.hash = next;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-ink-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-ink-950 text-slate-100">
      <Navbar current={page} onNavigate={navigate} />
      <main>
        {page === 'home' && <Home onNavigate={navigate} />}
        {page === 'tasks' && <Tasks />}
        {page === 'assistant' && <Assistant />}
      </main>
      <footer className="border-t border-ink-800/80 mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <p className="text-xs text-slate-500">
            StudyPlanner — your AI-powered study companion
          </p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}

export default App;
