import React, { useMemo, useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Paper,
  Select,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import {
  AirlineSeatReclineNormal,
  CalendarMonth,
  ChevronLeft,
  ChevronRight,
  Event as EventIcon,
  MoreVert,
  RouteRounded,
  Schedule,
  ViewList,
} from '@mui/icons-material';
import dayjs, { Dayjs } from 'dayjs';
import { Voyage } from '../../models/Voyage';
import { VoyageStatusEnum } from '../../models/enums';

export interface VoyageInstanceCalendarProps {
  instances: Voyage[];
  isLoading: boolean;
  onEditInstance: (instance: Voyage) => void;
  onDeleteInstance: (instanceId: string) => void;
  onViewSeats: (instance: Voyage) => void;
  onGenerateMore?: () => void;
}

type ViewMode = 'calendar' | 'list';

interface InstanceMenuState {
  anchorEl: HTMLElement | null;
  instance: Voyage | null;
}

export const VoyageInstanceCalendar: React.FC<VoyageInstanceCalendarProps> = ({
  instances,
  isLoading,
  onEditInstance,
  onDeleteInstance,
  onViewSeats,
  onGenerateMore,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [statusFilter, setStatusFilter] = useState<VoyageStatusEnum | 'ALL'>('ALL');
  const [instanceMenu, setInstanceMenu] = useState<InstanceMenuState>({ anchorEl: null, instance: null });

  // Filter instances based on status
  const filteredInstances = useMemo(() => {
    return instances.filter(instance => statusFilter === 'ALL' || instance.status === statusFilter);
  }, [instances, statusFilter]);

  // Group instances by date for calendar view
  const instancesByDate = useMemo(() => {
    const grouped = new Map<string, Voyage[]>();
    filteredInstances.forEach(instance => {
      const date = dayjs(instance.departureTime).format('YYYY-MM-DD');
      if (!grouped.has(date)) {
        grouped.set(date, []);
      }
      grouped.get(date)!.push(instance);
    });
    return grouped;
  }, [filteredInstances]);

  // Get calendar month days
  const calendarDays = useMemo(() => {
    const start = selectedDate.startOf('month').startOf('week');
    const end = selectedDate.endOf('month').endOf('week');
    const days: Dayjs[] = [];
    let current = start;
    while (current.isBefore(end) || current.isSame(end, 'day')) {
      days.push(current);
      current = current.add(1, 'day');
    }
    return days;
  }, [selectedDate]);

  const handleViewModeChange = (_: React.MouseEvent<HTMLElement>, newMode: ViewMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const handleInstanceMenuOpen = (event: React.MouseEvent<HTMLElement>, instance: Voyage) => {
    setInstanceMenu({ anchorEl: event.currentTarget, instance });
  };

  const handleInstanceMenuClose = () => {
    setInstanceMenu({ anchorEl: null, instance: null });
  };

  const handleMenuAction = (action: 'edit' | 'delete' | 'seats') => {
    if (instanceMenu.instance) {
      switch (action) {
        case 'edit':
          onEditInstance(instanceMenu.instance);
          break;
        case 'delete':
          onDeleteInstance(instanceMenu.instance.id!.toString());
          break;
        case 'seats':
          onViewSeats(instanceMenu.instance);
          break;
      }
    }
    handleInstanceMenuClose();
  };

  const getStatusColor = (status: VoyageStatusEnum) => {
    switch (status) {
      case VoyageStatusEnum.SCHEDULED:
        return 'primary';
      case VoyageStatusEnum.ONGOING:
        return 'success';
      case VoyageStatusEnum.COMPLETED:
        return 'success';
      case VoyageStatusEnum.CANCELLED:
        return 'error';
      case VoyageStatusEnum.DELAYED:
        return 'warning';
      default:
        return 'default';
    }
  };

  const renderInstanceCard = (instance: Voyage, compact: boolean = false) => (
    <Card
      key={instance.id}
      sx={{
        mb: compact ? 0.5 : 1,
        minHeight: compact ? 'auto' : 120,
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'action.hover',
        },
      }}
      onClick={() => onViewSeats(instance)}
    >
      <CardContent sx={{ p: compact ? 1 : 2, '&:last-child': { pb: compact ? 1 : 2 } }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <Box
            sx={{
              flex: 1,
            }}
          >
            <Typography variant={compact ? 'caption' : 'subtitle2'} noWrap>
              {instance.description}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                mt: 0.5,
              }}
            >
              <RouteRounded
                color="action"
                sx={{
                  fontSize: 'small',
                }}
              />
              <Typography variant="caption" color="textSecondary">
                {instance.departureGare?.name} → {instance.arrivalGare?.name}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mt: 0.5,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                <Schedule
                  color="action"
                  sx={{
                    fontSize: 'small',
                  }}
                />
                <Typography variant="caption">{dayjs(instance.departureTime).format('HH:mm')}</Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                <AirlineSeatReclineNormal
                  color="action"
                  sx={{
                    fontSize: 'small',
                  }}
                />
                <Typography variant="caption">
                  {instance.availableSeats}/{instance.availableSeats}
                </Typography>
              </Box>
              <Chip
                label={instance.status?.replace('_', ' ')}
                size="small"
                color={getStatusColor(instance.status!)}
                sx={{ height: 20 }}
              />
            </Box>
          </Box>
          {!compact && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <IconButton
                size="small"
                onClick={e => {
                  e.stopPropagation();
                  handleInstanceMenuOpen(e, instance);
                }}
              >
                <MoreVert
                  sx={{
                    fontSize: 'small',
                  }}
                />
              </IconButton>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );

  const renderCalendarView = () => (
    <Box>
      {/* Calendar Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <IconButton onClick={() => setSelectedDate(selectedDate.subtract(1, 'month'))}>
            <ChevronLeft />
          </IconButton>
          <Typography variant="h6">{selectedDate.format('MMMM YYYY')}</Typography>
          <IconButton onClick={() => setSelectedDate(selectedDate.add(1, 'month'))}>
            <ChevronRight />
          </IconButton>
        </Box>
        <Button variant="outlined" size="small" onClick={() => setSelectedDate(dayjs())}>
          Today
        </Button>
      </Box>

      {/* Calendar Grid */}
      <Paper variant="outlined">
        {/* Week Header */}
        <Grid container>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <Grid key={day} size={{ xs: 12 / 7 }}>
              <Box
                sx={{
                  p: 1,
                  textAlign: 'center',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 'bold',
                  }}
                >
                  {day}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Calendar Days */}
        <Box>
          {Array.from({ length: Math.ceil(calendarDays.length / 7) }, (_, weekIndex) => (
            <Grid container key={weekIndex}>
              {calendarDays.slice(weekIndex * 7, (weekIndex + 1) * 7).map(day => {
                const dateKey = day.format('YYYY-MM-DD');
                const dayInstances = instancesByDate.get(dateKey) ?? [];
                const isCurrentMonth = day.month() === selectedDate.month();
                const isToday = day.isSame(dayjs(), 'day');

                return (
                  <Grid key={day.format('YYYY-MM-DD')} size={{ xs: 12 / 7 }}>
                    <Box
                      sx={{
                        opacity: isCurrentMonth ? 1 : 0.5,
                        minHeight: 120,
                        p: 1,
                        bgcolor: isToday ? 'action.selected' : 'background.paper',
                        borderRight: '1px solid',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          mb: 0.5,
                        }}
                      >
                        <Typography
                          variant="caption"
                          color={isToday ? 'primary' : 'text.primary'}
                          sx={{
                            fontWeight: isToday ? 'bold' : 'normal',
                          }}
                        >
                          {day.date()}
                        </Typography>
                        {dayInstances.length > 0 && <Badge badgeContent={dayInstances.length} color="primary" />}
                      </Box>
                      <Box>
                        {dayInstances.slice(0, 2).map(instance => renderInstanceCard(instance, true))}
                        {dayInstances.length > 2 && (
                          <Typography variant="caption" color="textSecondary">
                            +{dayInstances.length - 2} more
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          ))}
        </Box>
      </Paper>
    </Box>
  );

  const renderListView = () => (
    <Box>
      {/* List Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'between',
          mb: 2,
        }}
      >
        <Typography variant="h6">{filteredInstances.length} Voyages</Typography>
        {onGenerateMore && (
          <Button variant="outlined" onClick={onGenerateMore}>
            Generate More
          </Button>
        )}
      </Box>

      {/* Instances List */}
      <Box>
        {filteredInstances.map(instance => (
          <Box
            key={instance.id}
            sx={{
              mb: 1,
            }}
          >
            {renderInstanceCard(instance)}
          </Box>
        ))}
        {filteredInstances.length === 0 && (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <EventIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="textSecondary">
              No voyage instances found
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {statusFilter !== 'ALL'
                ? `No voyages with status "${statusFilter}"`
                : 'Try creating some voyage templates with recurrence patterns'}
            </Typography>
          </Paper>
        )}
      </Box>
    </Box>
  );

  return (
    <Box>
      {/* Controls */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'between',
          mb: 3,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <ToggleButtonGroup value={viewMode} exclusive onChange={handleViewModeChange} size="small">
            <ToggleButton value="calendar">
              <CalendarMonth />
            </ToggleButton>
            <ToggleButton value="list">
              <ViewList />
            </ToggleButton>
          </ToggleButtonGroup>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as VoyageStatusEnum | 'ALL')}
              label="Status"
            >
              <MenuItem value="ALL">All Status</MenuItem>
              {Object.values(VoyageStatusEnum).map((status: VoyageStatusEnum) => (
                <MenuItem key={status} value={status}>
                  {status.replace('_', ' ')}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Typography variant="body2" color="textSecondary">
          {filteredInstances.length} of {instances.length} voyages
        </Typography>
      </Box>
      {/* Content */}
      {isLoading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            py: 4,
          }}
        >
          <Typography>Loading voyage instances...</Typography>
        </Box>
      ) : (
        <>{viewMode === 'calendar' ? renderCalendarView() : renderListView()}</>
      )}
      {/* Instance Menu */}
      <Menu anchorEl={instanceMenu.anchorEl} open={Boolean(instanceMenu.anchorEl)} onClose={handleInstanceMenuClose}>
        <MenuItem onClick={() => handleMenuAction('seats')}>
          <AirlineSeatReclineNormal sx={{ mr: 1 }} />
          View Seats
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('edit')}>Edit Instance</MenuItem>
        <MenuItem onClick={() => handleMenuAction('delete')}>Delete Instance</MenuItem>
      </Menu>
    </Box>
  );
};

export default VoyageInstanceCalendar;
