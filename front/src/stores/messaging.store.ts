import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import ShortUniqueId from 'short-unique-id';
import { Message } from '@/models/Message';
import { ChatRoom } from '@/models/ChatRoom';
import { MessageType } from '@/models/enums';
import { webSocketService, TypingIndicator, UserEvent, ReadReceipt } from '@/services/websocket.service';
import {
  NavigatorRoom,
  getNavigatorRoom as getNavigatorRoomFromStorage,
  setNavigatorRoom as setNavigatorRoomToStorage,
} from '@/utils/messaging.utils';
import dayjs from '@/utils/dayjs';

interface MessagingState {
  isConnected: boolean;
  isConnecting: boolean;
  currentRoomId: string | null;
  rooms: ChatRoom[];
  roomsLoading: boolean;
  messagesByRoom: Record<string, Message[]>;
  messagesLoading: Record<string, boolean>;
  typingIndicators: Record<string, TypingIndicator[]>;
  unreadCounts: Record<string, number>;
  isChatOpen: boolean;
  isSidebarOpen: boolean;
  navigatorRoom: NavigatorRoom;
  connect: () => void;
  disconnect: () => void;
  setCurrentRoom: (roomId: string | null) => void;
  setRooms: (rooms: ChatRoom[]) => void;
  addRoom: (room: ChatRoom) => void;
  updateRoom: (roomId: string, updates: Partial<ChatRoom>) => void;
  removeRoom: (roomId: string) => void;
  addMessage: (message: Message) => void;
  setRoomMessages: (roomId: string, messages: Message[]) => void;
  prependMessages: (roomId: string, messages: Message[]) => void;
  handleNewMessage: (message: Message) => void;
  handleTypingIndicator: (roomId: string, indicator: TypingIndicator) => void;
  handleUserEvent: (roomId: string, event: UserEvent) => void;
  handleReadReceipt: (roomId: string, receipt: ReadReceipt) => void;
  setUnreadCount: (roomId: string, count: number) => void;
  incrementUnreadCount: (roomId: string) => void;
  resetUnreadCount: (roomId: string) => void;
  toggleChat: () => void;
  toggleSidebar: () => void;
  openChat: () => void;
  closeChat: () => void;
  setRoomsLoading: (loading: boolean) => void;
  setMessagesLoading: (roomId: string, loading: boolean) => void;
  getNavigatorRoom: () => NavigatorRoom;
  initNavigatorRoom: () => NavigatorRoom;
  updateNavigatorRoom: (updates: Partial<NavigatorRoom>) => void;
}

export const useMessagingStore = create<MessagingState>()(
  devtools(
    (set, get) => ({
      // Initial state
      isConnected: false,
      isConnecting: false,
      currentRoomId: null,
      rooms: [],
      roomsLoading: false,
      messagesByRoom: {},
      messagesLoading: {},
      typingIndicators: {},
      unreadCounts: {},
      isChatOpen: false,
      isSidebarOpen: true,
      navigatorRoom: {} as NavigatorRoom,

      // Connection actions
      connect: () => {
        const state = get();
        if (state.isConnected || state.isConnecting) return;

        set({ isConnecting: true });

        webSocketService.onConnected(() => {
          set({ isConnected: true, isConnecting: false });
        });

        webSocketService.onDisconnected(() => {
          set({ isConnected: false, isConnecting: false });
        });

        webSocketService.onMessage(message => {
          get().handleNewMessage(message);
        });

        webSocketService.onTyping((roomId, indicator) => {
          get().handleTypingIndicator(roomId, indicator);
        });

        webSocketService.onUserEvent((roomId, event) => {
          get().handleUserEvent(roomId, event);
        });

        webSocketService.onReadReceipt((roomId, receipt) => {
          get().handleReadReceipt(roomId, receipt);
        });

        webSocketService.onError(error => {
          console.error('[Messaging Store] WebSocket error:', error);
          set({ isConnected: false, isConnecting: false });
        });

        webSocketService.connect();
      },

      disconnect: () => {
        webSocketService.disconnect();
        set({ isConnected: false, isConnecting: false });
      },

      setCurrentRoom: roomId => {
        const currentRoom = get().currentRoomId;
        if (currentRoom) webSocketService.unsubscribeFromRoom(currentRoom);
        if (roomId) {
          webSocketService.subscribeToRoom(roomId);
          get().resetUnreadCount(roomId);
        }
        set({ currentRoomId: roomId });
      },

      setRooms: rooms => set({ rooms }),

      addRoom: room =>
        set(state => ({
          rooms: [room, ...state.rooms.filter(r => r.roomId !== room.roomId)],
        })),

      updateRoom: (roomId, updates) =>
        set(state => ({
          rooms: state.rooms.map(room => (room.roomId === roomId ? { ...room, ...updates } : room)),
        })),

      removeRoom: roomId =>
        set(state => ({
          rooms: state.rooms.filter(room => room.roomId !== roomId),
          messagesByRoom: Object.fromEntries(Object.entries(state.messagesByRoom).filter(([id]) => id !== roomId)),
          unreadCounts: Object.fromEntries(Object.entries(state.unreadCounts).filter(([id]) => id !== roomId)),
          currentRoomId: state.currentRoomId === roomId ? null : state.currentRoomId,
        })),

      addMessage: message =>
        set(state => {
          const roomMessages = state.messagesByRoom[message.roomId] ?? [];
          const messageExists = roomMessages.some(m => m.messageId === message.messageId);
          if (messageExists) return state;

          return {
            messagesByRoom: {
              ...state.messagesByRoom,
              [message.roomId]: [...roomMessages, message].sort(
                (a, b) => dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf(),
              ),
            },
          };
        }),

      setRoomMessages: (roomId, messages) =>
        set(state => ({
          messagesByRoom: {
            ...state.messagesByRoom,
            [roomId]: messages.sort((a, b) => dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf()),
          },
        })),

      prependMessages: (roomId, messages) =>
        set(state => ({
          messagesByRoom: {
            ...state.messagesByRoom,
            [roomId]: [...messages, ...(state.messagesByRoom[roomId] ?? [])].sort(
              (a, b) => dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf(),
            ),
          },
        })),

      handleNewMessage: message => {
        const state = get();
        state.addMessage(message);
        state.updateRoom(message.roomId, {
          lastMessage: message.content,
          lastMessageSender: message.senderName,
          lastActivity: message.createdAt,
        });
      },

      handleTypingIndicator: (roomId, indicator) =>
        set(state => {
          const currentIndicators = state.typingIndicators[roomId] ?? [];
          const updatedIndicators = indicator.isTyping
            ? [...currentIndicators.filter(i => i.userId !== indicator.userId), indicator]
            : currentIndicators.filter(i => i.userId !== indicator.userId);

          return {
            typingIndicators: {
              ...state.typingIndicators,
              [roomId]: updatedIndicators,
            },
          };
        }),

      handleUserEvent: (roomId, event) => {
        if (event.type === 'user_joined') {
          get().addMessage({
            messageId: `system_${dayjs().valueOf()}`,
            roomId,
            senderId: 'system',
            senderName: 'System',
            type: MessageType.SYSTEM,
            content: `${event.userName} joined the conversation`,
            isRead: true,
            createdAt: dayjs().tz('Indian/Antananarivo').toISOString(),
          });
        }
      },

      handleReadReceipt: (roomId, receipt) =>
        set(state => ({
          messagesByRoom: {
            ...state.messagesByRoom,
            [roomId]: (state.messagesByRoom[roomId] ?? []).map(message => ({
              ...message,
              isRead: message.senderId !== receipt.userId ? true : message.isRead,
            })),
          },
        })),

      setUnreadCount: (roomId, count) =>
        set(state => ({
          unreadCounts: { ...state.unreadCounts, [roomId]: count },
        })),

      incrementUnreadCount: roomId =>
        set(state => ({
          unreadCounts: {
            ...state.unreadCounts,
            [roomId]: (state.unreadCounts[roomId] ?? 0) + 1,
          },
        })),

      resetUnreadCount: roomId =>
        set(state => ({
          unreadCounts: { ...state.unreadCounts, [roomId]: 0 },
        })),

      toggleChat: () => set(state => ({ isChatOpen: !state.isChatOpen })),
      toggleSidebar: () => set(state => ({ isSidebarOpen: !state.isSidebarOpen })),
      openChat: () => set({ isChatOpen: true }),
      closeChat: () => set({ isChatOpen: false }),
      setRoomsLoading: loading => set({ roomsLoading: loading }),
      setMessagesLoading: (roomId, loading) =>
        set(state => ({
          messagesLoading: { ...state.messagesLoading, [roomId]: loading },
        })),

      getNavigatorRoom: () => get().navigatorRoom,
      initNavigatorRoom: () => {
        const existingRoom = getNavigatorRoomFromStorage();
        if (existingRoom.senderId) {
          set({ navigatorRoom: existingRoom });
          return existingRoom;
        }
        // Initialize new navigator room if needed
        const uid = new ShortUniqueId({ length: 10 });
        const now = dayjs().tz('Indian/Antananarivo').toISOString();
        const newRoom: NavigatorRoom = {
          senderId: 'navigator',
          roomId: `nav-${uid.rnd()}`,
          userName: 'Navigator',
          createdAt: now,
          lastActivity: now,
        };
        setNavigatorRoomToStorage(newRoom);
        set({ navigatorRoom: newRoom });
        return newRoom;
      },
      updateNavigatorRoom: updates => {
        const currentRoom = get().navigatorRoom;
        const updatedRoom: NavigatorRoom = {
          ...currentRoom,
          ...updates,
          lastActivity: dayjs().tz('Indian/Antananarivo').toISOString(),
        };
        setNavigatorRoomToStorage(updatedRoom);
        set({ navigatorRoom: updatedRoom });
      },
    }),
    {
      name: 'messaging-store',
    },
  ),
);
