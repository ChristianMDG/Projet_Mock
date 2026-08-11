import { useState } from 'react';
import { Crafter } from '@/types';
import {
  useCreateCrafter,
  useDeleteCrafterByKoperative,
  useGetCraftersByKoperative,
  useUpdateCrafter,
} from '@/hooks/crafter.hooks';

interface UseCrafterListProps {
  koperativeId: number;
}

interface DeleteDialogState {
  open: boolean;
  crafter: Crafter | null;
}

export const useCrafterList = ({ koperativeId }: UseCrafterListProps) => {
  const [selectedCrafter, setSelectedCrafter] = useState<Crafter | undefined>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({
    open: false,
    crafter: null,
  });

  // Data fetching
  const { data: crafters = [], isLoading, error } = useGetCraftersByKoperative(koperativeId);

  // Mutations
  const createMutation = useCreateCrafter();
  const updateMutation = useUpdateCrafter();
  const deleteMutation = useDeleteCrafterByKoperative(koperativeId);

  // Handlers
  const handleCreateCrafter = () => {
    setSelectedCrafter(undefined);
    setIsFormOpen(true);
  };

  const handleEditCrafter = (crafter: Crafter) => {
    setSelectedCrafter(crafter);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedCrafter(undefined);
  };

  const handleDeleteCrafter = (crafter: Crafter) => {
    if (!crafter.id) return;
    setDeleteDialog({ open: true, crafter });
  };

  const handleDeleteConfirm = async () => {
    if (deleteDialog.crafter?.id) {
      try {
        await deleteMutation.mutateAsync(deleteDialog.crafter.id);
      } catch (error) {
        console.error('Failed to delete crafter:', error);
      }
    }
    setDeleteDialog({ open: false, crafter: null });
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, crafter: null });
  };

  const handleFormSubmit = async (crafterData: Partial<Crafter>) => {
    setFormError(null);
    try {
      if (selectedCrafter?.id) {
        await updateMutation.mutateAsync({ id: selectedCrafter.id, data: crafterData });
      } else {
        await createMutation.mutateAsync(crafterData);
      }
      handleCloseForm();
    } catch (error: unknown) {
      setFormError(error instanceof Error ? error.message : 'Error occurred while saving');
    }
  };

  return {
    // Data
    crafters,
    isLoading,
    error,
    selectedCrafter,
    isFormOpen,
    formError,
    deleteDialog,

    // Mutations state
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,

    // Handlers
    handleCreateCrafter,
    handleEditCrafter,
    handleCloseForm,
    handleDeleteCrafter,
    handleDeleteConfirm,
    handleDeleteCancel,
    handleFormSubmit,
  };
};
