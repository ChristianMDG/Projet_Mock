import React from 'react';
import { Tab, TabProps, useTheme } from '@mui/material';

interface StyledTabProps extends TabProps {
  /**
   * Whether to use the card-style appearance with shadow and background
   * @default true
   */
  cardStyle?: boolean;
}

/**
 * A styled tab component that provides consistent styling across the application
 * Based on the design patterns from SearchForm and KoperativeDetailPage
 */
export const StyledTab: React.FC<StyledTabProps> = ({ cardStyle = true, sx, ...props }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const cardSxProps = cardStyle
    ? {
        margin: 1.25,
        borderRadius: { xs: 3 },
        backgroundColor: theme.palette.background.paper,
        boxShadow: isDarkMode ? theme.customShadows.dark[2] : theme.shadows[1],
        minHeight: { xs: 36, sm: 44, md: 48 },
      }
    : {};

  const combinedSx = {
    ...cardSxProps,
    ...sx,
  };

  return <Tab {...props} sx={combinedSx} />;
};

export default StyledTab;
