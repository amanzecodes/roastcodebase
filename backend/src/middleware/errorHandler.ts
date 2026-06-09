import { type Request, type Response, type NextFunction } from 'express';
import { AppError } from '../types/errors.js';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.status).json({ error: err.message, code: err.code });
    return;
  }

  console.error(err);
  res.status(500).json({ error: 'Internal server error', code: 'INTERNAL_ERROR' });
}
