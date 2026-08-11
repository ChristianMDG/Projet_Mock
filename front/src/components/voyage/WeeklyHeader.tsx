import { Box, Grid, Link, Typography } from '@mui/material';
import { EditOutlined } from '@mui/icons-material';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import Labels from '@/labelKeys.json';

interface WeeklyHeaderProps {
  onEditSearch?: () => void;
  t: (key: string) => string;
}

export const WeeklyHeader = ({ onEditSearch, t }: WeeklyHeaderProps) => {
  return (
    <Grid container spacing={2} sx={{ mb: 2, alignItems: 'center' }}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
            }}
          >
            {t(Labels.voyage_weekly_outbound)}
          </Typography>
          {onEditSearch && (
            <Link
              component="button"
              underline="hover"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
              onClick={onEditSearch}
            >
              <EditOutlined
                sx={{
                  fontSize: 'small',
                }}
              />{' '}
              {t(Labels.voyage_weekly_modify)}
            </Link>
          )}
        </Box>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-end' }, gap: 0.5 }}
        >
          <TipsAndUpdatesIcon
            color="primary"
            sx={{
              mr: 0.5,
              fontSize: 'small',
            }}
          />
          {t(Labels.voyage_weekly_advice)}
        </Typography>
      </Grid>
    </Grid>
  );
};
