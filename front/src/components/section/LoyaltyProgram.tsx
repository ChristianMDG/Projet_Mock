import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  List,
  ListItem,
  Typography,
  type SxProps,
  type Theme,
} from '@mui/material';
import type { LoyaltyProgram as LoyaltyProgramType, LoyaltyLevel, LoyaltyBenefit } from '@/api/dynamic-page.api';

interface LoyaltyProgramProps {
  section: LoyaltyProgramType;
  sx?: SxProps<Theme>;
}

const LoyaltyProgram: React.FC<LoyaltyProgramProps> = ({ section, sx }) => {
  return (
    <Box sx={{ mb: 6, ...sx }} data-section={section.__component}>
      <Typography variant="h3" component="h2" gutterBottom>
        {section.title} {section.programName}
      </Typography>
      {section.description && (
        <Typography variant="body1" sx={{ mb: 3 }}>
          {section.description}
        </Typography>
      )}
      <Grid container spacing={2}>
        {section.levels.map((level: LoyaltyLevel) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={`level-${level.id}`}>
            <Card
              sx={{
                height: '100%',
                border: level.highlighted ? 2 : 1,
                borderColor: level.highlighted ? 'warning.main' : 'divider',
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <Chip label={level.name} color={level.color} sx={{ mb: 2 }} />
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {level.trips}
                </Typography>
                <List dense>
                  {level.benefits.map((benefit: LoyaltyBenefit, benefitIndex: number) => (
                    <ListItem key={`${level.id}-benefit-${benefitIndex}`} sx={{ py: 0.25, justifyContent: 'center' }}>
                      <Typography
                        variant="body2"
                        sx={{
                          textAlign: 'center',
                        }}
                      >
                        {benefit.text}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default LoyaltyProgram;
