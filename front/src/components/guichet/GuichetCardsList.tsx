import React from 'react';
import { Box } from '@mui/material';
import { Guichet } from '@/types';
import { GuichetCard } from '@/components/guichet';

interface GuichetCardsListProps {
  guichets: Guichet[];
  isDeleting: boolean;
  t: (key: string) => string;
  onEdit: (guichet: Guichet) => void;
  onDelete: (guichet: Guichet) => void;
  onAssignOperator: (guichet: Guichet) => void;
}

const GuichetCardsList: React.FC<GuichetCardsListProps> = ({
  guichets,
  isDeleting,
  t,
  onEdit,
  onDelete,
  onAssignOperator,
}) => (
  <Box>
    {guichets.map(guichet => (
      <GuichetCard
        key={guichet.id}
        guichet={guichet}
        onEdit={onEdit}
        onDelete={onDelete}
        onAssignOperator={onAssignOperator}
        isDeleting={isDeleting}
        t={t}
      />
    ))}
  </Box>
);

export default GuichetCardsList;
