import { Request, Response } from 'express';
import { WaitlistService } from '../../services/waitlist.service';
import { asyncHandler } from '../../utils/asyncHandler';

export class WaitlistController {
  private waitlistService: WaitlistService;

  constructor() {
    this.waitlistService = new WaitlistService();
  }

  joinWaitlist = asyncHandler(async (req: Request, res: Response) => {
    const {
      restaurantId,
      customerName,
      customerPhone,
      customerEmail,
      requestedDate,
      requestedTime,
      guestCount,
    } = req.body;

    const result = await this.waitlistService.joinWaitlist({
      restaurantId: Number(restaurantId),
      customerName,
      customerPhone,
      customerEmail,
      requestedDate: new Date(requestedDate),
      requestedTime,
      guestCount: Number(guestCount),
    });

    res.status(201).json({
      success: true,
      message: result.message,
      data: {
        waitlistEntry: result.waitlistEntry,
        position: result.position,
      },
    });
  });

  getWaitlistStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await this.waitlistService.getWaitlistStatus(Number(id));

    res.status(200).json({
      success: true,
      data: {
        entry: result.entry,
        position: result.position,
      },
    });
  });
}