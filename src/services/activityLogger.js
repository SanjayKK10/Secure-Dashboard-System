import { STORAGE_KEYS } from '../utils/constants';

const MAX_LOG_ENTRIES = 100;

export const ActivityTypes = {
  LOGIN: 'login',
  LOGOUT: 'logout',
  SIGNUP: 'signup',
  PASSWORD_CHANGE: 'password_change',
  PROFILE_UPDATE: 'profile_update',
  ACCESS_DENIED: 'access_denied',
  USER_CREATED: 'user_created',
  USER_UPDATED: 'user_updated',
  USER_DELETED: 'user_deleted'
};

export const logActivity = (type, userId, details = {}) => {
  try {
    const logs = JSON.parse(localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOG) || '[]');
    
    const newEntry = {
      id: crypto.randomUUID(),
      type,
      userId,
      details,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    };
    
    logs.unshift(newEntry);
    
    // Keep only the most recent entries
    const trimmedLogs = logs.slice(0, MAX_LOG_ENTRIES);
    localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOG, JSON.stringify(trimmedLogs));
    
    return newEntry;
  } catch (error) {
    console.error('Failed to log activity:', error);
    return null;
  }
};

export const getActivityLogs = (userId = null, limit = 20) => {
  try {
    const logs = JSON.parse(localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOG) || '[]');
    
    let filtered = logs;
    if (userId) {
      filtered = logs.filter(log => log.userId === userId);
    }
    
    return filtered.slice(0, limit);
  } catch (error) {
    console.error('Failed to get activity logs:', error);
    return [];
  }
};

export const clearActivityLogs = () => {
  localStorage.removeItem(STORAGE_KEYS.ACTIVITY_LOG);
};
