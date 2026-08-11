import React from 'react';
import { useTranslation } from 'react-i18next';
import { ListItemButton, ListItemAvatar, ListItemText, Avatar, Badge, Typography, Box } from '@mui/material';
import { Support as SupportIcon, Group as GroupIcon, Phone as PhoneIcon } from '@mui/icons-material';
import { ChatRoomDto, ChatRoomType } from '@/api/messaging.api';
import dayjs from '@/utils/dayjs';

interface ChatRoomItemProps {
  room: ChatRoomDto;
  selectedRoomId?: string | null;
  onRoomSelect: (roomId: string) => void;
}

export const ChatRoomItem: React.FC<ChatRoomItemProps> = ({ room, selectedRoomId, onRoomSelect }) => {
  const { t } = useTranslation();
  const formatLastActivity = (timestamp: string) => {
    const date = dayjs(timestamp);
    const now = dayjs();
    const diffInHours = now.diff(date, 'hours');

    if (diffInHours < 1) {
      return 'now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.format('DD/MM/YYYY');
    }
  };

  const getRoomIcon = (room: ChatRoomDto) => {
    switch (room.type) {
      case ChatRoomType.CUSTOMER_SUPPORT:
        return <SupportIcon />;
      case ChatRoomType.VOYAGE_CHAT:
        return <PhoneIcon />;
      case ChatRoomType.GENERAL_INQUIRY:
        return <GroupIcon />;
      default:
        return <GroupIcon />;
    }
  };

  return (
    <ListItemButton
      key={room.roomId}
      selected={selectedRoomId === room.roomId}
      onClick={() => onRoomSelect(room.roomId)}
      sx={{
        py: 2,
        '&.Mui-selected': {
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
          '&:hover': {
            backgroundColor: 'primary.dark',
          },
        },
      }}
    >
      <ListItemAvatar>
        <Badge badgeContent={room.unreadCount > 0 ? room.unreadCount : null} color="error" max={99}>
          <Avatar sx={{ backgroundColor: 'primary.main' }}>{getRoomIcon(room)}</Avatar>
        </Badge>
      </ListItemAvatar>

      <ListItemText
        primary={
          <Typography variant="body1" noWrap>
            {room.title}
          </Typography>
        }
        secondary={
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              noWrap
              sx={{
                maxWidth: 200,
                fontWeight: room.unreadCount > 0 ? 'bold' : 'normal',
              }}
            >
              {room.lastMessage === 'chat_support_welcome_message'
                ? t(room.lastMessage)
                : (room.lastMessage ?? 'No messages yet')}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {room.lastMessageSender && `${room.lastMessageSender} • `}
              {formatLastActivity(room.lastActivity)}
            </Typography>
          </Box>
        }
      />
    </ListItemButton>
  );
};
