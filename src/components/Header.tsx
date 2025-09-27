// src/components/Header.tsx
import React from 'react';
import { useChatStore } from '../store/chatStore';
import { CURRENT_USER_ID } from '../config';
import { Trash2, ArrowLeft } from 'lucide-react'; // Importa o ícone de seta
import { useNavigate } from 'react-router-dom'; // Importa o hook de navegação
import './Header.css';

interface HeaderProps {
  conversationId: string;
}

const Header: React.FC<HeaderProps> = ({ conversationId }) => {
  const navigate = useNavigate();

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

  const handleBack = () => {
    navigate('/');
  };

  return (
    <header className="app-header">
      <div className="header-left-section">
        <button onClick={handleBack} className="back-button" title="Voltar para a lista">
          <ArrowLeft size={24} />
        </button>
        <div className="header-title-container">
          <img 
            src={imageUrl} 
            alt={imageAlt} 
            className="app-logo"
          />
          <h1 className="app-title">{displayName}</h1>
        </div>
      </div>
      
      <div className="header-right-section">
        <button onClick={handleClearChat} className="clear-chat-button" title="Limpar conversa">
          <Trash2 size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;