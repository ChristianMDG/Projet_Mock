import React from 'react';
import {
  Card,
  CardHeader,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionIcon from '@mui/icons-material/Description';
import { useContrats, useDeleteContrat } from '@/hooks/contrat.hooks';
import { Contrat } from '@/models/Contrat';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ROUTES, generateRoute } from '@/constants/routes';
import SEO from '@/components/shared/SEO';

import Labels from '@/labelKeys.json';

const ContratPage: React.FC = () => {
  const theme = useTheme();
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: contratsData } = useContrats();
  const contrats: Contrat[] = Array.isArray(contratsData) ? contratsData : [];
  const deleteContrat = useDeleteContrat();

  const handleOpen = (contrat?: Contrat) => {
    if (contrat?.id) {
      navigate(generateRoute.contratEdit(contrat.id, i18n.language));
    } else {
      navigate(ROUTES.contratCreate[i18n.language]);
    }
  };

  const handleDelete = async (id: number) => {
    await deleteContrat.mutateAsync(id);
    await queryClient.invalidateQueries({ queryKey: ['contrats'] });
    await queryClient.invalidateQueries({ queryKey: ['contrat'] });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4, px: { xs: 0 } }}>
      <SEO title={t(Labels.nav_contrats)} />
      <Card sx={{ mt: 2, boxShadow: theme.shadows[2] }}>
        <CardHeader
          avatar={<DescriptionIcon color="primary" />}
          title={<Typography variant="h4">Gestion des Contrats</Typography>}
          action={
            <IconButton color="primary" onClick={() => handleOpen()} size="large">
              <AddIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ pb: 0, background: theme.palette.background.paper }}
        />
        <TableContainer component={Paper} sx={{ boxShadow: theme.shadows[1] }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Titre</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Début</TableCell>
                <TableCell>Fin</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contrats.map((contrat: Contrat) => (
                <TableRow key={contrat.id} hover>
                  <TableCell>{contrat.title}</TableCell>
                  <TableCell>{contrat.type}</TableCell>
                  <TableCell>{contrat.startDate}</TableCell>
                  <TableCell>{contrat.endDate}</TableCell>
                  <TableCell>{contrat.status}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleOpen(contrat)} size="large">
                      <EditIcon fontSize="inherit" />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(contrat.id!)} size="large">
                      <DeleteIcon fontSize="inherit" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Container>
  );
};

export default ContratPage;
