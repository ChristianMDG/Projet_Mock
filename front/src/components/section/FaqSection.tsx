import React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
  type SxProps,
  type Theme,
} from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import type { FaqSection as FaqSectionType } from '@/api/dynamic-page.api';

interface FaqSectionProps {
  section: FaqSectionType;
  sx?: SxProps<Theme>;
}

const FaqSection: React.FC<FaqSectionProps> = ({ section, sx }) => {
  return (
    <Box sx={{ mb: 6, ...sx }} data-section="page.faq-section">
      <Typography variant="h3" component="h2" gutterBottom sx={{ mb: 4 }}>
        {section.title}
      </Typography>
      {section.faqs.map(faq => (
        <Accordion key={faq.id}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">{faq.question}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1">{faq.answer}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default FaqSection;
