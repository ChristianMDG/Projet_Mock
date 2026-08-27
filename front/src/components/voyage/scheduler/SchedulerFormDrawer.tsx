import React from 'react';
import { SwipeableDrawer } from '@mui/material';
import { Ville } from '@/models/Ville';
import { Voyage } from '@/models/Voyage';
import SchedulerForm from './SchedulerForm';

export type { ClasseEntry } from './SchedulerForm';

interface SchedulerFormDrawerProps {
  open: boolean;
  onClose: () => void;
  koperativeId: number;
  initialData?: Partial<Voyage>;
  departureVille?: Ville | null;
  arrivalVille?: Ville | null;
  onSuccess?: (voyages: Voyage[]) => void;
}

const SchedulerFormDrawer: React.FC<SchedulerFormDrawerProps> = ({
  open,
  onClose,
  koperativeId,
  initialData,
  departureVille,
  arrivalVille,
  onSuccess,
}) => {
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
          maxWidth: 875,
          margin: '0 auto',
          bgcolor: 'inherit',
        },
      }}
    >
      <SchedulerForm
        onClose={onClose}
        koperativeId={koperativeId}
        initialData={initialData}
        departureVille={departureVille}
        arrivalVille={arrivalVille}
        onSuccess={onSuccess}
      />
    </SwipeableDrawer>
  );
};

export default SchedulerFormDrawer;
