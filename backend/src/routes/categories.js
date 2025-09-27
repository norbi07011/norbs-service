import express from 'express';
import { body, query } from 'express-validator';
import { CategoryController } from '../controllers/CategoryController.js';
import { auth, authorize } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication to all routes
router.use(auth);

// Get all categories
router.get('/', 
  query('type').optional().isIn(['general', 'project', 'file', 'product', 'service']).withMessage('Invalid category type'),
  query('includeInactive').optional().isBoolean().withMessage('includeInactive must be true or false'),
  query('hierarchy').optional().isBoolean().withMessage('hierarchy must be true or false'),
  CategoryController.getAll
);

// Get category by ID
router.get('/:id',
  CategoryController.getById
);

// Get categories by type
router.get('/type/:type',
  CategoryController.getByType
);

// Get popular categories
router.get('/popular/list',
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  CategoryController.getPopular
);

// Search categories
router.get('/search/query',
  query('q').notEmpty().isLength({ min: 1, max: 100 }).withMessage('Search term is required and must be 1-100 characters'),
  query('type').optional().isIn(['general', 'project', 'file', 'product', 'service']).withMessage('Invalid category type'),
  CategoryController.search
);

// Create new category (owner only)
router.post('/',
  authorize(['owner']),
  body('name').notEmpty().isLength({ min: 1, max: 100 }).withMessage('Name is required and must be 1-100 characters'),
  body('description').optional().isLength({ max: 500 }).withMessage('Description must be 500 characters or less'),
  body('color').optional().matches(/^#[0-9A-F]{6}$/i).withMessage('Color must be a valid hex color'),
  body('icon').optional().isLength({ min: 1, max: 50 }).withMessage('Icon must be 1-50 characters'),
  body('type').optional().isIn(['general', 'project', 'file', 'product', 'service']).withMessage('Invalid category type'),
  body('parentId').optional().isInt().withMessage('Parent ID must be a number'),
  body('isActive').optional().isBoolean().withMessage('isActive must be true or false'),
  body('sortOrder').optional().isInt({ min: 0 }).withMessage('Sort order must be 0 or greater'),
  CategoryController.create
);

// Update category (owner only)
router.put('/:id',
  authorize(['owner']),
  body('name').optional().isLength({ min: 1, max: 100 }).withMessage('Name must be 1-100 characters'),
  body('description').optional().isLength({ max: 500 }).withMessage('Description must be 500 characters or less'),
  body('color').optional().matches(/^#[0-9A-F]{6}$/i).withMessage('Color must be a valid hex color'),
  body('icon').optional().isLength({ min: 1, max: 50 }).withMessage('Icon must be 1-50 characters'),
  body('type').optional().isIn(['general', 'project', 'file', 'product', 'service']).withMessage('Invalid category type'),
  body('parentId').optional().isInt().withMessage('Parent ID must be a number'),
  body('isActive').optional().isBoolean().withMessage('isActive must be true or false'),
  body('sortOrder').optional().isInt({ min: 0 }).withMessage('Sort order must be 0 or greater'),
  CategoryController.update
);

// Delete category (owner only)
router.delete('/:id',
  authorize(['owner']),
  CategoryController.delete
);

// Reorder categories (owner only)
router.post('/reorder',
  authorize(['owner']),
  body('categoryIds').isArray({ min: 1 }).withMessage('Category IDs array is required'),
  body('categoryIds.*').isInt().withMessage('Each category ID must be a number'),
  CategoryController.reorder
);

// Get category statistics (owner only)
router.get('/stats/summary',
  authorize(['owner']),
  CategoryController.getStats
);

// Create default categories (owner only)
router.post('/defaults/create',
  authorize(['owner']),
  CategoryController.createDefaults
);

export default router;