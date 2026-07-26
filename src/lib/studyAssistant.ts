type KnowledgeEntry = {
  keywords: string[];
  topic: string;
  answer: (question: string) => string;
};

const knowledgeBase: KnowledgeEntry[] = [
  {
    keywords: ['pomodoro', 'pomodoro technique'],
    topic: 'Study Techniques',
    answer: () =>
      'The Pomodoro Technique is a time-management method: work in focused 25-minute sessions followed by a 5-minute break. After 4 sessions, take a longer 15-30 minute break. It helps maintain concentration and prevents mental fatigue. Try it for your hardest subjects first while your mind is fresh.',
  },
  {
    keywords: ['spaced repetition', 'forgetting curve'],
    topic: 'Memory',
    answer: () =>
      'Spaced repetition leverages the forgetting curve by reviewing material at increasing intervals (e.g. after 1 day, 3 days, 1 week, 2 weeks). Instead of cramming, you revisit information just as you are about to forget it, which strengthens long-term retention. Flashcard apps like Anki automate this scheduling for you.',
  },
  {
    keywords: ['active recall', 'recall', 'retrieval practice'],
    topic: 'Study Techniques',
    answer: () =>
      'Active recall means actively retrieving information from memory rather than passively re-reading notes. Test yourself with flashcards, practice questions, or by writing down everything you remember about a topic. It is one of the most evidence-backed study methods for long-term retention.',
  },
  {
    keywords: ['procrastinat', 'motivation', 'can\'t focus', 'cant focus', 'distracted'],
    topic: 'Productivity',
    answer: () =>
      'To beat procrastination, start with a 2-minute version of the task - just open the book or write one sentence. Often the barrier is starting, not doing. Remove phone distractions, work in a clean space, and use the Pomodoro Technique to make sessions feel manageable. Pair the task with something rewarding.',
  },
  {
    keywords: ['exam', 'final', 'midterm', 'test prep', 'revision'],
    topic: 'Exam Preparation',
    answer: () =>
      'For exam prep: 1) Start early and spread sessions out (spaced practice beats cramming). 2) Use active recall - practice past papers and self-test instead of re-reading. 3) Identify weak areas and target them. 4) Simulate exam conditions with timed practice. 5) Sleep well the night before - sleep consolidates memory.',
  },
  {
    keywords: ['note', 'taking notes', 'cornell', 'summarize'],
    topic: 'Note-Taking',
    answer: () =>
      'Good note-taking is active, not passive. The Cornell Method splits your page into cues, notes, and a summary - forcing you to process and organize. Mind maps work well for seeing connections between concepts. Whichever method you choose, review and condense notes within 24 hours while the material is fresh.',
  },
  {
    keywords: ['time management', 'schedule', 'plan', 'organize', 'balance'],
    topic: 'Planning',
    answer: () =>
      'Effective time management for students: block your week in advance, assign your hardest subjects to your peak energy hours, and protect focus time. Use the Add Task page to capture everything, then prioritize by due date and importance. Leave buffer time - schedules without slack break under real conditions.',
  },
  {
    keywords: ['memory', 'remember', 'retain', 'memorize'],
    topic: 'Memory',
    answer: () =>
      'To remember more: combine active recall with spaced repetition, connect new facts to things you already know (elaborative encoding), and teach the concept to someone else (the Feynman Technique). Sleep, exercise, and hydration also directly improve memory consolidation - they are not separate from studying.',
  },
  {
    keywords: ['math', 'calculus', 'algebra', 'equation'],
    topic: 'Mathematics',
    answer: () =>
      'For math: practice is non-negotiable - work through problems by hand rather than just reading solutions. Identify the underlying pattern or technique each problem type uses. When stuck, break the problem into smaller steps and ask what each piece gives you. Keep an error log of mistakes you repeat so you can target them.',
  },
  {
    keywords: ['essay', 'write', 'writing', 'paper', 'thesis'],
    topic: 'Writing',
    answer: () =>
      'For essays and papers: start with a clear thesis that takes a position. Outline your argument section by section before writing prose. Each paragraph should support the thesis with evidence and analysis, not just summary. Write a rough draft quickly, then revise - good writing comes from editing, not from a perfect first draft.',
  },
  {
    keywords: ['sleep', 'rest', 'tired', 'burnout'],
    topic: 'Wellbeing',
    answer: () =>
      'Rest is part of studying, not the opposite of it. Sleep consolidates what you learned during the day - pulling an all-nighter can actually reduce recall. Aim for 7-9 hours, take real breaks between sessions, and watch for burnout signs like loss of motivation or exhaustion. Sustainable pacing beats heroic cramming.',
  },
  {
    keywords: ['hello', 'hi', 'hey', 'help'],
    topic: 'Getting Started',
    answer: () =>
      'Hi! I am your AI Study Assistant. Ask me about study techniques (Pomodoro, active recall, spaced repetition), exam prep, note-taking, time management, or how to stay motivated. What would you like help with today?',
  },
  {
    keywords: ['thank', 'thanks', 'appreciate'],
    topic: 'Closing',
    answer: () =>
      "You're welcome! Remember - consistent, focused effort beats long cramming sessions. Good luck with your studies!",
  },
];

const fallbackAnswer = (question: string): string => {
  const lower = question.toLowerCase();

  if (lower.includes('how') && (lower.includes('study') || lower.includes('learn'))) {
    return "Great question. The most effective approach combines three evidence-backed methods: 1) Active recall - test yourself instead of re-reading. 2) Spaced repetition - review over increasing intervals. 3) Interleaving - mix different topics rather than blocking one subject. Try asking me about any of these in more detail, or about exam prep, note-taking, or time management.";
  }

  return "I can help with study techniques (Pomodoro, active recall, spaced repetition), exam preparation, note-taking methods, time management, memory strategies, and motivation. Try asking something like 'How does the Pomodoro technique work?' or 'How should I prepare for my exams?'";
};

export function getStudyAnswer(question: string): { answer: string; topic: string } {
  const normalized = question.toLowerCase().trim();

  if (!normalized) {
    return { answer: 'Please ask me a study-related question and I will do my best to help.', topic: 'Help' };
  }

  for (const entry of knowledgeBase) {
    if (entry.keywords.some((kw) => normalized.includes(kw))) {
      return { answer: entry.answer(question), topic: entry.topic };
    }
  }

  return { answer: fallbackAnswer(question), topic: 'General' };
}
