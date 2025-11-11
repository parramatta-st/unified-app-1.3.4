import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';

export default function handler(req:NextApiRequest, res:NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { password, campus, tutor } = req.body || {};
  if (!password || !campus || !tutor) return res.status(400).json({ ok:false, error:'missing fields' });
  if (password !== process.env.TUTOR_PASSWORD) return res.status(401).json({ ok:false, error:'invalid password' });
  const cookie = serialize('st_session', JSON.stringify({ campus, tutor }), { httpOnly:true, sameSite:'lax', path:'/', maxAge: 60*60*12 });
  res.setHeader('Set-Cookie', cookie);
  res.json({ ok:true });
}
