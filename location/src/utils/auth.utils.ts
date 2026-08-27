import { AuthorityEnum } from '@/models/enums';
import { UserOperator } from '@/models/UserOperator';
import { Authority } from '@/models/UserInfo';

/**
 * Check if user has a specific role
 */
export const hasRole = (user: UserOperator | null, role: AuthorityEnum): boolean => {
  return user?.authorities?.some((auth: Authority) => auth.name === role) ?? false;
};

/**
 * Check if user has any of the specified roles
 */
export const hasAnyRole = (user: UserOperator | null, roles: AuthorityEnum[]): boolean => {
  return roles.some(role => hasRole(user, role));
};

/**
 * Check if user is a GUICHET user
 */
export const isGuichetUser = (user: UserOperator | null): boolean => {
  return hasRole(user, AuthorityEnum.GUICHET);
};

/**
 * Check if user is an OPERATOR user
 */
export const isOperatorUser = (user: UserOperator | null): boolean => {
  return hasRole(user, AuthorityEnum.OPERATOR);
};

/**
 * Check if user is an ADMIN user
 */
export const isAdminUser = (user: UserOperator | null): boolean => {
  return hasRole(user, AuthorityEnum.ADMIN);
};

/**
 * Check if user is a KOPERATIVE user
 */
export const isKoperativeUser = (user: UserOperator | null): boolean => {
  return hasRole(user, AuthorityEnum.KOPERATIVE);
};

/**
 * Check if user is a CHAUFFEUR user
 */
export const isChauffeurUser = (user: UserOperator | null): boolean => {
  return hasRole(user, AuthorityEnum.CHAUFFEUR);
};

/**
 * Check if user has administrative privileges (ADMIN, KOPERATIVE, or GUICHET)
 */
export const hasAdministrativeRole = (user: UserOperator | null): boolean => {
  return hasAnyRole(user, [AuthorityEnum.ADMIN, AuthorityEnum.KOPERATIVE, AuthorityEnum.GUICHET]);
};
