// src/hooks/useStompChat.ts
import { useEffect, useRef } from 'react';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import { useChatStore, Message } from '../store/chatStore';
import { getSessionUser, setSessionUser, setAuthStatus, getAuthStatus, SessionUser } from '../auth/authState';
import { useNavigate } from 'react-router-dom';

type Incoming = {
  id: string;
  senderId: string;
  content: string;
  timestamp?: number;
  read?: boolean;
  chatId: string;
};

const authenticateUserFromHash = async (): Promise<SessionUser | null> => {
  const url = new URL(window.location.href);
  const hash = url.hash || '';
  const hashCnpjMatch = hash.match(/[#|&]cnpj=([^&]+)/);
  const queryCnpj = url.searchParams.get('cnpj');
  const cnpjRaw = hashCnpjMatch ? decodeURIComponent(hashCnpjMatch[1] || '') : (queryCnpj || '');

  if (!cnpjRaw) return null;

  const cnpj = cnpjRaw.replace(/\D/g, '');
  if (!cnpj) return null;

  try {
    const base = process.env.REACT_APP_API_URL;
    if (!base) throw new Error('REACT_APP_API_URL não configurada');

    const res = await fetch(`${base}/empresa/${encodeURIComponent(cnpj)}`);
    if (!res.ok) throw new Error(`Falha ao buscar empresa (${res.status})`);
    const payload = await res.json();

    if (!payload?.cnpj) return null;

    const user: SessionUser = {
      cnpj: payload.cnpj,
      telefone: payload.telefone || '',
      email: payload.email || '',
      nome: payload.nome || '',
      urlFoto: payload.urlFoto || '',
      userHash: payload.userHash || payload.cnpj
    };

    if (hashCnpjMatch) {
      const newUrl = new URL(window.location.href);
      newUrl.hash = newUrl.hash
        .replace(/(?:^#)?(?:&)?cnpj=[^&]*/, '')
        .replace(/^#&?/, '#');
      if (newUrl.hash === '#' || newUrl.hash === '') newUrl.hash = '';
      window.history.replaceState({}, '', newUrl.toString());
    } else if (queryCnpj) {
      url.searchParams.delete('cnpj');
      window.history.replaceState({}, '', url.toString());
    }

    return user;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
};

export const useStompChat = (conversationId: string | undefined) => {
  const clientRef = useRef<Client | null>(null);
  const subMsgRef = useRef<StompSubscription | null>(null);
  const addMessage = useChatStore((state) => state.addMessageToConversation);
  const navigate = useNavigate();

  useEffect(() => {
    const url = new URL(window.location.href);
    const hash = url.hash || '';
    const hashCnpjMatch = hash.match(/[#|&]cnpj=([^&]+)/);
    const queryCnpj = url.searchParams.get('cnpj');
    const cnpjRaw = hashCnpjMatch ? decodeURIComponent(hashCnpjMatch[1] || '') : (queryCnpj || '');

    const cnpj = cnpjRaw ? cnpjRaw.replace(/\D/g, '') : null;

    const initializeChat = async () => {
      const currentAuthStatus = getAuthStatus();
      const existingSession = getSessionUser() as SessionUser;

      if (currentAuthStatus !== 'ok' || !existingSession?.cnpj) {
        console.log('[STOMP] Attempting authentication from URL hash...');
        setAuthStatus('loading');

        const authenticatedUser = await authenticateUserFromHash();
        if (authenticatedUser) {
          setSessionUser(authenticatedUser);
          setAuthStatus('ok');
          console.log('[STOMP] Authentication successful');
        } else {
          setAuthStatus('missing');
          console.error('[STOMP] Authentication failed');
          return;
        }
      }

      if (cnpj) {
        if (conversationId && conversationId !== 'null') {
          const newUrl = new URL(window.location.href);
          newUrl.pathname = `/chat/${conversationId}`;
          newUrl.hash = `#cnpj=${cnpj}`;
          window.history.replaceState({}, '', newUrl.toString());
        } else {
          const newUrl = new URL(window.location.href);
          newUrl.pathname = '/';
          newUrl.hash = `#cnpj=${cnpj}`;
          window.history.replaceState({}, '', newUrl.toString());
        }
      }

      const brokerURL = process.env.REACT_APP_WEBSOCKET_URL;
      if (!brokerURL) {
        console.error('REACT_APP_WEBSOCKET_URL ausente no .env');
        return;
      }

      if (clientRef.current?.active) {
        try { subMsgRef.current?.unsubscribe(); } catch {}
        clientRef.current.deactivate();
        clientRef.current = null;
      }

      const client = new Client({
        brokerURL,
        reconnectDelay: 5000,
        debug: (msg) => console.log('[STOMP]', msg),
      });

      client.onConnect = () => {
        try { subMsgRef.current?.unsubscribe(); } catch {}

        if (conversationId && conversationId !== 'null') {
          subMsgRef.current = client.subscribe(`/topic/chat.${conversationId}`, (frame: IMessage) => {
            try {
              const incoming: Incoming = JSON.parse(frame.body);
              const session: any = getSessionUser();
              const myId = session?.cnpj || session?.userHash || '';
              const receivedMessage: Message = {
                messageId: incoming.id,
                senderId: incoming.senderId,
                corpo: incoming.content,
                timestamp: incoming.timestamp ?? Date.now(),
                read: !!incoming.read,
                isUser: myId ? incoming.senderId === myId : false,
              };
              if (!myId || receivedMessage.senderId !== myId) {
                addMessage(conversationId, receivedMessage);
              }
            } catch (e) {
              console.error('Falha ao processar mensagem STOMP:', e);
            }
          });
        }
      };

      client.onStompError = (frame) => {
        console.error('Erro STOMP:', frame.headers['message']);
        console.error('Detalhes:', frame.body);
      };

      client.activate();
      clientRef.current = client;
    };

    initializeChat();

    return () => {
      try { subMsgRef.current?.unsubscribe(); } catch {}
      if (clientRef.current?.active) clientRef.current.deactivate();
      clientRef.current = null;
      subMsgRef.current = null;
    };
  }, [conversationId, addMessage, navigate]);

  const sendMessage = (text: string, senderId: string) => {
    console.log('[SEND] attempting', { text, senderId, conversationId, connected: !!clientRef.current?.connected });
    if (!conversationId || conversationId === 'null') {
      console.error('[SEND] invalid conversationId', conversationId);
      return;
    }
    if (!clientRef.current?.connected) {
      console.error('[SEND] STOMP not connected');
      return;
    }
    const payload = { chatId: conversationId, senderId, content: text };
    console.log('[SEND] payload', payload);
    clientRef.current.publish({
      destination: '/app/chat',
      body: JSON.stringify(payload),
    });
    console.log('[SEND] published to /app/chat');
  };

  const markAsRead = (messageIds: string[]) => {
    if (!clientRef.current?.connected) return;
    if (!Array.isArray(messageIds) || messageIds.length === 0) return;
    clientRef.current.publish({
      destination: '/app/chat.markRead',
      body: JSON.stringify({ messageIds }),
    });
  };

  return { sendMessage, markAsRead };
};
