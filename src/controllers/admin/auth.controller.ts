import { Request, Response } from 'express';
import { AuthService } from '../../services/auth.service';
import { asyncHandler } from '../../utils/asyncHandler';

export class AdminAuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  login = asyncHandler(async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const admin = await this.authService.login({ username, password });

    // Store admin info in session (simple approach)
    // In production, you might use express-session
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: admin,
    });
  });

  // Simple logout (client-side will clear stored admin info)
  logout = asyncHandler(async (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  });
}