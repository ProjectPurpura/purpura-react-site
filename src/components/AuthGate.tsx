// src/components/AuthGate.tsx
import React, { useEffect, useState } from 'react';
import { getAuthStatus, getSessionUser } from '../auth/authState';
import { useLocation } from 'react-router-dom';
import '../pages/ChatListPage.css';

const AuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState(getAuthStatus());
  const location = useLocation();

  useEffect(() => {
    const id = window.setInterval(() => {
      setStatus(getAuthStatus());
    }, 200);
    return () => window.clearInterval(id);
  }, []);

  if (location.pathname === '/arearestrita') {
    return <>{children}</>;
  }

  if (status === 'idle' || status === 'loading') {
    return (
      <div className="chat-list-page">
        <header className="chat-list-header">
          <h1>Carregando...</h1>
          <p>Preparando sua sessão</p>
        </header>
      </div>
    );
  }

  if (status === 'missing') {
    return (
      <div className="chat-list-page">
        <header className="chat-list-header">
          <h1>Link inválido</h1>
          <p>Abra novamente pelo app mobile.</p>
        </header>
      </div>
    );
  }

  if (status === 'invalid') {
    return (
      <div className="chat-list-page">
        <header className="chat-list-header">
          <h1>Hash inválida</h1>
          <p>Verifique o link de acesso</p>
        </header>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="chat-list-page">
        <header className="chat-list-header">
          <h1>Erro ao autenticar</h1>
          <p>Tente novamente mais tarde</p>
        </header>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGate;
