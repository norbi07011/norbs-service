import express from 'express';
import { body, query } from 'express-validator';
import { FileController } from '../controllers/FileController.js';
import { auth } from '../middleware/auth.js';
import { authorize } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication to all routes
router.use(auth);

// Upload file
router.post('/upload',
  FileController.upload.single('file'),
  body('projectId').optional().isInt().withMessage('Project ID must be a number'),
  body('description').optional().isLength({ max: 500 }).withMessage('Description must be 500 characters or less'),
  body('category').optional().isIn(['general', 'design', 'document', 'media', 'code', 'other']).withMessage('Invalid category'),
  body('isPublic').optional().isBoolean().withMessage('isPublic must be true or false'),
  FileController.uploadFile
);

// Get file details
router.get('/:id',
  FileController.getFile
);

// Download file
router.get('/:id/download',
  FileController.downloadFile
);

// Update file
router.put('/:id',
  body('description').optional().isLength({ max: 500 }).withMessage('Description must be 500 characters or less'),
  body('category').optional().isIn(['general', 'design', 'document', 'media', 'code', 'other']).withMessage('Invalid category'),
  body('isPublic').optional().isBoolean().withMessage('isPublic must be true or false'),
  FileController.updateFile
);

// Delete file
router.delete('/:id',
  FileController.deleteFile
);

// Get files by project
router.get('/project/:projectId',
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be 0 or greater'),
  FileController.getProjectFiles
);

// Get files by user
router.get('/user/:userId',
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be 0 or greater'),
  FileController.getUserFiles
);

// Get public files
router.get('/public/list',
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be 0 or greater'),
  FileController.getPublicFiles
);

// Search files
router.get('/search/query',
  query('q').notEmpty().isLength({ min: 1, max: 100 }).withMessage('Search term is required and must be 1-100 characters'),
  query('projectId').optional().isInt().withMessage('Project ID must be a number'),
  query('category').optional().isIn(['all', 'general', 'design', 'document', 'media', 'code', 'other']).withMessage('Invalid category'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be 0 or greater'),
  FileController.searchFiles
);

// Get storage statistics (owner only)
router.get('/stats/storage',
  authorize(['owner']),
  FileController.getStorageStats
);

export default router;