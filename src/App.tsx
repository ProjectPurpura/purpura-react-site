// src/App.tsx
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import ChatListPage from './pages/ChatListPage/ChatListPage';
import ConversationPage from './pages/ConversationPage/ConversationPage';
import SupportPage from './pages/SupportPage/SupportPage';
import PathLoginPage from './pages/PathLoginPage/PathLoginPage';
import AuthGate from './components/AuthGate/AuthGate';
import { useHashLoginBootstrap } from './AppBootstrap';
import AreaRestrita from './pages/AreaRestrita/AreaRestrita';
import './App.css';

function App() {
  useHashLoginBootstrap();

  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    setVh();
    window.addEventListener('resize', setVh);
    return () => window.removeEventListener('resize', setVh);
  }, []);

  return (
    <div className="app-container">
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
        <AuthGate>
          <Routes>
            <Route path="/arearestrita" element={<AreaRestrita />} />
            <Route path="/:loginHash/" element={<PathLoginPage />} />
            <Route path="/" element={<ChatListPage />} />
            <Route path="/chat/:conversationId" element={<ConversationPage />} />
            <Route path="/suporte" element={<SupportPage />} />
          </Routes>
        </AuthGate>
      </div>
    </div>
  );
}

export default App;
