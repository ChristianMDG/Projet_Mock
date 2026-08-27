import React, { useState, useMemo, useCallback } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Fab,
  FormControl,
  Grid,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
  Avatar,
} from '@mui/material';
import ButtonTx from '@/components/ui/ButtonTx';
import IconButtonTx from '@/components/ui/IconButtonTx';
import StyledIcon from '@/components/ui/StyledIcon';
import AddIcon from '@mui/icons-material/AddRounded';
import BusinessIcon from '@mui/icons-material/BusinessRounded';
import EditIcon from '@mui/icons-material/EditRounded';
import ExpandMoreIcon from '@mui/icons-material/ExpandMoreRounded';
import LocationOnIcon from '@mui/icons-material/LocationOnRounded';
import PersonIcon from '@mui/icons-material/PersonRounded';
import PhoneIcon from '@mui/icons-material/PhoneRounded';
import { useOperators } from '@/hooks/operator.hooks';
import { useKoperatives } from '@/hooks/koperative.hooks';
import { useGares } from '@/hooks/gare.hooks';
import { UserOperator } from '@/types';
import { OperatorFilter } from '@/api/operator.api';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import Labels from '@/labelKeys.json';
import { Koperative } from '@/models/Koperative';
import { Gare } from '@/models/Gare';

import { OperatorFormDrawer } from '@/pages/koperativeDetail/OperatorFormDrawer';
import { formatPhoneForDisplay } from '@/utils/phoneUtils';
import ProtectedTx from '@/components/ProtectedTx';
import { AuthorityEnum } from '@/models/enums';
import KoperativeAutocomplete from '@/components/shared/KoperativeAutocomplete';
import GareAutocomplete from '@/components/shared/GareAutocomplete';
import HydrationSafe from '@/components/shared/HydrationSafe';
import VehicleIcon from '@/components/shared/VehicleIcon';
import OperatorListSkeleton from '@/skeleton/OperatorListSkeleton';
import SEO from '@/components/shared/SEO';
import DepartureBoardIcon from '@mui/icons-material/DepartureBoard';

interface GroupedOperators {
  [gareId: string]: {
    gareName: string;
    operators: UserOperator[];
  };
}

const addOperatorToStationGroup = (operator: UserOperator, groups: GroupedOperators): void => {
  for (const guichet of operator.guichets ?? []) {
    if (guichet.gare) {
      const gareKey = `gare-${guichet.gare.id}`;
      if (!groups[gareKey]) {
        groups[gareKey] = {
          gareName: guichet.gare.name,
          operators: [],
        };
      }
      // Prevent duplicate operators in the same group
      if (!groups[gareKey].operators.some(op => op.id === operator.id)) {
        groups[gareKey].operators.push(operator);
      }
    }
  }
};

const addOperatorToUnassignedGroup = (
  operator: UserOperator,
  groups: GroupedOperators,
  t: (key: string) => string,
): void => {
  const noGuichetKey = 'no-guichet';
  if (!groups[noGuichetKey]) {
    groups[noGuichetKey] = {
      gareName: t(Labels.operator_no_station_assigned),
      operators: [],
    };
  }
  groups[noGuichetKey].operators.push(operator);
};

export const OperatorPage: React.FC = () => {
  // Hooks
  const { t } = useTranslation();
  const { user } = useAuth();
  const isAdminOrOperator = user?.admin ?? user?.authorities?.some(a => a.name === AuthorityEnum.OPERATOR);
  // Check if the logged-in user has a koperative
  const userKoperativeId = user?.koperative?.id;

  // Local state management
  const [expandedGroup, setExpandedGroup] = useState<string | false>(false);
  const [filter, setFilter] = useState<Partial<OperatorFilter>>(() => ({
    ...(userKoperativeId ? { koperativeId: userKoperativeId } : {}),
  }));
  const [operatorDrawerOpen, setOperatorDrawerOpen] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState<UserOperator | null>(null);

  // Data fetching hooks
  const { data: operators = [], isLoading, error } = useOperators(filter);
  const { data: koperatives = [] } = useKoperatives();
  const { data: gares = [] } = useGares();

  const groupedOperators: GroupedOperators = useMemo(() => {
    const groups: GroupedOperators = {};

    for (const operator of operators) {
      const hasGuichets = operator.guichets && operator.guichets.length > 0;

      if (hasGuichets) {
        addOperatorToStationGroup(operator, groups);
      } else {
        addOperatorToUnassignedGroup(operator, groups, t);
      }
    }

    return groups;
  }, [operators, t]);

  const handleToggleGroup = useCallback(
    (groupKey: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedGroup(isExpanded ? groupKey : false);
    },
    [],
  );

  const handleAddOperator = useCallback(() => {
    setSelectedOperator(null);
    setOperatorDrawerOpen(true);
  }, []);

  const handleEditOperator = useCallback((operator: UserOperator) => {
    setSelectedOperator(operator);
    setOperatorDrawerOpen(true);
  }, []);

  const handleFilterChange = useCallback((newFilter: Partial<OperatorFilter>) => {
    setFilter(prev => ({ ...prev, ...newFilter }));
  }, []);

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
        }}
      >
        <Typography color="error">{t(Labels.operator_load_error)}</Typography>
      </Box>
    );
  }

  return (
    <>
      <SEO title={t(Labels.operator_management_title)} />
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            sx={{
              alignItems: 'center',
            }}
          >
            <Box sx={{ minWidth: 250, width: '100%' }}>
              <KoperativeAutocomplete
                id="operator-filter-koperative"
                value={koperatives.find(k => k.id === filter.koperativeId) ?? null}
                onChange={value => handleFilterChange({ koperativeId: (value as Koperative)?.id })}
                disabled={!!userKoperativeId}
                label={t(Labels.filter_by_cooperative)}
                placeholder={t(Labels.filter_by_cooperative)}
                startIcon={VehicleIcon}
                options={koperatives}
              />
            </Box>

            <Box sx={{ minWidth: 250, width: '100%' }}>
              <GareAutocomplete
                id="operator-filter-gare"
                value={gares.find(g => g.id === filter.gareId) ?? null}
                onChange={value => handleFilterChange({ gareId: (value as Gare)?.id })}
                label={t(Labels.filter_by_gare)}
                placeholder={t(Labels.filter_by_gare)}
                startIcon={DepartureBoardIcon}
              />
            </Box>

            <Box sx={{ minWidth: 200, width: '100%' }}>
              <FormControl fullWidth>
                <InputLabel id="operator-status-filter-label">{t(Labels.operator_status_filter)}</InputLabel>
                <Select
                  id="operator-status-filter"
                  labelId="operator-status-filter-label"
                  value={(() => {
                    if (filter.isActive === undefined) return 'all';
                    return filter.isActive ? 'active' : 'inactive';
                  })()}
                  onChange={e => {
                    if (e.target.value === 'all') {
                      const { isActive, ...newFilter } = filter;
                      setFilter(newFilter);
                    } else {
                      handleFilterChange({ isActive: e.target.value === 'active' });
                    }
                  }}
                  label={t(Labels.operator_status_filter)}
                >
                  <MenuItem value="all">{t(Labels.operator_status_all)}</MenuItem>
                  <MenuItem value="active">{t(Labels.operator_status_active)}</MenuItem>
                  <MenuItem value="inactive">{t(Labels.operator_status_inactive)}</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Stack>
        </CardContent>
      </Card>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          {t(Labels.operator_management_title)}
        </Typography>
        <ButtonTx
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddOperator}
          sx={{ display: { xs: 'none', sm: 'flex' } }}
          hideTextOnMobile
        >
          {t(Labels.operator_page_add_button)}
        </ButtonTx>
      </Box>
      <HydrationSafe fallback={<OperatorListSkeleton />}>
        {isLoading ? (
          <OperatorListSkeleton />
        ) : (
          <>
            <Stack spacing={3}>
              {Object.entries(groupedOperators).map(([groupKey, group]) => (
                <Accordion
                  key={groupKey}
                  expanded={expandedGroup === groupKey}
                  onChange={handleToggleGroup(groupKey)}
                  sx={{
                    '&:before': { display: 'none' },
                    boxShadow: 1,
                    borderRadius: 2,
                    '&.Mui-expanded': { boxShadow: 2 },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`${groupKey}-content`}
                    id={`${groupKey}-header`}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        width: '100%',
                      }}
                    >
                      <LocationOnIcon color="primary" />
                      <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        {group.gareName}
                      </Typography>
                      <Typography variant="body2" color="primary" sx={{ fontWeight: 'medium' }}>
                        {group.operators.length} opérateur{group.operators.length > 1 ? 's' : ''}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 0 }}>
                    <List>
                      {group.operators.map((operator, index) => (
                        <React.Fragment key={operator.id}>
                          <ListItem sx={{ flexDirection: 'column', alignItems: 'stretch', py: 2 }}>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                mb: 1.5,
                              }}
                            >
                              <Box
                                sx={{
                                  minWidth: 0,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 2,
                                }}
                              >
                                <Avatar
                                  src={operator.photo?.url}
                                  alt={`${operator.firstName} ${operator.lastName}`}
                                  sx={{
                                    width: 64,
                                    height: 64,
                                    bgcolor: 'primary.main',
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold',
                                  }}
                                >
                                  {operator.firstName?.charAt(0)}
                                  {operator.lastName?.charAt(0)}
                                </Avatar>

                                <Box sx={{ minWidth: 0 }}>
                                  <Typography
                                    variant="subtitle1"
                                    sx={{
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: { xs: 'normal', sm: 'nowrap' },
                                      fontWeight: 'medium',
                                    }}
                                  >
                                    {operator.firstName} {operator.lastName}
                                  </Typography>

                                  {operator.idNumber && (
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                      sx={{ whiteSpace: { xs: 'normal', sm: 'nowrap' } }}
                                    >
                                      {operator.idNumber}
                                    </Typography>
                                  )}
                                </Box>
                              </Box>
                              <Chip
                                label={
                                  operator.isActive
                                    ? t(Labels.operator_status_active)
                                    : t(Labels.operator_status_inactive)
                                }
                                color={operator.isActive ? 'success' : 'default'}
                                size="small"
                                variant="outlined"
                              />
                            </Box>
                            <Grid
                              container
                              spacing={1}
                              sx={{
                                alignItems: 'center',
                              }}
                            >
                              <Grid size={8}>
                                <Stack spacing={1}>
                                  {/* Le mail doit etre null, et rempli par les utilisateur */}
                                  {/* {operator.email && (
                                    <Box display="flex" alignItems="center" gap={0.5}>
                                      <EmailIcon fontSize="small" color="action" />
                                      <Typography variant="body2" color="text.secondary">
                                        {operator.email}
                                      </Typography>
                                    </Box>
                                  )} */}
                                  {operator.phone && isAdminOrOperator && (
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5,
                                      }}
                                    >
                                      <PhoneIcon
                                        color="action"
                                        sx={{
                                          fontSize: 'small',
                                        }}
                                      />
                                      <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                          fontWeight: 'bold',
                                        }}
                                      >
                                        {formatPhoneForDisplay(operator.phone)}
                                      </Typography>
                                    </Box>
                                  )}
                                </Stack>
                              </Grid>
                              <Grid
                                size={4}
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'flex-end',
                                  alignItems: 'center',
                                }}
                              >
                                {operator.koperative && (
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 0.5,
                                    }}
                                  >
                                    <BusinessIcon
                                      color="action"
                                      sx={{
                                        fontSize: 'small',
                                      }}
                                    />
                                    <Typography
                                      variant="body2"
                                      color="text.primary"
                                      sx={{
                                        fontWeight: 'bold',
                                      }}
                                    >
                                      {operator.koperative.name}
                                    </Typography>
                                  </Box>
                                )}
                                <IconButtonTx
                                  allowedRoles={['ADMIN', 'KOPERATIVE']}
                                  size="large"
                                  edge="end"
                                  aria-label="edit"
                                  onClick={() => handleEditOperator(operator)}
                                >
                                  <StyledIcon icon={EditIcon} />
                                </IconButtonTx>
                              </Grid>
                            </Grid>
                          </ListItem>
                          {index < group.operators.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Stack>

            {Object.keys(groupedOperators).length === 0 && (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <PersonIcon color="action" sx={{ fontSize: 64, mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {t(Labels.operator_page_no_operators)}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 3,
                  }}
                >
                  {t(Labels.operator_page_add_first)}
                </Typography>
                <ButtonTx
                  allowedRoles={['ADMIN', 'KOPERATIVE']}
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddOperator}
                >
                  {t(Labels.operator_page_add_button)}
                </ButtonTx>
              </Paper>
            )}
          </>
        )}
      </HydrationSafe>
      <ProtectedTx allowedRoles={['KOPERATIVE', 'ADMIN', 'GUICHET']}>
        <Fab
          color="primary"
          aria-label="add"
          onClick={handleAddOperator}
          sx={{ position: 'fixed', bottom: 16, right: 88, display: { xs: 'flex', sm: 'none' } }}
        >
          <AddIcon />
        </Fab>

        {/* Operator Form Drawer */}
        <OperatorFormDrawer
          open={operatorDrawerOpen}
          onClose={() => setOperatorDrawerOpen(false)}
          initialData={selectedOperator ?? undefined}
        />
      </ProtectedTx>
    </>
  );
};
