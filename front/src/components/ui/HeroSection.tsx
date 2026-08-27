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
    '& picture, & img': {
      width: '100%',
      height: '100%',
      display: 'block',
      objectFit: 'cover',
      objectPosition: 'center',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      background: 'linear-gradient(to right, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 100%)',
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
