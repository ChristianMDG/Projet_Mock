import { Badge, Box, Typography } from '@mui/material';
import dayjs from 'dayjs';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import { StyledTab } from '@/components/ui';
import { getStyledTabListSx } from '@/utils/tabStyles';
import { voyageDateUtils } from '@/utils/dayjs';
import type { VoyageWeeklyResult } from '@/types/type.util';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';

interface WeeklyTabsProps {
  weeklyResults: VoyageWeeklyResult[];
  selectedTab: number;
  language: string;
  onTabChange: (event: React.SyntheticEvent, resultId: number) => void;
}

export const WeeklyTabs = ({ weeklyResults, selectedTab, language, onTabChange }: WeeklyTabsProps) => {
  const { t } = useTranslation();
  const hasSelectedTab = weeklyResults.find(item => item.resultId === selectedTab);

  return hasSelectedTab ? (
    <Box sx={{ overflowX: 'auto' }}>
      <TabContext value={selectedTab}>
        <TabList onChange={onTabChange} variant="scrollable" scrollButtons={false} sx={getStyledTabListSx()}>
          {weeklyResults.map(item => {
            const isPast = dayjs(item.date).isBefore(dayjs(), 'day');
            const showBadge = !isPast && item.minPrice;
            return (
              <StyledTab
                key={item.resultId}
                value={item.resultId}
                disabled={isPast}
                label={
                  <Badge
                    color="error"
                    variant="dot"
                    invisible={!showBadge}
                    sx={{
                      '& .MuiBadge-badge': {
                        animation: showBadge ? 'blink 1.5s infinite' : 'none',
                        '@keyframes blink': {
                          '0%': { opacity: 1 },
                          '50%': { opacity: 0.4 },
                          '100%': { opacity: 1 },
                        },
                      },
                    }}
                  >
                    <Box sx={{ textAlign: 'left' }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 'bold',
                        }}
                      >
                        {isPast
                          ? t(Labels.voyage_weekly_passed)
                          : item.minPrice
                            ? `${item.minPrice.toLocaleString(language)} AR`
                            : '--'}
                      </Typography>
                      <Typography variant="body2">
                        {voyageDateUtils.formatWithLocale(item.date, 'ddd DD MMM', language)}
                      </Typography>
                    </Box>
                  </Badge>
                }
                sx={{ minWidth: 160, textTransform: 'none' }}
              />
            );
          })}
        </TabList>
      </TabContext>
    </Box>
  ) : (
    <></>
  );
};
