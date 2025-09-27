import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      error: 'Access token required',
      code: 'MISSING_TOKEN' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ 
        error: 'User not found',
        code: 'USER_NOT_FOUND' 
      });
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      clientId: user.client_id
    };
    
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(403).json({ 
      error: 'Invalid or expired token',
      code: 'INVALID_TOKEN' 
    });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required',
        code: 'AUTH_REQUIRED' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS',
        required: roles,
        actual: req.user.role
      });
    }

    next();
  };
};

export const authorizeOwnerOrClient = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      error: 'Authentication required',
      code: 'AUTH_REQUIRED' 
    });
  }

  // Owner can access everything
  if (req.user.role === 'owner') {
    return next();
  }

  // Client can only access their own data
  if (req.user.role === 'client') {
    // Check if the requested resource belongs to the client
    const clientId = req.params.clientId || req.body.clientId || req.query.clientId;
    
    if (clientId && clientId !== req.user.clientId) {
      return res.status(403).json({ 
        error: 'Access denied to this resource',
        code: 'ACCESS_DENIED' 
      });
    }
    
    return next();
  }

  return res.status(403).json({ 
    error: 'Invalid role',
    code: 'INVALID_ROLE' 
  });
};

// Alias for authenticateToken
export const auth = authenticateToken;

// Middleware factory for role-based authorization
export const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }
    next();
  };
};