import { useEffect, useRef, useCallback, useState } from 'react';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Message } from '@/api/messaging.api';
import { customStorage } from '@/utils/customStorage';
import { getWebSocketUrl } from '@/utils/environment';
import { useAuthStore } from '@/stores/auth.store';
import { UserOperator } from '@/models';

export interface TypingIndicator {
  userId: string;
  isTyping: boolean;
}

export interface UserEvent {
  type: 'user_joined' | 'user_left';
  userId: string;
  userName: string;
}

export interface ReadReceipt {
  userId: string;
  readAt: string;
}

type MessageHandler<T> = (data: T) => void;

interface WebSocketCallbacks {
  onConnected?: () => void;
  onDisconnected?: () => void;
  onMessage?: (message: Message) => void;
  onTyping?: (roomId: string, indicator: TypingIndicator) => void;
  onUserEvent?: (roomId: string, event: UserEvent) => void;
  onReadReceipt?: (roomId: string, receipt: ReadReceipt) => void;
  onError?: (error: unknown) => void;
  onNewRoom?: (room: unknown) => void;
}

const ROOM_ID_STORAGE_KEY = 'currentRoomId';
const MAX_RECONNECT_ATTEMPTS = 5;

export const useWebSocket = (callbacks?: WebSocketCallbacks) => {
  const [isConnected, setIsConnected] = useState(false);
  const [subscribedRooms, setSubscribedRooms] = useState<string[]>([]);

  const isConnectedRef = useRef(false);
  const clientRef = useRef<Client | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const subscriptionsRef = useRef(new Map<string, StompSubscription[]>());
  const callbacksRef = useRef(callbacks);

  // Generate a unique sender ID for this dashboard session (persists for the session)
  const senderIdRef = useRef(`dashboard-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const userNameRef = useRef('Dashboard Admin');

  useEffect(() => {
    callbacksRef.current = callbacks;
  }, [callbacks]);

  const clearReconnectTimeout = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  const attemptReconnect = useCallback(() => {
    if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
      reconnectAttemptsRef.current++;
      const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);

      reconnectTimeoutRef.current = setTimeout(() => {
        if (clientRef.current && !isConnectedRef.current) {
          clientRef.current.activate();
        }
      }, delay);
    }
  }, []);

  const createSubscription = useCallback(
    <T>(destination: string, handler: MessageHandler<T>): StompSubscription | null => {
      if (clientRef.current) {
        return clientRef.current.subscribe(destination, (message: IMessage) => {
          try {
            const data: T = JSON.parse(message.body);
            handler(data);
          } catch {
            // Parse error handled silently
          }
        });
      }
      return null;
    },
    []
  );

  const subscribeToNotifications = useCallback(() => {
    if (clientRef.current && isConnectedRef.current) {
      createSubscription('/topic/notifications', (data: unknown) => {
        callbacksRef.current?.onNewRoom?.(data);
      });
    }
  }, [createSubscription]);

  const resubscribeToSavedRoom = useCallback(() => {
    const savedRoomId = customStorage.getItem(ROOM_ID_STORAGE_KEY);
    if (savedRoomId && clientRef.current) {
      // Will be handled by the useEffect that subscribes to saved room
    }
  }, []);

  const onConnect = useCallback(() => {
    setIsConnected(true);
    isConnectedRef.current = true;
    reconnectAttemptsRef.current = 0;
    clearReconnectTimeout();
    subscribeToNotifications();
    resubscribeToSavedRoom();
    callbacksRef.current?.onConnected?.();
  }, [clearReconnectTimeout, subscribeToNotifications, resubscribeToSavedRoom]);

  const onDisconnect = useCallback(() => {
    setIsConnected(false);
    isConnectedRef.current = false;
    subscriptionsRef.current.clear();
    setSubscribedRooms([]);
    callbacksRef.current?.onDisconnected?.();
    attemptReconnect();
  }, [attemptReconnect]);

  const onStompError = useCallback((frame: unknown) => {
    callbacksRef.current?.onError?.(frame);
  }, []);

  useEffect(() => {
    const wsUrl = getWebSocketUrl();
    const token = customStorage.getItem('authToken');

    clientRef.current = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      connectHeaders: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        'X-Sender-Id': senderIdRef.current,
        'X-User-Name': userNameRef.current,
        'X-App-Source': 'dashboard',
        'X-Is-Guichet': String(!!(useAuthStore.getState().user as UserOperator)?.assignedKoperatives?.length),
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect,
      onDisconnect,
      onStompError,
    });

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
      clearReconnectTimeout();
    };
  }, [onConnect, onDisconnect, onStompError, clearReconnectTimeout]);

  const connect = useCallback(() => {
    if (clientRef.current && !isConnectedRef.current) {
      clientRef.current.activate();
    }
  }, []);

  const disconnect = useCallback(() => {
    if (clientRef.current && isConnectedRef.current) {
      clientRef.current.deactivate();
    }
    clearReconnectTimeout();
    subscriptionsRef.current.clear();
    setSubscribedRooms([]);
  }, [clearReconnectTimeout]);

  const subscribeToRoom = useCallback(
    (roomId: string) => {
      const canSubscribe = clientRef.current && isConnectedRef.current && !subscriptionsRef.current.has(roomId);
      if (canSubscribe) {
        const subscriptions: StompSubscription[] = [];

        const msgSub = createSubscription<Message>(`/topic/room/${roomId}`, (data) =>
          callbacksRef.current?.onMessage?.(data)
        );
        if (msgSub) subscriptions.push(msgSub);

        const typingSub = createSubscription<TypingIndicator>(`/topic/room/${roomId}/typing`, (data) =>
          callbacksRef.current?.onTyping?.(roomId, data)
        );
        if (typingSub) subscriptions.push(typingSub);

        const eventSub = createSubscription<UserEvent>(`/topic/room/${roomId}/events`, (data) =>
          callbacksRef.current?.onUserEvent?.(roomId, data)
        );
        if (eventSub) subscriptions.push(eventSub);

        const receiptSub = createSubscription<ReadReceipt>(`/topic/room/${roomId}/read-receipts`, (data) =>
          callbacksRef.current?.onReadReceipt?.(roomId, data)
        );
        if (receiptSub) subscriptions.push(receiptSub);

        subscriptionsRef.current.set(roomId, subscriptions);
        setSubscribedRooms(Array.from(subscriptionsRef.current.keys()));
        customStorage.setItem(ROOM_ID_STORAGE_KEY, roomId);
      }
    },
    [createSubscription]
  );

  const unsubscribeFromRoom = useCallback((roomId: string) => {
    const subs = subscriptionsRef.current.get(roomId);
    if (subs) {
      subs.forEach((sub) => sub.unsubscribe());
      subscriptionsRef.current.delete(roomId);
      setSubscribedRooms(Array.from(subscriptionsRef.current.keys()));

      if (customStorage.getItem(ROOM_ID_STORAGE_KEY) === roomId) {
        customStorage.removeItem(ROOM_ID_STORAGE_KEY);
      }
    }
  }, []);

  const subscribeToRooms = useCallback(
    (roomIds: string[]) => {
      roomIds.forEach((roomId) => subscribeToRoom(roomId));
    },
    [subscribeToRoom]
  );

  const publish = useCallback((destination: string, body: object | string) => {
    if (clientRef.current && isConnectedRef.current) {
      clientRef.current.publish({
        destination,
        body: typeof body === 'string' ? body : JSON.stringify(body),
        headers: {
          'X-Sender-Id': senderIdRef.current,
          'X-User-Name': userNameRef.current,
          'X-App-Source': 'dashboard',
          'X-Is-Guichet': String(!!(useAuthStore.getState().user as UserOperator)?.assignedKoperatives?.length),
        },
      });
    }
  }, []);

  const sendMessage = useCallback(
    (roomId: string, content: string, type = 'TEXT', metadata?: string) => {
      publish(`/app/chat/${roomId}/send`, { roomId, content, type, metadata });
    },
    [publish]
  );

  const sendTypingIndicator = useCallback(
    (roomId: string, isTyping: boolean) => {
      publish(`/app/chat/${roomId}/typing`, { isTyping });
    },
    [publish]
  );

  const joinRoom = useCallback(
    (roomId: string) => {
      publish(`/app/chat/${roomId}/join`, '{}');
    },
    [publish]
  );

  const leaveRoom = useCallback(
    (roomId: string) => {
      publish(`/app/chat/${roomId}/leave`, '{}');
    },
    [publish]
  );

  const clearCurrentRoom = useCallback(() => {
    customStorage.removeItem(ROOM_ID_STORAGE_KEY);
  }, []);

  const currentRoomId = customStorage.getItem(ROOM_ID_STORAGE_KEY);

  useEffect(() => {
    if (isConnected) {
      const savedRoomId = customStorage.getItem(ROOM_ID_STORAGE_KEY);
      const notSubscribed = savedRoomId && !subscriptionsRef.current.has(savedRoomId);
      if (notSubscribed) {
        subscribeToRoom(savedRoomId);
        joinRoom(savedRoomId);
      }
    }
  }, [isConnected, subscribeToRoom, joinRoom]);

  return {
    isConnected,
    subscribedRooms,
    currentRoomId,
    connect,
    disconnect,
    subscribeToRoom,
    unsubscribeFromRoom,
    subscribeToRooms,
    sendMessage,
    sendTypingIndicator,
    joinRoom,
    leaveRoom,
    clearCurrentRoom,
  };
};
