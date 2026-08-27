import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { PaymentTransactionStatusEnum } from '@/models/enums';

export interface PaymentNotification {
  transactionReference: string;
  serverCorrelationId: string;
  status: PaymentTransactionStatusEnum;
  amount: number;
  operatorName: string;
  message: string;
  failureReason?: string;
  timestamp: string;
  reservationId?: number;
}

type PaymentNotificationCallback = (notification: PaymentNotification) => void;

class PaymentWebSocketService {
  private client: Client | null = null;
  private subscriptions: Map<string, StompSubscription> = new Map();
  private isConnecting = false;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;

  constructor() {
    this.initializeClient();
  }

  private initializeClient() {
    const socketUrl = `${import.meta.env.VITE_TAXIBROUSSE_URL}/ws`;

    this.client = new Client({
      webSocketFactory: () => new SockJS(socketUrl) as WebSocket,
      reconnectDelay: this.reconnectDelay,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      debug: (str: string) => {
        if (import.meta.env.DEV) {
          console.log('[Payment WS]', str);
        }
      },
      onConnect: () => {
        console.log('[Payment WS] Connected');
        this.isConnected = true;
        this.isConnecting = false;
        this.reconnectAttempts = 0;
      },
      onDisconnect: () => {
        console.log('[Payment WS] Disconnected');
        this.isConnected = false;
        this.subscriptions.clear();
      },
      onStompError: frame => {
        console.error('[Payment WS] STOMP error:', frame);
        this.handleReconnect();
      },
      onWebSocketError: event => {
        console.error('[Payment WS] WebSocket error:', event);
        this.handleReconnect();
      },
    });
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`[Payment WS] Reconnect attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
    } else {
      console.error('[Payment WS] Max reconnect attempts reached');
    }
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isConnected) {
        resolve();
        return;
      }

      if (this.isConnecting) {
        const checkInterval = setInterval(() => {
          if (this.isConnected) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 100);
        return;
      }

      this.isConnecting = true;

      if (!this.client) {
        this.initializeClient();
      }

      const originalOnConnect = this.client!.onConnect;
      this.client!.onConnect = frame => {
        originalOnConnect(frame);
        resolve();
      };

      const originalOnStompError = this.client!.onStompError;
      this.client!.onStompError = frame => {
        originalOnStompError(frame);
        reject(new Error('Failed to connect to payment WebSocket'));
      };

      this.client!.activate();
    });
  }

  disconnect() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions.clear();

    if (this.client?.active) {
      this.client.deactivate();
    }

    this.isConnected = false;
    this.isConnecting = false;
  }

  subscribeToPaymentUpdates(transactionReference: string, callback: PaymentNotificationCallback): () => void {
    if (!this.client || !this.isConnected) {
      console.error('[Payment WS] Cannot subscribe: not connected');
      return () => {};
    }

    const destination = `/topic/payment/${transactionReference}`;
    const subscriptionKey = `payment-${transactionReference}`;

    if (this.subscriptions.has(subscriptionKey)) {
      console.warn(`[Payment WS] Already subscribed to ${destination}`);
      return () => this.unsubscribe(subscriptionKey);
    }

    const subscription = this.client.subscribe(destination, (message: IMessage) => {
      try {
        const notification: PaymentNotification = JSON.parse(message.body);
        console.log('[Payment WS] Received notification:', notification);
        callback(notification);
      } catch (error) {
        console.error('[Payment WS] Error parsing notification:', error);
      }
    });

    this.subscriptions.set(subscriptionKey, subscription);
    console.log(`[Payment WS] Subscribed to ${destination}`);

    return () => this.unsubscribe(subscriptionKey);
  }

  private unsubscribe(subscriptionKey: string) {
    const subscription = this.subscriptions.get(subscriptionKey);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(subscriptionKey);
      console.log(`[Payment WS] Unsubscribed from ${subscriptionKey}`);
    }
  }

  isActive(): boolean {
    return this.isConnected;
  }
}

export const paymentWebSocketService = new PaymentWebSocketService();
