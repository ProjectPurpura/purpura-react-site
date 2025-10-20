// src/pages/ConversationPage/ConversationPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import ChatHistory from '../../components/ChatHistory/ChatHistory';
import ChatInput from '../../components/ChatInput/ChatInput';
import { useStompChat } from '../../hooks/useStompChat';
import { fetchMessagesForChat, fetchConversationById, fetchEmpresaById } from '../../services/chatApi';
import { useChatStore } from '../../store/chatStore';
import { getSessionUser } from '../../auth/authState';

const ConversationPage: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const { setMessagesForConversation, addOrUpdateConversation, addEmpresaDetails } = useChatStore();
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

      if (!conversation) {
        setIsLoading(false);
        navigate('/', { replace: true });
        return;
      }

      const session: any = getSessionUser();
      const myId = session?.cnpj || session?.userHash || '';
      const otherParticipantId = conversation.participants.find(p => p !== myId);
      if (otherParticipantId && !empresas[otherParticipantId]) {
        const empresaDetails = await fetchEmpresaById(otherParticipantId);
        if (empresaDetails) addEmpresaDetails(empresaDetails);
      }

      const messages = await fetchMessagesForChat(conversationId);
      setMessagesForConversation(conversationId, messages);

      setIsLoading(false);
    };

    loadPageData();
  }, [conversationId, setMessagesForConversation, addOrUpdateConversation, addEmpresaDetails, navigate]);

  const session: any = getSessionUser();
  const myId = session?.cnpj || session?.userHash || '';

  const handleSendMessage = (text: string) => {
    if (!myId) {
      console.error('Usuário não autenticado');
      return;
    }
    sendMessage(text, myId);
  };

  if (!conversationId || conversationId === 'null') return <div>ID de conversa inválido!</div>;
  if (isLoading) return <div>Carregando dados da conversa...</div>;

  return (
    <>
      <Header conversationId={conversationId} />
      <ChatHistory conversationId={conversationId} currentUserId={myId} />
      <ChatInput conversationId={conversationId} onSendMessage={handleSendMessage} currentUserId={myId} />
    </>
  );
};

export default ConversationPage;
