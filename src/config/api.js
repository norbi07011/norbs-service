// API Configuration for Backend Integration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3006/api',
  TIMEOUT: 10000,
  
  // Endpoints
  ENDPOINTS: {
    // Auth
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH_TOKEN: '/auth/refresh-token',
    ME: '/auth/me',
    CHANGE_PASSWORD: '/auth/change-password',
    LOGOUT: '/auth/logout',
    
    // Clients
    CLIENTS: '/clients',
    
    // Projects (to be implemented)
    PROJECTS: '/projects',
    
    // Tasks (to be implemented)
    TASKS: '/tasks',
    
    // Files (to be implemented)
    FILES: '/files',
    
    // Invoices (to be implemented)
    INVOICES: '/invoices',
    
    // Activities (to be implemented)
    ACTIVITIES: '/activities'
  }
};

// HTTP Client Configuration
export const HTTP_CONFIG = {
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
};

// Token Management
export const TOKEN_KEY = 'norbs-jwt-token';
export const USER_KEY = 'norbs-user';

export const getAuthToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Failed to get auth token:', error);
    return null;
  }
};

export const setAuthToken = (token) => {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch (error) {
    console.error('Failed to set auth token:', error);
  }
};

export const getStoredUser = () => {
  try {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Failed to get stored user:', error);
    return null;
  }
};

export const setStoredUser = (user) => {
  try {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  } catch (error) {
    console.error('Failed to set stored user:', error);
  }
};

export const clearAuthData = () => {
  setAuthToken(null);
  setStoredUser(null);
};

// HTTP Client with automatic token injection
export const createAuthHeaders = () => {
  const token = getAuthToken();
  return {
    ...HTTP_CONFIG.headers,
    ...(token && { Authorization: `Bearer ${token}` })
  };
};