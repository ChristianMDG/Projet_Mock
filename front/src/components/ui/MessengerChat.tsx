import React, { useEffect, useState } from 'react';
import {
  Box,
  Fab,
  Paper,
  Typography,
  IconButton,
  TextField,
  Avatar,
  Zoom,
  Fade,
  List,
  ListItem,
  ListItemAvatar,
  Divider,
  Badge,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import SmsIcon from '@mui/icons-material/Sms';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { useMessenger } from '@/hooks/messenger.hook';
import { useMessagingStore } from '@/stores/messaging.store';
import dayjs from '@/utils/dayjs';

const formatTime = (date: Date) => {
  return dayjs(date).format('HH:mm');
};

const MessengerChat: React.FC = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [message, setMessage] = useState('');
  const { messages, roomId, sendMessage, markAsRead } = useMessenger();
  const { navigatorRoom } = useMessagingStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleToggle = () => {
    const nextOpen = !isOpen;
    setIsOpen(nextOpen);
    if (nextOpen && roomId) {
      markAsRead().then();
    }
  };

  const handleSendMessage = async () => {
    if (message.trim()) {
      await sendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Send message with Ctrl+Enter or Cmd+Enter
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSendMessage().then();
    }
  };

  return isMounted ? (
    <Box
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 1300,
      }}
    >
      {/* Chat Window */}
      <Fade in={isOpen}>
        <Paper
          elevation={8}
          sx={{
            position: 'absolute',
            bottom: 80,
            right: 0,
            width: { xs: 'calc(100vw - 48px)', sm: 380 },
            maxWidth: 380,
            height: 500,
            maxHeight: 'calc(100vh - 150px)',
            display: isOpen ? 'flex' : 'none',
            flexDirection: 'column',
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          {/* Agent Info */}
          <Box
            sx={{
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              padding: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    bgcolor: 'success.main',
                    borderRadius: '50%',
                    border: '1px solid white',
                  }}
                />
              }
            >
              <Avatar sx={{ bgcolor: 'secondary.main', color: 'primary.main' }}>
                <SupportAgentIcon />
              </Avatar>
            </Badge>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {t(Labels.messenger_status)}
            </Typography>
            <IconButton size="small" onClick={handleToggle} sx={{ color: 'inherit' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Messages */}
          <List
            sx={{
              flex: 1,
              overflow: 'auto',
              bgcolor: 'grey.50',
              p: 2,
            }}
          >
            {messages.map(({ messageId, content, createdAt, senderId }) => {
              const isMe = senderId === navigatorRoom.senderId;
              return (
                <ListItem
                  key={messageId}
                  sx={{
                    flexDirection: isMe ? 'row-reverse' : 'row',
                    alignItems: 'end',
                    gap: 1,
                    px: 0,
                    py: 0.5,
                  }}
                >
                  {!isMe && (
                    <ListItemAvatar sx={{ minWidth: 32 }}>
                      <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.main' }}>
                        <SupportAgentIcon sx={{ fontSize: 16 }} />
                      </Avatar>
                    </ListItemAvatar>
                  )}
                  <Paper
                    elevation={0}
                    sx={{
                      p: '8px 12px',
                      maxWidth: '75%',
                      bgcolor: isMe ? 'grey.200' : 'primary.main',
                      color: isMe ? 'secondary.contrastText' : 'primary.contrastText',
                      borderRadius: '18px',
                      borderBottomLeftRadius: isMe ? 18 : 4,
                      borderBottomRightRadius: isMe ? 4 : 18,
                      position: 'relative',
                      wordBreak: 'break-word',
                    }}
                  >
                    <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                      {content.startsWith('chat_') || content.startsWith('enum_') || content.startsWith('ui_')
                        ? t(content as keyof typeof Labels)
                        : content}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        mt: 0.5,
                        fontSize: '0.65rem',
                        opacity: 0.8,
                        textAlign: 'right',
                        width: '100%',
                      }}
                    >
                      {formatTime(dayjs(createdAt).toDate())}
                    </Typography>
                  </Paper>
                </ListItem>
              );
            })}
          </List>

          <Divider />

          {/* Input */}
          <Box
            sx={{
              p: 2,
              gap: 1,
              bgcolor: 'background.paper',
              alignItems: 'center',
              display: 'flex',
            }}
          >
            <TextField
              fullWidth
              multiline
              minRows={3}
              maxRows={6}
              placeholder={t(Labels.messenger_placeholder)}
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
            />
            <IconButton
              color="primary"
              onClick={handleSendMessage}
              disabled={!message.trim()}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
                '&.Mui-disabled': {
                  bgcolor: 'grey.300',
                  color: 'grey.500',
                },
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      </Fade>

      {/* Floating Action Button */}
      <Zoom in={isMounted}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {!isOpen && (
            <Fade in={!isOpen}>
              <Paper
                elevation={4}
                sx={{
                  px: 1,
                  borderRadius: 4,
                  boxShadow: 4,
                  border: '2px solid',
                  borderColor: 'primary.main',
                }}
              >
                <Typography
                  variant="button"
                  sx={{
                    fontSize: 13,
                  }}
                >
                  {t(Labels.messenger_support_label)}
                </Typography>
              </Paper>
            </Fade>
          )}
          <Fab
            color="primary"
            aria-label={t(Labels.messenger_open_chat)}
            onClick={handleToggle}
            sx={{
              border: 2,
              boxShadow: 4,
              borderColor: 'secondary.main',
              '&:hover': {
                transform: 'scale(1.05)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            {isOpen ? <CloseIcon /> : <SmsIcon />}
          </Fab>
        </Box>
      </Zoom>
    </Box>
  ) : null;
};

export default MessengerChat;
