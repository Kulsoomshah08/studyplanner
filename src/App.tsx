import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Home from '@/pages/Home';
import Tasks from '@/pages/Tasks';
import Assistant from '@/pages/Assistant';
import type { Page } from '@/types';

function App() {
  const [page, setPage] = useState<Page>('home');

  useEffect(() => {
    const hash = window.location.hash.replace('#', '') as Page;
    if (hash === 'home' || hash === 'tasks' || hash === 'assistant') {
      setPage(hash);
    }
  }, []);

  function navigate(next: Page) {
    setPage(next);
    window.location.hash = next;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar current={page} onNavigate={navigate} />
      <main>
        {page === 'home' && <Home onNavigate={navigate} />}
        {page === 'tasks' && <Tasks />}
        {page === 'assistant' && <Assistant />}
      </main>
      <footer className="border-t border-slate-200/70 mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <p className="text-xs text-slate-400">
            StudyPlanner — your AI-powered study companion
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
