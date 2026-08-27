import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { Box, List, TextField, InputAdornment } from '@mui/material';
import { Search } from '@mui/icons-material';
import { ChatRoom } from '@/models';
import { humanizeRoomTitle } from './utils';
import ChatListItem from './ChatListItem';
import { WHATSAPP_COLORS } from './constants';

interface ChatsPaneProps {
  chats: ChatRoom[];
  setSelectedChat: (chat: ChatRoom) => void;
  selectedChatId: string;
}

export default function ChatsPane({ chats, setSelectedChat, selectedChatId }: ChatsPaneProps) {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');

  const filtered = chats.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.roomId.toLowerCase().includes(q) ||
      (c.lastMessage ?? '').toLowerCase().includes(q) ||
      humanizeRoomTitle(c).toLowerCase().includes(q)
    );
  });

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        bgcolor: WHATSAPP_COLORS.bgLight,
        borderRight: `1px solid ${WHATSAPP_COLORS.divider}`,
      }}
    >
      {/* Search */}
      <Box
        sx={{ px: 1.5, py: 1, bgcolor: WHATSAPP_COLORS.searchBg, borderBottom: `1px solid ${WHATSAPP_COLORS.divider}` }}
      >
        <TextField
          size="small"
          fullWidth
          placeholder={t(Labels.msg_search_placeholder)}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          variant="outlined"
          sx={{
            bgcolor: WHATSAPP_COLORS.bgLight,
            borderRadius: '24px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '24px',
              '& fieldset': { border: 'none' },
            },
            '& .MuiOutlinedInput-input': {
              py: 1,
              px: 1,
              fontSize: '0.9rem',
            },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: 'text.secondary', fontSize: 20 }} />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      {/* List */}
      <Box sx={{ flex: 1, overflowY: 'auto', bgcolor: WHATSAPP_COLORS.bgLight }}>
        <List disablePadding>
          {filtered.map((chat) => (
            <ChatListItem
              key={chat.roomId}
              chat={chat}
              isSelected={selectedChatId === chat.roomId}
              onClick={() => setSelectedChat(chat)}
              t={t}
            />
          ))}
        </List>
      </Box>
    </Box>
  );
}
