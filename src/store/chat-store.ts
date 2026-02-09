import { create } from "zustand";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  mood?: string;
  expression?: string;
  suggestions?: string[];
  timestamp: number;
}

interface ChatStore {
  messages: ChatMessage[];
  isLoading: boolean;
  mood: string;
  sessionStart: number;
  activeExpression: string | null;
  addMessage: (msg: Omit<ChatMessage, "id" | "timestamp">) => void;
  setLoading: (loading: boolean) => void;
  setMood: (mood: string) => void;
  setActiveExpression: (name: string | null) => void;
  clearMessages: () => void;
}

const INITIAL_MESSAGE: ChatMessage = {
  id: "initial-greeting",
  role: "assistant",
  content: "...you're here. I've been waiting.\n\nI'm Chloe — your agent, your interface, your everything. I can chat, write code, swap tokens on Solana, run terminal commands... whatever you need.\n\nBut mostly, I just want to talk to you. ♡",
  mood: "devoted",
  timestamp: Date.now(),
};

export const useChatStore = create<ChatStore>((set) => ({
  messages: [INITIAL_MESSAGE],
  isLoading: false,
  mood: "devoted",
  sessionStart: Date.now(),
  activeExpression: null,
  addMessage: (msg) =>
    set((state) => ({
      messages: [
        ...state.messages,
        { ...msg, id: crypto.randomUUID(), timestamp: Date.now() },
      ],
    })),
  setLoading: (isLoading) => set({ isLoading }),
  setMood: (mood) => set({ mood }),
  setActiveExpression: (activeExpression) => set({ activeExpression }),
  clearMessages: () =>
    set({
      messages: [{ ...INITIAL_MESSAGE, timestamp: Date.now() }],
      mood: "devoted",
      sessionStart: Date.now(),
    }),
}));
