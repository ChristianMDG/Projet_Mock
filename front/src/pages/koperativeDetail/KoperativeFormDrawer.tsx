import React, { useEffect, useMemo, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Chip,
  Container,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  styled,
  SwipeableDrawer,
  TextField,
  Typography,
} from '@mui/material';
import ButtonTx from '@/components/ui/ButtonTx';
import IconButtonTx from '@/components/ui/IconButtonTx';
import StyledIcon from '@/components/ui/StyledIcon';
import { grey } from '@mui/material/colors';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import SaveIcon from '@mui/icons-material/Save';
import BusinessIcon from '@mui/icons-material/Business';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import { Ville } from '@/types';
import type { KoperativeFormDrawerProps, VilleSelectionListProps } from '@/types/type.props';
import { useCreateKoperative, useUpdateKoperative } from '@/hooks/koperative.hooks';
import { useNavigate } from 'react-router-dom';
import { useVilles } from '@/hooks/ville.hooks';
import { useCloudinaryUpload } from '@/hooks/cloudinary.hook';
import { KoperativeStatusEnum, KoperativeTypeEnum } from '@/models/enums';
import { KoperativeStatusLabels, KoperativeTypeLabels } from '@/models/enums';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import useKoperativeFormStore from '@/stores/koperative-form.store';
import { generateRoute } from '@/constants/routes';

const Puller = styled('div')(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: grey[300],
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
  ...theme.applyStyles('dark', {
    backgroundColor: grey[900],
  }),
}));

const KoperativeFormDrawer: React.FC<KoperativeFormDrawerProps> = ({ open, onClose, initialData = {} }) => {
  const { t, i18n } = useTranslation();

  // --- ZUSTAND STATE ---
  const { form, loading, villeFilter, error, updateForm, setLoading, setVilleFilter, setError, resetForm } =
    useKoperativeFormStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- EFFECTS ---
  useEffect(() => {
    resetForm(initialData);
  }, [initialData, resetForm]);

  // --- HOOKS ---
  const updateKoperative = useUpdateKoperative();
  const createKoperative = useCreateKoperative();
  const { data: villes } = useVilles();
  const { upload: uploadLogo, uploading: uploadingLogo, error: uploadLogoError } = useCloudinaryUpload('logos');
  const navigate = useNavigate();

  // --- HANDLERS ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateForm({ [e.target.name]: e.target.value });
  };

  const handleDeleteLogo = () => {
    updateForm({ logoUrl: undefined });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    if (loading) return;
    try {
      setLoading(true);
      setError(null);
      let koperativeId: number | undefined;
      if (typeof form.id === 'number' && form.id > 0) {
        await updateKoperative.mutateAsync({ id: form.id, koperative: form });
        koperativeId = form.id;
      } else {
        const result = await createKoperative.mutateAsync(form);
        koperativeId = result?.id;
      }
      onClose();
      if (koperativeId && form.slug) navigate(generateRoute.koperativeDetail(form.slug, i18n.language));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Une erreur est survenue lors de la sauvegarde.');
    } finally {
      setLoading(false);
    }
  };

  // --- VILLES LOGIC ---
  const checkedVilles = useMemo(() => (form.villes ? form.villes.map((v: Ville) => Number(v.id)) : []), [form.villes]);

  const filteredVilles = useMemo(() => {
    if (!villes) return [];
    if (!villeFilter.trim()) return villes;
    return villes.filter(v => v.name!.toLowerCase().includes(villeFilter.trim().toLowerCase()));
  }, [villes, villeFilter]);

  const handleToggle = (value: number) => () => {
    if (!villes) return;
    const currentChecked = checkedVilles;
    const newChecked =
      currentChecked.indexOf(value) === -1 ? [...currentChecked, value] : currentChecked.filter(id => id !== value);
    updateForm({ villes: newChecked.map(villeId => ({ id: villeId })) });
  };

  const selectedVilles = useMemo(() => {
    if (!villes || !form.villes) return [];
    return villes.filter(v => checkedVilles.includes(Number(v.id)));
  }, [villes, checkedVilles, form.villes]);

  const handleDeleteVille = (id: number) => {
    const newChecked = checkedVilles.filter(cid => cid !== id);
    updateForm({ villes: newChecked.map(villeId => ({ id: villeId })) });
  };

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      onOpen={() => {}}
      sx={{
        '& .MuiDrawer-paper': {
          height: 'auto',
          maxHeight: '80vh',
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        },
      }}
    >
      <Container
        sx={{
          maxWidth: 'xl',
        }}
      >
        <Puller />
        {loading && <LinearProgress sx={{ borderRadius: 1 }} />}
        <Grid component="form" container sx={{ mb: 3, mt: 3 }} spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Card>
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <StyledIcon icon={BusinessIcon} variant="secondary" />
                    <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
                      {t(Labels.koperative_form_title)}
                    </Typography>
                  </Box>
                }
                action={
                  <ButtonTx
                    variant="contained"
                    size="large"
                    color="primary"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    disabled={loading}
                  >
                    {t(Labels.koperative_form_save_button)}
                  </ButtonTx>
                }
              />
              <CardContent>
                {error && (
                  <Typography color="error" variant="subtitle1">
                    {error}
                  </Typography>
                )}
                <TextField
                  label={t(Labels.koperative_form_name_label)}
                  name="name"
                  value={form.name ?? ''}
                  onChange={handleChange}
                  fullWidth
                  margin="dense"
                  autoComplete="off"
                  placeholder="Koperativa FITIA"
                />
                <Box
                  sx={{
                    mt: 2,
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      mt: 1,
                      mb: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <ButtonTx
                      variant="outlined"
                      component="label"
                      disabled={uploadingLogo}
                      startIcon={<UploadFileIcon />}
                    >
                      {uploadingLogo ? t(Labels.koperative_form_logo_uploading) : t(Labels.koperative_form_logo_upload)}
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        ref={fileInputRef}
                        onChange={async e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const result = await uploadLogo(file);
                            updateForm({ logoUrl: result?.url });
                          }
                        }}
                      />
                    </ButtonTx>
                    {form.logoUrl && (
                      <ButtonTx variant="outlined" color="error" onClick={handleDeleteLogo} startIcon={<DeleteIcon />}>
                        {t(Labels.koperative_form_logo_delete)}
                      </ButtonTx>
                    )}
                  </Box>
                  {uploadLogoError && (
                    <Typography variant="body2" color="error">
                      {t(Labels.koperative_form_logo_error).replace('{error}', uploadLogoError)}
                    </Typography>
                  )}
                  {form.logoUrl && (
                    <Box
                      component="img"
                      src={form.logoUrl}
                      alt="Logo preview"
                      sx={{
                        maxWidth: 120,
                        maxHeight: 120,
                        borderRadius: 2,
                        width: '100%',
                        height: 'auto',
                        overflow: 'hidden',
                      }}
                    />
                  )}
                </Box>
                <TextField
                  label={t(Labels.koperative_form_description_label)}
                  name="description"
                  value={form.description ?? ''}
                  onChange={handleChange}
                  fullWidth
                  margin="dense"
                  autoComplete="off"
                  multiline
                  minRows={3}
                  placeholder="Description de la coopérative..."
                />
                <TextField
                  label={t(Labels.koperative_form_address_label)}
                  name="address"
                  value={form.address ?? ''}
                  onChange={handleChange}
                  fullWidth
                  margin="dense"
                  autoComplete="off"
                  placeholder="Antananarivo, Madagascar"
                />
                <TextField
                  label={t(Labels.koperative_form_phone_label)}
                  name="phone"
                  value={form.phone ?? ''}
                  onChange={handleChange}
                  fullWidth
                  margin="dense"
                  autoComplete="off"
                  placeholder="034 00 000 00"
                />
                <TextField
                  label={t(Labels.koperative_form_email_label)}
                  name="email"
                  value={form.email ?? ''}
                  onChange={handleChange}
                  fullWidth
                  margin="dense"
                  autoComplete="off"
                  placeholder="contact@koperativa.mg"
                />
                <TextField
                  label={t(Labels.koperative_form_tax_id_label)}
                  name="taxId"
                  value={form.taxId ?? ''}
                  onChange={handleChange}
                  fullWidth
                  margin="dense"
                  autoComplete="off"
                  placeholder="NIF-0000000"
                />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth margin="dense">
                      <InputLabel>{t(Labels.koperative_form_status_label)}</InputLabel>
                      <Select
                        name="status"
                        value={form.status ?? ''}
                        onChange={e => updateForm({ status: e.target.value as KoperativeStatusEnum })}
                        label={t(Labels.koperative_form_status_label)}
                      >
                        {Object.values(KoperativeStatusEnum).map(status => (
                          <MenuItem key={status} value={status}>
                            {t(KoperativeStatusLabels[status])}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth margin="dense">
                      <InputLabel>Type</InputLabel>
                      <Select
                        name="type"
                        value={form.type ?? ''}
                        onChange={e => updateForm({ type: e.target.value as KoperativeTypeEnum })}
                        label="Type"
                      >
                        {Object.values(KoperativeTypeEnum).map(type => (
                          <MenuItem key={type} value={type}>
                            {t(KoperativeTypeLabels[type])}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Card>
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <StyledIcon icon={LocationCityIcon} variant="secondary" />
                    <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
                      {t(Labels.koperative_form_city_selection)}
                    </Typography>
                  </Box>
                }
              />
              <CardContent>
                <Box
                  sx={{
                    mb: 2,
                  }}
                >
                  <TextField
                    label={t(Labels.koperative_form_filter_cities)}
                    value={villeFilter}
                    onChange={e => setVilleFilter(e.target.value)}
                    fullWidth
                    autoComplete="off"
                  />
                </Box>
                <Stack
                  direction="row"
                  sx={{
                    rowGap: 1,
                    columnGap: 1,
                    flexWrap: 'wrap',
                  }}
                >
                  {selectedVilles.map(ville => (
                    <Chip
                      key={ville.id}
                      label={ville.name}
                      icon={<LocationCityIcon />}
                      onDelete={() => handleDeleteVille(Number(ville.id))}
                    />
                  ))}
                </Stack>
                <Divider sx={{ mt: 1 }} />
                {filteredVilles && filteredVilles.length > 0 && (
                  <FixedSizeList
                    itemSize={56}
                    itemCount={filteredVilles.length}
                    itemData={
                      {
                        villes: filteredVilles,
                        checkedVilles,
                        handleToggle,
                      } as Omit<VilleSelectionListProps, 'checked'> & { checkedVilles: number[] }
                    }
                    height={500}
                    width="100%"
                  >
                    {({ index, style, data }: ListChildComponentProps<VilleSelectionListProps>) => {
                      const ville = data.villes[index];
                      return (
                        <ListItem
                          key={ville.id}
                          style={style}
                          secondaryAction={
                            <IconButtonTx edge="end" aria-label="add">
                              <LocationCityIcon />
                            </IconButtonTx>
                          }
                          disablePadding
                        >
                          <ListItemButton onClick={data.handleToggle(ville.id!)} dense>
                            <ListItemIcon>
                              <Checkbox
                                edge="start"
                                checked={data.checkedVilles.includes(ville.id!)}
                                tabIndex={-1}
                                disableRipple
                              />
                            </ListItemIcon>
                            <ListItemText id={`checkbox-list-label-${ville.id!}`} primary={ville.name} />
                          </ListItemButton>
                        </ListItem>
                      );
                    }}
                  </FixedSizeList>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </SwipeableDrawer>
  );
};

export default KoperativeFormDrawer;
