import React from 'react';
import { Box, ListItemButton, ListItemAvatar, ListItemText, Skeleton } from '@mui/material';

const ChatRoomListSkeleton: React.FC = () => (
  <Box>
    {Array.from({ length: 5 }).map((_, index) => (
      <ListItemButton key={index} sx={{ py: 2 }}>
        <ListItemAvatar>
          <Skeleton variant="circular" width={40} height={40} />
        </ListItemAvatar>
        <ListItemText
          primary={<Skeleton variant="text" width="60%" />}
          secondary={<Skeleton variant="text" width="80%" />}
        />
        <Box sx={{ ml: 1 }}>
          <Skeleton variant="text" width={30} />
        </Box>
      </ListItemButton>
    ))}
  </Box>
);

export default ChatRoomListSkeleton;
