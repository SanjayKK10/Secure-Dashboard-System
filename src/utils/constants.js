export const ROLES = {
  ADMIN: 'admin',
  EMPLOYEE: 'employee'
};

export const STORAGE_KEYS = {
  USERS: 'portal_users',
  CURRENT_USER: 'portal_current_user',
  ACTIVITY_LOG: 'portal_activity_log',
  SESSION: 'portal_session'
};

export const SESSION_DURATION = 8 * 60 * 60 * 1000; 

export const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecial: true
};

export const ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  EMPLOYEE_DASHBOARD: '/dashboard',
  ADMIN_DASHBOARD: '/admin',
  ACCESS_DENIED: '/access-denied'
};
