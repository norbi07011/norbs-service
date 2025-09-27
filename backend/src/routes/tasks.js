import express from 'express';
import { body, query } from 'express-validator';
import { TaskController } from '../controllers/TaskController.js';
import { authenticateToken, authorizeRoles, authorizeOwnerOrClient } from '../middleware/auth.js';

const router = express.Router();

// Validation rules
const taskValidation = [
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
    .isIn(['pending', 'completed'])
    .withMessage('Status must be either pending or completed'),
  body('projectId')
    .isUUID()
    .withMessage('Project ID must be a valid UUID'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date'),
  body('hoursLogged')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Hours logged must be a positive number')
];

const queryValidation = [
  query('projectId')
    .optional()
    .isUUID()
    .withMessage('Project ID must be a valid UUID')
];

// All routes require authentication
router.use(authenticateToken);

// Routes
router.get('/', authorizeOwnerOrClient, queryValidation, TaskController.getAll);
router.get('/stats', authorizeOwnerOrClient, queryValidation, TaskController.getStats);
router.get('/overdue', authorizeOwnerOrClient, TaskController.getOverdue);
router.get('/:id', authorizeOwnerOrClient, TaskController.getById);
router.post('/', authorizeOwnerOrClient, taskValidation, TaskController.create);
router.put('/:id', authorizeOwnerOrClient, taskValidation, TaskController.update);
router.delete('/:id', authorizeRoles('owner'), TaskController.delete); // Only owner can delete tasks

export default router;