import { Theme } from '@mui/material';

/**
 * Styled TabList with consistent indicator styling
 */
export const getStyledTabListSx = () => ({
  '& .MuiTabs-indicator': {
    borderRadius: 2,
    height: 4,
  },
});

/**
 * Alternative tab styles for different use cases
 */
export const getTabSxProps = (theme: Theme) => ({
  margin: 1,
  borderRadius: 2,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
  minHeight: 48,
});
