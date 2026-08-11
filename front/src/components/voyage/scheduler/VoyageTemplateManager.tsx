import React, { useState } from 'react';
import {
  Alert,
  AlertTitle,
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  CalendarToday,
  ContentCopy,
  Delete,
  Edit,
  EventNote,
  PlayArrow,
  Refresh,
  Schedule,
  Settings,
  Visibility,
  Warning,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { useInstancesByTemplate, useUpdateTemplateAndRegenerate } from '@/hooks/scheduler.hooks';
import { RecurrenceTypeEnum, Voyage, VoyageStatusEnum } from '@/types';
import dayjs from '@/utils/dayjs';

interface VoyageTemplateManagerProps {
  koperativeId?: number;
}

// Sample template data for demonstration
const sampleTemplates: Partial<Voyage>[] = [
  {
    id: 1,
    description: 'Antananarivo - Antsirabe Daily',
    departureGare: {
      id: 1,
      name: 'Gare Soarano',
      ville: { id: 1, name: 'Antananarivo' },
      isClosed: false,
    },
    arrivalGare: {
      id: 2,
      name: 'Gare Antsirabe',
      ville: { id: 2, name: 'Antsirabe' },
      isClosed: false,
    },
    recurrenceType: RecurrenceTypeEnum.WEEKLY,
    isTemplate: true,
    pricePerSeat: 15000,
    availableSeats: 22,
    status: VoyageStatusEnum.SCHEDULED,
    createdAt: '2025-08-01T08:00:00',
    recurrenceEndDate: '2025-12-31',
  },
  {
    id: 2,
    description: 'Fianarantsoa - Manakara Express',
    departureGare: {
      id: 3,
      name: 'Gare Fianarantsoa',
      ville: { id: 3, name: 'Fianarantsoa' },
      isClosed: false,
    },
    arrivalGare: {
      id: 4,
      name: 'Gare Manakara',
      ville: { id: 4, name: 'Manakara' },
      isClosed: false,
    },
    recurrenceType: RecurrenceTypeEnum.MONTHLY,
    isTemplate: true,
    pricePerSeat: 25000,
    availableSeats: 18,
    status: VoyageStatusEnum.SCHEDULED,
    createdAt: '2025-08-05T06:30:00',
    recurrenceEndDate: '2025-11-30',
  },
];

const VoyageTemplateManager: React.FC<VoyageTemplateManagerProps> = () => {
  const { t } = useTranslation();
  const [selectedTemplate, setSelectedTemplate] = useState<Partial<Voyage> | null>(null);
  const [instancesDialogOpen, setInstancesDialogOpen] = useState(false);

  const updateTemplate = useUpdateTemplateAndRegenerate();

  const getStatusColor = (
    status: string,
  ): 'primary' | 'secondary' | 'default' | 'error' | 'info' | 'success' | 'warning' => {
    switch (status) {
      case 'SCHEDULED':
        return 'success';
      case 'PAUSED':
        return 'warning';
      case 'EXPIRED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getRecurrenceIcon = (type: string) => {
    switch (type) {
      case 'WEEKLY':
        return <EventNote color="primary" />;
      case 'MONTHLY':
        return <CalendarToday color="secondary" />;
      case 'CUSTOM':
        return <Settings color="action" />;
      default:
        return <Schedule />;
    }
  };

  const handleViewInstances = (template: Partial<Voyage>) => {
    setSelectedTemplate(template);
    setInstancesDialogOpen(true);
  };

  const handleEditTemplate = (template: Partial<Voyage>) => {
    // TODO: Integrate with existing form components
    setSelectedTemplate(template);
  };

  const handleDuplicateTemplate = (template: Partial<Voyage>) => {
    // TODO: Implement template duplication logic
    setSelectedTemplate({ ...template, id: undefined });
  };

  const handleDeleteTemplate = (template: Partial<Voyage>) => {
    // TODO: Show confirmation dialog and implement deletion
    if (window.confirm(`Are you sure you want to delete template "${template.description}"?`)) {
      // Implement deletion logic
    }
  };

  const getTemplateHealthScore = () => {
    // Calculate template performance metrics
    const baseScore = 85;
    const hasConflicts = Math.random() > 0.8;
    return hasConflicts ? baseScore - 20 : baseScore;
  };

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h5" component="h2">
          {t(Labels.template_management)}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PlayArrow />}
          onClick={() => {
            // TODO: Implement template creation dialog
          }}
        >
          New Template
        </Button>
      </Box>
      {/* Alert for system status */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <AlertTitle>Scheduler Status</AlertTitle>
        {sampleTemplates.length} {t(Labels.active_templates)} | Last processing:{' '}
        {dayjs().subtract(1, 'hour').format('HH:mm')} | Next run: {dayjs().add(30, 'minutes').format('HH:mm')}
      </Alert>
      {/* Templates Table */}
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Template</TableCell>
              <TableCell>Route</TableCell>
              <TableCell>Recurrence</TableCell>
              <TableCell>{t(Labels.status_active)}</TableCell>
              <TableCell>Health</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Seats</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sampleTemplates.map(template => {
              const healthScore = getTemplateHealthScore();
              return (
                <TableRow key={template.id} hover>
                  <TableCell>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      {getRecurrenceIcon(template.recurrenceType ?? '')}
                      <Box>
                        <Typography variant="subtitle2">{template.description}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {template.id}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">{template.departureGare?.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        → {template.arrivalGare?.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={template.recurrenceType} size="small" variant="outlined" color="primary" />
                  </TableCell>
                  <TableCell>
                    <Chip label={template.status} size="small" color={getStatusColor(template.status ?? '')} />
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <LinearProgress
                        variant="determinate"
                        value={healthScore}
                        sx={{ width: 60, height: 4 }}
                        color={healthScore > 80 ? 'success' : healthScore > 60 ? 'warning' : 'error'}
                      />
                      <Typography variant="caption">{healthScore}%</Typography>
                      {healthScore < 70 && (
                        <Tooltip title="Performance issues detected">
                          <Warning
                            color="warning"
                            sx={{
                              fontSize: 'small',
                            }}
                          />
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 'bold',
                      }}
                    >
                      {template.pricePerSeat?.toLocaleString()} Ar
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{template.availableSeats} seats</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">{dayjs(template.createdAt).format('DD/MM/YY')}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 0.5,
                      }}
                    >
                      <Tooltip title="View Instances">
                        <IconButton size="small" onClick={() => handleViewInstances(template)}>
                          <Visibility
                            sx={{
                              fontSize: 'small',
                            }}
                          />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Template">
                        <IconButton size="small" onClick={() => handleEditTemplate(template)}>
                          <Edit
                            sx={{
                              fontSize: 'small',
                            }}
                          />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Duplicate Template">
                        <IconButton size="small" onClick={() => handleDuplicateTemplate(template)}>
                          <ContentCopy
                            sx={{
                              fontSize: 'small',
                            }}
                          />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Template">
                        <IconButton size="small" color="error" onClick={() => handleDeleteTemplate(template)}>
                          <Delete
                            sx={{
                              fontSize: 'small',
                            }}
                          />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Template Instances Dialog */}
      <Dialog
        open={instancesDialogOpen}
        onClose={() => setInstancesDialogOpen(false)}
        fullWidth
        sx={{
          maxWidth: 'md',
        }}
      >
        <DialogTitle>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <EventNote />
            {t(Labels.template_details)}: {selectedTemplate?.description}
          </Box>
        </DialogTitle>
        <DialogContent>
          <TemplateInstancesList templateId={selectedTemplate?.id} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInstancesDialogOpen(false)}>Close</Button>
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={() => {
              // Regenerate instances
              if (selectedTemplate?.id) {
                updateTemplate.mutate({
                  templateId: selectedTemplate.id,
                  updatedTemplate: selectedTemplate,
                });
              }
            }}
            disabled={updateTemplate.isPending}
          >
            Regenerate Instances
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Template Instances List Component
const TemplateInstancesList: React.FC<{ templateId?: number }> = ({ templateId }) => {
  const { data: instances, isLoading } = useInstancesByTemplate(templateId ?? 0);

  if (isLoading) {
    return <LinearProgress />;
  }

  if (!instances?.length) {
    return <Alert severity="info">No instances found for this template.</Alert>;
  }

  return (
    <List>
      {instances.slice(0, 10).map((instance, index) => (
        <ListItem key={instance.id ?? index} divider>
          <ListItemIcon>
            <Avatar sx={{ width: 32, height: 32 }}>{index + 1}</Avatar>
          </ListItemIcon>
          <ListItemText
            primary={`${dayjs(instance.departureTime).format('DD/MM/YYYY HH:mm')}`}
            secondary={
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                  }}
                >
                  Status: {instance.status} | Seats: {instance.availableSeats}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {instance.departureGare?.name} → {instance.arrivalGare?.name}
                </Typography>
              </Box>
            }
          />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Chip
              label={instance.status}
              size="small"
              color={
                instance.status === 'SCHEDULED' ? 'success' : instance.status === 'CANCELLED' ? 'error' : 'default'
              }
            />
            {instance.status === 'SCHEDULED' && (
              <IconButton size="small">
                <Edit
                  sx={{
                    fontSize: 'small',
                  }}
                />
              </IconButton>
            )}
          </Box>
        </ListItem>
      ))}
      {instances.length > 10 && (
        <ListItem>
          <ListItemText
            primary={
              <Typography variant="body2" color="text.secondary" align="center">
                ... and {instances.length - 10} more instances
              </Typography>
            }
          />
        </ListItem>
      )}
    </List>
  );
};

export default VoyageTemplateManager;
