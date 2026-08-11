import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardHeader,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useContrat, useCreateContrat, useUpdateContrat } from '@/hooks/contrat.hooks';
import { StyledIcon } from '@/components/ui';
import { Contrat } from '@/models/Contrat';
import { ContratStatusEnum, ContratTypeEnum } from '@/models/enums';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { useQueryClient } from '@tanstack/react-query';
import DescriptionIcon from '@mui/icons-material/Description';
import { ROUTES } from '@/constants/routes';
import SEO from '@/components/shared/SEO';

import Labels from '@/labelKeys.json';

const ContratFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const { data: contratData } = useContrat(Number(id));
  const createContrat = useCreateContrat();
  const updateContrat = useUpdateContrat();
  const queryClient = useQueryClient();

  const [form, setForm] = useState<Partial<Contrat>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit && contratData) {
      setForm(contratData);
    }
  }, [isEdit, contratData]);

  const handleChange = (field: keyof Contrat, value: unknown) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setError(null);
    try {
      if (isEdit && form.id) {
        await updateContrat.mutateAsync({ id: form.id, contrat: form });
      } else {
        await createContrat.mutateAsync(form);
      }
      await queryClient.invalidateQueries({ queryKey: ['contrats'] });
      await queryClient.invalidateQueries({ queryKey: ['contrat'] });
      navigate(ROUTES.contratsList[i18n.language]);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur lors de la sauvegarde du contrat.');
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <SEO title={`${isEdit ? t(Labels.button_edit) : t(Labels.button_create)} ${t(Labels.nav_contrats)}`} />
      <Card>
        <CardHeader
          avatar={<StyledIcon icon={DescriptionIcon} variant="secondary" />}
          title={<Typography variant="h4">{isEdit ? 'Modifier le contrat' : 'Créer un contrat'}</Typography>}
        />
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <TextField
            label="Titre"
            value={form.title ?? ''}
            onChange={e => handleChange('title', e.target.value)}
            fullWidth
            margin="dense"
            variant="outlined"
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Type</InputLabel>
            <Select value={form.type ?? ''} label="Type" onChange={e => handleChange('type', e.target.value)}>
              {Object.values(ContratTypeEnum).map(type => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Termes"
            value={form.terms ?? ''}
            onChange={e => handleChange('terms', e.target.value)}
            fullWidth
            multiline
            minRows={2}
            margin="dense"
            variant="outlined"
          />
          <TextField
            label="Date de début"
            type="date"
            value={form.startDate ?? ''}
            onChange={e => handleChange('startDate', e.target.value)}
            fullWidth
            margin="dense"
            variant="outlined"
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            label="Date de fin"
            type="date"
            value={form.endDate ?? ''}
            onChange={e => handleChange('endDate', e.target.value)}
            fullWidth
            margin="dense"
            variant="outlined"
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            label="Valeur du contrat"
            type="number"
            value={form.contractValue ?? ''}
            onChange={e => handleChange('contractValue', e.target.value)}
            fullWidth
            margin="dense"
            variant="outlined"
            slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Statut</InputLabel>
            <Select value={form.status ?? ''} label="Statut" onChange={e => handleChange('status', e.target.value)}>
              {Object.values(ContratStatusEnum).map(status => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button onClick={() => navigate(ROUTES.contratsList[i18n.language])} startIcon={<CancelIcon />}>
              Annuler
            </Button>
            <Button onClick={handleSave} variant="contained" startIcon={<SaveIcon />}>
              Enregistrer
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default ContratFormPage;
