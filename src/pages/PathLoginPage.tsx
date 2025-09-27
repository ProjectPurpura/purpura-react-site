// src/pages/PathLoginPage.tsx
import React, { useEffect, useState } from 'react';
import { setSessionUser, setAuthStatus } from '../auth/authState';
import { useNavigate, useParams } from 'react-router-dom';

const PathLoginPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle');

  useEffect(() => {
    (async () => {
      if (!token) {
        setStatus('error');
        return;
      }
      try {
        const base = process.env.REACT_APP_API_URL as string;
        const res = await fetch(`${base}/empresa/hash/${encodeURIComponent(token)}`);
        if (!res.ok) throw new Error('hash inválida');
        const payload = await res.json();
        setSessionUser(payload);
        setAuthStatus('ok');
        setStatus('ok');
        navigate('/', { replace: true });
      } catch {
        setStatus('error');
      }
    })();
  }, [token, navigate]);

  if (status === 'idle') return <div>Autenticando...</div>;
  if (status === 'error') return <div>Falha ao autenticar.</div>;
  return null;
};

export default PathLoginPage;
