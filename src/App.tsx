// src/App.tsx
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import ChatListPage from './pages/ChatListPage';
import ConversationPage from './pages/ConversationPage';
import SupportPage from './pages/SupportPage';
import './App.css';

function App() {
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    setVh();
    window.addEventListener('resize', setVh);
    const boot = document.getElementById('boot');
    if (boot?.parentElement) boot.parentElement.removeChild(boot);
    return () => window.removeEventListener('resize', setVh);
  }, []);

  return (
    <div className="app-container">
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
        <Routes>
          <Route path="/" element={<ChatListPage />} />
          <Route path="/chat/:conversationId" element={<ConversationPage />} />
          <Route path="/suporte" element={<SupportPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
