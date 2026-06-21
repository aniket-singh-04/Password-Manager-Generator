import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';

export const authRateLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  max: env.authRateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many authentication attempts. Please try again later.'
  }
});

