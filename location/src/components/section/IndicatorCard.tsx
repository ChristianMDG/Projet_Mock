import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import type { RentalReassuranceItem } from '@/api/dynamic-page.api';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { Link as RouterLink } from 'react-router-dom';
import ArrowForward from '@mui/icons-material/ArrowForward';
import { DynamicIcon } from '@/components/ui';

const IndicatorCard: React.FC<{ indicator: RentalReassuranceItem }> = ({ indicator }) => {
  const { t } = useTranslation();
  const { icon, title, description, color, link, linkText } = indicator;
  const iconColor = color ?? 'primary.main';

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', height: '100%', p: 2 }}
    >
      <Box sx={{ mb: 3 }}>
        <DynamicIcon name={icon} fallback="Shield" sx={{ fontSize: 56, color: iconColor }} />
      </Box>
      <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 700 }}>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, flexGrow: 1 }}>
        {description}
      </Typography>
      {Boolean(link) && (
        <Link
          component={RouterLink}
          to={link as string}
          color={iconColor}
          underline="hover"
          sx={{ fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
        >
          {linkText ?? t(Labels.rental_reassurance_learn_more)}
          <ArrowForward fontSize="small" />
        </Link>
      )}
    </Box>
  );
};

export default IndicatorCard;
