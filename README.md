# Success Tutoring Unified Portal (v1.3.4)

- Next.js 14 with **only `pages/api/*`** routes (no root `/api`).
- `/login` page added and allowed by middleware (sets cookie `st_session`).
- `/logout` clears cookie + localStorage.
- `/print` proxies to local Mac print API via `PRINT_API_URL`/`PRINT_API_TOKEN`.
- `/feedback` email via Gmail App Password (`MAIL_USER`/`MAIL_PASS`).
- Includes all TypeScript & type dependencies so Vercel builds cleanly.

## Dev
```
npm install
PORT=3000 npm run dev
```

## Env
See `.env.local.example` and set your real values.
