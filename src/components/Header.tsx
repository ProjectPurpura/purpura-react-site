// src/components/Header.tsx
import React from 'react';
import { useChatStore } from '../store/chatStore';
import { CURRENT_USER_ID } from '../config';
import { Trash2 } from 'lucide-react';
import './Header.css';

interface HeaderProps {
  conversationId: string;
}

const Header: React.FC<HeaderProps> = ({ conversationId }) => {
  const conversation = useChatStore((state) => state.conversations[conversationId]);
  const empresas = useChatStore((state) => state.empresas);

  const isSupportChat = conversationId === 'suporte';
  let displayName = 'Chat';
  
  let imageUrl = process.env.PUBLIC_URL + '/logo.svg';
  let imageAlt = 'Logo Purpura';

  if (isSupportChat) {
    displayName = 'Nara';
  } else if (conversation) {
    const otherParticipantId = conversation.participants.find(p => p !== CURRENT_USER_ID);
    if (otherParticipantId && empresas[otherParticipantId]) {
      const empresa = empresas[otherParticipantId];
      displayName = empresa.nome;
      
      if (empresa.urlFoto) {
        imageUrl = empresa.urlFoto;
        imageAlt = `Logo da ${empresa.nome}`;
      }
    }
  }

  const handleClearChat = () => {
    if (window.confirm(`Apagar o histórico de "${displayName}"?`)) {
      alert('Função de limpar ainda não implementada no store!');
    }
  };

  return (
    <header className="app-header">
      <div className="header-title-container">
        <img 
          src={imageUrl} 
          alt={imageAlt} 
          className="app-logo"
        />
        <h1 className="app-title">{displayName}</h1>
      </div>
      <button onClick={handleClearChat} className="clear-chat-button" title="Limpar conversa">
        <Trash2 size={20} />
      </button>
    </header>
  );
};

export default Header;