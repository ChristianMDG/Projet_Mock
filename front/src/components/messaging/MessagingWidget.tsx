import React, { useEffect } from 'react';
import { Box, Paper, useTheme, useMediaQuery, Fab, Badge, Tooltip } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import { ChatSidebar } from './ChatSidebar';
import { ChatRoom } from './ChatRoom';
import { MobileMessagingWidget } from './MobileMessagingWidget';
import { useMessagingInterface } from '@/hooks/messaging.hook';

export const MessagingWidget: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const {
    isConnected,
    isConnecting,
    currentRoomId,
    rooms,
    isChatOpen,
    isSidebarOpen,
    connect,
    setCurrentRoom,
    toggleChat,
    toggleSidebar,
    closeChat,
  } = useMessagingInterface();

  const totalUnreadCount = rooms.reduce((total, room) => total + room.unreadCount, 0);

  useEffect(() => {
    if (isConnected === false && isConnecting === false) {
      connect();
    }
  }, [isConnected, isConnecting, connect]);

  useEffect(() => {
    if (isMobile && currentRoomId && isSidebarOpen) {
      toggleSidebar();
    }
  }, [currentRoomId, isMobile, isSidebarOpen, toggleSidebar]);

  const handleRoomSelect = (roomId: string) => {
    setCurrentRoom(roomId);
  };

  const handleBackToSidebar = () => {
    if (isMobile) {
      setCurrentRoom(null);
      if (isSidebarOpen === false) {
        toggleSidebar();
      }
    }
  };

  if (isChatOpen === false) {
    return (
      <Tooltip title="Open chat" placement="left">
        <Fab
          color="primary"
          onClick={toggleChat}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: theme.zIndex.speedDial,
          }}
        >
          <Badge badgeContent={totalUnreadCount} color="error" max={99}>
            <ChatIcon />
          </Badge>
        </Fab>
      </Tooltip>
    );
  }

  if (isMobile) {
    return (
      <MobileMessagingWidget
        isSidebarOpen={isSidebarOpen}
        isChatOpen={isChatOpen}
        currentRoomId={currentRoomId}
        totalUnreadCount={totalUnreadCount}
        onRoomSelect={handleRoomSelect}
        onToggleSidebar={toggleSidebar}
        onToggleChat={toggleChat}
        onBackToSidebar={handleBackToSidebar}
      />
    );
  }

  return (
    <Paper
      elevation={8}
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        width: 800,
        height: 600,
        borderRadius: 2,
        overflow: 'hidden',
        display: 'flex',
        zIndex: theme.zIndex.modal,
        backgroundColor: 'background.paper',
      }}
    >
      <Box
        sx={{
          width: isSidebarOpen ? 320 : 0,
          transition: 'width 0.3s ease',
          overflow: 'hidden',
        }}
      >
        <ChatSidebar onRoomSelect={handleRoomSelect} selectedRoomId={currentRoomId} />
      </Box>

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1,
          }}
        >
          <Tooltip title="Close chat">
            <Fab
              size="small"
              onClick={closeChat}
              sx={{
                width: 32,
                height: 32,
                minHeight: 32,
                backgroundColor: 'action.hover',
                '&:hover': {
                  backgroundColor: 'action.selected',
                },
              }}
            >
              <CloseIcon fontSize="small" />
            </Fab>
          </Tooltip>
        </Box>

        {currentRoomId ? (
          <ChatRoom roomId={currentRoomId} />
        ) : (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 3,
              textAlign: 'center',
              color: 'text.secondary',
            }}
          >
            <Box>
              <ChatIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
              <div>Select a conversation to start messaging</div>
            </Box>
          </Box>
        )}
      </Box>
    </Paper>
  );
};
