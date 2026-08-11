import React from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Rating,
  Typography,
} from '@mui/material';
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator } from '@mui/lab';
import {
  Business,
  CheckCircle,
  Email,
  EmojiEventsOutlined,
  Handshake,
  LocationOn,
  NatureOutlined,
  People,
  Phone,
  Schedule,
  Shield,
  TrendingUp,
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { useKoperative } from '@/hooks/koperative.hooks';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { KoperativeAvatar } from '@/components/ui';
import { VehicleIcon } from '@/components/shared';
import SEO from '@/components/shared/SEO';

// Static data for fallback/default display
const staticCooperative = {
  id: 1,
  name: 'COTISSE',
  fullName: 'Coopérative de Transport Inter-urbain du Sud-Est',
  logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=120&h=120&fit=crop&crop=center',
  coverImage: 'https://images.unsplash.com/photo-1570125909517-53cb21c89ff2?w=800&h=400&fit=crop',
  founded: 1995,
  headquarters: 'Antsirabe',
  description:
    'COTISSE est une coopérative de transport leader à Madagascar, spécialisée dans les liaisons inter-urbaines. Depuis près de 30 ans, nous nous engageons à offrir un service de transport sûr, confortable et ponctuel pour tous nos passagers.',
  rating: 4.6,
  totalReviews: 2840,
  fleetSize: 85,
  dailyTrips: 120,
  routes: ['Antananarivo - Antsirabe', 'Antsirabe - Fianarantsoa', 'Antananarivo - Ambositra'],
  specialties: ['Confort Premium', 'Ponctualité', 'Sécurité Renforcée'],
  certifications: ['ISO 9001:2015', 'Certification Sécurité Transport Madagascar', 'Label Éco-responsable'],
  contact: {
    phone: '+261 20 44 123 45',
    email: 'contact@cotisse.mg',
    address: "Avenue de l'Indépendance, Antsirabe 110",
  },
  stats: {
    onTimePerformance: 94,
    customerSatisfaction: 92,
    safetyRecord: 99.8,
    experienceYears: 29,
  },
};

const services = [
  {
    name: 'Transport Standard',
    description: 'Service de base avec sièges confortables et climatisation',
    features: ['Sièges rembourrés', 'Climatisation', "Musique d'ambiance"],
    price: 'À partir de 12 000 Ar',
  },
  {
    name: 'Confort Plus',
    description: "Service premium avec sièges inclinables et plus d'espace",
    features: ['Sièges inclinables', "Plus d'espace jambes", 'Collation incluse', 'WiFi gratuit'],
    price: 'À partir de 18 000 Ar',
  },
  {
    name: 'VIP Executive',
    description: "Service haut de gamme pour un voyage d'exception",
    features: ['Sièges première classe', 'Service personnalisé', 'Repas inclus', 'Priorité embarquement'],
    price: 'À partir de 25 000 Ar',
  },
];

const commitments = [
  {
    title: 'Sécurité Maximale',
    description: 'Maintenance régulière de notre flotte et formation continue de nos chauffeurs',
    icon: <Shield />,
    color: 'error' as const,
  },
  {
    title: "Respect de l'Environnement",
    description: 'Véhicules aux normes Euro 6 et programme de compensation carbone',
    icon: <NatureOutlined />,
    color: 'success' as const,
  },
  {
    title: 'Ponctualité Garantie',
    description: "94% de nos voyages arrivent à l'heure prévue",
    icon: <Schedule />,
    color: 'primary' as const,
  },
  {
    title: 'Service Client',
    description: 'Équipe dédiée disponible 24h/7j pour vous accompagner',
    icon: <People />,
    color: 'info' as const,
  },
];

const milestones = [
  { year: 1995, event: 'Création de COTISSE avec 5 véhicules' },
  { year: 2000, event: 'Extension vers Fianarantsoa - 20 véhicules' },
  { year: 2010, event: 'Certification ISO 9001 et modernisation de la flotte' },
  { year: 2015, event: 'Lancement du service VIP Executive' },
  { year: 2020, event: 'Partenariat TaxiBrousse Digital' },
  { year: 2024, event: '85 véhicules, leader sur la route Antananarivo-Antsirabe' },
];

const KoperativeInfoPage: React.FC = () => {
  const { id } = useParams();
  const koperativeId = id ? parseInt(id, 10) : 0;
  const { data: koperative, isLoading, error } = useKoperative(koperativeId);
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          p: 4,
        }}
      >
        <Typography color="error">{t(Labels.ui_error_general)}</Typography>
      </Box>
    );
  }

  // Merge API data with static fallback
  const cooperative = {
    ...staticCooperative,
    id: koperative?.id ?? staticCooperative.id,
    name: koperative?.name ?? staticCooperative.name,
    fullName: koperative?.description ?? staticCooperative.fullName,
    logo: koperative?.logoUrl ?? staticCooperative.logo,
    coverImage: staticCooperative.coverImage,
    description: koperative?.description ?? staticCooperative.description,
    routes: koperative?.routes ?? staticCooperative.routes,
    rating: staticCooperative.rating,
    totalReviews: staticCooperative.totalReviews,
    founded: staticCooperative.founded,
    headquarters: staticCooperative.headquarters,
    specialties: staticCooperative.specialties,
    fleetSize: staticCooperative.fleetSize,
    dailyTrips: staticCooperative.dailyTrips,
    certifications: staticCooperative.certifications,
    contact: {
      phone: koperative?.phone ?? staticCooperative.contact.phone,
      email: koperative?.email ?? staticCooperative.contact.email,
      address: koperative?.address ?? staticCooperative.contact.address,
    },
    stats: staticCooperative.stats,
  };

  return (
    <Container
      sx={{
        px: '0 !important',
        maxWidth: 'lg',
      }}
    >
      <SEO title={cooperative.name} description={cooperative.description} />
      {/* En-tête avec image de couverture */}
      <Card sx={{ mb: 4, overflow: 'hidden' }}>
        <CardMedia
          component="img"
          image={cooperative.coverImage}
          alt={cooperative.name}
          sx={{
            objectFit: 'cover',
            height: '300',
          }}
        />
        <CardContent sx={{ position: 'relative' }}>
          <Box sx={{ position: 'absolute', top: -50, left: 24 }}>
            <KoperativeAvatar
              logoUrl={koperative?.logoUrl}
              name={cooperative.name}
              sx={{ width: 100, height: 100, border: '4px solid white', fontSize: '2rem' }}
            />
          </Box>

          <Box sx={{ ml: { xs: 0, md: 14 }, mt: { xs: 6, md: 0 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography
                variant="h3"
                component="h1"
                color="primary"
                sx={{
                  fontWeight: 'bold',
                }}
              >
                {cooperative.name}
              </Typography>
              {koperative?.status === 'CONFIRMED' && <Chip icon={<CheckCircle />} label="Certifiée" color="success" />}
            </Box>

            <Typography variant="h6" color="text.secondary" gutterBottom>
              {cooperative.fullName}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                <Rating value={cooperative.rating} precision={0.1} readOnly size="small" />
                <Typography variant="body2">
                  {cooperative.rating} ({cooperative.totalReviews.toLocaleString()} avis)
                </Typography>
              </Box>
              <Chip label={`Fondée en ${cooperative.founded}`} variant="outlined" size="small" />
              <Chip label={cooperative.headquarters} variant="outlined" size="small" icon={<LocationOn />} />
            </Box>

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {cooperative.specialties.map(specialty => (
                <Chip key={specialty} label={specialty} color="primary" variant="outlined" size="small" />
              ))}
            </Box>
          </Box>
        </CardContent>
      </Card>
      <Grid container spacing={4}>
        {/* Colonne principale */}
        <Grid size={{ xs: 12, md: 8 }}>
          {/* Description */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Business color="primary" />À Propos de {cooperative.name}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {cooperative.description}
              </Typography>

              <Alert severity="info" sx={{ mt: 2 }}>
                Avec {cooperative.stats.experienceYears} ans d'expérience, {cooperative.name} transporte plus de 500 000
                passagers par an en toute sécurité.
              </Alert>
            </CardContent>
          </Card>

          {/* Services */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <VehicleIcon color="primary" />
                Nos Services
              </Typography>

              <Grid container spacing={3}>
                {services.map(service => (
                  <Grid key={service.name} size={{ xs: 12, md: 6, lg: 4 }}>
                    <Paper variant="outlined" sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {service.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {service.description}
                        </Typography>

                        <List dense>
                          {service.features.map(feature => (
                            <ListItem key={feature} disablePadding>
                              <ListItemIcon sx={{ minWidth: 32 }}>
                                <CheckCircle
                                  color="success"
                                  sx={{
                                    fontSize: 'small',
                                  }}
                                />
                              </ListItemIcon>
                              <ListItemText primary={<Typography variant="body2">{feature}</Typography>} />
                            </ListItem>
                          ))}
                        </List>

                        <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                          <Typography variant="subtitle2" color="primary">
                            {service.price}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* Engagements */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Handshake color="primary" />
                Nos Engagements
              </Typography>

              <Grid container spacing={3}>
                {commitments.map(commitment => (
                  <Grid key={commitment.title} size={{ xs: 12, md: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Avatar sx={{ bgcolor: `${commitment.color}.main` }}>{commitment.icon}</Avatar>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {commitment.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {commitment.description}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* Histoire */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <EmojiEventsOutlined color="primary" />
                Notre Histoire
              </Typography>

              <Timeline>
                {milestones.map((milestone, index) => (
                  <TimelineItem key={milestone.year}>
                    <TimelineSeparator>
                      <TimelineDot color="primary" />
                      {index < milestones.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography variant="subtitle2" color="primary">
                        {milestone.year}
                      </Typography>
                      <Typography variant="body2">{milestone.event}</Typography>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid size={{ xs: 12, md: 4 }}>
          {/* Statistiques */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <TrendingUp color="primary" />
                Statistiques Clés
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Ponctualité</Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 'bold',
                    }}
                  >
                    {cooperative.stats.onTimePerformance}%
                  </Typography>
                </Box>
                <LinearProgress variant="determinate" value={cooperative.stats.onTimePerformance} color="success" />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Satisfaction Client</Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 'bold',
                    }}
                  >
                    {cooperative.stats.customerSatisfaction}%
                  </Typography>
                </Box>
                <LinearProgress variant="determinate" value={cooperative.stats.customerSatisfaction} color="info" />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Sécurité</Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 'bold',
                    }}
                  >
                    {cooperative.stats.safetyRecord}%
                  </Typography>
                </Box>
                <LinearProgress variant="determinate" value={cooperative.stats.safetyRecord} color="error" />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Grid
                container
                spacing={2}
                sx={{
                  textAlign: 'center',
                }}
              >
                <Grid size={6}>
                  <Typography variant="h6" color="primary">
                    {cooperative.fleetSize}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                    }}
                  >
                    {t(Labels.ui_label_vehicles)}
                  </Typography>
                </Grid>
                <Grid size={6}>
                  <Typography variant="h6" color="primary">
                    {cooperative.dailyTrips}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                    }}
                  >
                    Trajets/jour
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t(Labels.footer_contact_information)}
              </Typography>

              <List>
                <ListItem disablePadding sx={{ mb: 1 }}>
                  <ListItemIcon>
                    <Phone color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={cooperative.contact.phone} />
                </ListItem>

                <ListItem disablePadding sx={{ mb: 1 }}>
                  <ListItemIcon>
                    <Email color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={cooperative.contact.email} />
                </ListItem>

                <ListItem disablePadding sx={{ mb: 1 }}>
                  <ListItemIcon>
                    <LocationOn color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={<Typography variant="body2">{cooperative.contact.address}</Typography>} />
                </ListItem>
              </List>

              <Button variant="contained" startIcon={<VehicleIcon />} fullWidth sx={{ mt: 2 }}>
                {t(Labels.footer_ticket_booking)}
              </Button>
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Certifications & Labels
              </Typography>

              {cooperative.certifications.map(cert => (
                <Chip
                  key={cert}
                  label={cert}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0.5 }}
                  icon={<EmojiEventsOutlined />}
                />
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default KoperativeInfoPage;
