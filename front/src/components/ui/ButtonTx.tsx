import React, { useState, useEffect } from 'react';
import { Button, ButtonProps, useMediaQuery } from '@mui/material';
import { useAuth } from '@/context/AuthContext';
import { AuthorityEnum } from '@/models/enums';

/**
 * Extended Button component with authentication-based visibility and mobile-friendly features.
 */
interface ButtonTxProps extends ButtonProps {
  isProtected?: boolean;
  hideTextOnMobile?: boolean;
  allowedRoles?: string[];
}

const ButtonTx: React.FC<ButtonTxProps> = ({
  children,
  hideTextOnMobile = false,
  startIcon,
  endIcon,
  hidden,
  allowedRoles = [AuthorityEnum.ADMIN, AuthorityEnum.GUICHET, AuthorityEnum.KOPERATIVE],
  isProtected = true,
  ...props
}) => {
  const [mounted, setMounted] = useState(false);
  const isMobileQuery = useMediaQuery(theme => theme.breakpoints.down('sm'), {
    defaultMatches: false,
    noSsr: true,
  });
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (hidden || (!isAuthenticated && isProtected)) {
    return <></>;
  }

  const hasAccess = user?.authorities?.some(role => allowedRoles.includes(role.name));
  if (!hasAccess && isProtected) {
    return <></>;
  }

  if (hideTextOnMobile && (mounted ? isMobileQuery : false)) {
    return (
      <Button {...props} startIcon={undefined}>
        {startIcon}
      </Button>
    );
  }

  return (
    <Button {...props} startIcon={startIcon} endIcon={endIcon}>
      {children}
    </Button>
  );
};

export default ButtonTx;
