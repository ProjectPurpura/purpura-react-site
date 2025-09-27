// src/components/ChatInput.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useChatStore } from '../store/chatStore';
import { SendHorizontal } from 'lucide-react';
import { useStompChat } from '../hooks/useStompChat';
import './ChatInput.css';

interface ChatInputProps {
  conversationId: string;
  onSendMessage: (text: string) => void;
  currentUserId: string;
}

const TYPING_DEBOUNCE_MS = 1200;

const ChatInput: React.FC<ChatInputProps> = ({ conversationId, onSendMessage, currentUserId }) => {
  const [text, setText] = useState('');
  const addMessage = useChatStore((state) => state.addMessageToConversation);
  const { typingStart, typingStop } = useStompChat(conversationId);
  const lastTypedRef = useRef<number>(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      typingStop();
    };
  }, [typingStop]);

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
    typingStop();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    const now = Date.now();

    if (now - lastTypedRef.current > 300) {
      typingStart();
      lastTypedRef.current = now;
    }

    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      typingStop();
    }, TYPING_DEBOUNCE_MS) as unknown as number;
  };

  return (
    <div className="chat-input-container">
      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          className="chat-input-field"
          placeholder="Digite sua mensagem..."
          value={text}
          onChange={handleChange}
        />
        <button type="submit" className="send-button" title="Enviar mensagem">
          <SendHorizontal size={20} />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
