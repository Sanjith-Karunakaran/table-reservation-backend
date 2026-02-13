import { Request, Response } from 'express';
import { AvailabilityService } from '../../services/availability.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { SUCCESS_MESSAGES } from '../../constants/message';

export class AvailabilityController {
  private availabilityService: AvailabilityService;

  constructor() {
    this.availabilityService = new AvailabilityService();
  }

  checkAvailability = asyncHandler(async (req: Request, res: Response) => {
    const { restaurantId, reservationDate, startTime, guestCount } = req.body;

    const result = await this.availabilityService.checkAvailability({
      restaurantId: Number(restaurantId),
      reservationDate: new Date(reservationDate),
      startTime,
      guestCount: Number(guestCount),
    });

    res.status(200).json({
      success: result.available,
      message: result.message,
      data: {
        available: result.available,
        tables: result.availableTables,
      },
    });
  });
}