import { useEffect } from 'react';
import { getAuthStatus, setAuthStatus, setSessionUser, getSessionUser } from './auth/authState';

export function useHashLoginBootstrap() {
  useEffect(() => {
    (async () => {
      const url = new URL(window.location.href);
      const hash = url.hash || '';
      const hashCnpjMatch = hash.match(/[#|&]cnpj=([^&]+)/);
      const queryCnpj = url.searchParams.get('cnpj');
      const cnpjRaw = hashCnpjMatch ? decodeURIComponent(hashCnpjMatch[1] || '') : (queryCnpj || '');

      if (cnpjRaw) {
        const cnpj = cnpjRaw.replace(/\D/g, '');
        if (!cnpj) {
          setAuthStatus('invalid');
          return;
        }

        setAuthStatus('loading');
        try {
          const base = process.env.REACT_APP_API_URL;
          if (!base) throw new Error('REACT_APP_API_URL não configurada');

          const res = await fetch(`${base}/empresa/${encodeURIComponent(cnpj)}`);
          if (!res.ok) throw new Error(`Falha ao buscar empresa (${res.status})`);
          const payload = await res.json();

          if (!payload?.cnpj) {
            setAuthStatus('invalid');
            return;
          }

          setSessionUser({
            cnpj: payload.cnpj,
            telefone: payload.telefone || '',
            email: payload.email || '',
            nome: payload.nome || '',
            urlFoto: payload.urlFoto || '',
            userHash: payload.userHash || payload.cnpj
          });

          if (hashCnpjMatch) {
            const newUrl = new URL(window.location.href);
            newUrl.hash = newUrl.hash
              .replace(/(?:^#)?(?:&)?cnpj=[^&]*/, '')
              .replace(/^#&?/, '#');
            if (newUrl.hash === '#' || newUrl.hash === '') newUrl.hash = '';
            window.history.replaceState({}, '', newUrl.toString());
          } else if (queryCnpj) {
            url.searchParams.delete('cnpj');
            window.history.replaceState({}, '', url.toString());
          }

          setAuthStatus('ok');
          return;
        } catch {
          setAuthStatus('error');
          return;
        }
      }

      const existing: any = getSessionUser();
      if (existing?.cnpj) {
        setAuthStatus('ok');
      } else {
        setAuthStatus('missing');
      }
    })();
  }, []);
}
