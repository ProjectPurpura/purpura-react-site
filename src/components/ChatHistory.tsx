import React, { useRef, useEffect } from 'react';
import { useChatStore } from '../store/chatStore';
import ChatMessage from './ChatMessage';
import './ChatHistory.css';

const ChatHistory: React.FC = () => {
  const messages = useChatStore((state) => state.messages);
  
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-history">
      {messages.length === 0 ? (
        <div className="empty-chat-message">
          <h2>Olá, Pessoa!</h2>
          <p>Faça uma pergunta para começar a nossa conversa.</p>
        </div>
      ) : (
        messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)
      )}
      {}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default ChatHistory;