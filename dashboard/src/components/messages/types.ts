export interface UserProps {
  id: string;
  username: string;
  status: 'online' | 'offline';
  avatar?: string;
}

export interface ChatProps {
  roomId: string;
  participants: UserProps[];
  messages?: unknown[];
  lastMessage?: string;
  lastActivity?: string;
  unreadCount?: number;
}

export interface MessageItemRenderProps {
  showAvatar: boolean;
  isLastInGroup: boolean;
  isFirstInGroup: boolean;
}
