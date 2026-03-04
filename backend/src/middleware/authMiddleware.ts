import type { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/jwt.js';

declare global {
  namespace Express {
    interface Request {
      authUser?: {
        userId: string;
        email: string;
      };
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    req.authUser = verifyToken(token);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};
