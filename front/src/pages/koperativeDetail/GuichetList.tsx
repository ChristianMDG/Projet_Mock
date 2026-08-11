import React from 'react';
import { Box } from '@mui/material';
import { Guichet, Koperative } from '@/types';
import GuichetForm from './GuichetForm';
import { OperatorFormDrawer } from './OperatorFormDrawer';
import { useTranslation } from 'react-i18next';
import { useGuichetList } from '@/hooks/guichet-list.hook';
import { GuichetDeleteDialog, GuichetListContent, GuichetListHeader } from '@/components/guichet';
import useGuichetListStore from '@/stores/guichet-list.store';

interface GuichetListProps {
  guichets: Guichet[];
  koperative: Koperative;
}

const GuichetList: React.FC<GuichetListProps> = ({ guichets, koperative }) => {
  const { t } = useTranslation();

  // --- ZUSTAND STATE FOR OPERATOR FORM ---
  const { modals, selectedItems, openOperatorForm, closeOperatorForm } = useGuichetListStore();

  const {
    // Data
    selectedGuichet,
    isFormOpen,
    deleteDialog,
    formMode,

    // Mutations state
    isDeleting,

    // Handlers
    handleCreateGuichet,
    handleEditGuichet,
    handleCloseForm,
    handleDeleteGuichet,
    handleDeleteConfirm,
    handleDeleteCancel,
  } = useGuichetList({ koperativeId: koperative.id! });

  // --- OPTIMIZED HANDLERS ---
  const handleAddNewOperator = () => {
    openOperatorForm();
  };

  const handleAddOperatorToGuichet = (guichet: Guichet) => {
    openOperatorForm(guichet);
  };

  return (
    <Box>
      {/* Header */}
      <GuichetListHeader t={t} onCreateGuichet={handleCreateGuichet} onCreateOperator={handleAddNewOperator} />

      {/* Content */}
      <GuichetListContent
        guichets={guichets}
        isDeleting={isDeleting}
        t={t}
        onEdit={handleEditGuichet}
        onDelete={handleDeleteGuichet}
        onAssignOperator={handleAddOperatorToGuichet}
      />

      {/* Guichet Form */}
      <GuichetForm
        open={isFormOpen}
        onClose={handleCloseForm}
        koperativeId={koperative.id!}
        initialData={selectedGuichet}
        mode={formMode}
      />

      {/* Delete Confirmation Dialog */}
      <GuichetDeleteDialog
        open={deleteDialog.open}
        guichet={deleteDialog.guichet}
        isDeleting={isDeleting}
        t={t}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />

      {/* Operator Form Drawer */}
      <OperatorFormDrawer
        open={modals.operatorForm.open}
        onClose={closeOperatorForm}
        initialData={{
          koperative: koperative,
          ...(selectedItems.guichet && { guichets: [selectedItems.guichet] }),
        }}
      />
    </Box>
  );
};

export default GuichetList;
