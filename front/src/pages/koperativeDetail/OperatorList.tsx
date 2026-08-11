import React, { useState } from 'react';
import { Box } from '@mui/material';
import { Koperative, UserOperator } from '@/types';
import { OperatorFormDrawer } from './OperatorFormDrawer';
import { useTranslation } from 'react-i18next';
import { OperatorListContent, OperatorListHeader } from '@/components/operator';

interface OperatorListProps {
  operators: UserOperator[];
  koperative: Koperative;
}

const OperatorList: React.FC<OperatorListProps> = ({ operators, koperative }) => {
  const { t } = useTranslation();
  const [operatorDrawerOpen, setOperatorDrawerOpen] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState<UserOperator | null>(null);

  const handleAddNew = () => {
    setSelectedOperator(null);
    setOperatorDrawerOpen(true);
  };

  const handleEdit = (operator: UserOperator) => {
    setSelectedOperator(operator);
    setOperatorDrawerOpen(true);
  };

  return (
    <Box>
      {/* Header */}
      <OperatorListHeader t={t} onCreateOperator={handleAddNew} />

      {/* Content */}
      <OperatorListContent operators={operators} t={t} onEdit={handleEdit} />

      {/* Operator Form Drawer */}
      <OperatorFormDrawer
        open={operatorDrawerOpen}
        onClose={() => setOperatorDrawerOpen(false)}
        initialData={selectedOperator ?? { koperative }}
      />
    </Box>
  );
};

export default OperatorList;
