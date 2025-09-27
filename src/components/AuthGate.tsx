// src/components/AuthGate.tsx
import React, { useEffect, useState } from 'react';
import { getAuthStatus, onAuthChange } from '../auth/authState';
import '../pages/ChatListPage.css';

const AuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState(getAuthStatus());

  useEffect(() => {
    const unsubscribe = onAuthChange(() => setStatus(getAuthStatus()));
    return () => { unsubscribe(); };
  }, []);

  if (status === 'unknown') {
    return (
      <div className="chat-list-page">
        <header className="chat-list-header">
          <h1>Purpura</h1>
          <p>Inicializando...</p>
        </header>
        <main className="chat-list-container">
          <div className="chat-list-loading">Verificando autenticação...</div>
        </main>
      </div>
    );
  }

  if (status === 'missing') {
    return (
      <div className="chat-list-page">
        <header className="chat-list-header">
          <h1>Purpura</h1>
          <p>Autenticação necessária</p>
        </header>
        <main className="chat-list-container">
          <div className="chat-list-loading">
            Não foi possível autenticar o usuário: parâmetro “#login” ausente. Abra pelo app mobile que gera a URL com o userHash.
          </div>
        </main>
      </div>
    );
  }

  if (status === 'invalid') {
    return (
      <div className="chat-list-page">
        <header className="chat-list-header">
          <h1>Purpura</h1>
          <p>Falha de autenticação</p>
        </header>
        <main className="chat-list-container">
          <div className="chat-list-loading">
            Não foi possível autenticar o usuário: userHash inválido ou expirado. Tente novamente pelo app mobile.
          </div>
        </main>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGate;
