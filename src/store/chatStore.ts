import { create } from 'zustand';

export interface Message {
  messageId: string;
  senderId: string;
  corpo: string;
  timestamp: number;
  read: boolean;
  isUser?: boolean;
}

export interface Conversation {
  chatId: string;
  participants: string[];
  messages: Message[];
  lastMessagePreview?: string;
  lastUpdated?: number;
  unreadCount?: number;
}

export interface Empresa {
  cnpj: string;
  nome: string;
  email: string;
  telefone: string;
  urlFoto: string;
}

interface ChatState {
  conversations: Record<string, Conversation>;
  empresas: Record<string, Empresa>;
  addMessageToConversation: (conversationId: string, message: Message) => void;
  setConversations: (conversations: Conversation[]) => void;
  addEmpresaDetails: (empresa: Empresa) => void;
  setMessagesForConversation: (conversationId: string, messages: Message[]) => void;
  addOrUpdateConversation: (conversation: Conversation) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  conversations: {},
  empresas: {},
  
  addMessageToConversation: (conversationId, message) =>
    set((state) => {
      const newConversations = { ...state.conversations };
      const conversation = newConversations[conversationId];
      if (conversation) {
        if (!conversation.messages.some(m => m.messageId === message.messageId)) {
          conversation.messages.push(message);
        }
      }
      return { conversations: newConversations };
    }),

  setConversations: (conversations) =>
    set(() => {
        const conversationsRecord: Record<string, Conversation> = {};
        for (const convo of conversations) {
            if (convo.chatId) {
                conversationsRecord[convo.chatId] = {
                    ...convo,
                    messages: convo.messages || []
                };
            }
        }
        return { conversations: conversationsRecord };
    }),

  addEmpresaDetails: (empresa) =>
    set((state) => ({
      empresas: {
        ...state.empresas,
        [empresa.cnpj]: empresa,
      },
    })),

  setMessagesForConversation: (conversationId, messages) =>
    set((state) => {
      const newConversations = { ...state.conversations };
      const conversation = newConversations[conversationId];
      if (conversation) {
        conversation.messages = messages;
      }
      return { conversations: newConversations };
    }),

  addOrUpdateConversation: (conversation) =>
    set((state) => {
      const newConversations = { ...state.conversations };
      newConversations[conversation.chatId] = {
        ...state.conversations[conversation.chatId],
        ...conversation,
      };
      return { conversations: newConversations };
    }),
}));