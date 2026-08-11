import { Box, BoxProps, Card, CardProps, styled } from '@mui/material';

const HeroSectionContainer = styled(Card)<CardProps>(() => ({
  width: '100%',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  overflow: 'hidden',
  boxShadow: 'none',
  border: 'none',
}));

const HeroBackgroundContainer = styled(Box)<BoxProps>(() => {
  return {
    position: 'absolute',
    inset: 0,
    zIndex: 0,
    '&::after': {
      content: '""',
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
    },
  };
});

const HeroContentPanel = styled(Box)<BoxProps>(({ theme }) => {
  const lightBackground = 'rgba(1,22,56,0.90)';
  const darkBackground = 'rgba(20,24,28,0.75)';

  return {
    zIndex: 2,
    maxWidth: 400,
    width: '100%',
    position: 'relative',
    backgroundColor: theme.palette.mode === 'light' ? lightBackground : darkBackground,
    color: theme.palette.common.white,
    borderRadius: 16,
    boxShadow: theme.shadows[6],
    padding: theme.spacing(3),
    margin: theme.spacing(2),

    [theme.breakpoints.down('sm')]: {
      maxWidth: 280,
      width: 'calc(100% - 64px)',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: 'auto',
      marginBottom: theme.spacing(4),
      alignSelf: 'flex-end',
      padding: theme.spacing(2),
      '& .MuiTypography-h1': { fontSize: '1.25rem', lineHeight: 1.2 },
      '& .MuiTypography-h2': { fontSize: '1.1rem', lineHeight: 1.25 },
      '& .MuiTypography-h3': { fontSize: '1rem', lineHeight: 1.3 },
      '& .MuiTypography-h4': { fontSize: '0.9rem', lineHeight: 1.35 },
      '& .MuiTypography-h5': { fontSize: '0.8rem', lineHeight: 1.4 },
      '& .MuiTypography-h6': { fontSize: '0.75rem', lineHeight: 1.4 },
      '& .MuiTypography-body1': { fontSize: '0.72rem', lineHeight: 1.5 },
      '& .MuiTypography-body2': { fontSize: '0.68rem', lineHeight: 1.5 },
      '& .MuiTypography-overline': { fontSize: '0.6rem', letterSpacing: '0.08em' },
      '& .MuiTypography-subtitle1': { fontSize: '0.75rem' },
      '& .MuiTypography-subtitle2': { fontSize: '0.68rem' },
    },

    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(4),
    },
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(5),
    },
  };
});

export { HeroSectionContainer, HeroBackgroundContainer, HeroContentPanel };
