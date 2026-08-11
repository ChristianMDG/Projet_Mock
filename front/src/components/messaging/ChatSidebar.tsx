import React from 'react';
import {
  Box,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Divider,
  IconButton,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon, Support as SupportIcon } from '@mui/icons-material';
import { useMessagingInterface } from '@/hooks/messaging.hook';
import ChatRoomListSkeleton from '@/skeleton/ChatRoomListSkeleton';
import { ChatRoomItem } from './ChatRoomItem';

interface ChatSidebarProps {
  onRoomSelect: (roomId: string) => void;
  selectedRoomId?: string | null;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ onRoomSelect, selectedRoomId }) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const { rooms, isLoadingRooms, createSupportRoom, isCreatingRoom } = useMessagingInterface();

  const filteredRooms = rooms.filter(
    room =>
      room.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleCreateSupportRoom = async () => {
    try {
      const room = await createSupportRoom();
      onRoomSelect(room.roomId);
    } catch (error) {
      console.error('Failed to create support room:', error);
    }
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRight: 1,
        borderColor: 'divider',
        backgroundColor: 'background.paper',
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Typography variant="h6">Messages</Typography>
          <IconButton onClick={handleCreateSupportRoom} disabled={isCreatingRoom} size="small" color="primary">
            <AddIcon />
          </IconButton>
        </Box>

        {/* Search */}
        <TextField
          fullWidth
          size="small"
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      {/* Quick actions */}
      <Box sx={{ p: 1 }}>
        <ListItemButton onClick={handleCreateSupportRoom} disabled={isCreatingRoom} sx={{ borderRadius: 1, mb: 1 }}>
          <ListItemAvatar>
            <Avatar sx={{ backgroundColor: 'success.main' }}>
              <SupportIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Contact Support" secondary="Get help from our team" />
        </ListItemButton>
        <Divider />
      </Box>

      {/* Room list */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List sx={{ p: 0 }}>
          {isLoadingRooms ? (
            <ChatRoomListSkeleton />
          ) : (
            <>
              {filteredRooms.length > 0 ? (
                filteredRooms.map(room => (
                  <ChatRoomItem
                    key={room.roomId}
                    room={room}
                    selectedRoomId={selectedRoomId}
                    onRoomSelect={onRoomSelect}
                  />
                ))
              ) : (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    {searchQuery ? 'No conversations found' : 'No conversations yet'}
                  </Typography>
                  {!searchQuery && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Start a conversation by contacting support
                    </Typography>
                  )}
                </Box>
              )}
            </>
          )}
        </List>
      </Box>
    </Box>
  );
};
