import type { Theme } from '@mui/material/styles';
import type { LayoutSpacing } from '@/types/app.types';

export const LAYOUT_SPACING: LayoutSpacing = {
  header: {
    xs: 8, // 64px
    sm: 16, // 128px (double toolbar)
    md: 16, // 128px
  },
  footer: {
    xs: 2, // 16px
    sm: 2, // 16px
    md: 2, // 16px
  },
  container: {
    paddingTop: 2, // 16px
    paddingBottom: 2, // 16px
  },
};

export const getMainContentStyles = (theme: Theme) => ({
  marginTop: {
    xs: theme.spacing(LAYOUT_SPACING.header.xs),
    sm: theme.spacing(LAYOUT_SPACING.header.sm),
    md: theme.spacing(LAYOUT_SPACING.header.md),
  },
  marginBottom: theme.spacing(LAYOUT_SPACING.container.paddingBottom),
  minHeight: {
    xs: `calc(100vh - ${theme.spacing(LAYOUT_SPACING.header.xs + LAYOUT_SPACING.footer.xs)})`,
    sm: `calc(100vh - ${theme.spacing(LAYOUT_SPACING.header.sm + LAYOUT_SPACING.footer.sm)})`,
    md: `calc(100vh - ${theme.spacing(LAYOUT_SPACING.header.md + LAYOUT_SPACING.footer.md)})`,
  },
  px: 1,
});

export const breakpoints = {
  mobile: '(max-width: 599px)',
  tablet: '(min-width: 600px) and (max-width: 959px)',
  desktop: '(min-width: 960px)',
} as const;

export const getContainerProps = () => ({
  component: 'main' as const,
  maxWidth: 'xl' as const,
  sx: getMainContentStyles,
});

export const LAYOUT_COMPONENTS = {
  APP_LAYOUT: 'AppLayout',
  MAIN_CONTAINER: 'MainContainer',
  CONTENT_WRAPPER: 'ContentWrapper',
} as const;
