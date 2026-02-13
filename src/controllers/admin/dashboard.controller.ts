import { Request, Response } from 'express';
import { DashboardService } from '../../services/dashboard.service';
import { asyncHandler } from '../../utils/asyncHandler';

export class AdminDashboardController {
  private dashboardService: DashboardService;

  constructor() {
    this.dashboardService = new DashboardService();
  }

  getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
    // In a real app, get restaurantId from authenticated admin
    // For now, accept it from request body or query
    const restaurantId = Number(req.query.restaurantId || req.body.restaurantId);

    const stats = await this.dashboardService.getDashboardStats(restaurantId);

    res.status(200).json({
      success: true,
      data: stats,
    });
  });
}