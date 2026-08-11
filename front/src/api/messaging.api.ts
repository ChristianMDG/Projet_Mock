import api from './axios';

import { Message } from '@/models/Message';
import { ChatRoom } from '@/models/ChatRoom';
import { MessageType, ChatRoomType } from '@/models/enums';

export type { Message };
export type ChatRoomDto = ChatRoom;
export { MessageType, ChatRoomType };

export interface SendMessageRequest {
  roomId: string;
  content: string;
  type?: MessageType;
  metadata?: string;
  replyToMessageId?: string;
}

export interface CreateChatRoomRequest {
  type: ChatRoomType;
  title?: string;
  participantIds?: string[];
  metadata?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// Chat API functions
export const createChatRoom = async (request: CreateChatRoomRequest): Promise<ChatRoomDto> => {
  const response = await api.post('/chat/rooms', request);
  return response.data;
};

export const getUserRooms = async (): Promise<ChatRoomDto[]> => {
  const response = await api.get('/chat/rooms');
  return response.data;
};

export const getRoomDetails = async (roomId: string): Promise<ChatRoomDto> => {
  const response = await api.get(`/chat/rooms/${roomId}`);
  return response.data;
};

export const joinRoom = async (roomId: string): Promise<void> => {
  await api.post(`/chat/rooms/${roomId}/join`);
};

export const leaveRoom = async (roomId: string): Promise<void> => {
  await api.post(`/chat/rooms/${roomId}/leave`);
};

export const sendMessage = async (roomId: string, request: SendMessageRequest): Promise<Message> => {
  const response = await api.post(`/chat/rooms/${roomId}/messages`, request);
  return response.data;
};

export const getMessages = async (roomId: string, page = 0, size = 20): Promise<PaginatedResponse<Message>> => {
  const response = await api.get(`/chat/rooms/${roomId}/messages`, {
    params: { page, size },
  });
  return response.data;
};

export const markRoomAsRead = async (roomId: string): Promise<void> => {
  await api.post(`/chat/rooms/${roomId}/read`);
};

export const markMessageAsRead = async (messageId: string): Promise<void> => {
  await api.post(`/chat/messages/${messageId}/read`);
};

export const getUnreadCount = async (roomId: string): Promise<number> => {
  const response = await api.get(`/chat/rooms/${roomId}/unread-count`);
  return response.data;
};

export const getOrCreateSupportRoom = async (): Promise<ChatRoomDto> => {
  const response = await api.get('/chat/support');
  return response.data;
};

// Admin API functions
export const adminGetAllRooms = async (): Promise<ChatRoomDto[]> => {
  const response = await api.get('/admin/messaging/rooms');
  return response.data;
};

export const adminGetRoomsByType = async (type: ChatRoomType): Promise<ChatRoomDto[]> => {
  const response = await api.get(`/admin/messaging/rooms/type/${type}`);
  return response.data;
};

export const adminSendMessage = async (roomId: string, message: string): Promise<Message> => {
  const response = await api.post(`/admin/messaging/rooms/${roomId}/messages`, message, {
    headers: { 'Content-Type': 'text/plain' },
  });
  return response.data;
};

export const adminDeactivateRoom = async (roomId: string): Promise<void> => {
  await api.delete(`/admin/messaging/rooms/${roomId}`);
};

export const adminDeleteRoom = async (roomId: string): Promise<void> => {
  await api.delete(`/admin/messaging/rooms/${roomId}/delete`);
};

export const adminTakeOverConversation = async (roomId: string): Promise<void> => {
  await api.post(`/admin/messaging/rooms/${roomId}/take-over`);
};
