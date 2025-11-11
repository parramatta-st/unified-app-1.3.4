import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Header() {
  const [tutor, setTutor] = useState('');
  const [campus, setCampus] = useState('');

  useEffect(() => {
    try {
      setTutor(localStorage.getItem('st_tutor') || '');
      setCampus(localStorage.getItem('st_campus') || '');
    } catch {}
  }, []);

  return (
    <header className="sticky top-0 z-20 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
        <div className="text-white font-semibold">Success Tutoring</div>
        <nav className="ml-auto flex items-center gap-2">
          <Link className="px-3 py-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-sm" href="/">Home</Link>
          <Link className="px-3 py-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-sm" href="/feedback">Feedback</Link>
          <Link className="px-3 py-1.5 rounded-md bg-orange-600 hover:bg-orange-500 text-sm text-white" href="/print">Print</Link>
          <Link className="px-3 py-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-sm" href="/logout">Logout</Link>
        </nav>
        {(tutor || campus) && <div className="ml-2 text-xs text-neutral-400">{tutor}{tutor && campus ? ' · ' : ''}{campus}</div>}
      </div>
    </header>
  );
}
