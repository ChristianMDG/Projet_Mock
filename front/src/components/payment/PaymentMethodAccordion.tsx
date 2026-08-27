import React, { useMemo } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Card,
  FormControlLabel,
  Radio,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Phone from '@mui/icons-material/Phone';
import { useSectionByComponent } from '@/hooks/dynamic-page.hooks';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import type { PaymentSection } from '@/api/dynamic-page.api';
import { SECTION_TYPES } from '@/constants/section.types';
import MissingContent from '../shared/MissingContent';
import { trackEvent } from '@/hooks/google-analytics.hook';

interface PaymentMethodAccordionProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
}

const PaymentMethodAccordion: React.FC<PaymentMethodAccordionProps> = ({ selectedMethod, onMethodChange }) => {
  const { data } = useSectionByComponent(SECTION_TYPES.PAYMENT_SECTION);
  const section = data?.data as PaymentSection | undefined;
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const logoSize = isMobile ? 36 : 48;

  const activeMethods = useMemo(
    () => section?.paymentMethods?.filter(m => m.isActive)?.sort((a, b) => a.sortOrder - b.sortOrder) ?? [],
    [section?.paymentMethods],
  );
  const hasMethods = activeMethods.length > 0;

  if (!hasMethods) {
    return <MissingContent componentName="Payment Methods" />;
  }

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 2 }}>
        {t(Labels.payment_method_title)}
      </Typography>
      <Alert severity="error" sx={{ my: 2, borderRadius: 3, boxShadow: 1 }}>
        {t(Labels.payment_follow_instructions)}
      </Alert>
      {activeMethods.map(method => {
        const isSelected = selectedMethod === method.identifier;
        const isMobile = method.identifier?.toLowerCase().includes('mobile');

        return (
          <Accordion
            key={method.id}
            expanded={isSelected}
            onChange={(_, expanded) => {
              if (expanded) {
                trackEvent('payment_method_selected', 'Payment', method.identifier);
                onMethodChange(method.identifier);
              }
            }}
            sx={{
              mb: 1.5,
              boxShadow: 1,
              border: 1,
              borderColor: 'transparent',
              bgcolor: isSelected ? theme => `${theme.palette.primary.main}0A` : 'background.paper',
              transition: 'all 0.3s ease-in-out',
              borderRadius: 4,
              '&.MuiAccordion-root': {
                borderRadius: 4,
              },
            }}
            component={Card}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              sx={{ '& .MuiAccordionSummary-content': { alignItems: 'center', my: 1 } }}
            >
              <FormControlLabel
                control={
                  <Radio
                    checked={isSelected}
                    onChange={() => {
                      trackEvent('payment_method_selected', 'Payment', method.identifier);
                      onMethodChange(method.identifier);
                    }}
                    onClick={e => e.stopPropagation()}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {method.logo?.url && (
                      <Box
                        component="img"
                        src={method.logo.url}
                        alt={method.logo.alternativeText ?? method.name}
                        loading="lazy"
                        sx={{
                          width: logoSize,
                          height: logoSize,
                          objectFit: 'contain',
                          borderRadius: 1.5,
                          bgcolor: 'grey.50',
                          p: 0.5,
                          flexShrink: 0,
                        }}
                      />
                    )}
                    <Box>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 'medium',
                        }}
                      >
                        {method.name}
                      </Typography>
                      {isMobile && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                          <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {t(Labels.payment_method_mobile_money)}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                }
                sx={{ m: 0, flexGrow: 1 }}
              />
            </AccordionSummary>
            {method.description && (
              <AccordionDetails sx={{ pt: 0 }}>
                <Typography variant="h6" color="text.primary">
                  {method.description}
                </Typography>
              </AccordionDetails>
            )}
          </Accordion>
        );
      })}
    </Box>
  );
};

export default PaymentMethodAccordion;
