import React from 'react';
import { useChatStore } from '../store/chatStore';
import { Trash2 } from 'lucide-react';
import './Header.css';

const Header: React.FC = () => {
  const clearChat = useChatStore((state) => state.clearChat);

  const handleClearChat = () => {
    if (window.confirm('Tem certeza que deseja apagar todo o histórico da conversa?')) {
      clearChat();
    }
  };

  return (
    <header className="app-header">
      <h1 className="app-title">Nara</h1>
      <button onClick={handleClearChat} className="clear-chat-button" title="Limpar conversa">
        <Trash2 size={20} />
      </button>
    </header>
  );
};

export default Header;