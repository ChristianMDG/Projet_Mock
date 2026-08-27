import React from 'react';
import { SvgIcon, type SvgIconProps } from '@mui/material';
import { styled } from '@mui/material/styles';

interface StyledIconProps extends SvgIconProps {
  readonly children?: React.ReactNode;
  readonly icon?: React.ElementType;
}

const StyledIconWrapper = styled(SvgIcon)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.secondary.contrastText,
  borderRadius: 6,
  padding: 2,
  fontSize: '1.25rem',
}));

export const StyledIcon: React.FC<StyledIconProps> = ({ children, icon: Icon, ...props }) => {
  return <StyledIconWrapper {...props}>{Icon ? <Icon /> : children}</StyledIconWrapper>;
};

export default StyledIcon;
