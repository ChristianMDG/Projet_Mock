import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { Box, Typography, TextField, IconButton, Avatar, Paper, CircularProgress, Chip, Divider } from '@mui/material';
import { Send as SendIcon, ArrowBack as ArrowBackIcon, Close as CloseIcon } from '@mui/icons-material';
import { ChatRoom, ChatRoomType, Message } from '@/models';
import { useMessaging } from '@/hooks/messaging.hook';
import MessageItem from './MessageItem';
import { isSameDay, formatMessageDate } from './utils';

interface MessagesPaneProps {
  chat: ChatRoom;
  onBack?: () => void;
}

function roomTypeLabel(type: ChatRoomType, t: (k: string) => string): string {
  if (type === ChatRoomType.CUSTOMER_SUPPORT) return t(Labels.msg_room_support);
  if (type === ChatRoomType.VOYAGE_CHAT) return t(Labels.msg_room_voyage);
  return t(Labels.msg_room_general);
}

interface MessageGroup {
  messages: Message[];
  senderId: string;
}

function groupMessages(
  messages: Message[]
): Array<{ type: 'divider'; date: string } | { type: 'group'; group: MessageGroup }> {
  const result: Array<{ type: 'divider'; date: string } | { type: 'group'; group: MessageGroup }> = [];
  let lastDate: string | null = null;
  let currentGroup: MessageGroup | null = null;

  for (const msg of messages) {
    const msgDate = msg.createdAt;

    if (!lastDate || !isSameDay(lastDate, msgDate)) {
      if (currentGroup) {
        result.push({ type: 'group', group: currentGroup });
        currentGroup = null;
      }
      result.push({ type: 'divider', date: msgDate });
      lastDate = msgDate;
    }

    if (!currentGroup) {
      currentGroup = { messages: [msg], senderId: msg.senderId };
    } else {
      const last = currentGroup.messages[currentGroup.messages.length - 1];
      const timeDiff = new Date(msgDate).getTime() - new Date(last.createdAt).getTime();
      const sameGroupSender = msg.senderId === currentGroup.senderId && timeDiff < 5 * 60000;

      if (sameGroupSender) {
        currentGroup.messages.push(msg);
      } else {
        result.push({ type: 'group', group: currentGroup });
        currentGroup = { messages: [msg], senderId: msg.senderId };
      }
    }
  }

  if (currentGroup) {
    result.push({ type: 'group', group: currentGroup });
  }

  return result;
}

export default function MessagesPane({ chat, onBack }: MessagesPaneProps) {
  const { t } = useTranslation();
  const {
    messages,
    isConnected,
    loading,
    typingIndicators,
    selectedRoomId,
    closeRoom,
    sendMessage,
    setSelectedRoomId,
  } = useMessaging();

  const [textValue, setTextValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior });
    }, 100);
  }, []);

  useEffect(() => {
    if (chat?.roomId && chat.roomId !== selectedRoomId) {
      setSelectedRoomId(chat.roomId);
    }
  }, [chat, selectedRoomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const trimmedValue = textValue.trim();
    if (trimmedValue && isConnected) {
      try {
        await sendMessage(trimmedValue);
        setTextValue('');
        scrollToBottom();
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleClose = async () => {
    if (chat?.roomId) {
      closeRoom(chat.roomId);
    }
  };

  const typingUsers = typingIndicators.filter((ti) => ti.isTyping).map((ti) => ti.userId);
  const grouped = groupMessages(messages);

  if (loading && messages.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <Paper elevation={0} square sx={{ borderBottom: 1, borderColor: 'divider', flexShrink: 0, px: 2, py: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <IconButton size="small" onClick={onBack} sx={{ display: { md: 'none' } }}>
            <ArrowBackIcon />
          </IconButton>
          <Avatar sx={{ width: 36, height: 36, fontSize: '0.875rem' }}>
            {(chat.title || chat.roomId).charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle1" noWrap sx={{ fontWeight: 600 }}>
              {chat.title || chat.roomId}
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
          <IconButton size="small" onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Paper>

      {/* Messages Area */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
          bgcolor: 'background.default',
        }}
      >
        {messages.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Typography color="text.secondary">{t(Labels.msg_no_messages)}</Typography>
          </Box>
        ) : (
          <>
            {grouped.map((item, idx) => {
              if (item.type === 'divider') {
                return (
                  <Box key={`divider-${idx}`} sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 1.5 }}>
                    <Divider sx={{ flex: 1 }} />
                    <Typography variant="caption" sx={{ color: 'text.secondary', whiteSpace: 'nowrap', px: 1 }}>
                      {formatMessageDate(item.date)}
                    </Typography>
                    <Divider sx={{ flex: 1 }} />
                  </Box>
                );
              }

              const { group } = item;
              return group.messages.map((message, msgIdx) => {
                const isFirstInGroup = msgIdx === 0;
                const isLastInGroup = msgIdx === group.messages.length - 1;
                const showAvatar = !message.isFromCurrent && isLastInGroup;

                return (
                  <MessageItem
                    key={message.messageId || `${idx}-${msgIdx}`}
                    message={message}
                    showAvatar={showAvatar}
                    isLastInGroup={isLastInGroup}
                    isFirstInGroup={isFirstInGroup}
                  />
                );
              });
            })}
            <Box ref={messagesEndRef} />
          </>
        )}
      </Box>

      {/* Typing Indicator */}
      <Box sx={{ px: 2, py: 0.5, minHeight: 24 }}>
        {typingUsers.length > 0 && (
          <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            {typingUsers.length === 1
              ? t(Labels.msg_typing_one, { user: typingUsers[0] })
              : t(Labels.msg_typing_many, { count: typingUsers.length })}
          </Typography>
        )}
      </Box>

      {/* Input Area */}
      <Box sx={{ flexShrink: 0, p: 1.5, borderTop: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            size="small"
            placeholder={t(Labels.msg_input_placeholder)}
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!isConnected}
          />
          <IconButton color="primary" onClick={handleSend} disabled={!textValue.trim() || !isConnected}>
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
