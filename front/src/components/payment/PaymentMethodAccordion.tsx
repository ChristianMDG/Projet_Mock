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
} from '@mui/material';
import { ExpandMore, Phone } from '@mui/icons-material';
import { useSectionContext } from '@/context/SectionProvider';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import type { PaymentSection } from '@/api/dynamic-page.api';
import { SECTION_TYPES } from '@/constants/section.types';
import MissingContent from '../shared/MissingContent';

interface PaymentMethodAccordionProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
}

const PaymentMethodAccordion: React.FC<PaymentMethodAccordionProps> = ({ selectedMethod, onMethodChange }) => {
  const { getSectionByType } = useSectionContext();
  const section = getSectionByType<PaymentSection>(SECTION_TYPES.PAYMENT_SECTION);
  const { t } = useTranslation();

  const activeMethods = useMemo(
    () => section?.paymentMethods?.filter(m => m.isActive)?.sort((a, b) => a.sortOrder - b.sortOrder) ?? [],
    [section?.paymentMethods],
  );

  if (!activeMethods?.length) {
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
            onChange={(_, expanded) => expanded && onMethodChange(method.identifier)}
            sx={{ mb: 1, '&:before': { display: 'none' }, boxShadow: 1 }}
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
                    onChange={() => onMethodChange(method.identifier)}
                    value={method.identifier}
                    onClick={e => e.stopPropagation()}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {method.logo?.url && (
                      <Box
                        component="img"
                        src={method.logo.url}
                        alt={method.logo.alternativeText || method.name}
                        loading="lazy"
                        sx={{
                          width: 48,
                          height: 48,
                          objectFit: 'contain',
                          borderRadius: 1.5,
                          bgcolor: 'grey.50',
                          p: 0.5,
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
