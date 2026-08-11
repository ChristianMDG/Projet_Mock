import { useState, useEffect, useRef, useCallback } from 'react';
import { webSocketService } from '@/services/websocket.service';
import { getMessages, getOrCreateSupportRoom, markRoomAsRead } from '@/api/messaging.api';
import { Message } from '@/models/Message';
import { getOrInitRoomId } from '@/utils/messaging.utils';

export const useMessenger = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [roomId, setRoomId] = useState<string | null>(null);
  const roomIdRef = useRef<string | null>(null);

  useEffect(() => {
    roomIdRef.current = roomId;
  }, [roomId]);

  useEffect(() => {
    let isActive = true;

    const initChat = async () => {
      try {
        const currentRoomId = await getOrInitRoomId(getOrCreateSupportRoom);
        const response = await getMessages(currentRoomId);

        if (isActive) {
          setRoomId(currentRoomId);
          roomIdRef.current = currentRoomId;
          setMessages(response.content);
        }

        webSocketService.onConnected(() => {
          if (isActive) {
            webSocketService.subscribeToRoom(currentRoomId);
            webSocketService.joinRoom(currentRoomId);
          }
        });

        webSocketService.onMessage(msg => {
          if (msg.roomId === currentRoomId && isActive) {
            setMessages(prev => {
              if (prev.some(p => p.messageId === msg.messageId)) return prev;
              return [...prev, msg];
            });
          }
        });

        webSocketService.connect();
      } catch (error) {
        console.error('Failed to initialize chat:', error);
      }
    };

    void initChat();

    return () => {
      isActive = false;
      const cleanupRoomId = roomIdRef.current;
      if (cleanupRoomId) {
        webSocketService.leaveRoom(cleanupRoomId);
        webSocketService.unsubscribeFromRoom(cleanupRoomId);
      }
    };
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      if (text.trim() && roomId) {
        try {
          webSocketService.sendMessage(roomId, text);
        } catch (error) {
          console.error('Failed to send message:', error);
        }
      }
    },
    [roomId],
  );

  const markAsRead = useCallback(async () => {
    if (roomId) {
      await markRoomAsRead(roomId);
    }
  }, [roomId]);

  return {
    messages,
    roomId,
    sendMessage,
    markAsRead,
  };
};
