import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, CircularProgress } from '@mui/material';
import { ChatRoom } from '@/models';
import { useMessaging } from '@/hooks/messaging.hook';
import { useAuthStore } from '@/stores/auth.store';
import MessagesHeader from './MessagesHeader';
import MessagesInput from './MessagesInput';
import MessageList from './MessageList';
import TypingIndicator from './TypingIndicator';
import { WHATSAPP_COLORS } from './constants';

interface MessagesPaneProps {
  chat: ChatRoom;
  onBack?: () => void;
}

import { groupMessages } from './utils';

export default function MessagesPane({ chat, onBack }: MessagesPaneProps) {
  const { t } = useTranslation();
  const { user } = useAuthStore();
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
  const filteredMessages = messages.filter((m) => m.content !== 'chat_support_welcome_message');
  const grouped = groupMessages(filteredMessages);

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
      <MessagesHeader chat={chat} t={t} isConnected={isConnected} onBack={onBack} handleClose={handleClose} />

      {/* Messages Area */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
          bgcolor: WHATSAPP_COLORS.bgChat,
        }}
      >
        <MessageList
          groupedMessages={grouped}
          messagesCount={filteredMessages.length}
          userId={user?.id}
          userPhone={user?.phone}
          messagesEndRef={messagesEndRef}
        />
      </Box>

      {/* Typing Indicator */}
      <TypingIndicator typingUsers={typingUsers} />

      {/* Input Area */}
      <MessagesInput
        textValue={textValue}
        setTextValue={setTextValue}
        handleKeyDown={handleKeyDown}
        handleSend={handleSend}
        isConnected={isConnected}
        t={t}
      />
    </Box>
  );
}
