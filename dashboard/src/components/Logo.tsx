import { Box } from '@mui/material';
import { useColorScheme } from '@/shared/ColorSchemeToggle';
import taxibrousseLight from '@/assets/taxibrousse-light.svg';
import taxibrousseDark from '@/assets/taxibrousse-dark.svg';
import taxibroussePng from '@/assets/taxibrousse.png';

interface LogoProps {
  height?: number;
  width?: number;
}

export default function Logo({ height = 28, width }: LogoProps) {
  const { mode } = useColorScheme();

  const logoSrc = mode === 'dark' ? taxibrousseDark : taxibrousseLight;

  return (
    <Box
      component="img"
      src={logoSrc}
      alt="Taxibrousse"
      sx={{
        height: height,
        width: width ?? 'auto',
        display: 'block',
      }}
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).src = taxibroussePng;
      }}
    />
  );
}
