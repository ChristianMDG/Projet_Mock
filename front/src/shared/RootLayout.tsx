import React from 'react';
import { matchPath, useLocation } from 'react-router-dom';
import type { TFunction, i18n as I18nInstance } from 'i18next';
import { useAuth } from '@/context/AuthContext';
import { AuthorityEnum } from '@/models/enums';
import { hasAnyRole } from '@/utils/auth.utils';
import { ROUTES } from '@/constants/routes';
import type { LayoutProps } from '@/types/app.types';
import AppLayout from './AppLayout';
import OperatorLayout from './OperatorLayout';

const STAFF_ROLES = [AuthorityEnum.ADMIN, AuthorityEnum.KOPERATIVE, AuthorityEnum.GUICHET, AuthorityEnum.OPERATOR];
const OPERATOR_LAYOUT_ROUTES = [
  ROUTES.voyagesList,
  ROUTES.reservationsList,
  ROUTES.reservationsByVoyage,
  ROUTES.operatorBooking,
  ROUTES.operators,
];

/**
 * Chooses between the public `AppLayout` and the staff-only `OperatorLayout`.
 *
 * `OperatorLayout` is only rendered when the current route belongs to
 * `OPERATOR_LAYOUT_ROUTES` (e.g. `/dia`) AND the authenticated user has a staff role.
 * Any other case (public visitor, non-staff role, other routes) keeps the
 * regular `AppLayout` so `ProtectedTx` inside the page can still show its
 * access-denied fallback without a mismatched dashboard shell around it.
 */
const RootLayout: React.FC<LayoutProps & { t: TFunction; i18n: I18nInstance }> = ({ children, t, i18n }) => {
  const location = useLocation();
  const { user } = useAuth();

  const isOperatorRoute = OPERATOR_LAYOUT_ROUTES.some(route =>
    Object.values(route).some(localizedPath => matchPath({ path: localizedPath, end: true }, location.pathname)),
  );
  const isStaffUser = hasAnyRole(user, STAFF_ROLES);

  if (isOperatorRoute && isStaffUser) {
    return <OperatorLayout>{children}</OperatorLayout>;
  }

  return (
    <AppLayout t={t} i18n={i18n}>
      {children}
    </AppLayout>
  );
};

export default RootLayout;
