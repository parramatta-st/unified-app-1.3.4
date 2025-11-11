import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const { to, subject, html, meta } = req.body || {};
    if (!to || !subject || !html) return res.status(400).json({ ok:false, error:'missing fields' });

    const user = process.env.MAIL_USER!;
    const pass = process.env.MAIL_PASS!;
    if (!user || !pass) return res.status(500).json({ ok:false, error:'MAIL_USER/MAIL_PASS not set' });
    const replyTo = process.env.REPLY_TO || user;

    const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user, pass } });
    const info = await transporter.sendMail({ from: user, to, subject, html, replyTo });

    if (process.env.PRINT_LOG_WEBHOOK_URL) {
      fetch(process.env.PRINT_LOG_WEBHOOK_URL, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ kind:'feedback', to, subject, meta, id: info.messageId, when: new Date().toISOString() })}).catch(()=>{});
    }

    res.json({ ok:true, id: info.messageId });
  } catch (e:any) {
    res.status(500).json({ ok:false, error: e?.message || String(e) });
  }
}
