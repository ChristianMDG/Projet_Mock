import React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardContent,
  Typography,
  type SxProps,
  type Theme,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import type { LegalContent as LegalContentType, LegalSection } from '@/api/dynamic-page.api';

interface LegalContentProps {
  section: LegalContentType;
  sx?: SxProps<Theme>;
}

const LegalContent: React.FC<LegalContentProps> = ({ section, sx }) => {
  return (
    <Card sx={{ mb: 6, ...sx }} data-section="page.legal-content">
      <CardContent>
        <Typography variant="h3" component="h2" gutterBottom sx={{ mb: 3 }}>
          {section.title}
        </Typography>
        {section.subtitle && (
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {section.subtitle}
          </Typography>
        )}
        {section.sections.map((legalSection: LegalSection) => (
          <Accordion
            key={legalSection.id}
            elevation={0}
            sx={{
              mb: 1,
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              '&:before': {
                display: 'none',
              },
            }}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">{legalSection.title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                {legalSection.content}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </CardContent>
    </Card>
  );
};

export default LegalContent;
