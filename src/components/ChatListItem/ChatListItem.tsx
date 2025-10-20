// src/components/ChatListItem/ChatListItem.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useChatStore, Conversation } from '../../store/chatStore';
import { getSessionUser } from '../../auth/authState';
import { MessageSquare, Bot } from 'lucide-react';

interface ChatListItemProps {
  conversation: Conversation;
}

const ChatListItem: React.FC<ChatListItemProps> = ({ conversation }) => {
  const empresas = useChatStore((state) => state.empresas);
  const session: any = getSessionUser();
  const myId = session?.cnpj || session?.userHash || '';
  const otherParticipantId = conversation.participants.find(p => p !== myId);
  
  let displayName = 'Carregando...';
  const isSupportChat = conversation.chatId === 'suporte';

  if (isSupportChat) {
    displayName = otherParticipantId || 'PurpurIA';
  } else if (otherParticipantId && empresas[otherParticipantId]) {
    displayName = empresas[otherParticipantId].nome;
  } else if (otherParticipantId) {
    displayName = otherParticipantId;
  }

  const linkTo = isSupportChat ? '/suporte' : `/chat/${conversation.chatId}`;

  return (
    <Link to={linkTo} className="chat-list-item" aria-label={`Abrir conversa: ${displayName}`}>
      <div className="chat-item-icon" aria-hidden>
        {isSupportChat ? <Bot size={18} /> : <MessageSquare size={18} />}
      </div>
      <div className="chat-item-details">
        <h3 className="chat-item-name" title={displayName}>{displayName}</h3>
        {conversation.lastMessagePreview && (
          <p className="chat-item-preview" title={conversation.lastMessagePreview}>
            {conversation.lastMessagePreview}
          </p>
        )}
      </div>
      {conversation.unreadCount && conversation.unreadCount > 0 && (
        <div className="unread-badge" aria-label={`${conversation.unreadCount} não lidas`}>
          {conversation.unreadCount}
        </div>
      )}
    </Link>
  );
};

export default ChatListItem;


