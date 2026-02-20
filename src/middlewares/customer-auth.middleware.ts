// SIMPLE VERSION: No JWT validation, just pass through

import { Request, Response, NextFunction } from 'express';

export const authenticateCustomer = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // ✅ SIMPLE: Just pass through, no validation
  next();
};