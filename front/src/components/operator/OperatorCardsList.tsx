import React from 'react';
import { Grid } from '@mui/material';
import { UserOperator } from '@/types';
import OperatorCard from './OperatorCard';

interface OperatorCardsListProps {
  operators: UserOperator[];
  t: (key: string) => string;
  onEdit: (operator: UserOperator) => void;
}

const OperatorCardsList: React.FC<OperatorCardsListProps> = ({ operators, t, onEdit }) => (
  <Grid container spacing={2}>
    {operators.map(operator => (
      <Grid key={operator.id} size={{ xs: 12, sm: 6, md: 4 }}>
        <OperatorCard operator={operator} t={t} onEdit={onEdit} />
      </Grid>
    ))}
  </Grid>
);

export default OperatorCardsList;
