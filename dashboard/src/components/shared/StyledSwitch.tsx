import { Switch } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';

export const StyledSwitch = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: 'flex',
  '&:active': {
    '& .MuiSwitch-thumb': {
      width: 15,
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
      transform: 'translateX(9px)',
    },
  },
  '& .MuiSwitch-switchBase': {
    padding: 2,
    '&.Mui-checked': {
      transform: 'translateX(12px)',
      color: theme.palette.common.white,
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.primary.main,
        ...theme.applyStyles?.('dark', {
          backgroundColor: theme.palette.primary.dark,
        }),
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: theme.shadows[1],
    width: 12,
    height: 12,
    borderRadius: 6,
    transition: theme.transitions.create(['width'], {
      duration: 200,
    }),
  },
  '& .MuiSwitch-track': {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: alpha(theme.palette.common.black, 0.25),
    boxSizing: 'border-box',
    ...theme.applyStyles?.('dark', {
      backgroundColor: alpha(theme.palette.common.white, 0.35),
    }),
  },
}));
