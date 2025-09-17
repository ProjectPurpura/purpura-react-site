import { create } from 'zustand';

export interface Message {
  id: string;
  text: string;
  timestamp: Date;
  isUser: boolean;
}

interface ChatState {
  messages: Message[];
  addMessage: (message: Message) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  clearChat: () => set({ messages: [] }),
}));