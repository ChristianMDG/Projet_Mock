import React from 'react';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { UserOperator } from '@/types';
import { OperatorForm } from '@/components/operator';

interface OperatorFormDrawerProps {
  open: boolean;
  onClose: () => void;
  initialData?: Partial<UserOperator>;
}

export const OperatorFormDrawer: React.FC<OperatorFormDrawerProps> = ({ open, onClose, initialData }) => {
  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      onOpen={() => {}}
      disableSwipeToOpen={false}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%' },
          maxWidth: 600,
          margin: '0 auto',
          bgcolor: 'inherit',
        },
      }}
    >
      <OperatorForm initialData={initialData} onClose={onClose} />
    </SwipeableDrawer>
  );
};
