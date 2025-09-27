// src/AppBootstrap.tsx
import { useEffect } from 'react';
import { getAuthStatus, setAuthStatus, setSessionUser, getSessionUser } from './auth/authState';

export function useHashLoginBootstrap() {
  useEffect(() => {
    (async () => {
      const existing = getSessionUser();
      if (existing.cnpj || existing.userHash) {
        setAuthStatus('ok');
        return;
      }

      const hash = window.location.hash || '';
      const hMatch = hash.match(/[#|&]login=([^&]+)/); // #login=USER_HASH
      if (!hMatch) {
        setAuthStatus('missing');
        return;
      }

      const userHash = decodeURIComponent(hMatch[1] || '').trim();
      if (!userHash) {
        setAuthStatus('invalid');
        return;
      }

      setSessionUser('', userHash);

      const url = new URL(window.location.href);
      url.hash = url.hash.replace(/(?:^#)?(?:&)?login=[^&]*/, '').replace(/^#&?/, '#');
      if (url.hash === '#' || url.hash === '') url.hash = '';
      window.history.replaceState({}, '', url.toString());

      setAuthStatus('ok');
    })();
  }, []);
}
