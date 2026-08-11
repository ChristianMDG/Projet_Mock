import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Grid,
  Skeleton,
  Alert,
  TextField,
  InputAdornment,
  MenuItem,
  Stack,
  Fade,
} from '@mui/material';
import { Business, Search, FilterList } from '@mui/icons-material';
import { useKoperatives } from '@/hooks/koperative.hook';
import { SectionHeader } from '@/components/shared';
import type { Koperative } from '@/types/koperative.types';
import { KoperativeStatusEnum, KoperativeStatusLabels } from '@/types/koperative.types';
import Labels from '@/labelKeys.json';
import { KoperativeCard } from '@/components/koperative/KoperativeCard';
import { KoperativeDetailDialog } from '@/components/koperative/KoperativeDetailDialog';

export default function KoperativeManagementPage() {
  const { t } = useTranslation();
  const { data: koperatives = [], isLoading, error } = useKoperatives();

  const [selected, setSelected] = useState<Koperative | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<KoperativeStatusEnum | 'ALL'>('ALL');

  const filteredKoperatives = useMemo(() => {
    return koperatives
      .filter((k) => {
        const matchesSearch =
          k.name.toLowerCase().includes(search.toLowerCase()) ||
          k.registrationNumber?.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || k.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [koperatives, search, statusFilter]);

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {t(Labels.koperative_error)}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
        }}
      >
        <SectionHeader
          icon={<Business sx={{ fontSize: '2rem', color: 'primary.main' }} />}
          title={t(Labels.koperative_title)}
          subtitle={`${koperatives.length ?? 0} ${t(Labels.koperative_count_plural)}`}
        />

        <Stack direction="row" spacing={2} sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <TextField
            size="small"
            placeholder={t(Labels.common_search)}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" color="action" />
                  </InputAdornment>
                ),
              },
            }}
            sx={{ width: { xs: '100%', sm: 240 } }}
          />
          <TextField
            select
            size="small"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as KoperativeStatusEnum | 'ALL')}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <FilterList fontSize="small" color="action" />
                  </InputAdornment>
                ),
              },
            }}
            sx={{ width: { xs: '100%', sm: 160 } }}
          >
            <MenuItem value="ALL">{t(Labels.common_all)}</MenuItem>
            {Object.values(KoperativeStatusEnum).map((status) => (
              <MenuItem key={status} value={status}>
                {t(KoperativeStatusLabels[status] ?? status)}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </Box>

      {/* Loading Skeletons */}
      {isLoading ? (
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
              <Skeleton variant="rounded" height={220} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <>
          {filteredKoperatives.length > 0 ? (
            <Grid container spacing={3}>
              {filteredKoperatives.map((kop) => (
                <Fade in key={kop.id}>
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <KoperativeCard koperative={kop} onClick={() => setSelected(kop)} />
                  </Grid>
                </Fade>
              ))}
            </Grid>
          ) : (
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
                bgcolor: 'background.paper',
                borderRadius: 4,
                border: '1px dashed',
                borderColor: 'divider',
              }}
            >
              <Business sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                {t(Labels.koperative_none)}
              </Typography>
            </Box>
          )}
        </>
      )}

      {/* Detail Dialog */}
      <KoperativeDetailDialog koperative={selected} open={!!selected} onClose={() => setSelected(null)} />
    </Box>
  );
}
