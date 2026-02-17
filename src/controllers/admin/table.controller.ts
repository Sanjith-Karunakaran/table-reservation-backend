import { Request, Response } from 'express';
import { TableService } from '../../services/table.service';
import { asyncHandler } from '../../utils/asyncHandler';

export class AdminTableController {
  private tableService: TableService;

  constructor() {
    this.tableService = new TableService();
  }

  // Get all tables for restaurant
  getAllTables = asyncHandler(async (req: Request, res: Response) => {
    const { restaurantId } = req.query;

    const tables = await this.tableService.getAllTables(Number(restaurantId));

    res.status(200).json({
      success: true,
      data: tables,
    });
  });

  // Toggle table maintenance status
  toggleMaintenance = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    const updatedTable = await this.tableService.updateTableStatus(Number(id), status);

    res.status(200).json({
      success: true,
      data: updatedTable,
      message: `Table status updated to ${status.toLowerCase()}`,
    });
  });
}