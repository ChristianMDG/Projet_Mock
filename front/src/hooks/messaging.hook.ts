import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Message } from '@/models/Message';
import { ChatRoom } from '@/models/ChatRoom';
import { ChatRoomType } from '@/models/enums';
import {
  SendMessageRequest,
  CreateChatRoomRequest,
  getUserRooms,
  getRoomDetails,
  getMessages,
  sendMessage,
  createChatRoom,
  joinRoom,
  leaveRoom,
  markRoomAsRead,
  markMessageAsRead,
  getUnreadCount,
  getOrCreateSupportRoom,
  PaginatedResponse,
} from '@/api/messaging.api';
import { useMessagingStore } from '@/stores/messaging.store';

export const messagingKeys = {
  all: ['messaging'] as const,
  rooms: () => [...messagingKeys.all, 'rooms'] as const,
  room: (roomId: string) => [...messagingKeys.all, 'room', roomId] as const,
  messages: (roomId: string) => [...messagingKeys.all, 'messages', roomId] as const,
  unreadCount: (roomId: string) => [...messagingKeys.all, 'unread', roomId] as const,
};

export function useUserRooms() {
  return useQuery({
    queryKey: messagingKeys.rooms(),
    queryFn: getUserRooms,
    staleTime: 30 * 1000,
  });
}

export function useRoomDetails(roomId: string) {
  return useQuery({
    queryKey: messagingKeys.room(roomId),
    queryFn: () => getRoomDetails(roomId),
    enabled: !!roomId,
  });
}

export function useRoomMessages(roomId: string, page = 0, size = 20) {
  return useQuery({
    queryKey: [...messagingKeys.messages(roomId), page, size],
    queryFn: () => getMessages(roomId, page, size),
    enabled: !!roomId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUnreadCount(roomId: string) {
  return useQuery({
    queryKey: messagingKeys.unreadCount(roomId),
    queryFn: () => getUnreadCount(roomId),
    enabled: !!roomId,
    staleTime: 10 * 1000,
  });
}

export function useSupportRoom() {
  return useQuery({
    queryKey: [...messagingKeys.rooms(), 'support'],
    queryFn: getOrCreateSupportRoom,
  });
}

export function useCreateRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createChatRoom,
    onSuccess: newRoom => {
      queryClient.setQueryData<ChatRoom[]>(messagingKeys.rooms(), oldData => [newRoom, ...(oldData ?? [])]);
      useMessagingStore.getState().addRoom(newRoom);
    },
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  const messagingStore = useMessagingStore();

  return useMutation({
    mutationFn: ({ roomId, request }: { roomId: string; request: SendMessageRequest }) => sendMessage(roomId, request),
    onSuccess: (newMessage, { roomId }) => {
      queryClient.setQueryData<PaginatedResponse<Message>>([...messagingKeys.messages(roomId), 0, 20], oldData => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          content: [...oldData.content, newMessage],
        };
      });

      messagingStore.addMessage(newMessage);
      messagingStore.updateRoom(roomId, {
        lastMessage: newMessage.content,
        lastMessageSender: newMessage.senderName,
        lastActivity: newMessage.createdAt,
      });
    },
  });
}

export function useJoinRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: joinRoom,
    onSuccess: (_, roomId) => {
      queryClient.invalidateQueries({ queryKey: messagingKeys.room(roomId) });
      queryClient.invalidateQueries({ queryKey: messagingKeys.rooms() });
    },
  });
}

export function useLeaveRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: leaveRoom,
    onSuccess: (_, roomId) => {
      queryClient.invalidateQueries({ queryKey: messagingKeys.room(roomId) });
      queryClient.invalidateQueries({ queryKey: messagingKeys.rooms() });
    },
  });
}

export function useMarkRoomAsRead() {
  const queryClient = useQueryClient();
  const messagingStore = useMessagingStore();

  return useMutation({
    mutationFn: markRoomAsRead,
    onSuccess: (_, roomId) => {
      messagingStore.resetUnreadCount(roomId);
      queryClient.invalidateQueries({ queryKey: messagingKeys.unreadCount(roomId) });
    },
  });
}

export function useMarkMessageAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markMessageAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messagingKeys.all });
    },
  });
}

export function useChatRoom(roomId: string | null) {
  const messagingStore = useMessagingStore();
  const roomQuery = useRoomDetails(roomId ?? '');
  const messagesQuery = useRoomMessages(roomId ?? '');

  const joinMutation = useJoinRoom();
  const leaveMutation = useLeaveRoom();
  const sendMessageMutation = useSendMessage();
  const markAsReadMutation = useMarkRoomAsRead();

  const joinRoomHandler = async () => {
    if (!roomId) return;

    try {
      await joinMutation.mutateAsync(roomId);
      messagingStore.setCurrentRoom(roomId);
    } catch (error) {
      console.error('Failed to join room:', error);
    }
  };

  const leaveRoomHandler = async () => {
    if (!roomId) return;

    try {
      await leaveMutation.mutateAsync(roomId);
      if (messagingStore.currentRoomId === roomId) {
        messagingStore.setCurrentRoom(null);
      }
    } catch (error) {
      console.error('Failed to leave room:', error);
    }
  };

  const sendMessageHandler = async (content: string, type = 'TEXT') => {
    if (!roomId) return;

    const request: SendMessageRequest = {
      roomId,
      content,
      type: type as never,
    };

    try {
      await sendMessageMutation.mutateAsync({ roomId, request });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const markAsReadHandler = async () => {
    if (!roomId) return;

    try {
      await markAsReadMutation.mutateAsync(roomId);
    } catch (error) {
      console.error('Failed to mark room as read:', error);
    }
  };

  return {
    room: roomQuery.data,
    messages: messagesQuery.data?.content ?? [],
    isLoading: roomQuery.isLoading || messagesQuery.isLoading,
    error: roomQuery.error ?? messagesQuery.error,

    joinRoom: joinRoomHandler,
    leaveRoom: leaveRoomHandler,
    sendMessage: sendMessageHandler,
    markAsRead: markAsReadHandler,

    isJoining: joinMutation.isPending,
    isLeaving: leaveMutation.isPending,
    isSending: sendMessageMutation.isPending,
    isMarkingAsRead: markAsReadMutation.isPending,
  };
}

export function useMessagingInterface() {
  const messagingStore = useMessagingStore();
  const roomsQuery = useUserRooms();
  const createRoomMutation = useCreateRoom();

  const {
    isConnected,
    isConnecting,
    currentRoomId,
    rooms,
    isChatOpen,
    isSidebarOpen,
    connect,
    disconnect,
    setCurrentRoom,
    toggleChat,
    toggleSidebar,
    openChat,
    closeChat,
  } = messagingStore;

  const createSupportRoom = async () => {
    try {
      const request: CreateChatRoomRequest = {
        type: ChatRoomType.CUSTOMER_SUPPORT,
        title: 'Customer Support',
      };

      const room = await createRoomMutation.mutateAsync(request);
      setCurrentRoom(room.roomId);
      openChat();

      return room;
    } catch (error) {
      console.error('Failed to create support room:', error);
      throw error;
    }
  };

  return {
    isConnected,
    isConnecting,
    currentRoomId,
    rooms: roomsQuery.data ?? rooms,
    isChatOpen,
    isSidebarOpen,
    isLoadingRooms: roomsQuery.isLoading,

    connect,
    disconnect,
    setCurrentRoom,
    toggleChat,
    toggleSidebar,
    openChat,
    closeChat,
    createSupportRoom,

    isCreatingRoom: createRoomMutation.isPending,
  };
}
