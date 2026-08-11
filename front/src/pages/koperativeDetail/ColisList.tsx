import {
  Box,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import PackageIcon from '@mui/icons-material/AllInbox';
import AddIcon from '@mui/icons-material/Add';
import type { Colis } from '@/models/Colis';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';

interface ColisListProps {
  colis?: Colis[];
}

const ColisList: React.FC<ColisListProps> = ({ colis }) => {
  const { t } = useTranslation();
  const hasColis = Array.isArray(colis) && colis.length > 0;

  return (
    <Box sx={{ p: 2 }}>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PackageIcon color="primary" />
              {t(Labels.colis_list_title)}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              size="small"
              onClick={() => {
                // TODO: Implement create colis functionality
              }}
            >
              {t(Labels.colis_list_new_button)}
            </Button>
          </Box>
          {hasColis ? (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>{t(Labels.colis_form_sender_name_label)}</TableCell>
                  <TableCell>{t(Labels.colis_form_sender_phone_label)}</TableCell>
                  <TableCell>{t(Labels.colis_form_recipient_name_label)}</TableCell>
                  <TableCell>{t(Labels.colis_form_recipient_phone_label)}</TableCell>
                  <TableCell>{t(Labels.colis_form_description_label)}</TableCell>
                  <TableCell>{t(Labels.colis_form_weight_label)}</TableCell>
                  <TableCell>{t(Labels.colis_form_price_label)}</TableCell>
                  <TableCell>{t(Labels.colis_form_status_label)}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {colis.map((c, i) => (
                  <TableRow key={c.id ?? i}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{c.senderName}</TableCell>
                    <TableCell>{c.senderPhone}</TableCell>
                    <TableCell>{c.recipientName}</TableCell>
                    <TableCell>{c.recipientPhone}</TableCell>
                    <TableCell>{c.description}</TableCell>
                    <TableCell>{c.weight}</TableCell>
                    <TableCell>{c.price}</TableCell>
                    <TableCell>{t(`colis_status_${c.status?.toLowerCase()}`)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Typography align="center" sx={{ p: 3 }}>
              {t(Labels.colis_list_no_colis)}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ColisList;
