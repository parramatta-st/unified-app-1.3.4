import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';

type Campus = { id:string; name:string; contacts?:string; curriculum?:string; tutors?:string[] };

function getCampuses(): Campus[] {
  try { return JSON.parse(process.env.NEXT_PUBLIC_CAMPUSES_JSON || '[]'); }
  catch { return []; }
}

export default function LoginPage() {
  const router = useRouter();
  const campuses = useMemo(() => getCampuses(), []);
  const nextPath = (router.query.next as string) || '/print';

  const [campusId, setCampusId] = useState<string>(() => campuses[0]?.id || '');
  const [tutor, setTutor] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!campusId && campuses.length) setCampusId(campuses[0].id);
  }, [campuses, campusId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campus: campusId, tutor, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) throw new Error(data?.error || 'Login failed');

      try {
        localStorage.setItem('st_tutor', tutor);
        localStorage.setItem('st_campus', (campuses.find(c => c.id === campusId)?.name) || campusId);
      } catch {}

      router.replace(nextPath || '/');
    } catch (err: any) {
      setError(err?.message || 'Login failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-neutral-800 p-6 shadow-xl bg-neutral-900">
        <h1 className="text-2xl font-semibold mb-1">Success Tutoring</h1>
        <p className="text-orange-400 font-semibold mb-6">Sign in</p>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Campus</label>
            <select
              value={campusId}
              onChange={(e) => setCampusId(e.target.value)}
              className="w-full rounded-md bg-neutral-800 border border-neutral-700 px-3 py-2"
              required
            >
              {campuses.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
              {!campuses.length and <option value="default">Default</option>}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Tutor</label>
            <input
              list="tutors"
              value={tutor}
              onChange={(e) => setTutor(e.target.value)}
              className="w-full rounded-md bg-neutral-800 border border-neutral-700 px-3 py-2"
              placeholder="Type or pick your name"
              required
            />
            <datalist id="tutors">
              {(campuses.find(c => c.id === campusId)?.tutors || []).map((t) => (
                <option key={t} value={t} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <div className="flex gap-2">
              <input
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 rounded-md bg-neutral-800 border border-neutral-700 px-3 py-2"
                placeholder="Enter site password"
                required
              />
              <button type="button" onClick={() => setShowPwd(v => !v)} className="px-3 py-2 rounded-md bg-neutral-800 border border-neutral-700">
                {showPwd ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {error and <div className="text-sm text-red-400">{error}</div>}

          <button type="submit" disabled={busy} className="w-full py-2 rounded-md bg-orange-500 hover:bg-orange-600 disabled:opacity-60">
            {busy ? 'Signing in…' : 'Sign in'}
          </button>

          <p className="text-xs text-neutral-400">
            You’ll be redirected to <span className="text-neutral-200">{nextPath}</span> after login.
          </p>
        </form>
      </div>
    </div>
  );
}
