// src/components/ChatMessage/ChatMessage.tsx
import React from 'react';
import { Message } from '../../store/chatStore';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import './ChatMessage.css';

interface ChatMessageProps {
  message: Message;
  showTimestamp?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, showTimestamp=false }) => {
  const containerClass = message.isUser
    ? 'chat-message-container chat-message-container--user'
    : 'chat-message-container chat-message-container--other';

  const bubbleClass = message.isUser
    ? 'message-bubble message-bubble--user'
    : 'message-bubble message-bubble--other';

  return (
    <div className={containerClass}>
      <div className={bubbleClass}>
        <ReactMarkdown>{message.corpo}</ReactMarkdown>
      </div>
      {showTimestamp && (
        <span className="message-timestamp">
          {format(new Date(message.timestamp), 'HH:mm')}
        </span>
      )}
    </div>
  );
};

export default ChatMessage;


