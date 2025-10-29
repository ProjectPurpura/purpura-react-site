// src/pages/SupportPage/SupportPage.tsx
import React, { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import ChatHistory from '../../components/ChatHistory/ChatHistory';
import ChatInput from '../../components/ChatInput/ChatInput';
import { useChatStore } from '../../store/chatStore';
import { fetchChatHistory, sendMessageToChatbot } from '../../services/chatbotApi';
import { getSessionUser } from '../../auth/authState';
import './SupportPage.css';


const SupportPage: React.FC = () => {
  const supportConversationId = 'suporte';
  const session = getSessionUser() as Record<string, any> | undefined;
  const currentUserId = typeof session?.cnpj === 'string' ? session.cnpj : '';
  const addMessage = useChatStore((state) => state.addMessageToConversation);
  const addOrUpdateConversation = useChatStore((state) => state.addOrUpdateConversation);
  const setMessagesForConversation = useChatStore((state) => state.setMessagesForConversation);
  const setTyping = useChatStore((state) => state.setTyping);
  const conversations = useChatStore((state) => state.conversations);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  useEffect(() => {
    const initializeConversationWithHistory = async () => {
      console.log('[SupportPage] Inicializando conversa de suporte');
      
      addOrUpdateConversation({
        chatId: supportConversationId,
        participants: [currentUserId, 'PurpurIA'],
        messages: [],
        lastMessagePreview: '',
        lastUpdated: Date.now(),
        unreadCount: 0,
        typing: {},
      });

      if (currentUserId) {
        try {
          console.log('[SupportPage] Buscando histórico de chat');
          setIsLoadingHistory(true);
          console.log('[SupportPage] Buscando histórico para CNPJ:', currentUserId);
          const historyMessages = await fetchChatHistory(currentUserId);
          console.log('[SupportPage] Histórico carregado:', historyMessages.length, 'mensagens', historyMessages);
          
          if (historyMessages.length > 0) {
            setMessagesForConversation(supportConversationId, historyMessages);
            console.log('[SupportPage] Mensagens definidas no estado');
          } else {
            console.log('[SupportPage] Nenhuma mensagem no histórico');
          }
        } catch (error) {
          console.error('[SupportPage] Erro ao carregar histórico:', error);
        } finally {
          setIsLoadingHistory(false);
        }
      } else {
        setIsLoadingHistory(false);
      }
    };

    initializeConversationWithHistory();
  }, [supportConversationId, currentUserId, addOrUpdateConversation, setMessagesForConversation]);

  useEffect(() => {
    const supportConvo = conversations[supportConversationId];
  }, [conversations, supportConversationId]);

  const handleAiSendMessage = async (text: string) => {
    if (!currentUserId) {
      return;
    }

    try {
      setTyping(supportConversationId, 'PurpurIA', true);

      const aiResponseText = await sendMessageToChatbot(text);
      
      setTyping(supportConversationId, 'PurpurIA', false);
      
      const aiMsg = {
        messageId: `ai-${Date.now()}`,
        senderId: 'PurpurIA',
        corpo: aiResponseText,
        timestamp: Date.now(),
        read: false,
        isUser: false,
      };
      console.log('[SupportPage] Resposta da IA:', aiMsg);
      addMessage(supportConversationId, aiMsg);
    } catch (error) {
      console.error('[SupportPage] Erro enviando mensagem para IA:', error);
      
      setTyping(supportConversationId, 'PurpurIA', false);
      
      const errorMsg = {
        messageId: `error-${Date.now()}`,
        senderId: 'PurpurIA',
        corpo: 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.',
        timestamp: Date.now(),
        read: false,
        isUser: false,
      };
      addMessage(supportConversationId, errorMsg);
    }
  };

  return (
    <div className="support-page-container">
      <Header conversationId={supportConversationId} />
      <ChatHistory conversationId={supportConversationId} currentUserId={currentUserId} showTimestamps={false} />
      <ChatInput
        conversationId={supportConversationId}
        onSendMessage={handleAiSendMessage}
        currentUserId={currentUserId}
      />
    </div>
  );
};

export default SupportPage;
