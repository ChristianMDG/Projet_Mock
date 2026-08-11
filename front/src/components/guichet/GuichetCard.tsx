import React from 'react';
import { Box, Card, CardContent, Chip, Grid, Typography } from '@mui/material';
import { ButtonTx } from '@/components/ui';
import DeleteIcon from '@mui/icons-material/Delete';
import PhoneIcon from '@mui/icons-material/Phone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import { Guichet } from '@/types';
import Labels from '@/labelKeys.json';
import GuichetPng from '@/assets/Guichet.png';
import ProtectedTx from '@/components/ProtectedTx';

interface GuichetCardProps {
  guichet: Guichet;
  isDeleting: boolean;
  t: (key: string) => string;
  onEdit: (guichet: Guichet) => void;
  onDelete: (guichet: Guichet) => void;
  onAssignOperator: (guichet: Guichet) => void;
}

interface ActionButtonsProps {
  guichet: Guichet;
  isDeleting: boolean;
  t: (key: string) => string;
  onDelete: (guichet: Guichet) => void;
  onAssignOperator: (guichet: Guichet) => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ guichet, isDeleting, t, onDelete, onAssignOperator }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
    <ButtonTx
      variant="outlined"
      color="primary"
      onClick={e => {
        e.stopPropagation();
        onAssignOperator(guichet);
      }}
      hideTextOnMobile
      startIcon={<AssignmentIndIcon />}
    >
      {t(Labels.assigned)}
    </ButtonTx>
    <ButtonTx
      variant="outlined"
      color="error"
      onClick={e => {
        e.stopPropagation();
        onDelete(guichet);
      }}
      startIcon={<DeleteIcon />}
      hideTextOnMobile
      disabled={isDeleting}
      hidden={guichet.isActive}
    >
      {t(Labels.delete)}
    </ButtonTx>
  </Box>
);

const GuichetCard: React.FC<GuichetCardProps> = ({ guichet, isDeleting, t, onEdit, onDelete, onAssignOperator }) => {
  return (
    <Card sx={{ my: 2, position: 'relative' }}>
      <CardContent sx={{ padding: 2 }}>
        <Box
          onClick={e => {
            e.stopPropagation();
            onEdit(guichet);
          }}
          sx={{ cursor: 'pointer' }}
        >
          <Grid container spacing={2}>
            <Grid size="auto" sx={{ alignItems: 'center', display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box
                component="img"
                src={GuichetPng}
                alt={guichet.name}
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 2,
                  boxShadow: 1,
                  bgcolor: 'grey.100',
                  mb: 1,
                }}
              />
              <ProtectedTx>
                <Box sx={{ display: { xs: 'flex', sm: 'none' }, flexDirection: 'column', gap: 1 }}>
                  <ActionButtons
                    guichet={guichet}
                    isDeleting={isDeleting}
                    t={t}
                    onDelete={onDelete}
                    onAssignOperator={onAssignOperator}
                  />
                </Box>
              </ProtectedTx>
            </Grid>
            <Grid size="grow" sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 0.5 }}>
                <LocationCityIcon />
                <Typography
                  variant="h6"
                  sx={{
                    flex: 1,
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                    hyphens: 'auto',
                  }}
                >
                  <b>{guichet.gare?.ville?.name}</b>
                </Typography>
              </Box>
              {(guichet.phones || guichet.openingHours) && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 0.5, flexWrap: 'wrap' }}>
                  {guichet.phones && (
                    <Typography
                      variant="body2"
                      color="text.primary"
                      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      <PhoneIcon fontSize="inherit" />
                      {guichet.phones}
                    </Typography>
                  )}
                  {guichet.phones && guichet.openingHours && (
                    <FiberManualRecordIcon sx={{ fontSize: 8, color: 'text.secondary' }} />
                  )}
                  {guichet.openingHours && (
                    <Typography variant="body2" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccessTimeIcon fontSize="inherit" />
                      {guichet.openingHours}
                    </Typography>
                  )}
                </Box>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap', my: 0.5 }}>
                <PersonIcon sx={{ fontSize: 16, color: 'primary.main', flexShrink: 0 }} />
                {guichet.operateurs?.length ? (
                  guichet.operateurs.map((operateur, index) => (
                    <Chip
                      key={`${guichet.id}-${operateur.id}-${index}`}
                      label={
                        operateur.firstName && operateur.lastName
                          ? `${operateur.firstName} ${operateur.lastName}`
                          : (operateur.phone ?? operateur.email ?? 'N/A')
                      }
                      size="small"
                      sx={{
                        bgcolor: 'grey.100',
                        color: 'primary.main',
                        height: 24,
                      }}
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    {t(Labels.operator_page_no_operators)}
                  </Typography>
                )}
              </Box>
              {guichet.gare?.name && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ my: 0.5, display: 'block', fontStyle: 'italic' }}
                >
                  {guichet.gare.name}
                </Typography>
              )}
            </Grid>
            <ProtectedTx>
              <Grid size="auto" sx={{ display: { xs: 'none', sm: 'block' } }}>
                <ActionButtons
                  guichet={guichet}
                  isDeleting={isDeleting}
                  t={t}
                  onDelete={onDelete}
                  onAssignOperator={onAssignOperator}
                />
              </Grid>
            </ProtectedTx>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default GuichetCard;
