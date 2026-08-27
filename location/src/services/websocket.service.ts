import { Client, IFrame, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Message } from '@/models/Message';
import { useAuthStore } from '@/stores';
import { initNavigatorRoom } from '@/utils/messaging.utils';

export interface WebSocketMessage {
  type: 'message' | 'typing' | 'user_event' | 'read_receipt';
  data: unknown;
}

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

export class WebSocketService {
  private client: Client | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;

  private subscriptions: Map<string, { unsubscribe: () => void }> = new Map();

  private onConnectedCallback?: () => void;
  private onDisconnectedCallback?: () => void;
  private onMessageCallback?: (message: Message) => void;
  private onTypingCallback?: (roomId: string, indicator: TypingIndicator) => void;
  private onUserEventCallback?: (roomId: string, event: UserEvent) => void;
  private onReadReceiptCallback?: (roomId: string, receipt: ReadReceipt) => void;
  private onErrorCallback?: (error: unknown) => void;

  constructor() {
    this.setupClient();
  }

  private setupClient() {
    const wsUrl = `${import.meta.env.VITE_TAXIBROUSSE_URL}/ws`;

    const token = useAuthStore.getState().token;
    const navigatorRoom = initNavigatorRoom();

    this.client = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      connectHeaders: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        'X-Sender-Id': navigatorRoom.senderId,
        'X-User-Name': navigatorRoom.userName ?? 'Anonymous User',
        'X-Is-Guichet': String(!!useAuthStore.getState().user?.assignedKoperatives?.length),
      },
      debug: (str: string) => {
        if (import.meta.env.DEV) {
          console.log('[WebSocket Debug]:', str);
        }
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: this.onConnect.bind(this),
      onDisconnect: this.onDisconnect.bind(this),
      onStompError: this.onStompError.bind(this),
    });
  }

  private getMessageHeaders(): Record<string, string> {
    const navigatorRoom = initNavigatorRoom();
    return {
      'X-Sender-Id': navigatorRoom.senderId,
      'X-User-Name': navigatorRoom.userName ?? 'Anonymous User',
      'X-Is-Guichet': String(!!useAuthStore.getState().user?.assignedKoperatives?.length),
    };
  }

  private onConnect() {
    console.log('[WebSocket] Connected to messaging server');
    this.isConnected = true;
    this.reconnectAttempts = 0;

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    this.onConnectedCallback?.();
  }

  private onDisconnect() {
    console.log('[WebSocket] Disconnected from messaging server');
    this.isConnected = false;
    this.onDisconnectedCallback?.();

    const canReconnect = this.reconnectAttempts < this.maxReconnectAttempts;
    if (canReconnect) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      console.log(`[WebSocket] Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);

      this.reconnectTimeout = setTimeout(() => {
        if (!this.isConnected) this.connect();
      }, delay);
    }
  }

  private onStompError(frame: IFrame) {
    console.error('[WebSocket] STOMP Error:', frame);
    this.onErrorCallback?.(frame);
  }

  public connect() {
    if (!this.client) this.setupClient();
    if (this.client && !this.isConnected) {
      console.log('[WebSocket] Connecting to messaging server...');
      this.client.activate();
    }
  }

  public disconnect() {
    if (this.client && this.isConnected) {
      console.log('[WebSocket] Disconnecting from messaging server...');
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
      this.subscriptions.clear();
      this.client.deactivate();
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }

  public subscribeToRoom(roomId: string) {
    const subscriptionKey = `room_${roomId}`;
    const canSubscribe = this.client && this.isConnected && !this.subscriptions.has(subscriptionKey);

    if (canSubscribe) {
      const messageSub = this.client!.subscribe(`/topic/room/${roomId}`, (message: IMessage) => {
        try {
          const messageData: Message = JSON.parse(message.body);
          this.onMessageCallback?.(messageData);
        } catch (error) {
          console.error('[WebSocket] Error parsing message:', error);
        }
      });

      const typingSub = this.client!.subscribe(`/topic/room/${roomId}/typing`, (message: IMessage) => {
        try {
          const typingData: TypingIndicator = JSON.parse(message.body);
          this.onTypingCallback?.(roomId, typingData);
        } catch (error) {
          console.error('[WebSocket] Error parsing typing indicator:', error);
        }
      });

      const eventsSub = this.client!.subscribe(`/topic/room/${roomId}/events`, (message: IMessage) => {
        try {
          const eventData: UserEvent = JSON.parse(message.body);
          this.onUserEventCallback?.(roomId, eventData);
        } catch (error) {
          console.error('[WebSocket] Error parsing user event:', error);
        }
      });

      const receiptsSub = this.client!.subscribe(`/topic/room/${roomId}/read-receipts`, (message: IMessage) => {
        try {
          const receiptData: ReadReceipt = JSON.parse(message.body);
          this.onReadReceiptCallback?.(roomId, receiptData);
        } catch (error) {
          console.error('[WebSocket] Error parsing read receipt:', error);
        }
      });

      this.subscriptions.set(subscriptionKey, {
        unsubscribe: () => {
          messageSub.unsubscribe();
          typingSub.unsubscribe();
          eventsSub.unsubscribe();
          receiptsSub.unsubscribe();
        },
      });

      console.log(`[WebSocket] Subscribed to room: ${roomId}`);
    }
  }

  public unsubscribeFromRoom(roomId: string) {
    const subscriptionKey = `room_${roomId}`;
    const subscription = this.subscriptions.get(subscriptionKey);

    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(subscriptionKey);
      console.log(`[WebSocket] Unsubscribed from room: ${roomId}`);
    }
  }

  public sendMessage(roomId: string, content: string, type = 'TEXT', metadata?: string) {
    if (this.client && this.isConnected) {
      this.client.publish({
        destination: `/app/chat/${roomId}/send`,
        body: JSON.stringify({ roomId, content, type, metadata }),
        headers: this.getMessageHeaders(),
      });
    }
  }

  public sendTypingIndicator(roomId: string, isTyping: boolean) {
    if (this.client && this.isConnected) {
      this.client.publish({
        destination: `/app/chat/${roomId}/typing`,
        body: JSON.stringify({ isTyping }),
        headers: this.getMessageHeaders(),
      });
    }
  }

  public joinRoom(roomId: string) {
    if (this.client && this.isConnected) {
      this.client.publish({
        destination: `/app/chat/${roomId}/join`,
        body: '{}',
        headers: this.getMessageHeaders(),
      });
    }
  }

  public leaveRoom(roomId: string) {
    if (this.client && this.isConnected) {
      this.client.publish({
        destination: `/app/chat/${roomId}/leave`,
        body: '{}',
        headers: this.getMessageHeaders(),
      });
    }
  }

  public onConnected(callback: () => void) {
    this.onConnectedCallback = callback;
  }

  public onDisconnected(callback: () => void) {
    this.onDisconnectedCallback = callback;
  }

  public onMessage(callback: (message: Message) => void) {
    this.onMessageCallback = callback;
  }

  public onTyping(callback: (roomId: string, indicator: TypingIndicator) => void) {
    this.onTypingCallback = callback;
  }

  public onUserEvent(callback: (roomId: string, event: UserEvent) => void) {
    this.onUserEventCallback = callback;
  }

  public onReadReceipt(callback: (roomId: string, receipt: ReadReceipt) => void) {
    this.onReadReceiptCallback = callback;
  }

  public onError(callback: (error: unknown) => void) {
    this.onErrorCallback = callback;
  }

  public get connected() {
    return this.isConnected;
  }
}

export const webSocketService = new WebSocketService();
