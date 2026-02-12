import { Request, Response } from 'express';

export const healthCheck = (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: '🚀 Server is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
};

export const testRoute = (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: '✅ Test route works!',
    data: {
      route: req.path,
      method: req.method,
    },
  });
};