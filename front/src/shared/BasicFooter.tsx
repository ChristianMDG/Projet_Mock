import React from 'react';
import { Avatar, Box, Button, Container, Divider, Grid, IconButton, Link, Typography } from '@mui/material';
import Email from '@mui/icons-material/Email';
import Facebook from '@mui/icons-material/Facebook';
import LocationOn from '@mui/icons-material/LocationOn';
import Phone from '@mui/icons-material/Phone';
import TaxibrousseRedIcon from '@/components/ui/TaxibrousseRedIcon';
import { TFunction, i18n } from 'i18next';
import Labels from '@/labelKeys.json';
import { ROUTES } from '@/constants/routes';
import ProtectedTx from '@/components/ProtectedTx';
import { useSectionByComponent } from '@/hooks/dynamic-page.hooks';
import { AuthorityEnum } from '@/models/enums';
import { SECTION_TYPES } from '@/constants/section.types';
import type { PaymentSection } from '@/api/dynamic-page.api';
import dayjs from '@/utils/dayjs';

interface BasicFooterProps {
  t: TFunction;
  i18n: i18n;
}

const BasicFooter: React.FC<BasicFooterProps> = ({ t, i18n }) => {
  const currentYear = dayjs().year();
  const { data } = useSectionByComponent(SECTION_TYPES.PAYMENT_SECTION);
  const paymentMethods = (data?.data as PaymentSection)?.paymentMethods;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderTop: 1,
        borderColor: 'divider',
        pt: 3,
        pb: 3,
        mt: 'auto',
        position: 'relative',
      }}
    >
      <Container
        sx={{
          maxWidth: 'lg',
        }}
      >
        {/* Scroll to Top Button */}
        <Button
          size="small"
          variant="outlined"
          onClick={scrollToTop}
          sx={{
            position: 'absolute',
            right: { xs: 16, md: 32 },
            top: { xs: 16, md: 24 },
            py: 0.5,
            pl: 1.3,
            pr: 0.5,
            borderColor: 'divider',
          }}
        >
          {t(Labels.footer_scroll_to_top)} <TaxibrousseRedIcon sx={{ width: 32 }} />
        </Button>

        <Grid container spacing={4}>
          {/* Travel Information */}
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
            <Typography
              variant="h6"
              component="h2"
              gutterBottom
              sx={{
                fontWeight: 'bold',
              }}
            >
              {t(Labels.footer_travel_information)}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href={ROUTES.home[i18n.language]} color="inherit" underline="hover">
                {t(Labels.footer_ticket_booking)}
              </Link>
              <Link href={ROUTES.reservationsList[i18n.language]} color="inherit" underline="hover">
                {t(Labels.footer_check_in)}
              </Link>
              <ProtectedTx allowedRoles={[AuthorityEnum.ADMIN, AuthorityEnum.KOPERATIVE, AuthorityEnum.GUICHET]}>
                <Link href={ROUTES.voyagesList[i18n.language]} color="inherit" underline="hover">
                  {t(Labels.footer_trip_status)}
                </Link>
              </ProtectedTx>
              <Link href={ROUTES.bookingRates[i18n.language]} color="inherit" underline="hover">
                {t(Labels.footer_travel_requirements)}
              </Link>
            </Box>
          </Grid>

          {/* Customer Support */}
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
            <Typography
              variant="h6"
              component="h2"
              gutterBottom
              sx={{
                fontWeight: 'bold',
              }}
            >
              {t(Labels.footer_customer_support)}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href={ROUTES.services[i18n.language]} color="inherit" underline="hover">
                {t(Labels.footer_help_center)}
              </Link>
              <Link href={ROUTES.aboutUs[i18n.language]} color="inherit" underline="hover">
                {t(Labels.footer_contact_information)}
              </Link>
              <Link href={ROUTES.services[i18n.language]} color="inherit" underline="hover">
                {t(Labels.footer_faqs)}
              </Link>
              <Link href={ROUTES.safetyInsurance[i18n.language]} color="inherit" underline="hover">
                {t(Labels.footer_feedback_options)}
              </Link>
            </Box>
          </Grid>

          {/* Company Information */}
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
            <Typography
              variant="h6"
              component="h2"
              gutterBottom
              sx={{
                fontWeight: 'bold',
              }}
            >
              {t(Labels.footer_company_information)}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href={ROUTES.aboutUs[i18n.language]} color="inherit" underline="hover">
                {t(Labels.footer_about_us)}
              </Link>
              <Link href={ROUTES.destinations[i18n.language]} color="inherit" underline="hover">
                {t(Labels.footer_press_releases)}
              </Link>
              <Link href={ROUTES.promotions[i18n.language]} color="inherit" underline="hover">
                {t(Labels.footer_corporate_information)}
              </Link>
            </Box>
          </Grid>

          {/* Legal Policies */}
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
            <Typography
              variant="h6"
              component="h2"
              gutterBottom
              sx={{
                fontWeight: 'bold',
              }}
            >
              {t(Labels.footer_legal_policies)}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href={ROUTES.legalInformation[i18n.language]} color="inherit" underline="hover">
                {t(Labels.footer_terms_service)}
              </Link>
              <Link href={ROUTES.legalInformation[i18n.language]} color="inherit" underline="hover">
                {t(Labels.footer_privacy_policy)}
              </Link>
              <Link href={ROUTES.legalInformation[i18n.language]} color="inherit" underline="hover">
                {t(Labels.footer_cookies_policy)}
              </Link>
              <Link href={ROUTES.legalInformation[i18n.language]} color="inherit" underline="hover">
                {t(Labels.footer_accessibility_statement)}
              </Link>
            </Box>
          </Grid>

          {/* Contact & Social */}
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
            <Typography
              variant="h6"
              component="h2"
              gutterBottom
              sx={{
                fontWeight: 'bold',
              }}
            >
              {t(Labels.footer_contact_information)}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <IconButton
                color="inherit"
                aria-label="Facebook"
                href="https://www.facebook.com/profile.php?id=61570079625295"
                target="_blank"
                sx={{ p: 0, mr: 0.5 }}
              >
                <Facebook />
              </IconButton>
              <Typography variant="body2">Taxibrousse</Typography>
            </Box>

            <ProtectedTx allowedRoles={['ADMIN']}>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Phone
                  sx={{
                    fontSize: 'small',
                  }}
                />
                033 47 603 20
              </Typography>
            </ProtectedTx>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Email
                sx={{
                  fontSize: 'small',
                }}
              />
              contact@taxibrousse.mg
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <LocationOn
                sx={{
                  fontSize: 'small',
                }}
              />
              Lot 123, Antananarivo 101, Madagascar
            </Typography>
            {paymentMethods?.length && (
              <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {paymentMethods.map(method => (
                  <Avatar
                    key={method.id}
                    src={method.logo?.url}
                    alt={method.logo?.alternativeText ?? method.name}
                    sx={{ width: 40, height: 40, bgcolor: 'grey.100', borderRadius: 2 }}
                  />
                ))}
              </Box>
            )}
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {currentYear} Taxibrousse. {t(Labels.footer_all_rights_reserved)}.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t(Labels.footer_tagline)}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default BasicFooter;
