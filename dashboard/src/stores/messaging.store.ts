import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Message, ChatRoom } from '@/api/messaging.api';

export interface TypingIndicator {
  userId: string;
  isTyping: boolean;
}

interface MessagingState {
  isConnected: boolean;
  isConnecting: boolean;

  rooms: ChatRoom[];
  selectedRoomId: string | null;

  messagesByRoom: Record<string, Message[]>;

  typingIndicators: Record<string, TypingIndicator[]>;

  roomsLoading: boolean;
  messagesLoading: boolean;

  setConnected: (connected: boolean) => void;
  setConnecting: (connecting: boolean) => void;

  setRooms: (rooms: ChatRoom[]) => void;
  updateRoom: (roomId: string, updates: Partial<ChatRoom>) => void;
  setSelectedRoomId: (roomId: string | null) => void;

  setRoomMessages: (roomId: string, messages: Message[]) => void;
  addMessage: (message: Message) => void;

  setTypingIndicator: (roomId: string, indicator: TypingIndicator) => void;
  clearTypingIndicators: (roomId: string) => void;

  setRoomsLoading: (loading: boolean) => void;
  setMessagesLoading: (loading: boolean) => void;

  reset: () => void;
}

const initialState = {
  isConnected: false,
  isConnecting: false,
  rooms: [],
  selectedRoomId: null,
  messagesByRoom: {},
  typingIndicators: {},
  roomsLoading: false,
  messagesLoading: false,
};

export const useMessagingStore = create<MessagingState>()(
  devtools(
    (set) => ({
      ...initialState,

      setConnected: (connected) => set({ isConnected: connected }),
      setConnecting: (connecting) => set({ isConnecting: connecting }),

      setRooms: (rooms) => set({ rooms }),

      updateRoom: (roomId, updates) =>
        set((state) => ({
          rooms: state.rooms.map((room) => (room.roomId === roomId ? { ...room, ...updates } : room)),
        })),

      setSelectedRoomId: (roomId) => set({ selectedRoomId: roomId }),

      setRoomMessages: (roomId, messages) =>
        set((state) => ({
          messagesByRoom: {
            ...state.messagesByRoom,
            [roomId]: messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
          },
        })),

      addMessage: (message) =>
        set((state) => {
          const roomMessages = state.messagesByRoom[message.roomId] || [];
          if (roomMessages.some((m) => m.messageId === message.messageId)) {
            return state;
          }

          const updatedRooms = state.rooms.map((room) => {
            if (room.roomId === message.roomId) {
              return {
                ...room,
                lastMessage: message.content,
                lastMessageSender: message.senderName,
                lastActivity: message.createdAt,
                unreadCount: room.roomId === state.selectedRoomId ? 0 : (room.unreadCount || 0) + 1,
              };
            }
            return room;
          });

          return {
            messagesByRoom: {
              ...state.messagesByRoom,
              [message.roomId]: [...roomMessages, message].sort(
                (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
              ),
            },
            rooms: updatedRooms,
          };
        }),

      setTypingIndicator: (roomId, indicator) =>
        set((state) => {
          const currentIndicators = state.typingIndicators[roomId] || [];
          const updatedIndicators = indicator.isTyping
            ? [...currentIndicators.filter((i) => i.userId !== indicator.userId), indicator]
            : currentIndicators.filter((i) => i.userId !== indicator.userId);

          return {
            typingIndicators: {
              ...state.typingIndicators,
              [roomId]: updatedIndicators,
            },
          };
        }),

      clearTypingIndicators: (roomId) =>
        set((state) => ({
          typingIndicators: {
            ...state.typingIndicators,
            [roomId]: [],
          },
        })),

      setRoomsLoading: (loading) => set({ roomsLoading: loading }),
      setMessagesLoading: (loading) => set({ messagesLoading: loading }),

      reset: () => set(initialState),
    }),
    { name: 'messaging-store' }
  )
);
