import { Request, Response, NextFunction } from 'express';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // For now, skip authentication - in production you'd validate JWT tokens
  next();
};
