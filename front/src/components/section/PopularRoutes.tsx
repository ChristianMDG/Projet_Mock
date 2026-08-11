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
import LabelKeys from '@/labelKeys.json';
import type { PopularRoutes as PopularRoutesType, RouteItem } from '@/api/dynamic-page.api';

interface PopularRoutesProps {
  section: PopularRoutesType;
  sx?: SxProps<Theme>;
}

const PopularRoutes: React.FC<PopularRoutesProps> = ({ section, sx }) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ mb: 6, ...sx }} data-section="page.popular-routes">
      <Typography variant="h3" component="h2" gutterBottom>
        {section.title}
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>{t(LabelKeys.offers_departure)}</strong>
              </TableCell>
              <TableCell>
                <strong>{t(LabelKeys.ui_label_city_destination)}</strong>
              </TableCell>
              <TableCell>
                <strong>{t(LabelKeys.offers_duration)}</strong>
              </TableCell>
              <TableCell>
                <strong>{t(LabelKeys.routes_table_category)}</strong>
              </TableCell>
              <TableCell>
                <strong>{t(LabelKeys.offers_from)}</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {section.routes.map((route: RouteItem) => (
              <TableRow key={`${route.from}-${route.to}-${route.id}`}>
                <TableCell>{route.from}</TableCell>
                <TableCell>{route.to}</TableCell>
                <TableCell>{route.duration}</TableCell>
                <TableCell>
                  <Chip
                    label={route.comfort}
                    size="small"
                    color={(() => {
                      if (route.comfort === 'VIP') return 'success';
                      if (route.comfort === 'Confort') return 'secondary';
                      return 'primary';
                    })()}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="h6" color="primary">
                    {route.price.toLocaleString()} {t(LabelKeys.currency_ariary_short)}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {section.disclaimer && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          {section.disclaimer}
        </Typography>
      )}
    </Box>
  );
};

export default PopularRoutes;
