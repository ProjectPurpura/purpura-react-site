// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ChatListPage from './pages/ChatListPage';
import ConversationPage from './pages/ConversationPage';
import SupportPage from './pages/SupportPage';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<ChatListPage />} />
        <Route path="/chat/:conversationId" element={<ConversationPage />} />
        <Route path="/suporte" element={<SupportPage />} />
      </Routes>
    </div>
  );
}

export default App;