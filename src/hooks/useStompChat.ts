// src/hooks/useStompChat.ts
import { useEffect, useRef } from 'react';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import { useChatStore, Message } from '../store/chatStore';
import { getSessionUser } from '../auth/authState';

type Incoming = {
  id: string;
  senderId: string;
  content: string;
  timestamp?: number;
  read?: boolean;
  chatId: string;
};

export const useStompChat = (conversationId: string | undefined) => {
  const clientRef = useRef<Client | null>(null);
  const subMsgRef = useRef<StompSubscription | null>(null);
  const addMessage = useChatStore((state) => state.addMessageToConversation);

  useEffect(() => {
    if (!conversationId || conversationId === 'null') return;

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
    };

    client.onStompError = (frame) => {
      console.error('Erro STOMP:', frame.headers['message']);
      console.error('Detalhes:', frame.body);
    };

    client.activate();
    clientRef.current = client;

    return () => {
      try { subMsgRef.current?.unsubscribe(); } catch {}
      if (clientRef.current?.active) clientRef.current.deactivate();
      clientRef.current = null;
      subMsgRef.current = null;
    };
  }, [conversationId, addMessage]);

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
