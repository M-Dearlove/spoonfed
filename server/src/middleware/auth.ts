import { Request, Response, NextFunction } from 'express';
// Extend the Request interface to include the user property
declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload;
  }
}
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader: string | undefined = req.headers['authorization'];
  
  // More concise token extraction
  const token = authHeader?.split(' ')[1];
 
  if (!token) {
    return res.status(401).json({ message: 'No token provided.' });
  }

  try {
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET_KEY || 'defaultsecret'
    ) as JwtPayload;
    
    // Attach decoded user to request instead of modifying body
    req.user = decoded;
    
    return next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token expired' });
    }
    
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Optional: Token generation function
export const generateToken = (payload: Omit<JwtPayload, 'iat' | 'exp'>): string => {
  return jwt.sign(
    payload, 
    process.env.JWT_SECRET_KEY || 'defaultsecret', 
    { expiresIn: '1h' }
  );
};