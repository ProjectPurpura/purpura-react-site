// src/pages/ConversationPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header'; 
import ChatHistory from '../components/ChatHistory';
import ChatInput from '../components/ChatInput';
import { useStompChat } from '../hooks/useStompChat';
import { CURRENT_USER_ID } from '../config';
import { fetchMessagesForChat, fetchConversationById, fetchEmpresaById } from '../services/chatApi';
import { useChatStore } from '../store/chatStore';

const ConversationPage: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { 
    setMessagesForConversation,
    addOrUpdateConversation,
    addEmpresaDetails 
  } = useChatStore();
  
  const [isLoading, setIsLoading] = useState(true);

  const { sendMessage } = useStompChat(conversationId);

  useEffect(() => {
    const loadPageData = async () => {
      if (!conversationId || conversationId === 'null') {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      const { conversations, empresas } = useChatStore.getState();

      let conversation = conversations[conversationId];
      if (!conversation) {
        const convoDetails = await fetchConversationById(conversationId);
        if (convoDetails) {
          addOrUpdateConversation(convoDetails);
          conversation = convoDetails;
        }
      }

      if (conversation) {
        const otherParticipantId = conversation.participants.find(p => p !== CURRENT_USER_ID);
        if (otherParticipantId && !empresas[otherParticipantId]) {
          const empresaDetails = await fetchEmpresaById(otherParticipantId);
          if (empresaDetails) {
            addEmpresaDetails(empresaDetails);
          }
        }
      }
      
      const messages = await fetchMessagesForChat(conversationId);
      setMessagesForConversation(conversationId, messages);

      setIsLoading(false);
    };
    
    loadPageData();
  }, [conversationId, setMessagesForConversation, addOrUpdateConversation, addEmpresaDetails]);

  const handleSendMessage = (text: string) => {
    sendMessage(text, CURRENT_USER_ID);
  };
  
  if (!conversationId || conversationId === 'null') {
    return <div>ID de conversa inválido!</div>;
  }

  if (isLoading) {
    return <div>Carregando dados da conversa...</div>;
  }

  return (
    <>
      <Header conversationId={conversationId} />
      <ChatHistory conversationId={conversationId} currentUserId={CURRENT_USER_ID} />
      <ChatInput conversationId={conversationId} onSendMessage={handleSendMessage} currentUserId={CURRENT_USER_ID} />
    </>
  );
};

export default ConversationPage;