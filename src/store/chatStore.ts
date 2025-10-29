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
  typing?: Record<string, boolean>;
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

  setTyping: (conversationId: string, userId: string, isTyping: boolean) => void;
  getIsTyping: (conversationId: string, userId: string) => boolean;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: {},
  empresas: {},

  addMessageToConversation: (conversationId, message) =>
    set((state) => {
      const newConversations = { ...state.conversations };
      let conversation = newConversations[conversationId];
      
      if (!conversation) {
        conversation = {
          chatId: conversationId,
          participants: [message.senderId],
          messages: [],
          lastMessagePreview: '',
          lastUpdated: Date.now(),
          unreadCount: 0,
          typing: {},
        };
        newConversations[conversationId] = conversation;
      }
      
      if (!conversation.messages.some(m => m.messageId === message.messageId)) {
        conversation.messages.push(message);
        conversation.lastMessagePreview = message.corpo;
        conversation.lastUpdated = message.timestamp;
        conversation.unreadCount = (conversation.unreadCount || 0) + (message.isUser ? 0 : (message.read ? 0 : 1));
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
            messages: convo.messages || [],
            lastUpdated: convo.lastUpdated ?? (convo.messages?.length ? convo.messages[convo.messages.length - 1].timestamp : undefined),
            unreadCount: convo.unreadCount ?? (convo.messages?.filter(m => !m.read && !m.isUser).length || 0),
            typing: convo.typing || {},
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
        conversation.lastMessagePreview = messages.length ? messages[messages.length - 1].corpo : conversation.lastMessagePreview;
        conversation.lastUpdated = messages.length ? messages[messages.length - 1].timestamp : conversation.lastUpdated;
        conversation.unreadCount = messages.filter(m => !m.read && !m.isUser).length;
      }
      return { conversations: newConversations };
    }),

  addOrUpdateConversation: (conversation) =>
    set((state) => {
      const newConversations = { ...state.conversations };
      const prev = state.conversations[conversation.chatId];
      const merged: Conversation = {
        ...prev,
        ...conversation,
        messages: conversation.messages ?? prev?.messages ?? [],
        lastMessagePreview: conversation.lastMessagePreview ?? prev?.lastMessagePreview,
        lastUpdated: conversation.lastUpdated ?? prev?.lastUpdated,
        unreadCount: conversation.unreadCount ?? prev?.unreadCount,
        typing: conversation.typing ?? prev?.typing ?? {},
      };
      newConversations[conversation.chatId] = merged;
      return { conversations: newConversations };
    }),

  setTyping: (conversationId, userId, isTyping) =>
    set((state) => {
      const conversations = { ...state.conversations };
      const conv = conversations[conversationId];
      if (!conv) return { conversations };
      const typing = { ...(conv.typing || {}) };
      if (isTyping) typing[userId] = true; else delete typing[userId];
      conversations[conversationId] = { ...conv, typing };
      return { conversations };
    }),

  getIsTyping: (conversationId, userId) => {
    const conv = get().conversations[conversationId];
    return !!conv?.typing?.[userId];
  },
}));
