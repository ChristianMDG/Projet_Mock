import { ReactNode } from 'react';
import { IconButton, Tooltip, ThemeProvider, useColorScheme as useMuiColorScheme } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { appTheme } from '../themes/appTheme';

export const ColorSchemeProvider = ({ children }: { children: ReactNode }) => {
  return <ThemeProvider theme={appTheme}>{children}</ThemeProvider>;
};

export const useColorScheme = () => {
  return useMuiColorScheme();
};

export default function ColorSchemeToggle() {
  const { mode, setMode } = useMuiColorScheme();

  const toggleMode = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  return (
    <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
      <IconButton onClick={toggleMode} color="inherit">
        {mode === 'light' ? <Brightness4 /> : <Brightness7 />}
      </IconButton>
    </Tooltip>
  );
}
