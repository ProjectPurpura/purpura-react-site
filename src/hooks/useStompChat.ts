// src/hooks/useStompChat.ts
import { useEffect, useRef } from 'react';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import { useChatStore, Message } from '../store/chatStore';
import { CURRENT_USER_ID } from '../config';

type Incoming = {
  id: string;
  senderId: string;
  content: string;
  timestamp?: number;
  read?: boolean;
  chatId: string;
};

type TypingEvent = {
  chatId: string;
  userId: string;
  typing: boolean;
};

export const useStompChat = (conversationId: string | undefined) => {
  const clientRef = useRef<Client | null>(null);
  const subMsgRef = useRef<StompSubscription | null>(null);
  const subTypingRef = useRef<StompSubscription | null>(null);
  const addMessage = useChatStore((state) => state.addMessageToConversation);

  useEffect(() => {
    if (!conversationId || conversationId === 'null') {
      return;
    }

    const brokerURL = process.env.REACT_APP_WEBSOCKET_URL;
    if (!brokerURL) {
      console.error('URL do WebSocket não está definida no .env');
      return;
    }

    if (clientRef.current?.active) {
      try { subMsgRef.current?.unsubscribe(); } catch {}
      try { subTypingRef.current?.unsubscribe(); } catch {}
      clientRef.current.deactivate();
      clientRef.current = null;
    }

    const client = new Client({
      brokerURL,
      reconnectDelay: 5000,
      debug: () => {},
    });

    client.onConnect = () => {
      try { subMsgRef.current?.unsubscribe(); } catch {}
      try { subTypingRef.current?.unsubscribe(); } catch {}

      subMsgRef.current = client.subscribe(`/topic/chat.${conversationId}`, (frame: IMessage) => {
        try {
          const incoming: Incoming = JSON.parse(frame.body);
          const receivedMessage: Message = {
            messageId: incoming.id,
            senderId: incoming.senderId,
            corpo: incoming.content,
            timestamp: incoming.timestamp ?? Date.now(),
            read: !!incoming.read,
            isUser: incoming.senderId === CURRENT_USER_ID,
          };
          if (receivedMessage.senderId !== CURRENT_USER_ID) {
            addMessage(conversationId, receivedMessage);
          }
          if (incoming.senderId) {
            useChatStore.getState().setTyping(conversationId, incoming.senderId, false);
          }
        } catch (e) {
          console.error('Falha ao processar mensagem STOMP:', e);
        }
      });

      subTypingRef.current = client.subscribe(`/topic/chat.${conversationId}.typing`, (frame: IMessage) => {
        try {
          const evt: TypingEvent = JSON.parse(frame.body);
          if (evt?.userId) {
            useChatStore.getState().setTyping(evt.chatId, evt.userId, !!evt.typing);
          }
        } catch {}
      });
    };

    client.onStompError = (frame) => {
      console.error('Erro no Broker STOMP: ' + frame.headers['message']);
      console.error('Detalhes: ' + frame.body);
    };

    client.activate();
    clientRef.current = client;

    return () => {
      try { subMsgRef.current?.unsubscribe(); } catch {}
      try { subTypingRef.current?.unsubscribe(); } catch {}
      if (clientRef.current?.active) {
        clientRef.current.deactivate();
      }
      clientRef.current = null;
      subMsgRef.current = null;
      subTypingRef.current = null;
    };
  }, [conversationId, addMessage]);

  const sendMessage = (text: string, senderId: string) => {
    if (clientRef.current?.connected && conversationId && conversationId !== 'null') {
      const payload = {
        chatId: conversationId,
        senderId,
        content: text,
      };
      clientRef.current.publish({
        destination: '/app/chat',
        body: JSON.stringify(payload),
      });
      typingStop();
    } else {
      console.error('Não foi possível enviar a mensagem. Cliente não conectado ou ID de conversa inválido.');
    }
  };

  const typingStart = () => {
    if (!clientRef.current?.connected || !conversationId) return;
    const evt: TypingEvent = { chatId: conversationId, userId: CURRENT_USER_ID, typing: true };
    clientRef.current.publish({
      destination: '/app/chat.typing',
      body: JSON.stringify(evt),
    });
    useChatStore.getState().setTyping(conversationId, CURRENT_USER_ID, true);
  };

  const typingStop = () => {
    if (!clientRef.current?.connected || !conversationId) return;
    const evt: TypingEvent = { chatId: conversationId, userId: CURRENT_USER_ID, typing: false };
    clientRef.current.publish({
      destination: '/app/chat.typing',
      body: JSON.stringify(evt),
    });
    useChatStore.getState().setTyping(conversationId, CURRENT_USER_ID, false);
  };

  const markAsRead = (messageIds: string[]) => {
    if (!clientRef.current?.connected) return;
    if (!Array.isArray(messageIds) || messageIds.length === 0) return;

    clientRef.current.publish({
      destination: '/app/chat.markRead',
      body: JSON.stringify({ messageIds }),
    });
  };

  return { sendMessage, markAsRead, typingStart, typingStop };
};
