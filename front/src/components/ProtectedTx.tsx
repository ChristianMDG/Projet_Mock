import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { AuthorityEnum } from '@/models/enums';

interface ProtectedTxProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  fallback?: React.ReactNode;
}

/**
 * Renders children only if the current user has one of the allowed roles.
 * If no allowedRoles is provided, renders children for authenticated users with
 * administrative roles (excludes USER role by default).
 */
const ProtectedTx: React.FC<ProtectedTxProps> = ({
  children,
  allowedRoles = [AuthorityEnum.ADMIN, AuthorityEnum.GUICHET, AuthorityEnum.KOPERATIVE],
  fallback = null,
}) => {
  const { user, isGuichetAndInactive } = useAuth();

  if (user && allowedRoles && allowedRoles.length > 0) {
    if (isGuichetAndInactive) {
      return <>{fallback}</>;
    }

    const hasAccess = user.authorities?.some(role => allowedRoles.includes(role.name));

    if (hasAccess) return <>{children}</>;
  }

  return <>{fallback}</>;
};

export default ProtectedTx;
