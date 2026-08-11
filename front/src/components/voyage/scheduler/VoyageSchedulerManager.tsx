import React, { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { Analytics, EventNote, PlayArrow, Refresh, Schedule, Settings, Stop } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { useBatchGenerateInstances, useProcessActiveTemplates, useSchedulerStats } from '@/hooks/scheduler.hooks';
import dayjs from '@/utils/dayjs';

interface VoyageSchedulerManagerProps {
  koperativeId?: number;
}

const VoyageSchedulerManager: React.FC<VoyageSchedulerManagerProps> = ({ koperativeId }) => {
  const { t } = useTranslation();
  const [batchDialogOpen, setBatchDialogOpen] = useState(false);
  const [selectedTemplateIds, setSelectedTemplateIds] = useState<number[]>([]);
  const [maxInstances, setMaxInstances] = useState(50);
  const [autoProcess, setAutoProcess] = useState(false);

  // Hooks
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useSchedulerStats(koperativeId);
  const processTemplates = useProcessActiveTemplates();
  const batchGenerate = useBatchGenerateInstances();

  const handleProcessAll = async () => {
    try {
      await processTemplates.mutateAsync();
      refetchStats();
    } catch (error) {
      console.error('Error processing templates:', error);
    }
  };

  const handleBatchGenerate = async () => {
    try {
      await batchGenerate.mutateAsync({
        templateIds: selectedTemplateIds,
        maxInstancesPerTemplate: maxInstances,
      });
      setBatchDialogOpen(false);
      refetchStats();
    } catch (error) {
      console.error('Error batch generating:', error);
    }
  };

  const getStatusColor = (
    status: string,
  ): 'primary' | 'secondary' | 'default' | 'error' | 'info' | 'success' | 'warning' => {
    switch (status) {
      case 'SCHEDULED':
        return 'primary';
      case 'IN_PROGRESS':
        return 'warning';
      case 'COMPLETED':
        return 'success';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getRecurrenceTypeIcon = (type: string) => {
    switch (type) {
      case 'WEEKLY':
        return <EventNote />;
      case 'MONTHLY':
        return <Schedule />;
      case 'CUSTOM':
        return <Settings />;
      default:
        return <Schedule />;
    }
  };

  if (statsLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          p: 3,
        }}
      >
        <Typography>Loading scheduler stats...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          {t(Labels.voyage_scheduler_manager)}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: 1,
          }}
        >
          <Button
            variant="contained"
            startIcon={<PlayArrow />}
            onClick={handleProcessAll}
            disabled={processTemplates.isPending}
            color="primary"
          >
            {t(Labels.process_all_templates)}
          </Button>
          <Button variant="outlined" startIcon={<Refresh />} onClick={() => refetchStats()}>
            {t(Labels.refresh)}
          </Button>
        </Box>
      </Box>
      {/* Status Alert */}
      {stats && (
        <Alert
          severity={stats.activeTemplates > 0 ? 'info' : 'warning'}
          sx={{ mb: 3 }}
          action={
            <Tooltip title="Enable auto-processing">
              <FormControlLabel
                control={<Switch checked={autoProcess} onChange={e => setAutoProcess(e.target.checked)} size="small" />}
                label="Auto"
              />
            </Tooltip>
          }
        >
          {stats.activeTemplates > 0
            ? `${stats.activeTemplates} active templates ready for processing`
            : 'No active templates found'}
        </Alert>
      )}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        {/* Overview Statistics */}
        <Box>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t(Labels.scheduler_overview)}
              </Typography>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    textAlign: 'center',
                    p: 2,
                  }}
                >
                  <Typography variant="h4" color="primary">
                    {stats?.totalTemplates ?? 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t(Labels.total_templates)}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    textAlign: 'center',
                    p: 2,
                  }}
                >
                  <Typography variant="h4" color="success.main">
                    {stats?.activeTemplates ?? 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t(Labels.active_templates)}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    textAlign: 'center',
                    p: 2,
                  }}
                >
                  <Typography variant="h4" color="info.main">
                    {stats?.totalInstances ?? 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t(Labels.total_instances)}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    textAlign: 'center',
                    p: 2,
                  }}
                >
                  <Typography variant="h4" color="warning.main">
                    {stats?.upcomingInstances ?? 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t(Labels.upcoming_instances)}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Average instances per template */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant="body1">{t(Labels.average_instances_per_template)}</Typography>
                <Chip
                  label={stats?.averageInstancesPerTemplate?.toFixed(1) ?? '0.0'}
                  color="primary"
                  variant="outlined"
                />
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Bottom Section with Action Cards */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 3,
          }}
        >
          {/* Quick Actions */}
          <Box
            sx={{
              flex: 1,
            }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t(Labels.quick_actions)}
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                  }}
                >
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Analytics />}
                    onClick={() => setBatchDialogOpen(true)}
                    disabled={!stats?.totalTemplates}
                  >
                    {t(Labels.batch_generate)}
                  </Button>

                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Stop />}
                    color="error"
                    disabled={!stats?.upcomingInstances}
                  >
                    {t(Labels.cancel_all_upcoming)}
                  </Button>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="body2" color="text.secondary">
                  <strong>Last Updated:</strong>
                  <br />
                  {dayjs().format('DD/MM/YYYY HH:mm')}
                </Typography>
              </CardContent>
            </Card>
          </Box>

          {/* Recurrence Type Breakdown */}
          <Box
            sx={{
              flex: 1,
            }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t(Labels.instances_by_recurrence_type)}
                </Typography>

                {stats?.instancesByRecurrenceType &&
                  Object.entries(stats.instancesByRecurrenceType).map(([type, count]) => (
                    <Box
                      key={type}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        py: 1,
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        {getRecurrenceTypeIcon(type)}
                        <Typography variant="body1">{type}</Typography>
                      </Box>
                      <Chip label={count} size="small" />
                    </Box>
                  ))}
              </CardContent>
            </Card>
          </Box>

          {/* Status Breakdown */}
          <Box
            sx={{
              flex: 1,
            }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t(Labels.instances_by_status)}
                </Typography>

                {stats?.instancesByStatus &&
                  Object.entries(stats.instancesByStatus).map(([status, count]) => (
                    <Box
                      key={status}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        py: 1,
                      }}
                    >
                      <Typography variant="body1">{status}</Typography>
                      <Chip label={count} size="small" color={getStatusColor(status)} />
                    </Box>
                  ))}
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
      {/* Batch Generate Dialog */}
      <Dialog
        open={batchDialogOpen}
        onClose={() => setBatchDialogOpen(false)}
        fullWidth
        sx={{
          maxWidth: 'sm',
        }}
      >
        <DialogTitle>{t(Labels.batch_generate_instances)}</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              py: 2,
            }}
          >
            <TextField
              fullWidth
              label={t(Labels.template_ids)}
              placeholder="1,2,3"
              value={selectedTemplateIds.join(',')}
              onChange={e =>
                setSelectedTemplateIds(
                  e.target.value
                    .split(',')
                    .map(id => parseInt(id.trim()))
                    .filter(Boolean),
                )
              }
              helperText={t(Labels.template_ids_help)}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              type="number"
              label={t(Labels.max_instances_per_template)}
              value={maxInstances}
              onChange={e => setMaxInstances(parseInt(e.target.value) || 50)}
              slotProps={{ htmlInput: { min: 1, max: 200 } }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBatchDialogOpen(false)}>{t(Labels.ui_cancel)}</Button>
          <Button
            onClick={handleBatchGenerate}
            variant="contained"
            disabled={batchGenerate.isPending || selectedTemplateIds.length === 0}
          >
            {t(Labels.generate)}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VoyageSchedulerManager;
