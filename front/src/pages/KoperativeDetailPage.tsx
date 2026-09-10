import React, { Suspense } from 'react';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import KoperativeDetailSkeleton from '@/skeleton/KoperativeDetailSkeleton';
import StoreIcon from '@mui/icons-material/Store';
import SportsMotorsportsIcon from '@mui/icons-material/SportsMotorsports';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

import Grid from '@mui/material/Grid';
import { useParams } from 'react-router-dom';
import {
  useKoperativeBySlug,
  useKoperativeChauffeurs,
  useKoperativeCrafters,
  useKoperativeGuichets,
  useKoperativeVilles,
} from '@/hooks/koperative.hooks';
import { useClassesByKoperative } from '@/hooks/classe.hooks';
import { useOperatorsByKoperative } from '@/hooks/user.hooks';
import { KoperativeStatusEnum } from '@/models/enums';
import Labels from '@/labelKeys.json';
import { useTranslation } from 'react-i18next';
import KoperativeVerifiedIcon from '@/components/shared/KoperativeVerifiedIcon';
import KoperativeAvatar from '@/components/ui/KoperativeAvatar';
import StyledTab from '@/components/ui/StyledTab';
import { getStyledTabListSx } from '@/utils/tabStyles';
import { useAuth } from '@/context/AuthContext';
import { OperatorForm } from '@/components/operator';
import ProtectedTx from '@/components/ProtectedTx';
import SEO from '@/components/shared/SEO';
import { ROUTES } from '@/constants/routes';

// Lazy load heavy tab components for better performance
const GuichetList = React.lazy(() => import('./koperativeDetail/GuichetList'));
const CrafterList = React.lazy(() => import('./koperativeDetail/CrafterList'));
const OperatorList = React.lazy(() => import('./koperativeDetail/OperatorList'));
const VilleList = React.lazy(() => import('./koperativeDetail/VilleList'));
const ChauffeurList = React.lazy(() => import('./koperativeDetail/ChauffeurList'));

// Loading component for tab content
const TabLoadingFallback = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '200px',
    }}
  >
    <CircularProgress />
  </Box>
);

// Helper function to get translated status labels
const getKoperativeStatusLabel = (status: KoperativeStatusEnum, t: (key: string) => string): string => {
  switch (status) {
    case KoperativeStatusEnum.ACTIVE:
      return t(Labels.status_active);
    case KoperativeStatusEnum.INACTIVE:
      return t(Labels.status_inactive);
    case KoperativeStatusEnum.SUSPENDED:
      return t(Labels.status_suspended);
    default:
      return status;
  }
};

const KoperativeDetailPage = () => {
  const [tabId, setTabId] = React.useState('guichets');
  const handleTabChange = (_event: React.SyntheticEvent, tabId: string) => {
    setTabId(tabId);
  };

  const { slug } = useParams<{ slug?: string }>();
  const slugParam = slug?.trim();
  const { data: koperative, isLoading, error } = useKoperativeBySlug(slugParam);

  const koperativeId = koperative?.id ?? 0;

  const { data: operators = [] } = useOperatorsByKoperative(koperativeId);
  const { data: guichets = [], isLoading: guichetsLoading } = useKoperativeGuichets(koperativeId);
  const { data: crafters = [] } = useKoperativeCrafters(koperativeId);
  const { data: villes = [] } = useKoperativeVilles(koperativeId);
  const { data: chauffeurs = [] } = useKoperativeChauffeurs(koperativeId);
  const { data: classes = [] } = useClassesByKoperative(koperativeId);
  const { t } = useTranslation();
  const { user } = useAuth();

  if (isLoading || guichetsLoading) return <KoperativeDetailSkeleton />;

  if (error || !koperative || !slugParam)
    return (
      <Box
        sx={{
          p: 4,
        }}
      >
        <Typography color="error">{t(Labels.ui_error_general)}</Typography>
      </Box>
    );

  const getStatusIconColor = (status: KoperativeStatusEnum) => {
    if (status === KoperativeStatusEnum.ACTIVE) return 'success';
    if (status === KoperativeStatusEnum.INACTIVE) return 'error';
    if (status === KoperativeStatusEnum.SUSPENDED) return 'warning';
    return 'primary';
  };

  const getStatusTextColor = (status: KoperativeStatusEnum) => {
    if (status === KoperativeStatusEnum.ACTIVE) return 'success.main';
    if (status === KoperativeStatusEnum.INACTIVE) return 'error.main';
    if (status === KoperativeStatusEnum.SUSPENDED) return 'warning.main';
    return 'text.secondary';
  };

  const breadcrumbs = [
    { name: t(Labels.nav_home), path: ROUTES.home.fr },
    { name: t(Labels.menu_koperatives), path: ROUTES.koperativesList.fr },
    { name: koperative.name ?? '' },
  ];

  return (
    <Grid container rowSpacing={1} sx={{ pt: 1, mb: 1 }} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
      <SEO
        title={koperative.name}
        description={koperative.description || `${koperative.name} - Coopérative de transport sur Taxibrousse`}
        image={koperative.logoUrl}
        breadcrumbs={breadcrumbs}
      />
      <Grid size={{ xs: 12, md: 4 }}>
        <Card sx={{ mx: 'auto', width: 1 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <KoperativeAvatar logoUrl={koperative.logoUrl} name={koperative.name} sx={{ mr: 2 }} />
              <Box>
                <Typography
                  variant="h4"
                  component="h1"
                  color="error"
                  sx={{ display: 'flex', alignItems: 'center', gap: 0.75, fontWeight: 'bold' }}
                >
                  {koperative.name}
                  <KoperativeVerifiedIcon koperative={koperative} fontSize="small" />
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {koperative.description ?? t(Labels.ui_koperative_description)}
                </Typography>
                {classes.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                    {classes.map(classe => (
                      <Chip key={classe.id} label={classe.name} size="small" variant="outlined" color="primary" />
                    ))}
                  </Box>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>
        {/* User Connected Card */}
        {user && (
          <Card sx={{ mx: 'auto', width: 1, mt: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar alt={user.firstName ?? ''} sx={{ width: 48, height: 48, mr: 2, bgcolor: 'primary.main' }} />
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 'bold',
                    }}
                  >
                    {user.firstName} {user.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.phone}
                  </Typography>
                </Box>
                <Chip label={t(Labels.user_connected)} color="success" size="small" sx={{ ml: 1 }} />
              </Box>
            </CardContent>
          </Card>
        )}
        <Card sx={{ mt: 2, mb: 1, mx: 'auto', width: 1 }}>
          <CardContent>
            <List sx={{ width: 1 }}>
              {[
                {
                  icon: <StoreIcon color="primary" />,
                  label: t(Labels.ui_guichet_name),
                  count: guichets.length,
                  value: 'guichets',
                },
                {
                  icon: <DirectionsCarIcon color="primary" />,
                  label: t(Labels.ui_label_vehicles),
                  count: crafters.length,
                  value: 'crafters',
                },
                {
                  icon: <SportsMotorsportsIcon color="primary" />,
                  label: t(Labels.ui_label_chauffeurs),
                  count: chauffeurs.length,
                  value: 'chauffeurs',
                },
                {
                  icon: <LocationCityIcon color="primary" />,
                  label: t(Labels.ui_label_city),
                  count: villes.length,
                  value: 'villes',
                },
              ].map(item => (
                <ListItemButton
                  key={item.label}
                  sx={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}
                  onClick={() => setTabId(item.value)}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                  <Chip label={item.count} color="secondary" size="small" />
                </ListItemButton>
              ))}
              {koperative.status && (
                <ListItem sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircleIcon color={getStatusIconColor(koperative.status)} />
                  </ListItemIcon>
                  <ListItemText
                    primary={t(getKoperativeStatusLabel(koperative.status, t))}
                    sx={{ display: { xs: 'none', sm: 'block' } }}
                  />
                  <Typography variant="body2" color={getStatusTextColor(koperative.status)}>
                    {getKoperativeStatusLabel(koperative.status, t)}
                  </Typography>
                </ListItem>
              )}
              <ProtectedTx>
                <Divider sx={{ my: 1 }} />
                {koperative.phone && (
                  <ListItem sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <PhoneIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={t(Labels.ui_koperative_phone)}
                      sx={{ display: { xs: 'none', sm: 'block' } }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {koperative.phone}
                    </Typography>
                  </ListItem>
                )}
                {koperative.email && (
                  <ListItem sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <EmailIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={t(Labels.ui_koperative_email)}
                      sx={{ display: { xs: 'none', sm: 'block' } }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {koperative.email}
                    </Typography>
                  </ListItem>
                )}
                {koperative.address && (
                  <ListItem
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <LocationOnIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={t(Labels.ui_koperative_address)} />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, ml: 4.5 }}>
                      {koperative.address}
                    </Typography>
                  </ListItem>
                )}
              </ProtectedTx>
            </List>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <TabContext value={tabId}>
          <TabList onChange={handleTabChange} variant="scrollable" scrollButtons={false} sx={getStyledTabListSx()}>
            {user && (
              <StyledTab
                icon={<AccountCircleIcon />}
                label={t(Labels.my_account)}
                iconPosition="start"
                value="useredit"
              />
            )}
            <StyledTab icon={<StoreIcon />} label={t(Labels.ui_guichet_name)} iconPosition="start" value="guichets" />
            <StyledTab
              icon={<DirectionsCarIcon />}
              label={t(Labels.ui_label_vehicles)}
              iconPosition="start"
              value="crafters"
            />
            <StyledTab
              icon={<SportsMotorsportsIcon />}
              label={t(Labels.ui_label_chauffeurs)}
              iconPosition="start"
              value="chauffeurs"
            />
            <StyledTab
              icon={<PeopleIcon />}
              label={t(Labels.ui_guichet_operateurs)}
              iconPosition="start"
              value="operators"
            />
            <StyledTab
              icon={<LocationCityIcon />}
              label={t(Labels.ui_label_city)}
              iconPosition="start"
              value="villes"
            />
            <StyledTab cardStyle={false} disabled />
          </TabList>
          <TabPanel value="guichets" sx={{ p: 0, py: 2, '& .MuiBox-root': { px: 0 } }}>
            <Suspense fallback={<TabLoadingFallback />}>
              <GuichetList guichets={guichets} koperative={koperative} />
            </Suspense>
          </TabPanel>
          <TabPanel value="crafters" sx={{ p: 0, py: 2, '& .MuiBox-root': { px: 0 } }}>
            <Suspense fallback={<TabLoadingFallback />}>
              <CrafterList koperativeId={koperativeId} />
            </Suspense>
          </TabPanel>
          <TabPanel value="chauffeurs" sx={{ p: 0, py: 2, '& .MuiBox-root': { px: 0 } }}>
            <Suspense fallback={<TabLoadingFallback />}>
              <ChauffeurList koperativeId={koperativeId} />
            </Suspense>
          </TabPanel>
          <TabPanel value="operators" sx={{ p: 0, py: 2, '& .MuiBox-root': { px: 0 } }}>
            <Suspense fallback={<TabLoadingFallback />}>
              <OperatorList operators={operators} koperative={koperative} />
            </Suspense>
          </TabPanel>
          <TabPanel value="villes" sx={{ p: 0, py: 2, '& .MuiBox-root': { px: 0 } }}>
            <Suspense fallback={<TabLoadingFallback />}>
              <VilleList koperativeId={koperativeId} />
            </Suspense>
          </TabPanel>
          {user && (
            <TabPanel value="useredit" sx={{ px: 0, '& .MuiBox-root': { px: 0 } }}>
              <OperatorForm initialData={user} editKoperative={false} />
            </TabPanel>
          )}
        </TabContext>
      </Grid>
    </Grid>
  );
};

export default KoperativeDetailPage;
