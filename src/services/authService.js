import { STORAGE_KEYS, ROLES, SESSION_DURATION } from '../utils/constants';
import { logActivity, ActivityTypes } from './activityLogger';


const hashPassword = async (password) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'portal_salt_2024');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const getUsers = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
};

const saveUsers = (users) => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

const createSession = (user) => {
  const session = {
    userId: user.id,
    expiresAt: Date.now() + SESSION_DURATION,
    createdAt: Date.now()
  };
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
  return session;
};

const getSession = () => {
  try {
    const session = JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSION));
    if (!session) return null;
    if (Date.now() > session.expiresAt) {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      return null;
    }
    return session;
  } catch {
    return null;
  }
};

export const initializeDefaultAdmin = async () => {
  const users = getUsers();
  const adminExists = users.some(u => u.role === ROLES.ADMIN);
  
  if (!adminExists) {
    const hashedPassword = await hashPassword('Admin@123');
    const admin = {
      id: crypto.randomUUID(),
      email: 'admin@company.com',
      password: hashedPassword,
      name: 'System Admin',
      role: ROLES.ADMIN,
      department: 'IT',
      status: 'active',
      createdAt: new Date().toISOString()
    };
    users.push(admin);
    saveUsers(users);
  }
};

export const signup = async ({
  employeeId,
  email,
  password,
  name,
  department,
  role
}) => {
  const users = getUsers();
  
  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('An account with this email already exists');
  }
  
  const hashedPassword = await hashPassword(password);
  
 const newUser = {
  id: crypto.randomUUID(),
  employeeId,
  email: email.toLowerCase(),
  password: hashedPassword,
  name,
  department: department || 'General',
  role: role || ROLES.EMPLOYEE,
  status: 'active',
  createdAt: new Date().toISOString()
};

  users.push(newUser);
  saveUsers(users);
  
  logActivity(ActivityTypes.SIGNUP, newUser.id, { email: newUser.email });
  
  const { password: _, ...safeUser } = newUser;
  createSession(newUser);
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(safeUser));
  
  return safeUser;
};

export const login = async (email, password) => {
  const users = getUsers();

  console.log("Stored Users:", users);
  console.log("Entered Email:", email);

  const user = users.find(
    u => u.email.trim().toLowerCase() === email.trim().toLowerCase()
  );

  if (!user) {
    throw new Error('Email not found');
  }

  if (user.status === 'inactive') {
    throw new Error(
      'Your account has been deactivated. Please contact an administrator.'
    );
  }

  const hashedPassword = await hashPassword(password);

  console.log("Entered Password Hash:", hashedPassword);
  console.log("Stored Password Hash:", user.password);

  if (user.password !== hashedPassword) {
    logActivity(ActivityTypes.ACCESS_DENIED, user.id, {
      reason: 'Invalid password'
    });

    throw new Error('Invalid password');
  }

  const { password: _, ...safeUser } = user;

  createSession(user);

  localStorage.setItem(
    STORAGE_KEYS.CURRENT_USER,
    JSON.stringify(safeUser)
  );

  logActivity(ActivityTypes.LOGIN, user.id, {
    email: user.email
  });

  return safeUser;
};

export const logout = () => {
  const currentUser = getCurrentUser();
  if (currentUser) {
    logActivity(ActivityTypes.LOGOUT, currentUser.id, { email: currentUser.email });
  }
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  localStorage.removeItem(STORAGE_KEYS.SESSION);
};

export const getCurrentUser = () => {
  const session = getSession();
  if (!session) {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    return null;
  }
  
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER));
  } catch {
    return null;
  }
};

export const getAllUsers = () => {
  return getUsers().map(({ password, ...user }) => user);
};

export const updateUser = async (userId, updates) => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === userId);
  
  if (index === -1) {
    throw new Error('User not found');
  }
  
  if (updates.password) {
    updates.password = await hashPassword(updates.password);
  }
  
  users[index] = { ...users[index], ...updates, updatedAt: new Date().toISOString() };
  saveUsers(users);
  
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === userId) {
    const { password, ...safeUser } = users[index];
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(safeUser));
  }
  
  logActivity(ActivityTypes.USER_UPDATED, currentUser?.id || userId, { targetUserId: userId });
  
  const { password: _, ...safeUser } = users[index];
  return safeUser;
};

export const deleteUser = (userId) => {
  const users = getUsers();
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  if (user.role === ROLES.ADMIN) {
    const adminCount = users.filter(u => u.role === ROLES.ADMIN).length;
    if (adminCount <= 1) {
      throw new Error('Cannot delete the last admin account');
    }
  }
  
  const filtered = users.filter(u => u.id !== userId);
  saveUsers(filtered);
  
  const currentUser = getCurrentUser();
  logActivity(ActivityTypes.USER_DELETED, currentUser?.id, { deletedUserId: userId });
  
  return true;
};

export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};

export const hasRole = (requiredRole) => {
  const user = getCurrentUser();
  if (!user) return false;
  if (requiredRole === ROLES.ADMIN) return user.role === ROLES.ADMIN;
  return true;
};
export const resetPassword = async (email, newPassword) => {

  const users = getUsers();

  const userIndex = users.findIndex(
    u => u.email.toLowerCase() === email.toLowerCase()
  );

  if (userIndex === -1) {
    throw new Error('User not found');
  }

  const hashedPassword = await hashPassword(newPassword);

  users[userIndex].password = hashedPassword;

  users[userIndex].updatedAt = new Date().toISOString();

  saveUsers(users);

  logActivity(
    ActivityTypes.USER_UPDATED,
    users[userIndex].id,
    {
      action: 'Password Reset'
    }
  );

  return true;
};