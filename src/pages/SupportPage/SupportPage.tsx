// src/pages/SupportPage/SupportPage.tsx
import React, { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import ChatHistory from '../../components/ChatHistory/ChatHistory';
import ChatInput from '../../components/ChatInput/ChatInput';
import { useChatStore } from '../../store/chatStore';
import { getSessionUser } from '../../auth/authState';
import { fetchChatHistory } from '../../services/chatApi';
import './SupportPage.css';

const sendMessageToGemini = async (text: string): Promise<string> => {
  const chatbotApiBase = process.env.REACT_APP_CHATBOT_URL ?? '';
  const session = getSessionUser() as Record<string, any> | undefined;
  const chatId = typeof session?.cnpj === 'string' ? session.cnpj : '';
  const senderId = chatId;

  const controller = new AbortController();
  const timeoutMs = 10000;
  const timeoutId = setTimeout(() => {
    console.error('[Chatbot] Timeout atingido (' + timeoutMs + 'ms)');
    controller.abort();
  }, timeoutMs);

  try {
    const res = await fetch(`${chatbotApiBase}/chat/${chatId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senderId, content: text }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    console.log('[Chatbot] Status da resposta:', res.status);

    if (!res.ok) {
      const errText = await res.text();
      console.error('[Chatbot] Erro HTTP:', res.status, errText);
      throw new Error('Erro ao enviar mensagem para o chatbot');
    }

    const resposta = await res.json();
    console.log('[Chatbot] Resposta recebida:', resposta);

    return resposta.content ?? 'Sem resposta da IA.';
  } catch (error: unknown) {
    clearTimeout(timeoutId);
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.error('[Chatbot] Timeout de comunicação atingido!');
      throw new Error('Tempo de resposta excedido.');
    } else {
      console.error('[Chatbot] Erro desconhecido:', error);
      throw error;
    }
  }
};

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
          const historyMessages = await fetchChatHistory(currentUserId);
          console.log('[SupportPage] Histórico carregado:', historyMessages.length, 'mensagens');
          
          if (historyMessages.length > 0) {
            setMessagesForConversation(supportConversationId, historyMessages);
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

      const aiResponseText = await sendMessageToGemini(text);
      
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
      <ChatHistory conversationId={supportConversationId} currentUserId={currentUserId} />
      <ChatInput
        conversationId={supportConversationId}
        onSendMessage={handleAiSendMessage}
        currentUserId={currentUserId}
      />
    </div>
  );
};

export default SupportPage;
