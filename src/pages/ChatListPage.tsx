// src/pages/ChatListPage.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useChatStore, Conversation } from '../store/chatStore';
import { fetchConversations, fetchEmpresaById } from '../services/chatApi';
import ChatListItem from '../components/ChatListItem';
import './ChatListPage.css';
import { getSessionUser } from '../auth/authState';

const ChatListPage: React.FC = () => {
  const { conversations, setConversations, addEmpresaDetails } = useChatStore();
  const [isLoading, setIsLoading] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);

  const session: any = getSessionUser();
  const myId = session?.cnpj || session?.userHash || '';
  const myName = session?.nome || 'Minha Conta';

  useEffect(() => {
    const ro = new ResizeObserver(() => {
      if (listRef.current) listRef.current.style.setProperty('--tick', String(Date.now()));
    });
    if (listRef.current) ro.observe(listRef.current);
    return () => ro.disconnect();
  }, []);

  const conversationList = useMemo(() => {
    const arr = Object.values(conversations);
    if (myId && !arr.some(c => c.chatId === 'suporte')) {
      const supportChat: Conversation = {
        chatId: 'suporte',
        participants: ['PurpurIA', myId],
        messages: [],
        lastMessagePreview: 'Precisa de ajuda? Fale conosco!',
        lastUpdated: Date.now(),
        unreadCount: 0,
      };
      arr.push(supportChat);
    }
    arr.sort((a, b) => {
      if (a.chatId === 'suporte') return -1;
      if (b.chatId === 'suporte') return 1;
      return (b.lastUpdated || 0) - (a.lastUpdated || 0);
    });
    return arr;
  }, [conversations, myId]);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const convos = await fetchConversations(myId);
      setConversations(convos);

      const participantIds = new Set<string>();
      const currentEmpresas = useChatStore.getState().empresas;
      convos.forEach(convo => {
        convo.participants.forEach(id => {
          if (id !== myId && !currentEmpresas[id]) participantIds.add(id);
        });
      });
      for (const id of participantIds) {
        const empresa = await fetchEmpresaById(id);
        if (empresa) addEmpresaDetails(empresa);
      }
      setIsLoading(false);
    };
    if (myId) load();
  }, [setConversations, addEmpresaDetails, myId]);

  return (
    <div className="chat-list-page" ref={listRef}>
      <header className="chat-list-header">
        <h1>Minhas Conversas</h1>
        <p>Logado como: {myName} - {'cnpj' in session ? session.cnpj : 'N/A'}</p>
      </header>
      <main className="chat-list-container">
        {isLoading ? (
          <div className="chat-list-loading">Carregando conversas...</div>
        ) : (
          conversationList.map((convo) => (
            <ChatListItem key={convo.chatId} conversation={convo} />
          ))
        )}
      </main>
    </div>
  );
};

export default ChatListPage;
