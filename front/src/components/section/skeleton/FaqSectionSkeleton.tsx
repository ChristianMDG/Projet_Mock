import React from 'react';
import { Box, Accordion, Skeleton } from '@mui/material';

const FaqSectionSkeleton: React.FC = () => (
  <Box sx={{ mb: 6 }}>
    <Skeleton variant="text" width="30%" height={48} sx={{ mb: 4 }} />
    {[1, 2, 3, 4, 5].map(index => (
      <Accordion key={index} disabled sx={{ mb: 1 }}>
        <Box sx={{ p: 2 }}>
          <Skeleton variant="text" width="70%" height={24} />
        </Box>
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="90%" height={20} />
        </Box>
      </Accordion>
    ))}
  </Box>
);

export default FaqSectionSkeleton;
