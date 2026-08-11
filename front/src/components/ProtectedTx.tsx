import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { AuthorityEnum } from '@/models/enums';

interface ProtectedTxProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

/**
 * Renders children only if the current user has one of the allowed roles.
 * If no allowedRoles is provided, renders children for authenticated users with
 * administrative roles (excludes USER role by default).
 */
const ProtectedTx: React.FC<ProtectedTxProps> = ({
  children,
  allowedRoles = [AuthorityEnum.ADMIN, AuthorityEnum.GUICHET, AuthorityEnum.KOPERATIVE],
}) => {
  const { user } = useAuth();

  if (user && allowedRoles && allowedRoles.length > 0) {
    const hasAccess = user.authorities?.some(role => allowedRoles.includes(role.name));

    if (hasAccess) return <>{children}</>;
  }

  return <></>;
};

export default ProtectedTx;
