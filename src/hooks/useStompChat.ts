// src/hooks/useStompChat.ts
import { useEffect, useRef } from 'react';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import { useChatStore, Message } from '../store/chatStore';
import { CURRENT_USER_ID } from '../config';

export const useStompChat = (conversationId: string | undefined) => {
  const clientRef = useRef<Client | null>(null);
  const subRef = useRef<StompSubscription | null>(null);
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
      try {
        subRef.current?.unsubscribe();
      } catch {}
      clientRef.current.deactivate();
      clientRef.current = null;
    }

    const client = new Client({
      brokerURL,
      reconnectDelay: 5000,
      debug: (str) => {

      },
    });

    client.onConnect = () => {
      try {
        subRef.current?.unsubscribe();
      } catch {}

      subRef.current = client.subscribe(`/topic/chat.${conversationId}`, (message: IMessage) => {
        try {
          const receivedMessage: Message = JSON.parse(message.body);
          if (receivedMessage?.senderId !== CURRENT_USER_ID) {
            addMessage(conversationId, receivedMessage);
          }
        } catch (e) {
          console.error('Falha ao processar mensagem STOMP:', e);
        }
      });
    };

    client.onStompError = (frame) => {
      console.error('Erro no Broker STOMP: ' + frame.headers['message']);
      console.error('Detalhes: ' + frame.body);
    };

    client.activate();
    clientRef.current = client;

    return () => {
      try {
        subRef.current?.unsubscribe();
      } catch {}
      if (clientRef.current?.active) {
        clientRef.current.deactivate();
      }
      clientRef.current = null;
      subRef.current = null;
    };
  }, [conversationId, addMessage]);

  const sendMessage = (text: string, senderId: string) => {
    if (clientRef.current?.connected && conversationId && conversationId !== 'null') {
      const payload = {
        chatId: conversationId,
        senderId: senderId,
        content: text,
      };
      clientRef.current.publish({
        destination: '/app/chat',
        body: JSON.stringify(payload),
      });
    } else {
      console.error('Não foi possível enviar a mensagem. Cliente não conectado ou ID de conversa inválido.');
    }
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
