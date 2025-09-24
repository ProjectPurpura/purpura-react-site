// src/hooks/useStompChat.ts
import { useEffect, useRef } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import { useChatStore, Message } from '../store/chatStore';
import { CURRENT_USER_ID } from '../config';

export const useStompChat = (conversationId: string | undefined) => {
  const clientRef = useRef<Client | null>(null);
  const addMessage = useChatStore((state) => state.addMessageToConversation);

  useEffect(() => {
    if (!conversationId || conversationId === 'null') {
      return;
    }

    const brokerURL = process.env.REACT_APP_WEBSOCKET_URL;
    if (!brokerURL) {
      console.error("URL do WebSocket não está definida no .env");
      return;
    }

    const client = new Client({
      brokerURL,
      reconnectDelay: 5000,
      debug: (str) => {
        console.log(`STOMP DEBUG: ${str}`);
      },
    });

    client.onConnect = () => {
      client.subscribe(`/topic/chat.${conversationId}`, (message: IMessage) => {
        const receivedMessage: Message = JSON.parse(message.body);
        if (receivedMessage.senderId !== CURRENT_USER_ID) {
          addMessage(conversationId, receivedMessage);
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
      if (clientRef.current?.active) {
        clientRef.current.deactivate();
      }
    };
  }, [conversationId, addMessage]);

  const sendMessage = (text: string, senderId: string) => {
    if (clientRef.current?.connected && conversationId && conversationId !== 'null') {
      const payload = {
        chatId: conversationId,
        senderId: senderId,
        content: text
      };
      clientRef.current.publish({
        destination: '/app/chat',
        body: JSON.stringify(payload),
      });
    } else {
      console.error("Não foi possível enviar a mensagem. Cliente não conectado ou ID de conversa inválido.");
    }
  };

  return { sendMessage };
};