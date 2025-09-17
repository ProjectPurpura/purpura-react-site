import React, { useState } from 'react';
import { useChatStore } from '../store/chatStore';
import { SendHorizontal } from 'lucide-react';
import './ChatInput.css';

const sendMessageToGemini = async (text: string): Promise<string> => {
  console.log(`Enviando para a IA: "${text}"`);
  await new Promise(resolve => setTimeout(resolve, 1000)); 
  return `Resposta muito braba da sua IA favoritaaa`;
}

const ChatInput: React.FC = () => {
  const [text, setText] = useState('');
  const addMessage = useChatStore((state) => state.addMessage);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedText = text.trim();
    if (!trimmedText) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      text: trimmedText,
      timestamp: new Date(),
      isUser: true,
    };
    addMessage(userMessage);
    setText('');

    const aiResponseText = await sendMessageToGemini(trimmedText);

    const aiMessage = {
      id: `ai-${Date.now()}`,
      text: aiResponseText,
      timestamp: new Date(),
      isUser: false,
    };
    addMessage(aiMessage);
  };

  return (
    <div className="chat-input-container">
      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          className="chat-input-field"
          placeholder="Digite sua pergunta..."
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