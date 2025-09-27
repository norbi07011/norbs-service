import apiClient, { ApiError } from './apiClient.js';
import { API_CONFIG } from '../config/api.js';
import { setAuthToken, setStoredUser, clearAuthData, getAuthToken } from '../config/api.js';

export class RealAuthService {
  static async login(email, password) {
    try {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.LOGIN, {
        email,
        password
      });

      if (response.token && response.user) {
        // Store token and user data
        setAuthToken(response.token);
        setStoredUser(response.user);
        
        return {
          success: true,
          user: response.user,
          token: response.token,
          message: response.message
        };
      }

      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Login error:', error);
      
      if (error instanceof ApiError) {
        throw new Error(error.message);
      }
      
      throw new Error('Login failed. Please try again.');
    }
  }

  static async register(userData) {
    try {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.REGISTER, userData);

      if (response.token && response.user) {
        // Store token and user data
        setAuthToken(response.token);
        setStoredUser(response.user);
        
        return {
          success: true,
          user: response.user,
          token: response.token,
          message: response.message
        };
      }

      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error instanceof ApiError) {
        throw new Error(error.message);
      }
      
      throw new Error('Registration failed. Please try again.');
    }
  }

  static async refreshToken() {
    try {
      const currentToken = getAuthToken();
      if (!currentToken) {
        throw new Error('No token available');
      }

      const response = await apiClient.post(API_CONFIG.ENDPOINTS.REFRESH_TOKEN, {
        token: currentToken
      });

      if (response.token && response.user) {
        setAuthToken(response.token);
        setStoredUser(response.user);
        
        return {
          success: true,
          user: response.user,
          token: response.token
        };
      }

      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Token refresh error:', error);
      clearAuthData();
      throw error;
    }
  }

  static async getCurrentUser() {
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.ME);
      
      if (response.user) {
        setStoredUser(response.user);
        return response.user;
      }

      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Get current user error:', error);
      
      if (error instanceof ApiError && error.status === 401) {
        clearAuthData();
      }
      
      throw error;
    }
  }

  static async changePassword(currentPassword, newPassword) {
    try {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.CHANGE_PASSWORD, {
        currentPassword,
        newPassword
      });

      return {
        success: true,
        message: response.message
      };
    } catch (error) {
      console.error('Change password error:', error);
      
      if (error instanceof ApiError) {
        throw new Error(error.message);
      }
      
      throw new Error('Password change failed. Please try again.');
    }
  }

  static async logout() {
    try {
      // Call logout endpoint to invalidate token on server (if implemented)
      await apiClient.post(API_CONFIG.ENDPOINTS.LOGOUT);
    } catch (error) {
      console.error('Logout API error:', error);
      // Don't throw error on logout - always clear local data
    } finally {
      clearAuthData();
    }
  }

  static isTokenExpired() {
    const token = getAuthToken();
    if (!token) return true;

    try {
      // Decode JWT token to check expiration
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Token validation error:', error);
      return true;
    }
  }

  static shouldUseRealAPI() {
    // Check if backend is available - for now return false to use mock data
    // This can be controlled by environment variable
    return import.meta.env.VITE_USE_REAL_API === 'true';
  }
}