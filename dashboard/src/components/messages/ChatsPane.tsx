import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  TextField,
  InputAdornment,
  Chip,
  Stack,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { ChatRoom, ChatRoomType } from '@/models';
import { formatLastActivity } from './utils';

interface ChatsPaneProps {
  chats: ChatRoom[];
  setSelectedChat: (chat: ChatRoom) => void;
  selectedChatId: string;
}

function roomBgColor(type: ChatRoomType): string {
  if (type === ChatRoomType.CUSTOMER_SUPPORT) return 'primary.main';
  if (type === ChatRoomType.VOYAGE_CHAT) return 'secondary.main';
  return 'info.main';
}

export default function ChatsPane({ chats, setSelectedChat, selectedChatId }: ChatsPaneProps) {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');

  const filtered = chats.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.roomId.toLowerCase().includes(q) ||
      (c.lastMessage ?? '').toLowerCase().includes(q) ||
      (c.title ?? '').toLowerCase().includes(q)
    );
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {t(Labels.msg_conversations_title)}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {t(Labels.msg_conversations_count, { count: chats.length })}
        </Typography>
      </Box>

      {/* Search */}
      <Box sx={{ px: 2, py: 1 }}>
        <TextField
          size="small"
          fullWidth
          placeholder={t(Labels.msg_search_placeholder)}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      {/* List */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List disablePadding>
          {filtered.map((chat) => {
            const isSelected = selectedChatId === chat.roomId;
            const hasUnread = (chat.unreadCount ?? 0) > 0;

            return (
              <ListItemButton
                key={chat.roomId}
                selected={isSelected}
                onClick={() => setSelectedChat(chat)}
                sx={{
                  borderRadius: 1.5,
                  mx: 1,
                  mb: 0.5,
                  '&.Mui-selected': { bgcolor: 'action.selected' },
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: roomBgColor(chat.type) }}>{chat.roomId.substring(0, 2).toUpperCase()}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={chat.title || chat.roomId}
                  secondary={chat.lastMessage || t(Labels.msg_no_messages_short)}
                  slotProps={{
                    primary: { noWrap: true, sx: { fontWeight: hasUnread ? 700 : 500 } },
                    secondary: { noWrap: true, sx: { fontWeight: hasUnread ? 600 : 400 } },
                  }}
                />
                <Stack direction="column" sx={{ alignItems: 'flex-end', gap: 0.5, ml: 1, flexShrink: 0 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                    {formatLastActivity(chat.lastActivity)}
                  </Typography>
                  {hasUnread && (
                    <Chip
                      label={chat.unreadCount}
                      size="small"
                      color="primary"
                      sx={{
                        height: 18,
                        minWidth: 18,
                        '& .MuiChip-label': { px: 0.5, fontSize: '0.65rem' },
                      }}
                    />
                  )}
                </Stack>
              </ListItemButton>
            );
          })}
        </List>
      </Box>
    </Box>
  );
}
