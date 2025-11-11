import type { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    if (!process.env.PRINT_LOG_WEBHOOK_URL) return res.json({ ok:true, status: 'skipped' });
    const r = await fetch(process.env.PRINT_LOG_WEBHOOK_URL, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(req.body||{}) });
    const text = await r.text();
    return res.json({ ok:true, status:r.status, result:text });
  } catch (e:any) {
    return res.status(500).json({ ok:false, error: e?.message });
  }
}
