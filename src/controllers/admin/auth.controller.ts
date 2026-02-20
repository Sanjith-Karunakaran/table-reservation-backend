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

    // ✅ FIXED: Pass as separate arguments, not an object
    const admin = await this.authService.login(username, password);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: admin,
    });
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  });
}