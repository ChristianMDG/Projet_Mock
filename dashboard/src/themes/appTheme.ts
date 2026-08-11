/** Semantic CSS color constants — used for non-UI components like charts. */
export const paletteTokens = {
  navy: '#011638',
  navyLight: '#3a497a',
  navyMid: '#0a2463',
  success: '#2e7d32',
  successDark: '#1b5e20',
  warning: '#e65100',
  error: '#c62828',
  info: '#0277bd',
  infoDark: '#1565c0',
  purple: '#6a1b9a',
  teal: '#00796b',
  indigo: '#3949ab',
  pink: '#ad1457',
  grey: '#757575',
} as const;

import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// Extend the theme interface to add custom shadows
declare module '@mui/material/styles' {
  interface Theme {
    customShadows: {
      dark: {
        1: string;
        2: string;
        3: string;
      };
    };
  }

  interface ThemeOptions {
    customShadows?: {
      dark?: {
        1?: string;
        2?: string;
        3?: string;
      };
    };
  }
}

const theme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#011638',
          light: '#3a497a',
          dark: '#000a1a',
          contrastText: '#ffffff',
        },
        secondary: {
          main: '#ffe25a',
          light: '#fff59d',
          dark: '#f7d13b',
          contrastText: '#011638',
        },
        background: {
          default: 'rgb(246, 246, 247)',
          paper: '#ffffff',
        },
        text: {
          primary: '#011638',
          secondary: '#6c757d',
          disabled: '#b0b8c1',
        },
        divider: 'rgba(1, 22, 56, 0.12)',
        error: {
          main: '#ff3131',
        },
        warning: {
          main: '#ffa000',
        },
        info: {
          main: '#1976d2',
        },
        success: {
          main: '#2e7d32',
        },
        action: {
          hover: 'rgba(1, 22, 56, 0.10)',
          selected: 'rgba(255, 226, 90, 0.22)',
        },
      },
    },
    dark: {
      palette: {
        background: {
          default: '#0a0e27',
          paper: '#1a1f3a',
        },
      },
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica Neue", Helvetica, Arial, sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 500,
      letterSpacing: '0.02em',
      fontFamily: '"Inter", sans-serif',
    },
    h1: {
      fontWeight: 700,
      fontSize: '2.25rem',
      fontFamily: '"Inter", sans-serif',
      letterSpacing: '-0.025em',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 600,
      fontSize: '1.875rem',
      fontFamily: '"Inter", sans-serif',
      letterSpacing: '-0.015em',
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
      fontFamily: '"Inter", sans-serif',
      letterSpacing: '-0.01em',
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.25rem',
      fontFamily: '"Inter", sans-serif',
      letterSpacing: '0em',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.125rem',
      fontFamily: '"Inter", sans-serif',
      letterSpacing: '0em',
      lineHeight: 1.5,
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
      fontFamily: '"Inter", sans-serif',
      letterSpacing: '0em',
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      fontFamily: '"Inter", sans-serif',
      letterSpacing: '0.01em',
      lineHeight: 1.6,
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.875rem',
      fontFamily: '"Inter", sans-serif',
      letterSpacing: '0.01em',
      lineHeight: 1.5,
      fontWeight: 400,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      fontFamily: '"Inter", sans-serif',
      letterSpacing: '0.01em',
      lineHeight: 1.75,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      fontFamily: '"Inter", sans-serif',
      letterSpacing: '0.01em',
      lineHeight: 1.57,
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      fontFamily: '"Inter", sans-serif',
      letterSpacing: '0.02em',
      lineHeight: 1.66,
    },
  },
  customShadows: {
    dark: {
      1: '0px 2px 1px -1px rgba(158, 158, 158, 0.2), 0px 1px 1px 0px rgba(158, 158, 158, 0.14), 0px 1px 3px 0px rgba(158, 158, 158, 0.12)',
      2: '0px 3px 1px -2px rgba(158, 158, 158, 0.2), 0px 2px 2px 0px rgba(158, 158, 158, 0.14), 0px 1px 5px 0px rgba(158, 158, 158, 0.12)',
      3: '0px 3px 3px -2px rgba(158, 158, 158, 0.2), 0px 3px 4px 0px rgba(158, 158, 158, 0.14), 0px 1px 8px 0px rgba(158, 158, 158, 0.12)',
    },
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: false,
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: 'background.default',
          margin: 0,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 400,
          fontFamily: '"Inter", sans-serif',
          textTransform: 'none',
          fontSize: '1.10rem',
          padding: '8px 20px',
          letterSpacing: '0.01em',
        },
      },
      defaultProps: {
        disableRipple: false,
        disableElevation: false,
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 4,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontFamily: '"Inter", sans-serif',
          fontWeight: 400,
          padding: 14,
          textTransform: 'none',
          fontSize: '1.10rem',
          letterSpacing: '0.01em',
          color: theme.palette.text.primary,
          transition: 'color 0.2s',
          '&:hover': {
            color: theme.palette.primary.main,
            backgroundColor: theme.palette.action.hover,
          },
          '&.Mui-selected': {
            fontWeight: 600,
            color: theme.palette.primary.main,
            backgroundColor: theme.palette.action.selected,
          },
        }),
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          fontFamily: '"Inter", sans-serif',
          borderRadius: 16,
          fontSize: '0.8rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: '1px solid  rgba(215, 219, 226, 0.12)',
          boxShadow: '0 1px 1px rgba(1, 22, 56, 0.12), 0 1px 1px rgba(1, 22, 56, 0.24)',
          '&:hover': {
            boxShadow: '0 3px 3px rgba(1, 22, 56, 0.16), 0 3px 3px rgba(1, 22, 56, 0.23)',
          },
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderBottom: `2px solid ${theme.palette.divider}`,
        }),
      },
    },
    MuiCardActions: {
      styleOverrides: {
        root: ({ theme }) => ({
          padding: theme.spacing(2),
        }),
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: '"Inter", sans-serif',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          '&.Mui-selected, &.Mui-selected:hover': {
            borderRadius: 4,
          },
          '&:hover': {
            borderRadius: 4,
          },
        },
      },
    },
  },
});

export const appTheme = responsiveFontSizes(theme, {
  factor: 6,
  breakpoints: ['xs', 'sm', 'md', 'lg'],
  variants: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'subtitle1', 'subtitle2'],
  disableAlign: false,
});
