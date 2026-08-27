import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, SxProps, Theme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import StyledIcon from '@/components/ui/StyledIcon';
import VehicleIcon from '@/components/shared/VehicleIcon';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import CarRentalIcon from '@mui/icons-material/CarRental';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import ElectricRickshawIcon from '@mui/icons-material/ElectricRickshaw';
import type { KoperativeTypesList as KoperativeTypesListType } from '@/api/dynamic-page.api';
import { KoperativeTypeEnum, KoperativeTypeLabels } from '@/models/enums';

interface KoperativeTypesListProps {
  section: KoperativeTypesListType;
  sx?: SxProps<Theme>;
}

// Icon mapping for KoperativeTypeEnum
const KoperativeTypeIcons: Record<KoperativeTypeEnum, React.ReactNode> = {
  [KoperativeTypeEnum.COOP]: <StyledIcon icon={VehicleIcon} sx={{ fontSize: 40 }} />,
  [KoperativeTypeEnum.TAXI]: <StyledIcon icon={LocalTaxiIcon} sx={{ fontSize: 40 }} />,
  [KoperativeTypeEnum.TAXIMOTO]: <StyledIcon icon={TwoWheelerIcon} sx={{ fontSize: 40 }} />,
  [KoperativeTypeEnum.LOCATION]: <StyledIcon icon={CarRentalIcon} sx={{ fontSize: 40 }} />,
  [KoperativeTypeEnum.SPECIAL]: <StyledIcon icon={WorkspacePremiumIcon} sx={{ fontSize: 40 }} />,
  [KoperativeTypeEnum.TUCTUC]: <StyledIcon icon={ElectricRickshawIcon} sx={{ fontSize: 40 }} />,
};

const KoperativeTypesList: React.FC<KoperativeTypesListProps> = ({ section, sx }) => {
  const { t } = useTranslation();

  // Get all types
  const types = Object.values(KoperativeTypeEnum);

  return (
    <Box sx={{ py: 6, bgcolor: section.backgroundColor ?? 'background.default', ...sx }}>
      <Container maxWidth={section.containerMaxWidth ?? 'lg'}>
        <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
          {section.title}
        </Typography>
        {section.subtitle && (
          <Typography variant="subtitle1" color="text.secondary" align="center" sx={{ mb: 4 }}>
            {section.subtitle}
          </Typography>
        )}
        <Grid container spacing={3} sx={{ mt: 2, justifyContent: 'center' }}>
          {types.map(type => (
            <Grid size={{ xs: 6, sm: 4, md: 2 }} key={type}>
              <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
                <CardContent
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    height: '100%',
                    p: 3,
                    '&:last-child': { pb: 3 },
                  }}
                >
                  {KoperativeTypeIcons[type]}
                  <Typography variant="subtitle2" sx={{ mt: 2, fontWeight: 600 }}>
                    {t(KoperativeTypeLabels[type])}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default KoperativeTypesList;
