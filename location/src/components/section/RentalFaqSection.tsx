import React from 'react';
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  type SxProps,
  type Theme,
} from '@mui/material';
import type { RentalFaqSection as RentalFaqSectionType } from '@/api/dynamic-page.api';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface RentalFaqSectionProps {
  section: RentalFaqSectionType;
  sx?: SxProps<Theme>;
}

const RentalFaqSection: React.FC<RentalFaqSectionProps> = ({ section, sx }) => {
  const { title, subtitle, faqs, backgroundColor, containerMaxWidth } = section;

  return (
    <Box component="section" sx={{ py: { xs: 6, md: 10 }, bgcolor: backgroundColor ?? 'background.paper', ...sx }}>
      <Container maxWidth={containerMaxWidth ?? 'md'}>
        <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 8 } }}>
          <Typography variant="h3" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
            {title}
          </Typography>
          {Boolean(subtitle) && (
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
              {subtitle}
            </Typography>
          )}
        </Box>

        {Boolean(faqs?.length) && (
          <Box>
            {faqs.map((faq, index) => (
              <Accordion
                key={faq.id}
                defaultExpanded={index === 0}
                sx={{
                  mb: 2,
                  boxShadow: 'none',
                  '&:before': { display: 'none' },
                  bgcolor: 'transparent',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: '8px !important',
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon color="primary" />}
                  sx={{
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    p: 3,
                    '& .MuiAccordionSummary-content': { my: 0 },
                  }}
                >
                  {faq.question}
                </AccordionSummary>
                <AccordionDetails sx={{ px: 3, pb: 3, pt: 0, color: 'text.secondary', lineHeight: 1.7 }}>
                  <Typography variant="body1">{faq.answer}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default RentalFaqSection;
