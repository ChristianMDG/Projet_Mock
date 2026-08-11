import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { Guichet } from '@/types';
import Labels from '@/labelKeys.json';
import { GuichetCardsList } from '@/components/guichet';

interface GuichetListContentProps {
  guichets: Guichet[];
  isDeleting: boolean;
  t: (key: string) => string;
  onEdit: (guichet: Guichet) => void;
  onDelete: (guichet: Guichet) => void;
  onAssignOperator: (guichet: Guichet) => void;
}

const GuichetListContent: React.FC<GuichetListContentProps> = ({
  guichets,
  isDeleting,
  t,
  onEdit,
  onDelete,
  onAssignOperator,
}) => {
  if (guichets.length === 0) {
    return (
      <Card sx={{ textAlign: 'center', my: 2 }}>
        <CardContent>
          <Typography color="text.secondary" variant="h6">
            {t(Labels.guichet_list_no_guichets)}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            {t(Labels.guichet_list_no_guichets_description)}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <GuichetCardsList
      t={t}
      onEdit={onEdit}
      onDelete={onDelete}
      guichets={guichets}
      isDeleting={isDeleting}
      onAssignOperator={onAssignOperator}
    />
  );
};

export default GuichetListContent;
