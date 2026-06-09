import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../types/errors.js';

export interface AuthRequest extends Request {
  userId?: string;
  username?: string;
}

export const requireAuth = (req: AuthRequest, _res: Response, next: NextFunction): void => {
  const token = req.cookies?.singe_authentication_token;

  if (!token) {
    next(new AppError(401, 'NOT_AUTHENTICATED', 'Not authenticated'));
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; username: string };
    req.userId = payload.id;
    req.username = payload.username;
    next();
  } catch {
    next(new AppError(401, 'INVALID_TOKEN', 'Invalid token'));
  }
};
