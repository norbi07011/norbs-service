import express from 'express';
import { body } from 'express-validator';
import { ClientController } from '../controllers/ClientController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Validation rules
const clientValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Name must be between 2 and 255 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('phone')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Phone must be less than 50 characters'),
  body('language')
    .optional()
    .isIn(['nl', 'en', 'tr', 'pl', 'de', 'fr'])
    .withMessage('Language must be one of: nl, en, tr, pl, de, fr'),
  body('address')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Address must be less than 500 characters'),
  body('city')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('City must be less than 100 characters'),
  body('zipCode')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Zip code must be less than 20 characters'),
  body('country')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Country must be less than 100 characters'),
  body('vatNumber')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('VAT number must be less than 50 characters')
];

// Routes - All client routes require authentication and owner role
router.use(authenticateToken);
router.use(authorizeRoles('owner'));

router.get('/', ClientController.getAll);
router.get('/:id', ClientController.getById);
router.post('/', clientValidation, ClientController.create);
router.put('/:id', clientValidation, ClientController.update);
router.delete('/:id', ClientController.delete);

export default router;