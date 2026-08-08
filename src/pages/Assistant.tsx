import { useEffect, useRef, useState } from 'react';
import {
  Send,
  Sparkles,
  MessageSquare,
  User,
  RotateCcw,
  Lightbulb,
  Brain,
  Clock,
  BookOpen,
  Target,
} from 'lucide-react';
import { getStudyAnswer } from '@/lib/studyAssistant';
import type { ChatMessage } from '@/types';

const suggestions = [
  { icon: Brain, text: 'How does the Pomodoro technique work?' },
  { icon: Target, text: 'How should I prepare for my exams?' },
  { icon: Clock, text: 'I keep procrastinating. Any tips?' },
  { icon: BookOpen, text: 'What is the best way to take notes?' },
];

const welcomeMessage: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hi! I am your AI Study Assistant. I can help with study techniques, exam preparation, note-taking, time management, memory strategies, and staying motivated. Ask me a question or pick a suggestion below to get started.",
  timestamp: Date.now(),
};

export default function Assistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const response = getStudyAnswer(trimmed);
    const delay = 600 + Math.random() * 500;
    setTimeout(() => {
      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: response.answer,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
      inputRef.current?.focus();
    }, delay);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  function resetChat() {
    setMessages([welcomeMessage]);
    setInput('');
    inputRef.current?.focus();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center shadow-glow mb-4">
          <Sparkles className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">AI Study Assistant</h1>
        <p className="text-sm text-slate-400 mt-1.5 max-w-md">
          Ask me anything about studying - techniques, exams, focus, memory, and more.
        </p>
      </div>

      <div className="bg-ink-900 rounded-3xl border border-ink-700/60 shadow-card overflow-hidden flex flex-col h-[62vh] min-h-[480px] animate-scale-in">
        {/* Header bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-ink-800 bg-gradient-to-r from-brand-500/10 to-transparent">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-500/15 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-brand-300" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white leading-none">Study Chat</p>
              <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Online
              </p>
            </div>
          </div>
          <button
            onClick={resetChat}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-brand-300 px-3 py-1.5 rounded-lg hover:bg-ink-800 transition-colors"
            title="Start a new chat"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            New chat
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-4 bg-ink-950/40">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 animate-fade-in ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user'
                    ? 'bg-ink-700'
                    : 'bg-gradient-to-br from-brand-500 to-accent-600'
                }`}
              >
                {msg.role === 'user' ? (
                  <User className="w-4 h-4 text-slate-300" />
                ) : (
                  <Sparkles className="w-4 h-4 text-white" />
                )}
              </div>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-brand-600 to-brand-700 text-white rounded-tr-sm'
                    : 'bg-ink-850 text-slate-200 border border-ink-700/60 rounded-tl-sm shadow-soft'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-2.5 animate-fade-in">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="bg-ink-850 border border-ink-700/60 rounded-2xl rounded-tl-sm px-4 py-3 shadow-soft flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-400 animate-typing" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-brand-400 animate-typing" style={{ animationDelay: '200ms' }} />
                <span className="w-2 h-2 rounded-full bg-brand-400 animate-typing" style={{ animationDelay: '400ms' }} />
              </div>
            </div>
          )}
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && !isTyping && (
          <div className="px-4 pb-3 bg-ink-950/40">
            <p className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-2">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              Try asking
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {suggestions.map((s) => {
                const Icon = s.icon;
                return (
                  <button
                    key={s.text}
                    onClick={() => sendMessage(s.text)}
                    className="flex items-center gap-2.5 text-left text-sm text-slate-300 bg-ink-850 border border-ink-700/60 rounded-xl px-3.5 py-2.5 hover:border-brand-500/40 hover:bg-brand-500/10 transition-all"
                  >
                    <Icon className="w-4 h-4 text-brand-400 flex-shrink-0" />
                    <span className="leading-snug">{s.text}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="flex items-end gap-2 p-3 border-t border-ink-800 bg-ink-900"
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input);
              }
            }}
            placeholder="Ask a study question..."
            rows={1}
            className="flex-1 resize-none px-4 py-2.5 rounded-xl bg-ink-850 border border-ink-700 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/50 transition-colors max-h-32"
            style={{ minHeight: '44px' }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="w-11 h-11 flex-shrink-0 rounded-xl bg-gradient-to-br from-brand-600 to-accent-600 text-white flex items-center justify-center hover:from-brand-500 hover:to-accent-500 transition-all shadow-soft disabled:opacity-40 disabled:cursor-not-allowed"
            title="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      <p className="text-center text-xs text-slate-600 mt-4">
        The assistant provides general study guidance. For specific course content, consult your materials and instructors.
      </p>
    </div>
  );
}
