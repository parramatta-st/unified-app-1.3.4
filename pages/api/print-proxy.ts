import type { NextApiRequest, NextApiResponse } from 'next';

function timeoutFetch(url: string, opts: any, ms=15000) {
  const c = new AbortController();
  const id = setTimeout(() => c.abort(), ms);
  return fetch(url, { ...opts, signal: c.signal }).finally(() => clearTimeout(id));
}

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  const base = process.env.PRINT_API_URL;
  const token = process.env.PRINT_API_TOKEN;
  const { action } = req.query;
  const timeout = Number(process.env.PRINT_PROXY_TIMEOUT_MS || '15000');

  if (!base || !token) return res.status(500).json({ ok:false, error:'PRINT_API_URL/PRINT_API_TOKEN not set' });

  try {
    if (req.method === 'GET') {
      if (action === 'health') {
        const r = await timeoutFetch(`${base}/api/health`, { headers: { 'X-PRINT-TOKEN': token } }, timeout);
        const j = await r.json(); return res.json(j);
      }
      if (action === 'catalog') {
        const r = await timeoutFetch(`${base}/api/catalog`, { headers: { 'X-PRINT-TOKEN': token } }, timeout);
        const j = await r.json(); return res.json(j);
      }
    }
    if (req.method === 'POST') {
      const body = req.body ? JSON.stringify(req.body) : undefined;
      const headers: any = { 'X-PRINT-TOKEN': token, 'Content-Type':'application/json' };
      if (action === 'print') {
        const r = await timeoutFetch(`${base}/api/print`, { method:'POST', headers, body }, timeout);
        const j = await r.json(); return res.json(j);
      }
      if (action === 'print-topic') {
        const r = await timeoutFetch(`${base}/api/print-topic`, { method:'POST', headers, body }, timeout);
        const j = await r.json(); return res.json(j);
      }
    }
    return res.status(400).json({ ok:false, error:'invalid action' });
  } catch (e:any) {
    return res.status(502).json({ ok:false, error: e?.message || String(e) });
  }
}
