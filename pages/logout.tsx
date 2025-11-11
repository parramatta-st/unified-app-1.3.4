import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Logout() {
  const router = useRouter();
  useEffect(() => {
    (async () => {
      try {
        await fetch('/api/logout');
        localStorage.removeItem('st_tutor');
        localStorage.removeItem('st_campus');
      } catch {}
      router.replace('/login');
    })();
  }, [router]);
  return null;
}
