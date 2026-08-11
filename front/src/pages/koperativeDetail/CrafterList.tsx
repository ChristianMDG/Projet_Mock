import React from 'react';
import { Box } from '@mui/material';

import { useTranslation } from 'react-i18next';
import { useCrafterList } from '@/hooks/crafter-list.hook';
import CrafterForm from './CrafterForm';
import { CrafterDeleteDialog, CrafterListContent, CrafterListHeader } from '@/components/crafter';

interface CrafterListProps {
  koperativeId: number;
}

const CrafterList: React.FC<CrafterListProps> = ({ koperativeId }) => {
  const { t } = useTranslation();

  const {
    // Data
    crafters,
    isLoading,
    error,
    selectedCrafter,
    isFormOpen,
    formError,
    deleteDialog,

    // Mutations state
    isDeleting,

    // Handlers
    handleCreateCrafter,
    handleEditCrafter,
    handleCloseForm,
    handleDeleteCrafter,
    handleDeleteConfirm,
    handleDeleteCancel,
    handleFormSubmit,
  } = useCrafterList({ koperativeId });

  return (
    <Box>
      {/* Header */}
      <CrafterListHeader t={t} onCreateCrafter={handleCreateCrafter} />

      {/* Content */}
      <CrafterListContent
        crafters={crafters}
        isLoading={isLoading}
        error={error}
        isDeleting={isDeleting}
        t={t}
        onEdit={handleEditCrafter}
        onDelete={handleDeleteCrafter}
      />

      {/* Form Modal */}
      <CrafterForm
        open={isFormOpen}
        onClose={handleCloseForm}
        koperativeId={koperativeId}
        initialData={selectedCrafter}
        mode={selectedCrafter ? 'edit' : 'create'}
        onSubmit={handleFormSubmit}
        loading={isLoading}
        error={formError}
      />

      {/* Delete Confirmation Dialog */}
      <CrafterDeleteDialog
        open={deleteDialog.open}
        crafter={deleteDialog.crafter}
        isDeleting={isDeleting}
        t={t}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </Box>
  );
};

export default CrafterList;
