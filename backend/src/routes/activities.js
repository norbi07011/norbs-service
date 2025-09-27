import express from 'express';
import { body, query } from 'express-validator';
import { ActivityController } from '../controllers/ActivityController.js';
import { auth } from '../middleware/auth.js';
import { authorize } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication to all routes
router.use(auth);

// Get all activities (owner only)
router.get('/', 
  authorize(['owner']),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be 0 or greater'),
  ActivityController.getAll
);

// Get activity by ID (owner only)
router.get('/:id',
  authorize(['owner']),
  ActivityController.getById
);

// Get activities by user ID
router.get('/user/:userId',
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be 0 or greater'),
  ActivityController.getByUser
);

// Get activities by date range (owner only)
router.get('/date-range/search',
  authorize(['owner']),
  query('startDate').notEmpty().isISO8601().withMessage('Start date must be valid ISO 8601 date'),
  query('endDate').notEmpty().isISO8601().withMessage('End date must be valid ISO 8601 date'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be 0 or greater'),
  ActivityController.getByDateRange
);

// Get activity statistics (owner only)
router.get('/stats/summary',
  authorize(['owner']),
  ActivityController.getStats
);

// Create new activity log entry
router.post('/',
  body('action').notEmpty().isLength({ min: 1, max: 100 }).withMessage('Action is required and must be 1-100 characters'),
  body('resource').optional().isLength({ max: 50 }).withMessage('Resource must be 50 characters or less'),
  body('resourceId').optional().isInt().withMessage('Resource ID must be a number'),
  body('description').optional().isLength({ max: 500 }).withMessage('Description must be 500 characters or less'),
  body('metadata').optional().isObject().withMessage('Metadata must be an object'),
  ActivityController.create
);

export default router;