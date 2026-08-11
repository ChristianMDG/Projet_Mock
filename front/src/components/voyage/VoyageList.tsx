import React from 'react';
import { Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Voyage } from '@/types';
import VoyageCard from './VoyageCard';
import VoyageListSkeleton from '@/skeleton/VoyageListSkeleton';
import Labels from '@/labelKeys.json';

interface VoyageListProps {
  voyages: Voyage[];
  loading?: boolean;
  error?: Error | null;
  selectedVoyage?: Voyage | null;
  onSelectVoyage?: (voyage: Voyage) => void;
}

export const VoyageList: React.FC<VoyageListProps> = ({
  voyages,
  loading = false,
  error = null,
  selectedVoyage = null,
  onSelectVoyage,
}) => {
  const { t } = useTranslation();

  if (loading) {
    return <VoyageListSkeleton count={3} />;
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error.message}
      </Alert>
    );
  }

  return (
    <>
      {voyages.length === 0 ? (
        <Alert severity="info">{t(Labels.voyage_list_no_voyages)}</Alert>
      ) : (
        <>
          {voyages.map(voyage => (
            <VoyageCard
              key={voyage.id}
              voyage={voyage}
              selected={selectedVoyage?.id === voyage.id}
              onSelect={onSelectVoyage}
            />
          ))}
        </>
      )}
    </>
  );
};

export default VoyageList;
