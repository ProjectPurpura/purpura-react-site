// src/components/ChatHistory.tsx
import React, { useRef, useLayoutEffect, useMemo } from 'react';
import { useChatStore, Message } from '../store/chatStore';
import ChatMessage from './ChatMessage';
import DateSeparator from './DateSeparator';
import TypingIndicator from './TypingIndicator';
import './ChatHistory.css';
import { isSameDay, isToday, isYesterday, format, getYear } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CURRENT_USER_ID } from '../config';

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
  const conversation = useChatStore((s) => s.conversations[conversationId]);
  const messages = conversation?.messages || emptyMessages;

  const sortedMessages = useMemo(
    () => [...messages].sort((a, b) => a.timestamp - b.timestamp),
    [messages]
  );

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const node = chatContainerRef.current;
    if (node) {
      const isScrolledToBottom = node.scrollHeight - node.scrollTop - node.clientHeight < 100;
      const previousMessagesCount = parseInt(node.dataset.messagesCount || '0');
      const isInitialLoad = previousMessagesCount === 0 && sortedMessages.length > 0;

      if (isInitialLoad || isScrolledToBottom) {
        requestAnimationFrame(() => {
          node.scrollTop = node.scrollHeight;
        });
      }

      node.dataset.messagesCount = String(sortedMessages.length);
    }
  }, [sortedMessages, conversation?.typing]);

  const rendered = useMemo(() => {
    const arr = [...sortedMessages] as Array<Message | { typing: true; timestamp: number }>;
    const anyoneTyping = Object.values(conversation?.typing || {}).some(Boolean);
    if (anyoneTyping) {
      arr.push({ typing: true, timestamp: Date.now() } as any);
    }
    return arr;
  }, [sortedMessages, conversation?.typing]);

  return (
    <div className="chat-history" ref={chatContainerRef}>
      {rendered.length === 0 ? (
        <div className="empty-chat-message">
          <p>Nenhuma mensagem ainda. Envie a primeira!</p>
        </div>
      ) : (
        rendered.map((msg: any, index: number) => {
          const previousMessage = rendered[index - 1] as any;
          const showDateSeparator =
            !previousMessage ||
            (!msg.typing &&
              !isSameDay(new Date(msg.timestamp), new Date(previousMessage?.timestamp)));

          if (msg.typing) {
            return (
              <React.Fragment key={`typing-${index}`}>
                <div className="chat-message-container chat-message-container--other">
                  <div className="message-bubble message-bubble--other">
                    <TypingIndicator />
                  </div>
                </div>
              </React.Fragment>
            );
          }

          const isUserMessage = msg.senderId === currentUserId;
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
