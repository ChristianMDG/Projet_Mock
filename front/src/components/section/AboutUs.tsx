import React from 'react';
import { Box, Typography, type SxProps, type Theme } from '@mui/material';
import type { AboutUs as AboutUsType, TextParagraph } from '@/api/dynamic-page.api';

interface AboutUsProps {
  section: AboutUsType;
  sx?: SxProps<Theme>;
}

const AboutUs: React.FC<AboutUsProps> = ({ section, sx }) => {
  return (
    <Box sx={{ mb: 6, ...sx }} data-section="page.about-us-section">
      <Typography variant="h3" component="h2" gutterBottom sx={{ mb: 4 }}>
        {section.title}
      </Typography>
      {section.paragraphs.map((paragraph: TextParagraph) => (
        <Typography key={paragraph.id} variant="body1" component="p" gutterBottom>
          {paragraph.text}
        </Typography>
      ))}
    </Box>
  );
};

export default AboutUs;
