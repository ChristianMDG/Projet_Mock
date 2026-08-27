import React from 'react';
import { Drawer, useTheme, Fab, Badge, Tooltip } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import { ChatSidebar } from './ChatSidebar';
import { ChatRoom } from './ChatRoom';

interface MobileMessagingWidgetProps {
  isSidebarOpen: boolean;
  isChatOpen: boolean;
  currentRoomId: string | null;
  totalUnreadCount: number;
  onRoomSelect: (roomId: string) => void;
  onToggleSidebar: () => void;
  onToggleChat: () => void;
  onBackToSidebar: () => void;
}

export const MobileMessagingWidget: React.FC<MobileMessagingWidgetProps> = ({
  isSidebarOpen,
  isChatOpen,
  currentRoomId,
  totalUnreadCount,
  onRoomSelect,
  onToggleSidebar,
  onToggleChat,
  onBackToSidebar,
}) => {
  const theme = useTheme();

  return (
    <>
      <Drawer
        open={isSidebarOpen && isChatOpen}
        onClose={onToggleSidebar}
        anchor="bottom"
        slotProps={{
          paper: {
            sx: {
              height: '80vh',
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
            },
          },
        }}
      >
        <ChatSidebar onRoomSelect={onRoomSelect} selectedRoomId={currentRoomId} />
      </Drawer>

      <Drawer
        open={currentRoomId !== null && isChatOpen}
        onClose={onBackToSidebar}
        anchor="bottom"
        slotProps={{
          paper: {
            sx: {
              height: '90vh',
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
            },
          },
        }}
      >
        {currentRoomId && <ChatRoom roomId={currentRoomId} />}
      </Drawer>

      <Tooltip title="Open chat" placement="left">
        <Fab
          color="primary"
          onClick={onToggleChat}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: theme.zIndex.speedDial,
          }}
        >
          <Badge badgeContent={totalUnreadCount} color="error" max={99}>
            {isChatOpen ? <CloseIcon /> : <ChatIcon />}
          </Badge>
        </Fab>
      </Tooltip>
    </>
  );
};
