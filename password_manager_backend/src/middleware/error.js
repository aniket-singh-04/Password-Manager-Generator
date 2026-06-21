import { env } from '../config/env.js';

export function notFound(req, res) {
  return res.status(404).json({ message: 'Route not found.' });
}

export function errorHandler(err, req, res, next) {
  const status = err.statusCode || err.status || 500;
  const response = {
    message: status === 500 ? 'Something went wrong.' : err.message
  };

  if (env.nodeEnv !== 'production') {
    response.stack = err.stack;
  }

  res.status(status).json(response);
}

