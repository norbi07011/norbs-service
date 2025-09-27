import { AuthService } from '../services/AuthService.js';
import { validationResult } from 'express-validator';

export class AuthController {
  static async register(req, res) {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const result = await AuthService.register(req.body);
      
      res.status(201).json({
        message: 'User registered successfully',
        ...result
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(400).json({
        error: error.message || 'Registration failed'
      });
    }
  }

  static async login(req, res) {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      
      res.json({
        message: 'Login successful',
        ...result
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(401).json({
        error: error.message || 'Login failed'
      });
    }
  }

  static async refreshToken(req, res) {
    try {
      const { token } = req.body;
      
      if (!token) {
        return res.status(400).json({
          error: 'Token is required'
        });
      }

      const result = await AuthService.refreshToken(token);
      
      res.json({
        message: 'Token refreshed successfully',
        ...result
      });
    } catch (error) {
      console.error('Token refresh error:', error);
      res.status(401).json({
        error: error.message || 'Token refresh failed'
      });
    }
  }

  static async me(req, res) {
    try {
      res.json({
        user: req.user
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({
        error: 'Failed to get user information'
      });
    }
  }

  static async changePassword(req, res) {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { currentPassword, newPassword } = req.body;
      const result = await AuthService.changePassword(
        req.user.id,
        currentPassword,
        newPassword
      );
      
      res.json(result);
    } catch (error) {
      console.error('Change password error:', error);
      res.status(400).json({
        error: error.message || 'Password change failed'
      });
    }
  }

  static async logout(req, res) {
    try {
      // In a real application, you might want to blacklist the token
      // For now, we'll just return a success message
      res.json({
        message: 'Logged out successfully'
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        error: 'Logout failed'
      });
    }
  }
}