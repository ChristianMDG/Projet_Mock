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
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
  SvgIcon,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import SmsIcon from '@mui/icons-material/Sms';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { FaFacebookMessenger } from 'react-icons/fa';
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
  const [isDialOpen, setIsDialOpen] = useState(false);
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
              gap: 1.5,
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
              <Avatar sx={{ bgcolor: 'secondary.main', color: 'primary.main', width: 36, height: 36 }}>
                <SupportAgentIcon fontSize="small" />
              </Avatar>
            </Badge>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {t(Labels.messenger_status)}
            </Typography>

            <Box sx={{ flex: 1 }} />

            <IconButton size="small" onClick={handleToggle} sx={{ color: 'inherit', ml: 0.5 }}>
              <CloseIcon fontSize="small" />
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

      {/* Floating Action Button / SpeedDial */}
      <Zoom in={isMounted}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isOpen ? (
            <Fab
              color="primary"
              aria-label="Close"
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
              <CloseIcon />
            </Fab>
          ) : (
            <SpeedDial
              ariaLabel={t(Labels.chat_contact_options)}
              icon={<SpeedDialIcon icon={<SmsIcon />} />}
              onClose={() => setIsDialOpen(false)}
              onOpen={() => setIsDialOpen(true)}
              open={isDialOpen}
              direction="up"
              FabProps={{
                color: 'primary',
                sx: {
                  border: 2,
                  boxShadow: 4,
                  borderColor: 'secondary.main',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                  transition: 'all 0.2s ease-in-out',
                },
              }}
            >
              <SpeedDialAction
                icon={<SmsIcon color="primary" />}
                slotProps={{
                  tooltip: { title: t(Labels.messenger_open_chat), open: true },
                  staticTooltipLabel: {
                    sx: {
                      bgcolor: 'text.primary',
                      color: 'background.paper',
                      fontWeight: 500,
                      boxShadow: 2,
                      fontSize: '0.75rem',
                      px: 1,
                      py: 0.5,
                    },
                  },
                }}
                onClick={() => {
                  setIsDialOpen(false);
                  handleToggle();
                }}
              />
              <SpeedDialAction
                icon={<WhatsAppIcon sx={{ color: '#25D366' }} />}
                slotProps={{
                  tooltip: { title: t(Labels.chat_whatsapp), open: true },
                  staticTooltipLabel: {
                    sx: {
                      bgcolor: 'text.primary',
                      color: 'background.paper',
                      fontWeight: 500,
                      boxShadow: 2,
                      fontSize: '0.75rem',
                      px: 1,
                      py: 0.5,
                    },
                  },
                }}
                onClick={() => {
                  setIsDialOpen(false);
                  window.open('https://wa.me/261374107562', '_blank');
                }}
              />
              <SpeedDialAction
                icon={<SvgIcon component={FaFacebookMessenger} inheritViewBox sx={{ color: '#0084FF' }} />}
                slotProps={{
                  tooltip: { title: t(Labels.chat_messenger), open: true },
                  staticTooltipLabel: {
                    sx: {
                      bgcolor: 'text.primary',
                      color: 'background.paper',
                      fontWeight: 500,
                      boxShadow: 2,
                      fontSize: '0.75rem',
                      px: 1,
                      py: 0.5,
                    },
                  },
                }}
                onClick={() => {
                  setIsDialOpen(false);
                  window.open('https://m.me/61570079625295', '_blank');
                }}
              />
            </SpeedDial>
          )}
        </Box>
      </Zoom>
    </Box>
  ) : null;
};

export default MessengerChat;
