import { Paper, Box, IconButton, Avatar, Typography, Chip } from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
  AttachFile as AttachIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { ChatRoom, ChatRoomType } from '@/models';
import Labels from '@/labelKeys.json';
import { humanizeRoomTitle } from './utils';
import { WHATSAPP_COLORS } from './constants';

function roomTypeLabel(type: ChatRoomType, t: (k: string) => string): string {
  if (type === ChatRoomType.CUSTOMER_SUPPORT) return t(Labels.msg_room_support);
  if (type === ChatRoomType.VOYAGE_CHAT) return t(Labels.msg_room_voyage);
  return t(Labels.msg_room_general);
}

interface MessagesHeaderProps {
  chat: ChatRoom;
  t: (k: string) => string;
  isConnected: boolean;
  onBack?: () => void;
  handleClose: () => void;
}

export default function MessagesHeader({ chat, t, isConnected, onBack, handleClose }: MessagesHeaderProps) {
  return (
    <Paper
      elevation={0}
      square
      sx={{
        borderBottom: `1px solid ${WHATSAPP_COLORS.divider}`,
        bgcolor: WHATSAPP_COLORS.headerBg,
        flexShrink: 0,
        px: 2,
        py: 1.5,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <IconButton size="small" onClick={onBack} sx={{ display: { md: 'none' } }}>
          <ArrowBackIcon />
        </IconButton>
        <Avatar sx={{ width: 36, height: 36, fontSize: '0.875rem' }}>
          {humanizeRoomTitle(chat).charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle2" noWrap sx={{ fontWeight: 600 }}>
            {humanizeRoomTitle(chat)}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
            <Chip
              size="small"
              variant="outlined"
              label={roomTypeLabel(chat.type, t)}
              sx={{ height: 20, fontSize: '0.7rem' }}
            />
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: isConnected ? 'success.main' : 'error.main',
                display: 'inline-block',
              }}
            />
            <Typography variant="caption" color={isConnected ? 'success.main' : 'error.main'}>
              {isConnected ? t(Labels.msg_connected) : t(Labels.msg_disconnected)}
            </Typography>
          </Box>
        </Box>
        <IconButton size="small">
          <SearchIcon fontSize="small" sx={{ color: WHATSAPP_COLORS.iconColor }} />
        </IconButton>
        <IconButton size="small">
          <AttachIcon fontSize="small" sx={{ color: WHATSAPP_COLORS.iconColor }} />
        </IconButton>
        <IconButton size="small" onClick={handleClose}>
          <MoreVertIcon fontSize="small" sx={{ color: WHATSAPP_COLORS.iconColor }} />
        </IconButton>
      </Box>
    </Paper>
  );
}
