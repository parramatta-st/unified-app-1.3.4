import Header from '../../components/Header';
import { useEffect, useMemo, useState } from 'react';

type Item = {
  id:number; subject:string; topic:string; year:string;
  type?:string; name?:string; item_type?:string;
  path?:string; page_count?:number; file_bytes?:number; active?:number;
};
type Group = { key:string; items: Item[] };

export default function PrintPage() {
  const [status, setStatus] = useState<string>('Checking…');
  const [qty, setQty] = useState<number>(1);
  const [student, setStudent] = useState('');
  const [catalog, setCatalog] = useState<Item[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string>('');

  async function refresh() {
    setStatus('Checking…');
    try {
      const h = await fetch('/api/print-proxy?action=health').then(r => r.json());
      if (!h?.ok) throw new Error('Not connected');
      setStatus(`Connected · ${h.printer || 'Printer'}`);
      const c = await fetch('/api/print-proxy?action=catalog').then(r => r.json());
      setCatalog(c?.items || []);
    } catch (e:any) {
      setStatus('Not Connected');
    }
  }

  useEffect(() => { refresh(); }, []);

  const groups = useMemo<Group[]>(() => {
    const g = new Map<string, Item[]>();
    for (const it of catalog) {
      if (!it) continue;
      const type = (it.type || it.item_type || 'Lesson');
      const name = it.name || `${type}`;
      const it2 = { ...it, type, name };
      const key = `${it.subject} • ${it.topic} • ${it.year}`;
      if (!g.has(key)) g.set(key, []);
      g.get(key)!.push(it2);
    }
    return [...g.entries()].map(([key, items]) => ({ key, items }));
  }, [catalog]);

  async function sendPrint(material_id:number) {
    setBusy(true); setMessage('');
    try {
      const body = { material_id, qty, meta: { student } };
      const r = await fetch('/api/print-proxy?action=print', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
      const j = await r.json();
      if (!j?.ok) throw new Error(j?.error || 'Print failed');
      setMessage('Sent to printer.');
      if (student) {
        await fetch('/api/log-print', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ when: new Date().toISOString(), kind:'print', student, qty, ok:true }) });
      }
    } catch (e:any) {
      setMessage(e?.message || 'Print failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-wrap items-end gap-3">
          <div className="px-3 py-2 rounded-md bg-neutral-900 border border-neutral-800">{status}</div>
          <div>
            <label className="block text-xs text-neutral-400">Quantity</label>
            <input type="number" min={1} max={50} value={qty} onChange={e=>setQty(parseInt(e.target.value||'1',10))} className="w-28 rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2" />
          </div>
          <div className="flex-1 min-w-[220px]">
            <label className="block text-xs text-neutral-400">Student (for logs)</label>
            <input value={student} onChange={e=>setStudent(e.target.value)} placeholder="e.g. Charlotte" className="w-full rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2" />
          </div>
          <button onClick={refresh} className="px-3 py-2 rounded-md bg-neutral-800 border border-neutral-700 hover:bg-neutral-700">Refresh</button>
          {message and <div className="text-sm text-neutral-300">{message}</div>}
        </div>

        {groups.map(g => (
          <section key={g.key} className="rounded-xl border border-neutral-800 overflow-hidden">
            <div className="px-4 py-3 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between">
              <h2 className="font-semibold">{g.key}</h2>
            </div>
            <div className="divide-y divide-neutral-900">
              <div className="grid grid-cols-12 text-sm text-neutral-400 px-4 py-2">
                <div className="col-span-3">Type</div>
                <div className="col-span-7">Name</div>
                <div className="col-span-2 text-right">Action</div>
              </div>
              {g.items.map(it => (
                <div key={it.id} className="grid grid-cols-12 items-center px-4 py-3 hover:bg-neutral-900/50">
                  <div className="col-span-3">{it.type || it.item_type || 'Lesson'}</div>
                  <div className="col-span-7">{it.name || `${it.type}`}</div>
                  <div className="col-span-2 text-right">
                    <button disabled={busy} onClick={()=>sendPrint(it.id)} className="px-3 py-1.5 rounded-md bg-orange-600 hover:bg-orange-500 disabled:opacity-60">Print</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
