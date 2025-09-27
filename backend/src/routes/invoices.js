import express from 'express';
import { body, query } from 'express-validator';
import { InvoiceController } from '../controllers/InvoiceController.js';
import { auth } from '../middleware/auth.js';
import { authorize } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication to all routes
router.use(auth);

// Get all invoices (owner only)
router.get('/', 
  authorize(['owner']),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be 0 or greater'),
  query('status').optional().isIn(['draft', 'sent', 'paid', 'overdue', 'cancelled']).withMessage('Invalid status'),
  InvoiceController.getAll
);

// Get invoice by ID
router.get('/:id',
  InvoiceController.getById
);

// Get invoice by invoice number
router.get('/number/:invoiceNumber',
  InvoiceController.getByInvoiceNumber
);

// Get invoices by client
router.get('/client/:clientId',
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be 0 or greater'),
  InvoiceController.getByClient
);

// Get invoices by project (owner only)
router.get('/project/:projectId',
  authorize(['owner']),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be 0 or greater'),
  InvoiceController.getByProject
);

// Create new invoice (owner only)
router.post('/',
  authorize(['owner']),
  body('clientId').notEmpty().isInt().withMessage('Client ID is required and must be a number'),
  body('projectId').optional().isInt().withMessage('Project ID must be a number'),
  body('amount').notEmpty().isFloat({ min: 0 }).withMessage('Amount is required and must be a positive number'),
  body('currency').optional().isLength({ min: 3, max: 3 }).withMessage('Currency must be 3 characters'),
  body('taxRate').optional().isFloat({ min: 0, max: 1 }).withMessage('Tax rate must be between 0 and 1'),
  body('status').optional().isIn(['draft', 'sent', 'paid', 'overdue', 'cancelled']).withMessage('Invalid status'),
  body('dueDate').notEmpty().isISO8601().withMessage('Due date is required and must be valid date'),
  body('description').notEmpty().isLength({ min: 1, max: 500 }).withMessage('Description is required and must be 1-500 characters'),
  body('notes').optional().isLength({ max: 1000 }).withMessage('Notes must be 1000 characters or less'),
  body('items').optional().isArray().withMessage('Items must be an array'),
  body('items.*.description').if(body('items').exists()).notEmpty().withMessage('Item description is required'),
  body('items.*.quantity').if(body('items').exists()).isFloat({ min: 0 }).withMessage('Item quantity must be positive'),
  body('items.*.unit_price').if(body('items').exists()).isFloat({ min: 0 }).withMessage('Item unit price must be positive'),
  InvoiceController.create
);

// Update invoice (owner only)
router.put('/:id',
  authorize(['owner']),
  body('amount').optional().isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('currency').optional().isLength({ min: 3, max: 3 }).withMessage('Currency must be 3 characters'),
  body('taxRate').optional().isFloat({ min: 0, max: 1 }).withMessage('Tax rate must be between 0 and 1'),
  body('status').optional().isIn(['draft', 'sent', 'paid', 'overdue', 'cancelled']).withMessage('Invalid status'),
  body('dueDate').optional().isISO8601().withMessage('Due date must be valid date'),
  body('description').optional().isLength({ min: 1, max: 500 }).withMessage('Description must be 1-500 characters'),
  body('notes').optional().isLength({ max: 1000 }).withMessage('Notes must be 1000 characters or less'),
  InvoiceController.update
);

// Mark invoice as paid (owner only)
router.post('/:id/mark-paid',
  authorize(['owner']),
  body('paymentDate').optional().isISO8601().withMessage('Payment date must be valid date'),
  InvoiceController.markAsPaid
);

// Delete invoice (owner only)
router.delete('/:id',
  authorize(['owner']),
  InvoiceController.delete
);

// Get invoice statistics (owner only)
router.get('/stats/summary',
  authorize(['owner']),
  InvoiceController.getStats
);

// Get overdue invoices (owner only)
router.get('/overdue/list',
  authorize(['owner']),
  InvoiceController.getOverdue
);

// Update overdue invoices (owner only)
router.post('/overdue/update',
  authorize(['owner']),
  InvoiceController.updateOverdue
);

export default router;