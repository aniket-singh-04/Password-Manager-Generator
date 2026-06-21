import { Router } from 'express';
import { body } from 'express-validator';
import { login, me, register } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { authRateLimiter } from '../middleware/rateLimit.js';
import { validateRequest } from '../middleware/validate.js';

const authRouter = Router();

const passwordRule = body('password')
  .isLength({ min: 10 })
  .withMessage('Password must be at least 10 characters long.');

authRouter.post(
  '/register',
  authRateLimiter,
  [
    body('name').trim().isLength({ min: 2, max: 80 }).withMessage('Name must be 2-80 characters.'),
    body('email').trim().isEmail().normalizeEmail().withMessage('Valid email is required.'),
    passwordRule
  ],
  validateRequest,
  register
);

authRouter.post(
  '/login',
  authRateLimiter,
  [
    body('email').trim().isEmail().normalizeEmail().withMessage('Valid email is required.'),
    body('password').notEmpty().withMessage('Password is required.')
  ],
  validateRequest,
  login
);

authRouter.get('/me', requireAuth, me);


export default authRouter;
