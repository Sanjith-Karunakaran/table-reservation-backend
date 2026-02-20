import { Request, Response } from 'express';
import { CustomerAuthService } from '../../services/customer-auth.service';
import { asyncHandler } from '../../utils/asyncHandler';

export class CustomerAuthController {
  private authService: CustomerAuthService;

  constructor() {
    this.authService = new CustomerAuthService();
  }

  login = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.authService.login(req.body);
    
    res.status(200).json({
      success: true,
      message: 'Welcome back!',
      data: result,
    });
  });

  getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      data: { message: 'User authenticated' },
    });
  });
}

export const customerAuthController = new CustomerAuthController();