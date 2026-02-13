import { Request, Response } from 'express';
import { TableRepository } from '../../repositories/table.repository';
import { asyncHandler } from '../../utils/asyncHandler';

export class AdminTableController {
  private tableRepo: TableRepository;

  constructor() {
    this.tableRepo = new TableRepository();
  }

  // Get all tables for restaurant
  getAllTables = asyncHandler(async (req: Request, res: Response) => {
    const { restaurantId } = req.query;

    const tables = await this.tableRepo.findByRestaurantId(Number(restaurantId));

    res.status(200).json({
      success: true,
      data: tables,
    });
  });

  // Toggle table maintenance status
  toggleMaintenance = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body; // 'AVAILABLE' or 'MAINTENANCE'

    await this.tableRepo.updateStatus(Number(id), status);

    res.status(200).json({
      success: true,
      message: `Table status updated to ${status}`,
    });
  });
}