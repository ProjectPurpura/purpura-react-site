// src/pages/PathLoginPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ChatListPage.css';
import { setSessionUser } from '../auth/authState';

const PathLoginPage: React.FC = () => {
  const { loginHash } = useParams<{ loginHash: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'ok' | 'fail'>('loading');

  useEffect(() => {
    (async () => {
      const token = decodeURIComponent((loginHash || '').replace(/\/+$/, '')).trim();
      if (!token) {
        setStatus('fail');
        return;
      }
      setSessionUser('', token);
      setStatus('ok');
      navigate('/', { replace: true });
    })();
  }, [loginHash, navigate]);

  return (
    <div className="chat-list-page">
      <header className="chat-list-header">
        <h1>Purpura</h1>
        <p>Autenticando...</p>
      </header>
      <main className="chat-list-container">
        {status === 'loading' && (
          <div className="chat-list-loading">Processando hash de acesso...</div>
        )}
        {status === 'fail' && (
          <div className="chat-list-loading">userHash inválido ou ausente.</div>
        )}
      </main>
    </div>
  );
};

export default PathLoginPage;
