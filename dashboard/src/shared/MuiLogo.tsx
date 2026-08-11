import { Box } from '@mui/material';
import { useColorScheme } from './ColorSchemeToggle';
import taxibrousseDark from '@/assets/taxibrousse-dark.svg';
import taxibrousseLight from '@/assets/taxibrousse-light.svg';

export default function MuiLogo() {
  const { mode } = useColorScheme();
  const isDark = mode === 'dark';

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <img src={isDark ? taxibrousseDark : taxibrousseLight} alt="Taxibrousse" height={32} />
    </Box>
  );
}
