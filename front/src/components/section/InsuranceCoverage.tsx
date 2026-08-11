import React from 'react';
import {
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  type SxProps,
  type Theme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import type { InsuranceCoverage as InsuranceCoverageType } from '@/api/dynamic-page.api';

interface InsuranceCoverageProps {
  section: InsuranceCoverageType;
  sx?: SxProps<Theme>;
}

const InsuranceCoverage: React.FC<InsuranceCoverageProps> = ({ section, sx }) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ mb: 6, ...sx }} data-section="page.insurance-coverage">
      <Typography variant="h3" component="h2" gutterBottom sx={{ mb: 4 }}>
        {section.title}
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>{t(Labels.insurance_table_type)}</strong>
              </TableCell>
              <TableCell>
                <strong>{t(Labels.insurance_table_description)}</strong>
              </TableCell>
              <TableCell>
                <strong>{t(Labels.insurance_table_coverage)}</strong>
              </TableCell>
              <TableCell>
                <strong>{t(Labels.insurance_table_status)}</strong>
              </TableCell>
              <TableCell>
                <strong>{t(Labels.insurance_table_price)}</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {section.insuranceTypes.map(insurance => (
              <TableRow key={insurance.id}>
                <TableCell>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 'bold',
                    }}
                  >
                    {insurance.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{insurance.description}</Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    color="primary"
                    sx={{
                      fontWeight: 'medium',
                    }}
                  >
                    {insurance.coverage}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={
                      insurance.included ? t(Labels.insurance_status_included) : t(Labels.insurance_status_optional)
                    }
                    color={insurance.included ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {insurance.included ? t(Labels.insurance_price_free) : (insurance.price ?? '-')}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default InsuranceCoverage;
