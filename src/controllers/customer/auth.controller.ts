import { Request, Response } from 'express';
import { CustomerAuthService } from '../../services/customer-auth.service';
import { asyncHandler } from '../../utils/asyncHandler';

const customerAuthService = new CustomerAuthService();

export const customerAuthController = {
  // POST /api/customer/login
  login: asyncHandler(async (req: Request, res: Response) => {
    const { email, phone, password } = req.body;

    const result = await customerAuthService.login({
      email,
      phone,
      password,
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  }),

  // GET /api/customer/me (get current user info)
  getCurrentUser: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId!; // Set by authenticateCustomer middleware

    const user = await customerAuthService.getUserById(userId);

    res.status(200).json({
      success: true,
      data: user,
    });
  }),
};