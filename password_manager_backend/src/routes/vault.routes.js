import { Router } from 'express';
import { body, param, query } from 'express-validator';
import {
  createEntry,
  deleteEntry,
  getStats,
  listEntries,
  updateEntry
} from '../controllers/vault.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';

export const vaultRouter = Router();

function entryValidators({ passwordOptional = false } = {}) {
  const passwordValidator = body('password').isLength({ min: 1, max: 512 }).withMessage('Password is required.');
  return [
    body('websiteName').trim().isLength({ min: 1, max: 120 }).withMessage('Website name is required.'),
    body('websiteUrl').trim().isURL({ require_protocol: true }).withMessage('Website URL must include http:// or https://.'),
    body('username').trim().isLength({ min: 1, max: 160 }).withMessage('Username or email is required.'),
    passwordOptional ? passwordValidator.optional({ values: 'falsy' }) : passwordValidator,
    body('notes').optional({ values: 'falsy' }).trim().isLength({ max: 1000 }).withMessage('Notes must be under 1000 characters.')
  ];
}

vaultRouter.use(requireAuth);
vaultRouter.get('/', query('search').optional().trim().isLength({ max: 120 }), validateRequest, listEntries);
vaultRouter.get('/stats', getStats);
vaultRouter.post('/', entryValidators(), validateRequest, createEntry);
vaultRouter.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid entry id.'),
    ...entryValidators({ passwordOptional: true })
  ],
  validateRequest,
  updateEntry
);
vaultRouter.delete('/:id', param('id').isMongoId().withMessage('Invalid entry id.'), validateRequest, deleteEntry);
