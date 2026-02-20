import { Request, Response } from 'express';
import { AvailabilityService } from '../../services/availability.service';
import { asyncHandler } from '../../utils/asyncHandler';

export class AvailabilityController {
  private availabilityService: AvailabilityService;

  constructor() {
    this.availabilityService = new AvailabilityService();
  }

  // ✅ FIXED: Changed from req.body to req.query
  checkAvailability = asyncHandler(async (req: Request, res: Response) => {
    const { restaurantId, reservationDate, startTime, guestCount } = req.query;

    // Validate required params
    if (!restaurantId || !reservationDate || !startTime || !guestCount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: restaurantId, reservationDate, startTime, guestCount',
      });
    }

    const result = await this.availabilityService.checkAvailability({
      restaurantId: Number(restaurantId),
      reservationDate: new Date(reservationDate as string),
      startTime: startTime as string,
      guestCount: Number(guestCount),
    });

    res.status(200).json({
      success: true,
      message: result.message,
      data: {
        available: result.available,
        availableTables: result.availableTables, // ✅ FIXED: Changed from 'tables' to 'availableTables'
      },
    });
  });
}