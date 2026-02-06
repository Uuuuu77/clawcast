import { create } from "zustand";
import { safeStorage } from "@/lib/safeStorage";
import { AnalysisResult } from "@/components/clawcast/ResultCard";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  analysisResult?: AnalysisResult;
  timestamp: string;
  isLoading?: boolean;
}

export interface ChatThread {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

interface ChatStore {
  threads: ChatThread[];
  activeThreadId: string | null;
  sidebarOpen: boolean;

  // Actions
  createThread: () => string;
  deleteThread: (id: string) => void;
  setActiveThread: (id: string | null) => void;
  addMessage: (threadId: string, message: Omit<ChatMessage, "id">) => string;
  updateMessage: (threadId: string, messageId: string, updates: Partial<ChatMessage>) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  getActiveThread: () => ChatThread | undefined;
}

const STORAGE_KEY = "clawcast-threads";

function loadThreads(): ChatThread[] {
  try {
    const raw = safeStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function saveThreads(threads: ChatThread[]) {
  try {
    safeStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
  } catch {}
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export const useChatStore = create<ChatStore>((set, get) => ({
  threads: loadThreads(),
  activeThreadId: null,
  sidebarOpen: false,

  createThread: () => {
    const id = generateId();
    const thread: ChatThread = {
      id,
      title: "New Analysis",
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => {
      const threads = [thread, ...state.threads];
      saveThreads(threads);
      return { threads, activeThreadId: id };
    });
    return id;
  },

  deleteThread: (id) => {
    set((state) => {
      const threads = state.threads.filter((t) => t.id !== id);
      saveThreads(threads);
      return {
        threads,
        activeThreadId: state.activeThreadId === id ? null : state.activeThreadId,
      };
    });
  },

  setActiveThread: (id) => set({ activeThreadId: id }),

  addMessage: (threadId, message) => {
    const msgId = generateId();
    set((state) => {
      const threads = state.threads.map((t) => {
        if (t.id !== threadId) return t;
        const newMsg = { ...message, id: msgId };
        const updated = {
          ...t,
          messages: [...t.messages, newMsg],
          updatedAt: new Date().toISOString(),
          // Auto-title from first user message
          title:
            t.messages.length === 0 && message.role === "user"
              ? message.content.slice(0, 60) + (message.content.length > 60 ? "..." : "")
              : t.title,
        };
        return updated;
      });
      saveThreads(threads);
      return { threads };
    });
    return msgId;
  },

  updateMessage: (threadId, messageId, updates) => {
    set((state) => {
      const threads = state.threads.map((t) => {
        if (t.id !== threadId) return t;
        return {
          ...t,
          messages: t.messages.map((m) =>
            m.id === messageId ? { ...m, ...updates } : m
          ),
          updatedAt: new Date().toISOString(),
        };
      });
      saveThreads(threads);
      return { threads };
    });
  },

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  getActiveThread: () => {
    const { threads, activeThreadId } = get();
    return threads.find((t) => t.id === activeThreadId);
  },
}));
