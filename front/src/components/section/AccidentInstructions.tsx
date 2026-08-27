import React from 'react';
import { Box, Container, Typography, Card, CardContent, Alert, Chip, Stack, Divider, Grid } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import type { AccidentInstructions as AccidentInstructionsType } from '@/api/dynamic-page.api';
import { Icon } from '@/shared/IconMapper';

interface AccidentInstructionsProps {
  section: AccidentInstructionsType;
}

const priorityColors = {
  critical: 'error',
  high: 'warning',
  medium: 'info',
  low: 'default',
} as const;

const AccidentInstructions: React.FC<AccidentInstructionsProps> = ({ section }) => {
  const sortedInstructions = [...section.instructions].sort((a, b) => a.step - b.step);

  return (
    <Box sx={{ py: 6, bgcolor: section.backgroundColor ?? '#fff3e0' }}>
      <Container
        sx={{
          maxWidth: section.containerMaxWidth ?? 'lg',
        }}
      >
        <Typography variant="h4" gutterBottom align="center" color="error">
          {section.title}
        </Typography>
        {section.subtitle && (
          <Typography variant="subtitle1" color="text.secondary" align="center" sx={{ mb: 4 }}>
            {section.subtitle}
          </Typography>
        )}

        <Alert severity="error" icon={<PhoneIcon />} sx={{ mb: 4, fontSize: '1.1rem', fontWeight: 'bold' }}>
          Numéro d'urgence: {section.emergencyNumber}
        </Alert>

        <Grid container spacing={3}>
          {sortedInstructions.map(instruction => (
            <Grid key={instruction.id} size={{ xs: 12, md: 6 }}>
              <Card
                sx={{
                  height: '100%',
                  borderLeft: 4,
                  borderColor:
                    instruction.priority === 'critical'
                      ? 'error.main'
                      : instruction.priority === 'high'
                        ? 'warning.main'
                        : 'info.main',
                }}
              >
                <CardContent>
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                      mb: 2,
                      alignItems: 'flex-start',
                    }}
                  >
                    <Box
                      sx={{
                        minWidth: 40,
                        height: 40,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                      }}
                    >
                      {instruction.step}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                          mb: 1,
                          alignItems: 'center',
                        }}
                      >
                        <Icon iconName={instruction.icon} sx={{ color: 'primary.main' }} />
                        <Typography variant="h6" component="div">
                          {instruction.title}
                        </Typography>
                      </Stack>
                      <Chip
                        label={instruction.priority.toUpperCase()}
                        color={priorityColors[instruction.priority]}
                        size="small"
                        sx={{ mb: 1 }}
                      />
                    </Box>
                  </Stack>

                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    {instruction.description}
                  </Typography>

                  {instruction.details && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontStyle: 'italic' }}
                        dangerouslySetInnerHTML={{ __html: instruction.details }}
                      />
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default AccidentInstructions;
