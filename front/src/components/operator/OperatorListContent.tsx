import React from 'react';
import { Card, Typography } from '@mui/material';
import { UserOperator } from '@/types';
import Labels from '@/labelKeys.json';
import OperatorCardsList from './OperatorCardsList';

interface OperatorListContentProps {
  operators: UserOperator[];
  t: (key: string) => string;
  onEdit: (operator: UserOperator) => void;
}

const OperatorListContent: React.FC<OperatorListContentProps> = ({ operators, t, onEdit }) => {
  if (operators.length === 0) {
    return (
      <Card sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary" variant="h4">
          {t(Labels.operator_list_no_operators)}
        </Typography>
        <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>
          {t(Labels.operator_list_no_operators_description)}
        </Typography>
      </Card>
    );
  }

  return <OperatorCardsList operators={operators} t={t} onEdit={onEdit} />;
};

export default OperatorListContent;
