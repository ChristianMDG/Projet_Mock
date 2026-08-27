import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BusinessIcon from '@mui/icons-material/Business';
import EditIcon from '@mui/icons-material/Edit';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import StoreIcon from '@mui/icons-material/Store';

import { useTranslation } from 'react-i18next';
import { useGareById } from '@/hooks/gare.hooks';
import { useAvailableDestinations, useDeleteRoute } from '@/hooks/route.hooks';
import Labels from '@/labelKeys.json';
import ButtonTx from '@/components/ui/ButtonTx';
import StyledIcon from '@/components/ui/StyledIcon';
import { RouteFormDrawer, RouteList } from '@/components/gare';
import GareFormDrawer from './gareDetail/GareFormDrawer';
import KoperativeDetailSkeleton from '@/skeleton/KoperativeDetailSkeleton';

import { Route } from '@/models/Route';
import Noimage from '@/assets/noimage.png';
import { ROUTES, generateRoute } from '@/constants/routes';
import SEO from '@/components/shared/SEO';

const SAMPLE_PHOTOS: { img: string; title: string; author: string }[] = [];

const GareDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const isMobileQuery = useMediaQuery(theme => theme.breakpoints.down('sm'), {
    defaultMatches: false,
    noSsr: true,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const isMobile = mounted ? isMobileQuery : false;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [routeFormOpen, setRouteFormOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<Route | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [routeToDelete, setRouteToDelete] = useState<Route | undefined>();

  const gareId = id ? parseInt(id, 10) : undefined;
  const { data: gare, isLoading, error } = useGareById(gareId);
  const { data: availableRoutes = [] } = useAvailableDestinations(gareId ?? 0);
  const deleteRouteMutation = useDeleteRoute();

  // Event handlers
  const handleBack = () => navigate(ROUTES.garesList[i18n.language]);
  const handleEdit = () => setDrawerOpen(true);
  const handleCloseDrawer = () => setDrawerOpen(false);
  const handleAddRoute = () => {
    setSelectedRoute(undefined);
    setRouteFormOpen(true);
  };
  const handleEditRoute = (route: Route) => {
    setSelectedRoute(route);
    setRouteFormOpen(true);
  };
  const handleDeleteRoute = (route: Route) => {
    setRouteToDelete(route);
    setDeleteDialogOpen(true);
  };
  const handleConfirmDelete = () => {
    if (routeToDelete) {
      deleteRouteMutation.mutate(routeToDelete.id!);
    }
    setDeleteDialogOpen(false);
    setRouteToDelete(undefined);
  };
  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setRouteToDelete(undefined);
  };
  const handleCloseRouteForm = () => {
    setRouteFormOpen(false);
    setSelectedRoute(undefined);
  };

  // Loading state
  if (isLoading) {
    return <KoperativeDetailSkeleton />;
  }

  // Error state
  if (error || !gare) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          {error ? `${t(Labels.ui_error_general)}: ${error.message}` : t(Labels.ui_error_not_found)}
        </Alert>
        <ButtonTx variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mt: 2 }} hideTextOnMobile>
          {t(Labels.ui_button_back_to_list)}
        </ButtonTx>
      </Box>
    );
  }

  // Prepare photos data with consistent structure
  const photos = gare.photos && gare.photos.length > 0 ? gare.photos : SAMPLE_PHOTOS;
  const hasRealPhotos = gare.photos && gare.photos.length > 0;

  const breadcrumbs = [
    { name: t(Labels.nav_home), path: ROUTES.home.fr },
    { name: t(Labels.menu_stations), path: ROUTES.garesList.fr },
    { name: gare.name ?? '' },
  ];

  return (
    <Box sx={{ pt: 2 }}>
      <SEO title={gare.name} description={gare.description ?? gare.address} breadcrumbs={breadcrumbs} />
      <Box sx={{ mb: 3 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{
            alignItems: { xs: 'stretch', sm: 'center' },
            justifyContent: 'space-between',
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            sx={{
              flex: 1,
              minWidth: 0,
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <IconButton onClick={handleBack} aria-label={t(Labels.ui_button_back_to_list)}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant={isMobile ? 'h6' : 'h4'} component="h1" noWrap sx={{ flexShrink: 1, minWidth: 0 }}>
              {gare.name}
            </Typography>
            <Chip
              label={gare.isClosed ? t(Labels.ui_status_closed) : t(Labels.ui_status_open)}
              color={gare.isClosed ? 'error' : 'success'}
              variant="outlined"
              sx={{ flexShrink: 0 }}
            />
          </Stack>
          <ButtonTx variant="contained" startIcon={<AddIcon />} onClick={handleAddRoute}>
            {t(Labels.button_add_route)}
          </ButtonTx>
          <ButtonTx
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleEdit}
            sx={{ mt: { xs: 2, sm: 0 }, width: { xs: '100%', sm: 'auto' } }}
          >
            {t(Labels.ui_button_modify)}
          </ButtonTx>
        </Stack>
      </Box>
      <Grid container spacing={2}>
        <Grid size={12}>
          <RouteList gareId={gare.id!} onEditRoute={handleEditRoute} onDeleteRoute={handleDeleteRoute} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {t(Labels.ui_label_city)}
                </Typography>
                <Typography variant="body1">{gare.ville?.name ?? 'N/A'}</Typography>
              </Box>

              {gare.ville?.province && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {t(Labels.ui_label_province)}
                  </Typography>
                  <Typography variant="body1">{gare.ville.province}</Typography>
                </Box>
              )}

              {gare.ville?.region && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {t(Labels.ui_label_region)}
                  </Typography>
                  <Typography variant="body1">{gare.ville.region}</Typography>
                </Box>
              )}

              {gare.address && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {t(Labels.ui_label_address)}
                  </Typography>
                  <Typography variant="body1">{gare.address}</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader
              subheader={gare.name}
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PhotoLibraryIcon color="primary" />
                  <Typography variant="h6" component="span">
                    {`${t(Labels.ui_label_photos)} (${photos.length})`}
                  </Typography>
                </Box>
              }
            />

            {photos.length > 0 ? (
              <CardContent sx={{ p: 1 }}>
                <Box sx={{ width: '100%', height: 450, overflowY: 'scroll', mx: 'auto' }}>
                  <ImageList
                    variant="masonry"
                    sx={{
                      mt: 0,
                      gap: 8,
                    }}
                    cols={3}
                  >
                    {photos.map((item, index) => {
                      // Type guard to determine which type of photo we have
                      const isCloudinary = hasRealPhotos && 'publicId' in item;
                      const photo = item as Record<string, string>;
                      const key = isCloudinary ? (photo.id ?? photo.publicId) : `sample-${index}`;
                      const imgSrc = isCloudinary ? photo.url : photo.img;
                      const imgAlt = isCloudinary ? (photo.publicId ?? 'Photo') : (photo.title ?? 'Photo');
                      const imgTitle = isCloudinary ? photo.publicId : (photo.author ?? 'Photo');

                      return (
                        <ImageListItem key={key}>
                          <img
                            srcSet={`${imgSrc}?w=248&fit=crop&auto=format&dpr=2 2x`}
                            src={`${imgSrc}?w=248&fit=crop&auto=format`}
                            alt={imgAlt}
                            loading="lazy"
                          />
                          <ImageListItemBar
                            title={imgTitle}
                            sx={{
                              position: 'below',
                            }}
                          />
                        </ImageListItem>
                      );
                    })}
                  </ImageList>
                </Box>
              </CardContent>
            ) : (
              <CardContent sx={{ p: 1 }}>
                <Box
                  sx={{
                    width: '100%',
                    height: 450,
                    overflowY: 'auto',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                    }}
                  >
                    <Box
                      component="img"
                      src={Noimage}
                      alt="No Data"
                      loading="lazy"
                      sx={{
                        width: 200,
                        height: 'auto',
                        opacity: 0.8,
                        mb: 1,
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      No Data Available
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            )}
          </Card>
        </Grid>

        {/* Right Column - Guichets */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardHeader
              subheader={`${gare.name} (${gare.guichets?.length ?? 0} Koperatives)`}
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <StoreIcon color="primary" />
                  <Typography variant="h6" component="span">
                    {t(Labels.ui_label_counters)}
                  </Typography>
                </Box>
              }
            />
            <CardContent>
              {gare.guichets && gare.guichets.length > 0 ? (
                <Grid container spacing={2}>
                  {gare.guichets.map(guichet => (
                    <Grid key={guichet.id} size={{ xs: 12, sm: 6 }}>
                      <Card>
                        <CardActionArea
                          onClick={() =>
                            navigate(generateRoute.koperativeDetail(guichet.koperative?.slug ?? '', i18n.language))
                          }
                        >
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <StyledIcon icon={BusinessIcon} variant="secondary" />
                              <Typography variant="h5">{guichet.koperative?.name}</Typography>
                            </Box>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Card sx={{ p: 4, textAlign: 'center' }}>
                  <Typography color="text.secondary" variant="h6">
                    {t(Labels.ui_message_no_counters)}
                  </Typography>
                  <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>
                    {t(Labels.ui_message_contact_create_counter)}
                  </Typography>
                </Card>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <GareFormDrawer open={drawerOpen} onClose={handleCloseDrawer} initialData={gare} />
      <RouteFormDrawer
        open={routeFormOpen}
        onClose={handleCloseRouteForm}
        initialData={selectedRoute}
        defaultDepartureGare={gare}
        availableGares={availableRoutes}
      />
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">{t(Labels.delete_confirmation_title)}</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            {routeToDelete && (
              <Typography variant="h6" component="span">
                {routeToDelete.departureGare?.name} → {routeToDelete.arrivalGare?.name}
              </Typography>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <ButtonTx onClick={handleCancelDelete} color="primary">
            {t(Labels.ui_cancel)}
          </ButtonTx>
          <ButtonTx onClick={handleConfirmDelete} color="error" variant="contained">
            {t(Labels.ui_delete)}
          </ButtonTx>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GareDetailPage;
