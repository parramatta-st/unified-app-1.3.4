import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';
export default function handler(_req:NextApiRequest, res:NextApiResponse) {
  const cookie = serialize('st_session','',{ httpOnly:true, sameSite:'lax', path:'/', maxAge:0 });
  res.setHeader('Set-Cookie', cookie);
  res.json({ ok:true });
}
