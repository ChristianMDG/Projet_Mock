import { useTranslation } from 'react-i18next';
import { Box, CircularProgress, Typography } from '@mui/material';
import { ChatBubbleOutlined, Forum } from '@mui/icons-material';
import Labels from '@/labelKeys.json';
import ChatsPane from './ChatsPane';
import MessagesPane from './MessagesPane';
import { useMessaging } from '@/hooks/messaging.hook';
import { ChatRoom } from '@/models';

export default function MyMessages() {
  const { t } = useTranslation();
  const { rooms, loading, selectedRoomId, setSelectedRoomId } = useMessaging();
  const selectedChat: ChatRoom | undefined = rooms.find((r) => r.roomId === selectedRoomId);

  const handleSetSelectedChat = (chat: ChatRoom) => setSelectedRoomId(chat.roomId);
  const handleBack = () => setSelectedRoomId(null);

  if (loading && rooms.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (rooms.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          gap: 2,
          p: 3,
        }}
      >
        <ChatBubbleOutlined sx={{ fontSize: 56, color: 'text.disabled' }} />
        <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center' }}>
          {t(Labels.msg_no_conversations)}
        </Typography>
        <Typography variant="body2" color="text.disabled" sx={{ textAlign: 'center' }}>
          {t(Labels.msg_support_hint)}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Left panel — conversation list */}
      <Box
        sx={{
          width: { xs: '100%', md: 320 },
          flexShrink: 0,
          borderRight: { md: 1 },
          borderColor: { md: 'divider' },
          display: { xs: selectedChat ? 'none' : 'flex', md: 'flex' },
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <ChatsPane chats={rooms} selectedChatId={selectedChat?.roomId ?? ''} setSelectedChat={handleSetSelectedChat} />
      </Box>

      {/* Right panel — messages */}
      <Box
        sx={{
          flex: 1,
          display: { xs: selectedChat ? 'flex' : 'none', md: 'flex' },
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {selectedChat ? (
          <MessagesPane chat={selectedChat} onBack={handleBack} />
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              gap: 1.5,
            }}
          >
            <Forum sx={{ fontSize: 56, color: 'text.disabled' }} />
            <Typography variant="h6" color="text.secondary">
              {t(Labels.msg_select_title)}
            </Typography>
            <Typography variant="body2" color="text.disabled">
              {t(Labels.msg_select_hint)}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
