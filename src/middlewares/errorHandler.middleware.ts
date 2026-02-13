import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { AppError } from '../errors/AppError';
import { ValidationError } from '../errors/ValidationError';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Error:', err);

  // Handle ValidationError (Zod)
  if (err instanceof ValidationError) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: err.errors,
    });
  }

  // Handle AppError (custom errors)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  }

  // Handle Prisma errors
  if (err.code?.startsWith('P')) {
    logger.error('Prisma error:', err.code, err.meta);
    
    // Common Prisma errors
    if (err.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: 'A record with this data already exists',
      });
    }
    
    if (err.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Record not found',
      });
    }
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      details: err,
    }),
  });
};