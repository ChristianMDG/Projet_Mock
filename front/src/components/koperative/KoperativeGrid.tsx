import React from 'react';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Koperative } from '@/types';
import KoperativeCard from './KoperativeCard';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { generateRoute } from '@/constants/routes';
import { AuthorityEnum } from '@/models/enums';
import Labels from '@/labelKeys.json';

interface KoperativeGridProps {
  koperatives: Koperative[];
  onSelect?: (koperative: Koperative) => void;
  onEdit?: (koperative: Koperative) => void;
  isEmpty?: boolean;
}

export const KoperativeGrid: React.FC<KoperativeGridProps> = ({ koperatives, onSelect, onEdit, isEmpty = false }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleKoperativeClick = (koperative: Koperative) => {
    if (koperative.slug) {
      const isAdminOrOperator = user?.admin ?? user?.authorities?.some(a => a.name === AuthorityEnum.OPERATOR);
      const route = isAdminOrOperator
        ? generateRoute.koperativeDetail(koperative.slug, i18n.language)
        : generateRoute.cooperativeInfo(koperative.slug, i18n.language);

      navigate(route);
      onSelect?.(koperative);
    }
  };

  if (isEmpty || koperatives.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
          px: 2,
          textAlign: 'center',
        }}
      >
        <Typography variant="h5" color="text.secondary" sx={{ mb: 2, fontWeight: 500 }}>
          {t(Labels.koperative_not_found)}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t(Labels.voyage_try_different_filters)}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        {koperatives.map(koperative => (
          <Grid key={koperative.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <KoperativeCard koperative={koperative} onSelect={handleKoperativeClick} onEdit={onEdit} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default KoperativeGrid;
