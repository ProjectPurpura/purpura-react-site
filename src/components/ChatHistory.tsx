// src/components/ChatHistory.tsx
import React, { useRef, useLayoutEffect } from 'react';
import { useChatStore, Message } from '../store/chatStore';
import ChatMessage from './ChatMessage';
import DateSeparator from './DateSeparator';
import './ChatHistory.css';
import { isSameDay, isToday, isYesterday, format, getYear } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ChatHistoryProps {
  conversationId: string;
  currentUserId: string;
}

const emptyMessages: Message[] = [];

const formatDateSeparator = (timestamp: number) => {
  const date = new Date(timestamp);
  const today = new Date();
  if (isToday(date)) return 'Hoje';
  if (isYesterday(date)) return 'Ontem';
  if (getYear(date) === getYear(today)) {
    return format(date, "d 'de' MMMM", { locale: ptBR });
  }
  return format(date, "d 'de' MMMM 'de' yyyy", { locale: ptBR });
};

const ChatHistory: React.FC<ChatHistoryProps> = ({ conversationId, currentUserId }) => {
  const messages = useChatStore(
    (state) => state.conversations[conversationId]?.messages || emptyMessages
  );
  
  const sortedMessages = [...messages].sort((a, b) => a.timestamp - b.timestamp);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  useLayoutEffect(() => {
    const node = chatContainerRef.current;
    if (node) {
      const isScrolledToBottom = node.scrollHeight - node.scrollTop - node.clientHeight < 100;
      const previousMessagesCount = parseInt(node.dataset.messagesCount || '0');
      const isInitialLoad = previousMessagesCount === 0 && sortedMessages.length > 0;

      if (isInitialLoad || isScrolledToBottom) {
        node.scrollTop = node.scrollHeight;
      }

      node.dataset.messagesCount = String(sortedMessages.length);
    }
  }, [sortedMessages]);

  return (
    <div className="chat-history" ref={chatContainerRef}>
      {sortedMessages.length === 0 ? (
        <div className="empty-chat-message">
          <p>Nenhuma mensagem ainda. Envie a primeira!</p>
        </div>
      ) : (
        sortedMessages.map((msg, index) => {
          const previousMessage = sortedMessages[index - 1];
          const showDateSeparator = !previousMessage || 
            !isSameDay(new Date(msg.timestamp), new Date(previousMessage.timestamp));
          
          const isUserMessage = msg.senderId === currentUserId;
          
          // O ESPIÃO PARA DEBUG
          console.log(`Msg: "${msg.corpo}", Sender: ${msg.senderId}, CurrentUser: ${currentUserId}, IsUser?: ${isUserMessage}`);
          
          const messageWithLayout = { ...msg, isUser: isUserMessage };

          return (
            <React.Fragment key={msg.messageId}>
              {showDateSeparator && (
                <DateSeparator date={formatDateSeparator(msg.timestamp)} />
              )}
              <ChatMessage message={messageWithLayout} />
            </React.Fragment>
          );
        })
      )}
    </div>
  );
};

export default ChatHistory;