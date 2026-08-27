import { Box, Container, Typography, alpha, Paper } from '@mui/material';
import { useState } from 'react';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import StyledTab from '@/components/ui/StyledTab';
import rentalHero from '../assets/rental-hero.png';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';

export default function RentalTermsPage() {
  const { t } = useTranslation();
  const [value, setValue] = useState('0');

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <>
      <Box component="main" sx={{ flexGrow: 1, pb: 8 }}>
        <Box
          sx={{
            position: 'relative',
            py: { xs: 6, md: 8 },
            backgroundImage: `url(${rentalHero})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: theme => alpha(theme.palette.primary.main, 0.8),
            },
          }}
        >
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 800,
                color: 'primary.contrastText',
                mb: 2,
                textShadow: theme => `0 2px 8px ${alpha(theme.palette.common.black, 0.3)}`,
              }}
            >
              {t(Labels.rental_terms_hero_title)}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 400,
                color: theme => alpha(theme.palette.primary.contrastText, 0.9),
                textShadow: theme => `0 1px 4px ${alpha(theme.palette.common.black, 0.3)}`,
                maxWidth: 600,
              }}
            >
              {t(Labels.rental_terms_hero_desc)}
            </Typography>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ mt: 6 }}>
          <Paper
            variant="outlined"
            sx={{
              borderRadius: 3,
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              overflow: 'hidden',
            }}
          >
            <TabContext value={value}>
              <TabList
                orientation="vertical"
                variant="scrollable"
                onChange={handleChange}
                aria-label={t(Labels.rental_terms_tabs_aria)}
                sx={{
                  borderRight: 1,
                  borderColor: 'divider',
                  minWidth: { md: 250 },
                  bgcolor: 'background.default',
                }}
              >
                <StyledTab
                  label={t(Labels.rental_terms_tab_cgv)}
                  value="0"
                  cardStyle={false}
                  sx={{ alignItems: 'flex-start', textAlign: 'left', py: 2 }}
                />
                <StyledTab
                  label={t(Labels.rental_terms_tab_legal)}
                  value="1"
                  cardStyle={false}
                  sx={{ alignItems: 'flex-start', textAlign: 'left', py: 2 }}
                />
                <StyledTab
                  label={t(Labels.rental_terms_tab_privacy)}
                  value="2"
                  cardStyle={false}
                  sx={{ alignItems: 'flex-start', textAlign: 'left', py: 2 }}
                />
                <StyledTab
                  label={t(Labels.rental_terms_tab_cookies)}
                  value="3"
                  cardStyle={false}
                  sx={{ alignItems: 'flex-start', textAlign: 'left', py: 2 }}
                />
              </TabList>

              <Box sx={{ flexGrow: 1, minHeight: 400 }}>
                <TabPanel value="0" sx={{ p: { xs: 2, md: 4 } }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                    {t(Labels.rental_terms_cgv_title)}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }} color="text.secondary">
                    <strong>{t(Labels.rental_terms_cgv_1_title)}</strong>
                    <br />
                    {t(Labels.rental_terms_cgv_1_desc)}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }} color="text.secondary">
                    <strong>{t(Labels.rental_terms_cgv_2_title)}</strong>
                    <br />
                    {t(Labels.rental_terms_cgv_2_desc)}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }} color="text.secondary">
                    <strong>{t(Labels.rental_terms_cgv_3_title)}</strong>
                    <br />
                    {t(Labels.rental_terms_cgv_3_desc)}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }} color="text.secondary">
                    <strong>{t(Labels.rental_terms_cgv_4_title)}</strong>
                    <br />
                    {t(Labels.rental_terms_cgv_4_desc)}
                  </Typography>
                </TabPanel>

                <TabPanel value="1" sx={{ p: { xs: 2, md: 4 } }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                    {t(Labels.rental_terms_legal_title)}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }} color="text.secondary">
                    <strong>{t(Labels.rental_terms_legal_publisher_title)}</strong>
                    <br />
                    Taxibrousse Location SAS
                    <br />
                    {t(Labels.rental_terms_legal_publisher_capital)} 10 000 000 MGA
                    <br />
                    {t(Labels.rental_terms_legal_publisher_hq)} Analakely, Antananarivo 101, Madagascar
                    <br />
                    NIF : 1234567890
                    <br />
                    STAT : 987654321
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }} color="text.secondary">
                    <strong>{t(Labels.rental_terms_legal_director_title)}</strong>
                    <br />
                    {t(Labels.rental_terms_legal_director_name)}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }} color="text.secondary">
                    <strong>{t(Labels.rental_terms_legal_host_title)}</strong>
                    <br />
                    AWS (Amazon Web Services)
                    <br />
                    Tour Carpe Diem, 31 Place des Corolles, 92400 Courbevoie, France
                  </Typography>
                </TabPanel>

                <TabPanel value="2" sx={{ p: { xs: 2, md: 4 } }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                    {t(Labels.rental_terms_privacy_title)}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }} color="text.secondary">
                    <strong>{t(Labels.rental_terms_privacy_1_title)}</strong>
                    <br />
                    {t(Labels.rental_terms_privacy_1_desc)}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }} color="text.secondary">
                    <strong>{t(Labels.rental_terms_privacy_2_title)}</strong>
                    <br />
                    {t(Labels.rental_terms_privacy_2_desc)}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }} color="text.secondary">
                    <strong>{t(Labels.rental_terms_privacy_3_title)}</strong>
                    <br />
                    {t(Labels.rental_terms_privacy_3_desc)}
                  </Typography>
                </TabPanel>

                <TabPanel value="3" sx={{ p: { xs: 2, md: 4 } }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                    {t(Labels.rental_terms_cookies_title)}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }} color="text.secondary">
                    <strong>{t(Labels.rental_terms_cookies_1_title)}</strong>
                    <br />
                    {t(Labels.rental_terms_cookies_1_desc)}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }} color="text.secondary">
                    <strong>{t(Labels.rental_terms_cookies_2_title)}</strong>
                    <br />
                    {t(Labels.rental_terms_cookies_2_desc_1)}
                    <br />
                    {t(Labels.rental_terms_cookies_2_desc_2)}
                    <br />
                    {t(Labels.rental_terms_cookies_2_desc_3)}
                  </Typography>
                </TabPanel>
              </Box>
            </TabContext>
          </Paper>
        </Container>
      </Box>
    </>
  );
}
