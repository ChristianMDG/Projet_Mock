import React from 'react';
import { Box } from '@mui/material';
import { Crafter } from '@/types';
import { CrafterCard } from '@/components/crafter';

interface CrafterCardsListProps {
  crafters: Crafter[];
  isDeleting: boolean;
  t: (key: string) => string;
  onEdit: (crafter: Crafter) => void;
  onDelete: (crafter: Crafter) => void;
}

const CrafterCardsList: React.FC<CrafterCardsListProps> = ({ crafters, isDeleting, t, onEdit, onDelete }) => (
  <Box>
    {crafters.map(crafter => (
      <CrafterCard
        key={crafter.id}
        crafter={crafter}
        onEdit={onEdit}
        onDelete={onDelete}
        isDeleting={isDeleting}
        t={t}
      />
    ))}
  </Box>
);

export default CrafterCardsList;
