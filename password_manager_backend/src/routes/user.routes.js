import { Router } from 'express';
import { body } from 'express-validator';
import { changePassword, updateProfile } from '../controllers/user.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';

export const userRouter = Router();

userRouter.use(requireAuth);

userRouter.put(
  '/profile',
  [
    body('name').trim().isLength({ min: 2, max: 80 }).withMessage('Name must be 2-80 characters.'),
    body('email').trim().isEmail().normalizeEmail().withMessage('Valid email is required.')
  ],
  validateRequest,
  updateProfile
);

userRouter.put(
  '/password',
  [
    body('currentPassword').notEmpty().withMessage('Current password is required.'),
    body('newPassword').isLength({ min: 10 }).withMessage('New password must be at least 10 characters long.')
  ],
  validateRequest,
  changePassword
);

