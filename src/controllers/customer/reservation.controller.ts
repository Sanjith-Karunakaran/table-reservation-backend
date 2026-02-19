import { Request, Response } from 'express';
import { ReservationService } from '../../services/reservation.service';
import { asyncHandler } from '../../utils/asyncHandler';

const reservationService = new ReservationService();

export const customerReservationController = {
  // POST /api/customer/reservations - Create new reservation
  create: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId; // ✅ Set by authenticateCustomer middleware (optional if guest)

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

    const result = await reservationService.createReservation({
      restaurantId: Number(restaurantId),
      reservationDate: new Date(reservationDate),
      startTime,
      guestCount: Number(guestCount),
      customerName,
      customerPhone,
      customerEmail,
      specialRequests,
      bookingSource: 'ONLINE',
      userId,  // ✅ Pass userId (can be undefined for guests)
    });

    res.status(201).json({
      success: true,
      message: result.message,
      data: result.reservation,
    });
  }),

  // GET /api/customer/reservations/my - Get logged-in user's reservations
  // ✅ NEW ENDPOINT
  getMyReservations: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId!; // Required - set by authenticateCustomer middleware

    const reservations = await reservationService.getReservationsByUser(userId);

    res.status(200).json({
      success: true,
      data: reservations,
    });
  }),

  // GET /api/customer/reservations - Lookup by phone/email (legacy - kept for compatibility)
  lookup: asyncHandler(async (req: Request, res: Response) => {
    const { phone, email } = req.query;

    const reservations = await reservationService.findReservationsByCustomer(
      phone as string,
      email as string
    );

    res.status(200).json({
      success: true,
      data: reservations,
    });
  }),

  // GET /api/customer/reservations/:id - Get single reservation
  getById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const reservation = await reservationService.getReservationById(Number(id));

    res.status(200).json({
      success: true,
      data: reservation,
    });
  }),

  // PATCH /api/customer/reservations/:id - Update reservation
  update: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updates = req.body;

    const result = await reservationService.updateReservation(Number(id), updates);

    res.status(200).json({
      success: true,
      message: result.message,
      data: result.reservation,
    });
  }),

  // DELETE /api/customer/reservations/:id - Cancel reservation
  cancel: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { cancellationReason } = req.body;

    const result = await reservationService.cancelReservation(
      Number(id),
      cancellationReason
    );

    res.status(200).json({
      success: true,
      message: result.message,
    });
  }),
};