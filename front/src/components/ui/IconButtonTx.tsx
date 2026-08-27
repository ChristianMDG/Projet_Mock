import React from 'react';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { useAuth } from '@/context/AuthContext';
import { AuthorityEnum } from '@/models/enums';

/**
 * Extended IconButton component with authentication-based visibility controls.
 * Optimized with React.memo to prevent unnecessary re-renders when props haven't changed.
 *
 * @param allowedRoles - Array of roles that are allowed to see this button
 * @param children - Button content (typically icons)
 * @param props - All other IconButton props
 */
interface IconButtonTxProps extends IconButtonProps {
  allowedRoles?: string[];
}

const IconButtonTx: React.FC<IconButtonTxProps> = React.memo(
  ({ children, allowedRoles = [AuthorityEnum.ADMIN, AuthorityEnum.GUICHET, AuthorityEnum.KOPERATIVE], ...props }) => {
    const { user, isAuthenticated, isGuichetAndInactive } = useAuth();

    if (!isAuthenticated) {
      return <></>;
    }

    if (isGuichetAndInactive) {
      return <></>;
    }

    const hasAccess = user?.authorities?.some(role => allowedRoles.includes(role.name));
    if (!hasAccess) {
      return <></>;
    }

    return <IconButton {...props}>{children}</IconButton>;
  },
);

// Set display name for debugging
IconButtonTx.displayName = 'IconButtonTx';

export default IconButtonTx;
