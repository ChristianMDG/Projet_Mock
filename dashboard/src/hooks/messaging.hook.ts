import { useEffect, useCallback, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChatRoom, adminSendMessage, adminDeleteRoom, getMessages, adminGetAllRooms } from '@/api/messaging.api';
import type { Message } from '@/models';
import { useWebSocket } from './web-socket.hook';
import { useMessagingStore } from '@/stores/messaging.store';
import { useAuthStore } from '@/stores/auth.store';
import dayjs from '@/utils/dayjsConfig';

interface PaginatedMessages {
  content: Message[];
}

export const messagingKeys = {
  all: ['messaging'] as const,
  rooms: () => [...messagingKeys.all, 'rooms'] as const,
  messages: (roomId: string) => [...messagingKeys.all, 'messages', roomId] as const,
};

export function useRoomsQuery() {
  return useQuery({
    queryKey: messagingKeys.rooms(),
    queryFn: adminGetAllRooms,
    staleTime: 60000,
  });
}

export function useMessagesQuery(roomId: string | null) {
  return useQuery({
    queryKey: messagingKeys.messages(roomId ?? ''),
    queryFn: () => {
      if (!roomId) throw new Error('roomId is required');
      return getMessages(roomId);
    },
    enabled: Boolean(roomId),
    staleTime: 30000,
  });
}

export const useMessaging = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const selectedRoomId = useMessagingStore((state) => state.selectedRoomId);
  const roomsQuery = useRoomsQuery();
  const messagesQuery = useMessagesQuery(selectedRoomId);

  const {
    isConnecting,
    rooms: storeRooms,
    typingIndicators,
    setConnected,
    setConnecting,
    setRooms,
    updateRoom,
    setSelectedRoomId: storeSetSelectedRoomId,
    setRoomMessages,
    addMessage,
    setTypingIndicator,
  } = useMessagingStore();

  const previousRoomIdRef = useRef<string | null>(null);
  const initialSelectionDone = useRef(false);
  const { isConnected, subscribedRooms, subscribeToRoom, connect } = useWebSocket({
    onConnected: () => {
      setConnected(true);
      setConnecting(false);
      storeRooms.forEach((room) => subscribeToRoom(room.roomId));
    },
    onDisconnected: () => {
      setConnected(false);
      setConnecting(false);
    },
    onMessage: (msg) => {
      addMessage(msg);
      // Also update query cache if current room
      if (msg.roomId === selectedRoomId) {
        queryClient.setQueryData<PaginatedMessages>(messagingKeys.messages(msg.roomId), (old) => {
          if (old) {
            if (old.content.some((m) => m.messageId === msg.messageId)) {
              return old;
            }
            return { ...old, content: [...old.content, msg] };
          }
          return { content: [msg] };
        });
      }
    },
    onTyping: (roomId, indicator) => setTypingIndicator(roomId, indicator),
    onError: () => setConnecting(false),
  });

  // Update store when rooms are fetched
  useEffect(() => {
    if (roomsQuery.data) {
      setRooms(roomsQuery.data);
      if (isConnected) {
        roomsQuery.data.forEach((room: ChatRoom) => {
          const isSubscribed = subscribedRooms.includes(room.roomId);
          if (isSubscribed) {
            return;
          }
          subscribeToRoom(room.roomId);
        });
      }

      // Only auto-select on initial load, not after user navigates back
      const shouldAutoSelect = initialSelectionDone.current === false && !selectedRoomId && roomsQuery.data.length > 0;
      if (shouldAutoSelect) {
        initialSelectionDone.current = true;
      }
    }
  }, [
    roomsQuery.data,
    setRooms,
    isConnected,
    subscribedRooms,
    subscribeToRoom,
    selectedRoomId,
    storeSetSelectedRoomId,
  ]);

  // Sync messages to store for legacy compat if needed, but we should use query data directly if possible
  useEffect(() => {
    if (messagesQuery.data && selectedRoomId) {
      setRoomMessages(selectedRoomId, messagesQuery.data?.content ?? []);
      updateRoom(selectedRoomId, { unreadCount: 0 });
    }
  }, [messagesQuery.data, selectedRoomId, setRoomMessages, updateRoom]);

  // Mutation: Send Message
  const sendMessageMutation = useMutation({
    mutationFn: (content: string) => {
      if (!selectedRoomId) throw new Error('No room selected');
      return adminSendMessage(selectedRoomId, content);
    },
    onSuccess: (newMessage) => {
      if (!selectedRoomId) return;
      addMessage(newMessage);
      queryClient.setQueryData<PaginatedMessages>(messagingKeys.messages(selectedRoomId), (old) => {
        if (old) {
          if (old.content.some((m) => m.messageId === newMessage.messageId)) {
            return old;
          }
          return { ...old, content: [...old.content, newMessage] };
        }
        return { content: [newMessage] };
      });
      updateRoom(selectedRoomId, {
        lastMessage: newMessage.content,
        lastMessageSender: user?.firstName ?? 'Support',
        lastActivity: dayjs().toISOString(),
      });
    },
  });

  // Mutation: Close/Delete Room
  const closeRoomMutation = useMutation({
    mutationFn: (roomId: string) => adminDeleteRoom(roomId),
    onSuccess: (_, roomId) => {
      queryClient.invalidateQueries({ queryKey: messagingKeys.rooms() });
      if (selectedRoomId === roomId) {
        storeSetSelectedRoomId(null);
      }
    },
  });

  useEffect(() => {
    if (previousRoomIdRef.current) {
      return;
    }

    setConnecting(true);
    connect();
    previousRoomIdRef.current = 'initialized';
  }, [connect, setConnecting]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (selectedRoomId && content.trim()) {
        await sendMessageMutation.mutateAsync(content);
      }
    },
    [selectedRoomId, sendMessageMutation]
  );

  const setSelectedRoomId = useCallback(
    (roomId: string | null) => {
      if (roomId === selectedRoomId) {
        return;
      }
      storeSetSelectedRoomId(roomId);
    },
    [selectedRoomId, storeSetSelectedRoomId]
  );

  return {
    isConnected,
    isConnecting,
    rooms: storeRooms,
    selectedRoomId,
    currentUserId: user?.phone,
    messages: messagesQuery.data?.content ?? [],
    loading: roomsQuery.isLoading ?? messagesQuery.isLoading,
    typingIndicators: selectedRoomId ? (typingIndicators[selectedRoomId] ?? []) : [],
    closeRoom: (roomId: string) => closeRoomMutation.mutate(roomId),
    refreshRooms: () => roomsQuery.refetch(),
    setSelectedRoomId,
    sendMessage,
  };
};
