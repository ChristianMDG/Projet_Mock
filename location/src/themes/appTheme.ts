import { createTheme, responsiveFontSizes, alpha } from '@mui/material/styles';

// Extend the theme interface to add custom shadows and custom breakpoints
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

  interface BreakpointOverrides {
    xm: true;
  }

  interface Palette {
    taxi: {
      main: string;
      light: string;
      dark: string;
      contrastText?: string;
    };
    special: {
      main: string;
      light: string;
      dark: string;
      contrastText?: string;
    };
  }

  interface PaletteOptions {
    taxi?: {
      main?: string;
      light?: string;
      dark?: string;
      contrastText?: string;
    };
    special?: {
      main?: string;
      light?: string;
      dark?: string;
      contrastText?: string;
    };
  }
}
const notchedFocus = (color: string) => ({
  borderColor: color,
  borderWidth: 1,
  overflow: 'visible',
  filter: `drop-shadow(0 0 1.5px ${alpha(color, 0.45)}) drop-shadow(0 0 3px ${alpha(color, 0.25)})`,
});

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      xm: 375,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
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
          default: '#ffffff',
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
          light: '#ff9999',
          dark: '#d50000',
          contrastText: '#ffffff',
        },
        warning: {
          main: '#ffa000',
          light: '#ffd149',
          dark: '#c67100',
          contrastText: '#000000',
        },
        info: {
          main: '#1976d2',
          light: '#63a4ff',
          dark: '#004ba0',
          contrastText: '#ffffff',
        },
        success: {
          main: '#2e7d32',
          light: '#60ad5e',
          dark: '#005005',
          contrastText: '#ffffff',
        },
        taxi: {
          main: '#fbbf24',
          light: '#fde68a',
          dark: '#b45309',
        },
        special: {
          main: '#9c27b0',
          light: '#e1bee7',
          dark: '#7b1fa2',
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
        taxi: {
          main: '#fbbf24',
          light: '#fef3c7',
          dark: '#fbbf24',
        },
        special: {
          main: '#ce93d8',
          light: '#f3e5f5',
          dark: '#ce93d8',
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
    },
    h1: {
      fontWeight: 700,
      fontSize: '2.25rem',
      color: 'primary.main',
      letterSpacing: '-0.025em',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 600,
      fontSize: '1.875rem',
      color: 'primary.main',
      letterSpacing: '-0.015em',
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
      color: 'primary.main',
      letterSpacing: '-0.01em',
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.25rem',
      color: 'primary.main',
      letterSpacing: '0em',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.125rem',
      color: 'primary.main',
      letterSpacing: '0em',
      lineHeight: 1.5,
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
      color: 'primary.main',
      letterSpacing: '0em',
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      letterSpacing: '0.01em',
      lineHeight: 1.6,
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.875rem',
      color: 'text.secondary',
      letterSpacing: '0.01em',
      lineHeight: 1.5,
      fontWeight: 400,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      color: 'primary.main',
      letterSpacing: '0.01em',
      lineHeight: 1.75,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      color: 'text.secondary',
      letterSpacing: '0.01em',
      lineHeight: 1.57,
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      color: 'text.secondary',
      letterSpacing: '0.02em',
      lineHeight: 1.66,
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 600,
      letterSpacing: '0.08em',
      lineHeight: 2.66,
      textTransform: 'uppercase',
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
        '.MuiPickersOutlinedInput-root': {
          borderRadius: '8px !important',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 400,
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
          borderRadius: 16,
          fontSize: '0.8rem',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: 0,
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 1,
      },
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid  rgba(215, 219, 226, 0.12)',
          boxShadow: '0 1px 1px rgba(1, 22, 56, 0.12), 0 1px 1px rgba(1, 22, 56, 0.24)',
          '&:hover': {
            boxShadow: '0 2px 2px rgba(1, 22, 56, 0.16), 0 2px 2px rgba(1, 22, 56, 0.23)',
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
    MuiAccordion: {
      defaultProps: {
        disableGutters: true,
        elevation: 0,
      },
      styleOverrides: {
        root: () => ({
          borderRadius: 16,
          overflow: 'hidden',
          transition: 'box-shadow 0.2s ease',
          '&:hover': { boxShadow: 2 },
          '&.Mui-expanded': { boxShadow: 3 },
        }),
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 8,
          '& .MuiOutlinedInput-notchedOutline': {
            transition: theme.transitions.create(['border-color', 'filter'], {
              duration: theme.transitions.duration.shorter,
            }),
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': notchedFocus(theme.palette.primary.main),
          '&.Mui-error.Mui-focused .MuiOutlinedInput-notchedOutline': notchedFocus(theme.palette.error.main),
          '&.Mui-focused.MuiOutlinedInput-colorSecondary .MuiOutlinedInput-notchedOutline': notchedFocus(
            theme.palette.secondary.main,
          ),
          '&.Mui-focused.MuiOutlinedInput-colorSuccess .MuiOutlinedInput-notchedOutline': notchedFocus(
            theme.palette.success.main,
          ),
          '&.Mui-focused.MuiOutlinedInput-colorWarning .MuiOutlinedInput-notchedOutline': notchedFocus(
            theme.palette.warning.main,
          ),
          '&.Mui-focused.MuiOutlinedInput-colorInfo .MuiOutlinedInput-notchedOutline': notchedFocus(
            theme.palette.info.main,
          ),
        }),
        input: {
          '&::placeholder': {
            opacity: 0.45,
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        asterisk: ({ theme }) => ({
          color: theme.palette.error.main,
        }),
      },
    },
  },
});

export const appTheme = responsiveFontSizes(theme, {
  factor: 4,
  breakpoints: ['xs', 'xm', 'sm', 'md', 'lg', 'xl'],
  variants: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'subtitle1', 'subtitle2', 'body1', 'body2', 'caption', 'button'],
  disableAlign: true,
});
