import { auth } from './auth.js';

export const permissions = {
  canViewAllUsers: () => auth.isAdmin(),
  canEditProducts: () => auth.isAdmin(),
  canEditCommissions: () => auth.isAdmin(),
  canManageUsers: () => auth.isAdmin(),
  canCreditMoney: () => auth.isAdmin(),
  canViewAdminPanel: () => auth.isAdmin(),
  canViewOwnData: () => auth.isLoggedIn(),
  canCreateOrder: () => auth.isLoggedIn(),
  canViewRanking: () => auth.isLoggedIn(),
};
