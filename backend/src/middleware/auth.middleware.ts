import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
  iat: number;
  exp: number;
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'No authorization token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = process.env.JWT_ACCESS_SECRET || 'access-secret';
    const payload = jwt.verify(token, secret) as TokenPayload;

    req.user = { id: payload.userId };

    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
