import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type MessageType = {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: number;
};

export type ConversationType = {
  id: string;
  title: string;
  messages: MessageType[];
  createdAt: number;
  updatedAt: number;
};

export type AssistantStore = {
  conversations: Record<string, ConversationType>;
  currentConversationId: string | null;
  setCurrentConversationId: (id: string | null) => void;
  addConversation: (userId: string) => string;
  addMessage: (conversationId: string, message: Omit<MessageType, 'id' | 'timestamp'>) => void;
  deleteConversation: (conversationId: string) => void;
  updateConversationTitle: (conversationId: string, title: string) => void;
  getConversationsByUserId: (userId: string) => ConversationType[];
};

// Helper function to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 10);

export const useAssistantStore = create<AssistantStore>()(
  persist(
    (set, get) => ({
      conversations: {},
      currentConversationId: null,
      
      setCurrentConversationId: (id) => set({ currentConversationId: id }),
      
      addConversation: (userId) => {
        const id = `${userId}-${generateId()}`;
        const newConversation: ConversationType = {
          id,
          title: `New conversation ${new Date().toLocaleString()}`,
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        
        set((state) => ({
          conversations: {
            ...state.conversations,
            [id]: newConversation,
          },
          currentConversationId: id,
        }));
        
        return id;
      },
      
      addMessage: (conversationId, message) => {
        const newMessage: MessageType = {
          ...message,
          id: generateId(),
          timestamp: Date.now(),
        };
        
        set((state) => {
          const conversation = state.conversations[conversationId];
          if (!conversation) return state;
          
          return {
            conversations: {
              ...state.conversations,
              [conversationId]: {
                ...conversation,
                messages: [...conversation.messages, newMessage],
                updatedAt: Date.now(),
              },
            },
          };
        });
      },
      
      deleteConversation: (conversationId) => {
        set((state) => {
          const { [conversationId]: deleted, ...rest } = state.conversations;
          return {
            conversations: rest,
            currentConversationId:
              state.currentConversationId === conversationId
                ? null
                : state.currentConversationId,
          };
        });
      },
      
      updateConversationTitle: (conversationId, title) => {
        set((state) => {
          const conversation = state.conversations[conversationId];
          if (!conversation) return state;
          
          return {
            conversations: {
              ...state.conversations,
              [conversationId]: {
                ...conversation,
                title,
              },
            },
          };
        });
      },
      
      getConversationsByUserId: (userId) => {
        const { conversations } = get();
        return Object.values(conversations)
          .filter((conv) => conv.id.startsWith(`${userId}-`))
          .sort((a, b) => b.updatedAt - a.updatedAt);
      },
    }),
    {
      name: 'solis-assistant-storage',
    }
  )
);
