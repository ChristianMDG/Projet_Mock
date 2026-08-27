import { ListItemButton, ListItemAvatar, Avatar, ListItemText, Stack, Typography, Box } from '@mui/material';
import { ChatRoom, ChatRoomType } from '@/models';
import { humanizeRoomTitle, formatLastActivity } from './utils';
import { WHATSAPP_COLORS } from './constants';
import Labels from '@/labelKeys.json';

interface ChatListItemProps {
  chat: ChatRoom;
  isSelected: boolean;
  onClick: () => void;
  t: (k: string) => string;
}

export function roomBgColor(type: ChatRoomType): string {
  if (type === ChatRoomType.CUSTOMER_SUPPORT) return 'primary.main';
  if (type === ChatRoomType.VOYAGE_CHAT) return 'secondary.main';
  return 'info.main';
}

export default function ChatListItem({ chat, isSelected, onClick, t }: ChatListItemProps) {
  const hasUnread = (chat.unreadCount ?? 0) > 0;

  return (
    <ListItemButton
      selected={isSelected}
      onClick={onClick}
      sx={{
        py: 1.5,
        px: 2,
        borderBottom: `1px solid ${WHATSAPP_COLORS.dividerLight}`,
        bgcolor: isSelected ? WHATSAPP_COLORS.selectedBg : 'transparent',
        '&:hover': {
          bgcolor: isSelected ? WHATSAPP_COLORS.selectedBg : WHATSAPP_COLORS.hoverBg,
        },
        '&.Mui-selected': {
          bgcolor: WHATSAPP_COLORS.selectedBg,
          '&:hover': { bgcolor: WHATSAPP_COLORS.selectedBg },
        },
      }}
    >
      <ListItemAvatar sx={{ minWidth: 60 }}>
        <Avatar
          sx={{
            width: 48,
            height: 48,
            color: `${roomBgColor(chat.type).split('.')[0]}.main`,
            fontWeight: 600,
            fontSize: '1.2rem',
          }}
        >
          {chat.roomId.substring(0, 2).toUpperCase()}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={humanizeRoomTitle(chat)}
        secondary={
          chat.lastMessage && chat.lastMessage !== 'chat_support_welcome_message'
            ? `${chat.lastMessageSender && !chat.lastMessageSender.startsWith('ADMIN') ? chat.lastMessageSender.substring(0, 15) + ': ' : chat.lastMessageSender?.startsWith('ADMIN') ? 'Vous: ' : ''}${chat.lastMessage}`
            : t(Labels.msg_no_messages_short)
        }
        slotProps={{
          primary: {
            noWrap: true,
            sx: { fontWeight: 400, color: WHATSAPP_COLORS.textMain, fontSize: '1rem', lineHeight: 1.2, mb: 0.5 },
          },
          secondary: {
            noWrap: true,
            sx: {
              fontWeight: 400,
              color: hasUnread ? WHATSAPP_COLORS.textMain : 'text.secondary',
              fontSize: '0.85rem',
            },
          },
        }}
      />
      <Stack
        direction="column"
        sx={{ alignItems: 'flex-end', justifyContent: 'flex-start', ml: 2, minWidth: 48, height: '100%' }}
      >
        <Typography
          variant="caption"
          sx={{
            whiteSpace: 'nowrap',
            color: hasUnread ? WHATSAPP_COLORS.unreadBadge : 'text.disabled',
            fontWeight: hasUnread ? 500 : 400,
            mb: hasUnread ? 0.5 : 0,
          }}
        >
          {formatLastActivity(chat.lastActivity)}
        </Typography>
        {hasUnread && (
          <Box
            sx={{
              bgcolor: WHATSAPP_COLORS.unreadBadge,
              color: WHATSAPP_COLORS.bgLight,
              borderRadius: '50%',
              height: 20,
              minWidth: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.7rem',
              fontWeight: 500,
              px: 0.8,
            }}
          >
            {chat.unreadCount}
          </Box>
        )}
      </Stack>
    </ListItemButton>
  );
}
