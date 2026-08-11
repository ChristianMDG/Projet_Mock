import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  EmojiEmotions as EmojiIcon,
  Phone as PhoneIcon,
  VideoCall as VideoCallIcon,
} from '@mui/icons-material';
import { Message } from '@/api/messaging.api';
import { useChatRoom } from '@/hooks/messaging.hook';
import { useMessagingStore } from '@/stores/messaging.store';
import dayjs from '@/utils/dayjs';

interface ChatRoomProps {
  roomId: string;
}

export const ChatRoom: React.FC<ChatRoomProps> = ({ roomId }) => {
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { navigatorRoom } = useMessagingStore();

  const { room, messages, isLoading, sendMessage, markAsRead, isSending } = useChatRoom(roomId);
  const { messagesByRoom, typingIndicators } = useMessagingStore();

  const realtimeMessages = messagesByRoom[roomId] ?? [];
  const allMessages = [...messages, ...realtimeMessages]
    .reduce((unique, message) => {
      const exists = unique.some(m => m.messageId === message.messageId);
      if (exists) return unique;

      unique.push(message);
      return unique;
    }, [] as Message[])
    .sort((a, b) => dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf());

  const roomTypingUsers = typingIndicators[roomId] ?? [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [allMessages]);

  useEffect(() => {
    if (room && allMessages.length > 0) {
      markAsRead().then(_ => {});
    }
  }, [room, allMessages.length, markAsRead]);

  const handleSendMessage = async () => {
    if (messageInput.trim() && !isSending) {
      const content = messageInput;
      setMessageInput('');

      try {
        await sendMessage(content);
      } catch (error) {
        console.error('Failed to send message:', error);
        setMessageInput(content);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage().then(_ => {});
    }
  };

  const renderMessage = (message: Message) => {
    const isMe = message.senderId === navigatorRoom.senderId;
    const formatTime = (timestamp: string) => dayjs(timestamp).format('HH:mm');

    return (
      <ListItem
        key={message.messageId}
        sx={{
          flexDirection: isMe ? 'row-reverse' : 'row',
          alignItems: 'flex-start',
          mb: 1,
        }}
      >
        <ListItemAvatar sx={{ minWidth: isMe ? 0 : 56 }}>
          {!isMe && (
            <Avatar src={message.senderAvatar} sx={{ width: 32, height: 32 }}>
              {message.senderName.charAt(0).toUpperCase()}
            </Avatar>
          )}
        </ListItemAvatar>

        <Box sx={{ maxWidth: '70%', mx: 1 }}>
          {!isMe && (
            <Typography variant="caption" color="text.secondary">
              {message.senderName}
            </Typography>
          )}

          <Paper
            elevation={1}
            sx={{
              p: 1.5,
              backgroundColor: isMe ? 'primary.main' : 'secondary.main',
              color: isMe ? 'primary.contrastText' : 'text.primary',
              borderRadius: 2,
              borderTopLeftRadius: isMe ? 2 : 0,
              borderTopRightRadius: isMe ? 0 : 2,
            }}
          >
            <Typography variant="body2">{message.content}</Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
              <Typography
                variant="caption"
                sx={{
                  color: isMe ? 'primary.contrastText' : 'text.secondary',
                  opacity: 0.7,
                }}
              >
                {formatTime(message.createdAt)}
              </Typography>

              {isMe && (
                <Typography variant="caption" sx={{ color: 'primary.contrastText', opacity: 0.7, ml: 1 }}>
                  {message.isRead ? '✓✓' : '✓'}
                </Typography>
              )}
            </Box>
          </Paper>
        </Box>
      </ListItem>
    );
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ width: 40, height: 40 }}>{room?.title?.charAt(0).toUpperCase() ?? 'C'}</Avatar>
          <Box>
            <Typography variant="h6">{room?.title ?? 'Chat Room'}</Typography>
            <Typography variant="caption" color="text.secondary">
              {room?.type.replace('_', ' ').toLowerCase()}
            </Typography>
          </Box>
        </Box>

        <Box>
          <Tooltip title="Voice call">
            <IconButton size="small">
              <PhoneIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Video call">
            <IconButton size="small">
              <VideoCallIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto', p: 1 }}>
        <List sx={{ p: 0 }}>{allMessages.map(renderMessage)}</List>

        {roomTypingUsers.length > 0 && (
          <Box sx={{ p: 2, textAlign: 'left' }}>
            <Typography variant="caption" color="text.secondary">
              {roomTypingUsers.map(u => u.userId).join(', ')} {roomTypingUsers.length === 1 ? 'is' : 'are'} typing...
            </Typography>
          </Box>
        )}

        <Box ref={messagesEndRef} />
      </Box>

      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            placeholder="Type a message..."
            value={messageInput}
            onChange={e => setMessageInput(e.target.value)}
            onKeyDown={handleKeyDown}
            variant="outlined"
            size="small"
          />

          <IconButton size="small" color="primary">
            <AttachFileIcon />
          </IconButton>

          <IconButton size="small" color="primary">
            <EmojiIcon />
          </IconButton>

          <IconButton onClick={handleSendMessage} disabled={messageInput.trim() === '' || isSending} color="primary">
            {isSending ? <CircularProgress size={24} /> : <SendIcon />}
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};
