// src/components/ChatInput.tsx
import React, { useState } from 'react';
import { useChatStore } from '../store/chatStore';
import { SendHorizontal } from 'lucide-react';
import './ChatInput.css';

interface ChatInputProps {
  conversationId: string;
  onSendMessage: (text: string) => void;
  currentUserId: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ conversationId, onSendMessage, currentUserId }) => {
  const [text, setText] = useState('');
  const addMessage = useChatStore((state) => state.addMessageToConversation);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedText = text.trim();
    if (!trimmedText) return;

    const userMessage = {
      messageId: `user-${Date.now()}`,
      senderId: currentUserId,
      corpo: trimmedText,
      timestamp: Date.now(),
      read: true,
      isUser: true,
    };
    addMessage(conversationId, userMessage);
    
    onSendMessage(trimmedText);

    setText('');
  };

  return (
    <div className="chat-input-container">
      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          className="chat-input-field"
          placeholder="Digite sua mensagem..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" className="send-button" title="Enviar mensagem">
          <SendHorizontal size={20} />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;