import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: number;
  role: string;
}

export const protect = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  console.log('[Middleware] Auth Header:', authHeader);

  // Check if Authorization header exists
  if (!authHeader) {
    console.log('[Middleware] No Auth Header found');
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  // Extract token: Handle "Bearer <token>" or "Bearer<token>" or just "<token>"
  let token = '';
  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (authHeader.startsWith('Bearer')) {
    // Handle missing space case
    token = authHeader.substring(6);
  } else {
    // Fallback: assume the whole header is the token
    token = authHeader;
  }

  console.log(`[Middleware] Extracted Token: ${token.substring(0, 10)}... (Length: ${token.length})`);

  try {
    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    // Attach user info to request
    (req as any).user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
};
