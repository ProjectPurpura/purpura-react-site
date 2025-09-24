// src/pages/ChatListPage.tsx
import React, { useEffect, useState } from 'react';
import { useChatStore, Conversation } from '../store/chatStore';
import { fetchConversations, fetchEmpresaById } from '../services/chatApi';
import { CURRENT_USER_ID } from '../config';
import ChatListItem from '../components/ChatListItem';
import './ChatListPage.css';

const ChatListPage: React.FC = () => {
  const { conversations, empresas, setConversations, addEmpresaDetails } = useChatStore();
  const [isLoading, setIsLoading] = useState(true);
  
  const conversationList = Object.values(conversations);

  const supportChatExists = conversationList.some(c => c.chatId === 'suporte');

  if (!supportChatExists) {
    const supportChat: Conversation = {
      chatId: 'suporte',
      participants: ['Nara', CURRENT_USER_ID],
      messages: [],
      lastMessagePreview: 'Precisa de ajuda? Fale conosco!',
      lastUpdated: new Date().getTime(),
      unreadCount: 0,
    };
    conversationList.push(supportChat);
  }
  
  conversationList.sort((a, b) => {
    if (a.chatId === 'suporte') return -1;
    if (b.chatId === 'suporte') return 1;
    return (b.lastUpdated || 0) - (a.lastUpdated || 0);
  });

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      const convosFromServer = await fetchConversations(CURRENT_USER_ID);
      setConversations(convosFromServer);

      const participantIds = new Set<string>();
      const currentEmpresas = useChatStore.getState().empresas;
      convosFromServer.forEach(convo => {
        convo.participants.forEach(id => {
          if (id !== CURRENT_USER_ID && !currentEmpresas[id]) {
            participantIds.add(id);
          }
        });
      });

      const idsToFetch = Array.from(participantIds);
      for (let i = 0; i < idsToFetch.length; i++) {
        const id = idsToFetch[i];
        const empresaDetails = await fetchEmpresaById(id);
        if (empresaDetails) {
          addEmpresaDetails(empresaDetails);
        }
      }

      setIsLoading(false);
    };

    loadInitialData();
  }, [setConversations, addEmpresaDetails]);

  if (isLoading) {
    return <div>Carregando conversas...</div>;
  }

  return (
    <div className="chat-list-page">
      <header className="chat-list-header">
        <h1>Minhas Conversas</h1>
        <p>Selecione uma conversa para continuar.</p>
      </header>
      <main className="chat-list-container">
        {conversationList.map((convo) => (
          <ChatListItem key={convo.chatId} conversation={convo} />
        ))}
      </main>
    </div>
  );
};

export default ChatListPage;