import { Box, Container, Typography, Grid, Divider, alpha } from '@mui/material';
import { Link } from 'react-router-dom';
import taxibrousseDarkLocUrl from '@/assets/taxibrousse-dark-loc.svg?url';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';

const getFooterColumns = (t: any) => [
  {
    title: t(Labels.rental_footer_vehicles),
    links: [
      { label: t(Labels.rental_footer_city_cars), path: '/voitures' },
      { label: t(Labels.rental_footer_suv), path: '/voitures' },
      { label: t(Labels.rental_footer_minibus), path: '/utilitaires' },
      { label: t(Labels.rental_footer_vans), path: '/utilitaires' },
    ],
  },
  {
    title: t(Labels.rental_footer_agencies),
    links: [
      { label: 'Antananarivo', path: '/agences' },
      { label: 'Toamasina', path: '/agences' },
      { label: 'Mahajanga', path: '/agences' },
      { label: 'Fianarantsoa', path: '/agences' },
    ],
  },
  {
    title: t(Labels.rental_footer_info),
    links: [
      { label: t(Labels.rental_footer_how_to_rent), path: '/guide' },
      { label: t(Labels.rental_footer_terms), path: '/conditions' },
      { label: t(Labels.rental_footer_insurance), path: '/contact' },
      { label: t(Labels.rental_footer_help_center), path: '/contact' },
    ],
  },
  {
    title: t(Labels.rental_footer_about),
    links: [
      { label: t(Labels.rental_footer_who_are_we), path: '/a-propos' },
      { label: t(Labels.rental_footer_careers), path: '/a-propos' },
      { label: t(Labels.rental_footer_press), path: '/a-propos' },
      { label: t(Labels.rental_footer_contact), path: '/contact' },
    ],
  },
];

export default function RentalFooter() {
  const { t } = useTranslation();
  const footerColumns = getFooterColumns(t);
  return (
    <Box component="footer" sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', pt: 6, pb: 3 }}>
      <Container maxWidth="lg">
        {/* Logo */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Box component="img" src={taxibrousseDarkLocUrl} alt="Taxibrousse Location" sx={{ height: 36 }} />
          </Box>
          <Typography variant="body2" sx={{ opacity: 0.65 }}>
            {t(Labels.rental_footer_slogan)}
          </Typography>
        </Box>

        <Divider sx={{ borderColor: theme => alpha(theme.palette.primary.contrastText, 0.12), mb: 4 }} />

        {/* Columns */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {footerColumns.map(col => (
            <Grid size={{ xs: 6, md: 3 }} key={col.title}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, mb: 1.5, opacity: 0.9, textTransform: 'uppercase', letterSpacing: '0.05em' }}
              >
                {col.title}
              </Typography>
              <Box
                component="ul"
                sx={{ listStyle: 'none', p: 0, m: 0, display: 'flex', flexDirection: 'column', gap: 0.75 }}
              >
                {col.links.map(link => (
                  <Box component="li" key={link.label}>
                    <Box
                      component={Link}
                      to={link.path}
                      sx={{
                        color: theme => alpha(theme.palette.primary.contrastText, 0.6),
                        textDecoration: 'none',
                        fontSize: '0.85rem',
                        transition: 'color 0.15s',
                        '&:hover': { color: 'primary.contrastText' },
                      }}
                    >
                      {link.label}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ borderColor: theme => alpha(theme.palette.primary.contrastText, 0.12), mb: 3 }} />

        {/* Bottom */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
          }}
        >
          <Typography variant="caption" sx={{ opacity: 0.45 }}>
            {t(Labels.rental_footer_copyright, { year: new Date().getFullYear() })}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {[
              { label: t(Labels.rental_footer_legal), path: '/conditions' },
              { label: t(Labels.rental_footer_privacy), path: '/conditions' },
              { label: t(Labels.rental_footer_cookies), path: '/conditions' },
            ].map(item => (
              <Box
                key={item.label}
                component={Link}
                to={item.path}
                sx={{
                  color: theme => alpha(theme.palette.primary.contrastText, 0.45),
                  textDecoration: 'none',
                  fontSize: '0.75rem',
                  '&:hover': { color: theme => alpha(theme.palette.primary.contrastText, 0.9) },
                }}
              >
                {item.label}
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
