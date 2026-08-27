import { Suspense, useEffect, useState } from 'react';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Avatar, Box, Card, CardContent, Chip, CircularProgress, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import BusinessIcon from '@mui/icons-material/Business';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BookIcon from '@mui/icons-material/Book';
import Loyalty from '@mui/icons-material/Loyalty';

import Labels from '@/labelKeys.json';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import StyledTab from '@/components/ui/StyledTab';
import { getStyledTabListSx } from '@/utils/tabStyles';
import { useAuth } from '@/context/AuthContext';
import AccountReservationList from '@/components/account/AccountReservationList';
import AccountPreviousVoyagesList from '@/components/account/AccountPreviousVoyagesList';
import AccountFavoritesKoperativeList from '@/components/account/AccountFavoritesKoperativeList';
import AccountLoyaltyPoints from '@/components/account/AccountLoyaltyPoints';
import UserForm from '@/components/forms/UserForm';
import { convertPhoneToDisplay } from '@/utils/phoneUtils';
import PromotionBanner from '@/components/banner/PromotionBanner';
import Section from '@/components/section/Section';
import { ROUTES, SECTION_TYPES } from '@/constants';
import SEO from '@/components/shared/SEO';
import ProtectedTx from '@/components/ProtectedTx';

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

const AccountDetailPage = () => {
  const [tabId, setTabId] = useState('reservations');
  const handleTabChange = (_event: React.SyntheticEvent, tabId: string) => {
    setTabId(tabId);
  };

  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      return;
    }
    navigate(ROUTES.home[i18n.language]);
  }, [user, navigate, i18n.language]);

  return (
    <Grid container rowSpacing={1} sx={{ pt: 1, mb: 1 }} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
      <SEO title={t(Labels.my_account)} />
      <Grid size={{ xs: 12, md: 4 }}>
        {/* Promotion Banner - To Show when configured */}
        <ProtectedTx>
          <PromotionBanner />
        </ProtectedTx>

        {/* User Profile Card */}
        {user && (
          <Card sx={{ mx: 'auto', width: 1, mt: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Avatar
                  src={user.photo?.url}
                  alt={`${user.firstName} ${user.lastName}`}
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: 'primary.main',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                  }}
                >
                  {user.firstName?.charAt(0)}
                  {user.lastName?.charAt(0)}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography
                      variant="h6"
                      noWrap
                      sx={{
                        fontWeight: 'bold',
                      }}
                    >
                      {user.firstName} {user.lastName}
                    </Typography>
                    <Chip label={t(Labels.user_connected)} color="success" size="small" />
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}
                  >
                    {user.phone && convertPhoneToDisplay(user.phone)}
                  </Typography>
                  {user.email && (
                    <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-word' }}>
                      {user.email}
                    </Typography>
                  )}
                  {user.idNumber && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                      {t(Labels.operator_form_idnumber_label)}: {user.idNumber}
                    </Typography>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <TabContext value={tabId}>
          <TabList onChange={handleTabChange} variant="scrollable" scrollButtons={false} sx={getStyledTabListSx()}>
            <StyledTab
              icon={<BookmarksIcon />}
              label={t(Labels.reservation_in_progress)}
              iconPosition="start"
              value="reservations"
            />
            <StyledTab icon={<BookIcon />} label={t(Labels.voyages_previous)} iconPosition="start" value="voyages" />
            <StyledTab
              icon={<BusinessIcon />}
              label={t(Labels.kooperatives)}
              iconPosition="start"
              value="koperatives"
            />
            <StyledTab
              icon={<AccountCircleIcon />}
              label={t(Labels.update_account)}
              iconPosition="start"
              value="updateAccount"
            />
            <StyledTab icon={<Loyalty />} label={t(Labels.loyality_points)} iconPosition="start" value="loyalty" />
          </TabList>

          {/* Current Reservations Tab */}
          <TabPanel value="reservations" sx={{ p: 0, py: 2, '& .MuiBox-root': { px: 0 } }}>
            <Suspense fallback={<TabLoadingFallback />}>
              <AccountReservationList />
            </Suspense>
          </TabPanel>

          {/* Previous Voyages Tab */}
          <TabPanel value="voyages" sx={{ p: 0, py: 2, '& .MuiBox-root': { px: 0 } }}>
            <Suspense fallback={<TabLoadingFallback />}>
              {user && <AccountPreviousVoyagesList voyageurId={user?.id} />}
            </Suspense>
          </TabPanel>

          {/* Favorite Koperatives Tab */}
          <TabPanel value="koperatives" sx={{ p: 0, py: 2, '& .MuiBox-root': { px: 0 } }}>
            <Suspense fallback={<TabLoadingFallback />}>
              {user && <AccountFavoritesKoperativeList voyageurId={user?.id} />}
            </Suspense>
          </TabPanel>

          {/* Update Account Tab */}
          <TabPanel value="updateAccount" sx={{ p: 0, py: 2, '& .MuiBox-root': { px: 0 } }}>
            <Suspense fallback={<TabLoadingFallback />}>{user && <UserForm initialData={user} />}</Suspense>
          </TabPanel>

          {/* Loyalty Points Tab */}
          <TabPanel value="loyalty" sx={{ p: 0, py: 2, '& .MuiBox-root': { px: 0 } }}>
            <Suspense fallback={<TabLoadingFallback />}>{user && <AccountLoyaltyPoints userId={user?.id} />}</Suspense>
          </TabPanel>
        </TabContext>
      </Grid>
      {/* Help and FAQ section for account management */}
      <Grid size={12} sx={{ mt: 4 }}>
        <Section
          section={{
            id: 1,
            __component: 'page.section-reference',
            sectionTitle: '',
            sectionType: SECTION_TYPES.FAQ_SECTION,
          }}
          hide
        />
      </Grid>
      {/* Help Center section for additional support */}
      <Grid size={12} sx={{ mt: 2 }}>
        <Section
          section={{
            id: 2,
            __component: 'page.section-reference',
            sectionTitle: '',
            sectionType: SECTION_TYPES.HELP_CENTER_SECTION,
          }}
          hide
        />
      </Grid>
    </Grid>
  );
};

export default AccountDetailPage;
