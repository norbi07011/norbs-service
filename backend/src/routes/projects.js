import express from 'express';
import { body, query } from 'express-validator';
import { ProjectController } from '../controllers/ProjectController.js';
import { authenticateToken, authorizeRoles, authorizeOwnerOrClient } from '../middleware/auth.js';

const router = express.Router();

// Validation rules
const projectValidation = [
  body('title')
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Title must be between 2 and 255 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  body('status')
    .optional()
    .isIn(['planning', 'in-progress', 'review', 'done'])
    .withMessage('Status must be one of: planning, in-progress, review, done'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be one of: low, medium, high'),
  body('budgetType')
    .optional()
    .isIn(['fixed', 'hourly'])
    .withMessage('Budget type must be either fixed or hourly'),
  body('budgetAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Budget amount must be a positive number'),
  body('clientId')
    .isUUID()
    .withMessage('Client ID must be a valid UUID'),
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date')
];

const searchValidation = [
  query('search')
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Search term must be between 1 and 255 characters'),
  query('status')
    .optional()
    .isIn(['planning', 'in-progress', 'review', 'done'])
    .withMessage('Status must be one of: planning, in-progress, review, done'),
  query('clientId')
    .optional()
    .isUUID()
    .withMessage('Client ID must be a valid UUID')
];

// All routes require authentication
router.use(authenticateToken);

// Routes
router.get('/', authorizeOwnerOrClient, ProjectController.getAll);
router.get('/stats', authorizeRoles('owner'), ProjectController.getStats);
router.get('/client/:clientId', authorizeOwnerOrClient, ProjectController.getByClientId);
router.get('/:id', authorizeOwnerOrClient, ProjectController.getById);
router.post('/', authorizeRoles('owner'), projectValidation, ProjectController.create);
router.put('/:id', authorizeRoles('owner'), projectValidation, ProjectController.update);
router.delete('/:id', authorizeRoles('owner'), ProjectController.delete);

export default router;