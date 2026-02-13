import { Request, Response } from 'express';
import { ReservationService } from '../../services/reservation.service';
import { asyncHandler } from '../../utils/asyncHandler';

export class ReservationController {
  private reservationService: ReservationService;

  constructor() {
    this.reservationService = new ReservationService();
  }

  createReservation = asyncHandler(async (req: Request, res: Response) => {
    const {
      restaurantId,
      reservationDate,
      startTime,
      guestCount,
      customerName,
      customerPhone,
      customerEmail,
      specialRequests,
    } = req.body;

    const result = await this.reservationService.createReservation({
      restaurantId: Number(restaurantId),
      reservationDate: new Date(reservationDate),
      startTime,
      guestCount: Number(guestCount),
      customerName,
      customerPhone,
      customerEmail,
      specialRequests,
    });

    res.status(201).json({
      success: true,
      message: result.message,
      data: result.reservation,
    });
  });

  getReservationById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const reservation = await this.reservationService.getReservationById(Number(id));

    res.status(200).json({
      success: true,
      data: reservation,
    });
  });

  lookupReservations = asyncHandler(async (req: Request, res: Response) => {
    const { phone, email } = req.query;

    const reservations = await this.reservationService.findReservationsByCustomer(
      phone as string,
      email as string
    );

    res.status(200).json({
      success: true,
      data: reservations,
    });
  });

  updateReservation = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updates = req.body;

    if (updates.reservationDate) {
      updates.reservationDate = new Date(updates.reservationDate);
    }

    const result = await this.reservationService.updateReservation(Number(id), updates);

    res.status(200).json({
      success: true,
      message: result.message,
      data: result.reservation,
    });
  });

  cancelReservation = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { cancellationReason } = req.body;

    const result = await this.reservationService.cancelReservation(
      Number(id),
      cancellationReason
    );

    res.status(200).json({
      success: true,
      message: result.message,
    });
  });
}