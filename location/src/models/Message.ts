import { Base } from './Base';
import { MessageType } from './enums';

export interface Message extends Base {
  messageId: string;
  roomId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  type: MessageType;
  content: string;
  metadata?: string;
  isRead: boolean;
  createdAt: string;
  deliveredAt?: string;
  readAt?: string;
  replyToMessageId?: string;
}
