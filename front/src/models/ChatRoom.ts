import { ChatRoomType } from './enums';

export interface ChatRoom {
  roomId: string;
  type: ChatRoomType;
  participants: string;
  isActive: boolean;
  title: string;
  lastMessage?: string;
  lastMessageSender?: string;
  lastActivity: string;
  metadata?: string;
  unreadCount: number;
}
