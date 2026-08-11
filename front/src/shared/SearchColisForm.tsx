import { useState, useEffect } from 'react';
import { Button, Card, CardContent, Grid, useMediaQuery } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';

import { ComboBox } from '@/components/shared';
import { useTranslation } from 'react-i18next';
import { voyageDateUtils } from '@/utils/dayjs';
import Labels from '@/labelKeys.json';

export default function SearchColisForm() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const isMobileQuery = useMediaQuery(theme => theme.breakpoints.down('sm'), {
    defaultMatches: false,
    noSsr: true,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Card id="search-colis">
      <CardContent>
        <Grid container spacing={2}>
          <Grid container size={{ xs: 12 }} spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <DatePicker
                sx={{ width: '100%' }}
                label={t(Labels.search_departure_date)}
                format="dddd D MMMM"
                value={voyageDateUtils.now()}
                minDate={voyageDateUtils.now()}
                timezone="Indian/Antananarivo"
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <ComboBox />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 4 }}>
              <ComboBox />
            </Grid>
          </Grid>
          <Grid
            container
            size={12}
            spacing={3}
            direction="row"
            sx={{
              justifyContent: 'right',
            }}
          >
            <Button
              size="large"
              fullWidth={mounted ? isMobileQuery : false}
              variant="contained"
              endIcon={<LocationSearchingIcon />}
            >
              {t(Labels.search_find_location)}
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
