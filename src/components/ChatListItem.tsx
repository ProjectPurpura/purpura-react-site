// src/components/ChatListItem.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useChatStore, Conversation } from '../store/chatStore';
import { CURRENT_USER_ID } from '../config';
import { MessageSquare, Bot } from 'lucide-react';

interface ChatListItemProps {
  conversation: Conversation;
}

const ChatListItem: React.FC<ChatListItemProps> = ({ conversation }) => {
  const empresas = useChatStore((state) => state.empresas);
  const otherParticipantId = conversation.participants.find(p => p !== CURRENT_USER_ID);
  
  let displayName = 'Carregando...';
  const isSupportChat = conversation.chatId === 'suporte';

  if (isSupportChat) {
    displayName = otherParticipantId || 'Nara';
  } else if (otherParticipantId && empresas[otherParticipantId]) {
    displayName = empresas[otherParticipantId].nome;
  }

  const linkTo = isSupportChat ? '/suporte' : `/chat/${conversation.chatId}`;

  return (
    <Link to={linkTo} className="chat-list-item">
      <div className="chat-item-icon">
        {isSupportChat ? <Bot size={24} /> : <MessageSquare size={24} />}
      </div>
      <div className="chat-item-details">
        <h3 className="chat-item-name">{displayName}</h3>
        {conversation.lastMessagePreview && <p className="chat-item-preview">{conversation.lastMessagePreview}</p>}
      </div>
      
      {conversation.unreadCount && conversation.unreadCount > 0 && (
        <div className="unread-badge">{conversation.unreadCount}</div>
      )}
    </Link>
  );
};

export default ChatListItem;