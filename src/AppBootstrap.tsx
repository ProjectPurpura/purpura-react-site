// src/AppBootstrap.tsx
import { useEffect } from 'react';
import { getAuthStatus, setAuthStatus, setSessionUser, getSessionUser } from './auth/authState';

export function useHashLoginBootstrap() {
  useEffect(() => {
    (async () => {
      const hash = window.location.hash || '';
      const hMatch = hash.match(/[#|&]login=([^&]+)/);

      if (hMatch) {
        const userHash = decodeURIComponent(hMatch[1] || '').trim();
        if (!userHash) {
          setAuthStatus('invalid');
          return;
        }

        setAuthStatus('loading');
        try {
          const base = process.env.REACT_APP_API_URL;
          if (!base) throw new Error('REACT_APP_API_URL não configurada');

          const res = await fetch(`${base}/empresa/hash/${encodeURIComponent(userHash)}`);
          if (!res.ok) throw new Error(`Falha ao resolver hash (${res.status})`);
          const payload = await res.json();

          if (!payload?.cnpj || !payload?.userHash) {
            setAuthStatus('invalid');
            return;
          }

          setSessionUser(payload);

          const url = new URL(window.location.href);
          url.hash = url.hash
            .replace(/(?:^#)?(?:&)?login=[^&]*/, '')
            .replace(/^#&?/, '#');
          if (url.hash === '#' || url.hash === '') url.hash = '';
          window.history.replaceState({}, '', url.toString());

          setAuthStatus('ok');
          return;
        } catch {
          setAuthStatus('error');
          return;
        }
      }

      const existing: any = getSessionUser();
      if (existing?.cnpj || existing?.userHash) {
        setAuthStatus('ok');
      } else {
        setAuthStatus('missing');
      }
    })();
  }, []);
}
