import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { errorHandler, notFound } from './middleware/error.js';
import { sanitizeInput } from './middleware/sanitize.js';
import authRouter  from './routes/auth.routes.js';
import { userRouter } from './routes/user.routes.js';
import { vaultRouter } from './routes/vault.routes.js';

export const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(
  cors({
    origin: env.clientOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);
app.use(express.json({ limit: '32kb' }));
app.use(sanitizeInput);

if (env.nodeEnv !== 'test') {
  app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
}

app.get('/health', (req, res) => {
  return res.status(200).json({ status: 'ok' });
});

app.use('/api/auth', authRouter);
app.use('/api/vault', vaultRouter);
app.use('/api/users', userRouter);

app.use(notFound);
app.use(errorHandler);

