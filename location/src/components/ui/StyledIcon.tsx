import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';
import { styled } from '@mui/material/styles';

interface StyledIconProps extends SvgIconProps {
  children?: React.ReactNode;
  icon?: React.ElementType;
  variant?: 'primary' | 'secondary';
}

const StyledIconWrapper = styled(SvgIcon)<{ variant?: 'primary' | 'secondary' }>(() => ({
  backgroundColor: '#ffe25a',
  color: '#011638',
  borderRadius: 6,
  padding: 2,
}));

export const StyledIcon: React.FC<StyledIconProps> = ({ children, icon: Icon, variant = 'secondary', ...props }) => {
  return (
    <StyledIconWrapper variant={variant} {...props}>
      {Icon ? <Icon /> : children}
    </StyledIconWrapper>
  );
};

export default StyledIcon;
