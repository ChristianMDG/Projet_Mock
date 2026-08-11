import { useState } from 'react';
import { Guichet } from '@/types';
import { useCreateGuichet, useDeleteGuichet, useUpdateGuichet } from '@/hooks/guichet.hooks';

interface UseGuichetListProps {
  koperativeId: number;
}

interface DeleteDialogState {
  open: boolean;
  guichet: Guichet | null;
}

export const useGuichetList = ({ koperativeId }: UseGuichetListProps) => {
  const [selectedGuichet, setSelectedGuichet] = useState<Guichet | undefined>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({
    open: false,
    guichet: null,
  });
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  // Mutations
  const createMutation = useCreateGuichet(koperativeId);
  const updateMutation = useUpdateGuichet(koperativeId);
  const deleteMutation = useDeleteGuichet(koperativeId);

  // Handlers
  const handleCreateGuichet = () => {
    setSelectedGuichet(undefined);
    setFormMode('create');
    setIsFormOpen(true);
  };

  const handleEditGuichet = (guichet: Guichet) => {
    setSelectedGuichet(guichet);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedGuichet(undefined);
    setFormError(null);
  };

  const handleDeleteGuichet = (guichet: Guichet) => {
    if (!guichet.id) return;
    setDeleteDialog({ open: true, guichet });
  };

  const handleDeleteConfirm = async () => {
    if (deleteDialog.guichet?.id) {
      try {
        await deleteMutation.mutateAsync(deleteDialog.guichet);
      } catch (error) {
        console.error('Failed to delete guichet:', error);
      }
    }
    setDeleteDialog({ open: false, guichet: null });
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, guichet: null });
  };

  const handleFormSubmit = async (guichetData: Partial<Guichet>) => {
    setFormError(null);
    try {
      if (selectedGuichet?.id) {
        await updateMutation.mutateAsync({ id: selectedGuichet.id, guichet: guichetData });
      } else {
        await createMutation.mutateAsync(guichetData);
      }
      handleCloseForm();
    } catch (error: unknown) {
      setFormError(error instanceof Error ? error.message : 'Error occurred while saving');
    }
  };

  return {
    // Data
    selectedGuichet,
    isFormOpen,
    formError,
    deleteDialog,
    formMode,

    // Mutations state
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,

    // Handlers
    handleCreateGuichet,
    handleEditGuichet,
    handleCloseForm,
    handleDeleteGuichet,
    handleDeleteConfirm,
    handleDeleteCancel,
    handleFormSubmit,
  };
};
