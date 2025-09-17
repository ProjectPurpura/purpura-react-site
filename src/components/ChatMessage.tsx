import React from 'react';
import { Message } from '../store/chatStore';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';

import './ChatMessage.css';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const containerClass = message.isUser
    ? 'chat-message-container chat-message-container--user'
    : 'chat-message-container chat-message-container--ai';

  const bubbleClass = message.isUser
    ? 'message-bubble message-bubble--user'
    : 'message-bubble message-bubble--ai';


  return (
    <div className={containerClass}>
      <div className={bubbleClass}>
        <ReactMarkdown>{message.text}</ReactMarkdown>
      </div>
      <span className="message-timestamp">
        {format(message.timestamp, 'HH:mm')}
      </span>
    </div>
  );
};

export default ChatMessage;