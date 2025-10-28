// src/services/chatApi.ts
import { Conversation, Empresa, Message } from "../store/chatStore";

const API_BASE_URL = process.env.REACT_APP_API_URL;

export const fetchConversations = async (userId: string): Promise<Conversation[]> => {
  if (!API_BASE_URL) {
    throw new Error("URL da API não definida no .env");
  }
  try {
    const response = await fetch(`${API_BASE_URL}/chat/user/${userId}`);
    if (!response.ok) {
      throw new Error(`Erro ao buscar conversas: ${response.statusText}`);
    }
    const dataFromServer: any[] = await response.json();
    const translatedData: Conversation[] = dataFromServer.map(chat => ({
      ...chat,
      chatId: chat.id 
    }));
    return translatedData;
  } catch (error) {
    console.error("Falha ao buscar conversas:", error);
    return [];
  }
};

export const fetchEmpresaById = async (empresaId: string): Promise<Empresa | null> => {
  if (!API_BASE_URL) {
    throw new Error("URL da API não definida no .env");
  }
  try {
    const response = await fetch(`${API_BASE_URL}/empresa/${empresaId}`);
    if (!response.ok) {
      throw new Error(`Empresa ${empresaId} não encontrada`);
    }
    const data: Empresa = await response.json();
    return data;
  } catch (error) {
    console.error(`Falha ao buscar detalhes da empresa ${empresaId}:`, error);
    return null;
  }
};

export const fetchMessagesForChat = async (chatId: string): Promise<Message[]> => {
  if (!API_BASE_URL) {
    throw new Error("URL da API não definida no .env");
  }
  try {
    const response = await fetch(`${API_BASE_URL}/chat/${chatId}/messages`);
    if (!response.ok) {
      throw new Error(`Erro ao buscar mensagens para o chat ${chatId}`);
    }
    const dataFromServer: any[] = await response.json();
    const translatedData: Message[] = dataFromServer.map(message => ({
      ...message,
      messageId: message.id,
      corpo: message.content,
    }));
    return translatedData;
  } catch (error) {
    console.error(`Falha ao buscar mensagens para o chat ${chatId}:`, error);
    return [];
  }
};

export const fetchConversationById = async (chatId: string): Promise<Conversation | null> => {
  if (!API_BASE_URL) {
    throw new Error("URL da API não definida no .env");
  }
  try {
    const response = await fetch(`${API_BASE_URL}/chat/${chatId}`);
    if (!response.ok) {
      throw new Error(`Chat ${chatId} não encontrado`);
    }
    const dataFromServer: any = await response.json();
    const translatedData: Conversation = { ...dataFromServer, chatId: dataFromServer.id };
    return translatedData;
  } catch (error) {
    console.error(`Falha ao buscar detalhes do chat ${chatId}:`, error);
    return null;
  }
};

export const fetchChatHistory = async (cnpj: string): Promise<Message[]> => {
  const CHATBOT_API_BASE = process.env.REACT_APP_CHATBOT_URL;
  
  if (!CHATBOT_API_BASE) {
    throw new Error("URL da API do Chatbot não definida no .env");
  }
  
  if (!cnpj) {
    console.warn("CNPJ não fornecido para buscar histórico");
    return [];
  }

  try {
    const response = await fetch(`${CHATBOT_API_BASE}/chat?senderId=${cnpj}&chatId=${cnpj}`);

    if (!response.ok) {
      console.error(`Erro ao buscar histórico de chat: ${response.status} ${response.statusText}`);
      return [];
    }

    const dataFromServer: any[] = await response.json();
    
    const translatedData: Message[] = dataFromServer.map((msg: any) => ({
      messageId: msg.id || msg.messageId || `msg-${Date.now()}-${Math.random()}`,
      senderId: msg.senderId || '',
      corpo: msg.content || msg.corpo || '',
      timestamp: msg.timestamp || Date.now(),
      read: msg.read !== undefined ? msg.read : true,
      isUser: msg.senderId === cnpj,
    }));

    return translatedData;
  } catch (error) {
    console.error("Falha ao buscar histórico de chat:", error);
    return [];
  }
};