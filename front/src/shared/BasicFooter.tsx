import React, { useState, useEffect } from 'react';
import {
  Avatar,
  Box,
  Container,
  Divider,
  Grid,
  IconButton,
  Link,
  Stack,
  Typography,
  alpha,
  useColorScheme,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import EmailIcon from '@mui/icons-material/Email';
import FacebookIcon from '@mui/icons-material/Facebook';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { TFunction, i18n as I18nType } from 'i18next';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { ROUTES, generateRoute } from '@/constants/routes';
import ProtectedTx from '@/components/ProtectedTx';
import { useTopKoperatives } from '@/hooks/koperative.hooks';
import { AuthorityEnum } from '@/models/enums';
import dayjs from '@/utils/dayjs';

import taxibrousseDark from '@/assets/taxibrousse-dark.svg';
import taxibrousseLight from '@/assets/taxibrousse-light.svg';
import taxibroussePng from '@/assets/taxibrousse.png';
import mvolaLogo from '@/assets/mvola_logo.jpeg';
import orangeMoneyLogo from '@/assets/orange_money_logo.jpeg';
import airtelMoneyLogo from '@/assets/airtel_money_logo.jpeg';

interface BasicFooterProps {
  t?: TFunction;
  i18n?: I18nType;
}

const PAYMENT_METHODS = [
  { id: 'mvola', name: 'MVola', logo: mvolaLogo },
  { id: 'orange', name: 'Orange Money', logo: orangeMoneyLogo },
  { id: 'airtel', name: 'Airtel Money', logo: airtelMoneyLogo },
];

const BasicFooter: React.FC<BasicFooterProps> = ({ t: propT, i18n: propI18n }) => {
  const { t: hookT, i18n: hookI18n } = useTranslation();
  const t = propT ?? hookT;
  const currentI18n = propI18n ?? hookI18n;
  const currentLang = currentI18n.language ?? 'mg';

  const theme = useTheme();
  const currentYear = dayjs().year();

  const { mode: colorMode } = useColorScheme();
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)', {
    defaultMatches: false,
    noSsr: true,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkMode = mounted && (colorMode === 'dark' || (colorMode === 'system' && prefersDark));
  const logoSrc = isDarkMode ? taxibrousseDark : taxibrousseLight;

  const { data: topKoperatives = [] } = useTopKoperatives({ top: 6 });
  const hasCooperatives = topKoperatives.length > 0;

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderTop: 1,
        borderColor: 'divider',
        pt: { xs: 4, md: 5 },
        pb: { xs: 3, md: 4 },
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        {/* Top Header Bar: Logo on Left, Cooperatives floated Right */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            gap: { xs: 2, md: 3 },
            mb: 3.5,
          }}
        >
          {/* Logo & Tagline (Left) */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, flexShrink: 0 }}>
            <Box
              component={RouterLink}
              to={ROUTES.home[currentLang]}
              sx={{ display: 'inline-flex', alignItems: 'center' }}
            >
              <Box
                component="img"
                src={logoSrc}
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  e.currentTarget.src = taxibroussePng;
                }}
                alt="Taxibrousse"
                sx={{ height: { xs: 32, md: 38 }, width: 'auto', objectFit: 'contain' }}
              />
            </Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              {t(Labels.footer_tagline)}
            </Typography>
          </Box>

          {/* List of Cooperatives floated Right with similar proportions to Taxibrousse logo */}
          {hasCooperatives && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: { xs: 'flex-start', md: 'flex-end' },
                flexWrap: 'wrap',
                gap: 1.25,
              }}
            >
              {topKoperatives.map(koperative => {
                const targetSlug = koperative.slug || String(koperative.id);
                const detailUrl = generateRoute.koperativeDetail(targetSlug, currentLang);
                const hasLogo = Boolean(koperative.logoUrl);

                return (
                  <Box
                    key={koperative.id}
                    component={RouterLink}
                    to={detailUrl}
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 1.25,
                      minHeight: { xs: 38, md: 42 },
                      px: 1.5,
                      py: 0.85,
                      borderRadius: 2,
                      textDecoration: 'none',
                      color: 'text.secondary',
                      bgcolor: alpha(theme.palette.text.primary, 0.04),
                      transition: theme.transitions.create(['background-color', 'color', 'transform']),
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                        color: 'primary.main',
                        transform: 'translateY(-1px)',
                      },
                    }}
                  >
                    <Avatar
                      variant="rounded"
                      src={hasLogo ? (koperative.logoUrl ?? undefined) : undefined}
                      alt={koperative.name ?? 'Koperative'}
                      sx={{
                        width: { xs: 26, md: 30 },
                        height: { xs: 26, md: 30 },
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        borderRadius: 1.5,
                        bgcolor: hasLogo ? 'transparent' : 'primary.main',
                        color: hasLogo ? 'text.primary' : 'primary.contrastText',
                        '& img': {
                          objectFit: 'contain',
                        },
                      }}
                    >
                      {koperative.name?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        fontSize: { xs: '0.875rem', md: '0.95rem' },
                        color: 'inherit',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {koperative.name}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Clean 4-Column Navigation Links */}
        <Grid container spacing={{ xs: 3, md: 4 }} sx={{ mb: 4 }}>
          {/* Col 1: Voyages & Réservations */}
          <Grid size={{ xs: 6, sm: 6, md: 3 }}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                color: 'text.secondary',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                display: 'block',
                mb: 1.5,
              }}
            >
              {t(Labels.footer_travel_information)}
            </Typography>
            <Stack spacing={1}>
              <Link
                component={RouterLink}
                to={ROUTES.home[currentLang]}
                underline="hover"
                sx={{ color: 'text.primary', fontSize: '0.875rem', '&:hover': { color: 'primary.main' } }}
              >
                {t(Labels.footer_ticket_booking)}
              </Link>
              <Link
                component={RouterLink}
                to={ROUTES.searchResults[currentLang]}
                underline="hover"
                sx={{ color: 'text.primary', fontSize: '0.875rem', '&:hover': { color: 'primary.main' } }}
              >
                {t(Labels.footer_booking_search)}
              </Link>
              <Link
                component={RouterLink}
                to={ROUTES.reservationsList[currentLang]}
                underline="hover"
                sx={{ color: 'text.primary', fontSize: '0.875rem', '&:hover': { color: 'primary.main' } }}
              >
                {t(Labels.footer_check_in)}
              </Link>
              <Link
                component={RouterLink}
                to={ROUTES.destinations[currentLang]}
                underline="hover"
                sx={{ color: 'text.primary', fontSize: '0.875rem', '&:hover': { color: 'primary.main' } }}
              >
                {t(Labels.footer_destinations)}
              </Link>
              <ProtectedTx allowedRoles={[AuthorityEnum.ADMIN, AuthorityEnum.KOPERATIVE, AuthorityEnum.GUICHET]}>
                <Link
                  component={RouterLink}
                  to={ROUTES.voyagesList[currentLang]}
                  underline="hover"
                  sx={{ color: 'text.primary', fontSize: '0.875rem', '&:hover': { color: 'primary.main' } }}
                >
                  {t(Labels.footer_trip_status)}
                </Link>
              </ProtectedTx>
            </Stack>
          </Grid>

          {/* Col 2: Services & Tarifs */}
          <Grid size={{ xs: 6, sm: 6, md: 3 }}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                color: 'text.secondary',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                display: 'block',
                mb: 1.5,
              }}
            >
              {t(Labels.footer_services_title)}
            </Typography>
            <Stack spacing={1}>
              <Link
                component={RouterLink}
                to={ROUTES.services[currentLang]}
                underline="hover"
                sx={{ color: 'text.primary', fontSize: '0.875rem', '&:hover': { color: 'primary.main' } }}
              >
                {t(Labels.footer_services_title)}
              </Link>
              <Link
                component={RouterLink}
                to={ROUTES.bookingRates[currentLang]}
                underline="hover"
                sx={{ color: 'text.primary', fontSize: '0.875rem', '&:hover': { color: 'primary.main' } }}
              >
                {t(Labels.footer_travel_requirements)}
              </Link>
              <Link
                component={RouterLink}
                to={ROUTES.safetyInsurance[currentLang]}
                underline="hover"
                sx={{ color: 'text.primary', fontSize: '0.875rem', '&:hover': { color: 'primary.main' } }}
              >
                {t(Labels.footer_safety_insurance)}
              </Link>
              <Link
                component={RouterLink}
                to={ROUTES.promotions[currentLang]}
                underline="hover"
                sx={{ color: 'text.primary', fontSize: '0.875rem', '&:hover': { color: 'primary.main' } }}
              >
                {t(Labels.footer_promotions)}
              </Link>
            </Stack>
          </Grid>

          {/* Col 3: Entreprise & Légal */}
          <Grid size={{ xs: 6, sm: 6, md: 3 }}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                color: 'text.secondary',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                display: 'block',
                mb: 1.5,
              }}
            >
              {t(Labels.footer_company_information)}
            </Typography>
            <Stack spacing={1}>
              <Link
                component={RouterLink}
                to={ROUTES.aboutUs[currentLang]}
                underline="hover"
                sx={{ color: 'text.primary', fontSize: '0.875rem', '&:hover': { color: 'primary.main' } }}
              >
                {t(Labels.footer_about_us)}
              </Link>
              <Link
                component={RouterLink}
                to={ROUTES.legalInformation[currentLang]}
                underline="hover"
                sx={{ color: 'text.primary', fontSize: '0.875rem', '&:hover': { color: 'primary.main' } }}
              >
                {t(Labels.footer_legal_policies)}
              </Link>
              <Link
                component={RouterLink}
                to={ROUTES.pageInformations[currentLang]}
                underline="hover"
                sx={{ color: 'text.primary', fontSize: '0.875rem', '&:hover': { color: 'primary.main' } }}
              >
                {t(Labels.footer_informative_pages)}
              </Link>
              <Link
                component={RouterLink}
                to={ROUTES.koperativesList[currentLang] ?? '/koperativa'}
                underline="hover"
                sx={{ color: 'text.primary', fontSize: '0.875rem', '&:hover': { color: 'primary.main' } }}
              >
                {t(Labels.footer_cooperatives_title)}
              </Link>
            </Stack>
          </Grid>

          {/* Col 4: Contact */}
          <Grid size={{ xs: 6, sm: 6, md: 3 }}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                color: 'text.secondary',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                display: 'block',
                mb: 1.5,
              }}
            >
              {t(Labels.footer_contact_information)}
            </Typography>
            <Stack spacing={1.25}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton
                  aria-label="Facebook Taxibrousse"
                  href="https://www.facebook.com/profile.php?id=61570079625295"
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  sx={{ p: 0, color: 'primary.main' }}
                >
                  <FacebookIcon fontSize="small" />
                </IconButton>
                <Link
                  href="https://www.facebook.com/profile.php?id=61570079625295"
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="hover"
                  sx={{ color: 'text.primary', fontSize: '0.875rem' }}
                >
                  Facebook Taxibrousse
                </Link>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                <Link
                  href="mailto:contact@taxibrousse.mg"
                  underline="hover"
                  sx={{ color: 'text.secondary', fontSize: '0.85rem' }}
                >
                  contact@taxibrousse.mg
                </Link>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <LocationOnIcon sx={{ fontSize: 18, color: 'text.secondary', mt: 0.25 }} />
                <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.4 }}>
                  Lot 123, Antananarivo 101, Madagascar
                </Typography>
              </Box>

              <ProtectedTx allowedRoles={[AuthorityEnum.ADMIN]}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PhoneIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    033 81 919 24
                  </Typography>
                </Box>
              </ProtectedTx>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 2.5 }} />

        {/* Bottom Bar: Secure Payment logos & Copyright */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            gap: 2,
          }}
        >
          {/* Payment Methods */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: 'text.secondary' }}>
              <LockOutlinedIcon sx={{ fontSize: 16 }} />
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                {t(Labels.footer_payment_methods_title)} :
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
              {PAYMENT_METHODS.map(method => (
                <Box
                  key={method.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.85,
                    px: 1.25,
                    py: 0.75,
                    borderRadius: 1.5,
                    bgcolor: alpha(theme.palette.text.primary, 0.03),
                  }}
                >
                  <Box
                    component="img"
                    src={method.logo}
                    alt={method.name}
                    sx={{ width: 22, height: 22, borderRadius: 0.5, objectFit: 'contain' }}
                  />
                  <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {method.name}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Copyright */}
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            © {currentYear} Taxibrousse. {t(Labels.footer_all_rights_reserved)}.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default BasicFooter;
