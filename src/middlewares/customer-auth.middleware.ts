import { Request, Response, NextFunction } from 'express';
import { verifyCustomerToken } from '../utils/jwt';
import { UnauthorizedError } from '../errors/UnauthorizedError';

// Extend Express Request to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: number;
      userEmail?: string;
    }
  }
}

export const authenticateCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided. Please login.');
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = verifyCustomerToken(token);

    // Attach user info to request
    req.userId = decoded.userId;
    req.userEmail = decoded.email;

    next();
  } catch (error: any) {
    if (error.message.includes('expired')) {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please login again.',
      });
    }
    
    return res.status(401).json({
      success: false,
      message: error.message || 'Authentication failed',
    });
  }
};