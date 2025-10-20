// src/pages/SupportPage/SupportPage.tsx
import React from 'react';
import Header from '../../components/Header/Header';
import ChatHistory from '../../components/ChatHistory/ChatHistory';
import ChatInput from '../../components/ChatInput/ChatInput';
import { useChatStore } from '../../store/chatStore';

const sendMessageToGemini = async (text: string): Promise<string> => {
  console.log(`Enviando para a IA: "${text}"`);
  await new Promise(resolve => setTimeout(resolve, 1000)); 
  return `Esta é uma resposta simulada da IA para: "${text}"`;
}

const SupportPage: React.FC = () => {
  const supportConversationId = 'suporte';
  const currentUserId = "meuIdFixo_suporte";
  const addMessage = useChatStore((state) => state.addMessageToConversation);
  
  const handleAiSendMessage = async (text: string) => {
    const aiResponseText = await sendMessageToGemini(text);
    const aiMessage = {
      messageId: `ai-${Date.now()}`,
      senderId: "Purpura Bot",
      corpo: aiResponseText,
      timestamp: Date.now(),
      read: true,
    };
    addMessage(supportConversationId, aiMessage);
  };

  return (
    <>
      <Header conversationId={supportConversationId} />
      <ChatHistory conversationId={supportConversationId} currentUserId={currentUserId} />
      <ChatInput 
        conversationId={supportConversationId} 
        onSendMessage={handleAiSendMessage} 
        currentUserId={currentUserId}
      />
    </>
  );
};

export default SupportPage;
