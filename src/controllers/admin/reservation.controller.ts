import { Request, Response } from 'express';
import { ReservationService } from '../../services/reservation.service';
import { ReservationRepository } from '../../repositories/reservation.repository';
import { asyncHandler } from '../../utils/asyncHandler';
import { SUCCESS_MESSAGES } from '../../constants/message';

export class AdminReservationController {
  private reservationService: ReservationService;
  private reservationRepo: ReservationRepository;

  constructor() {
    this.reservationService = new ReservationService();
    this.reservationRepo = new ReservationRepository();
  }

  // ✅ Get single reservation by ID
  getReservationById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const reservation = await this.reservationRepo.findById(Number(id));

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found',
      });
    }

    res.status(200).json({
      success: true,
      data: reservation,
    });
  });

  // Get all reservations for admin's restaurant
  getAllReservations = asyncHandler(async (req: Request, res: Response) => {
    const { restaurantId, date, status, search } = req.query;

    let reservations;

    if (date) {
      const dateStr = date as string;
      const queryDate = new Date(dateStr + 'T00:00:00.000Z');
      reservations = await this.reservationRepo.findByRestaurantAndDate(
        Number(restaurantId),
        queryDate
      );
    } else {
      reservations = await this.reservationRepo.findAllByRestaurant(
        Number(restaurantId)
      );
    }

    if (status && status !== 'all') {
      reservations = reservations.filter(
        (r) => r.status === (status as string).toUpperCase()
      );
    }

    if (search) {
      const searchLower = (search as string).toLowerCase();
      reservations = reservations.filter(
        (r) =>
          r.customerName.toLowerCase().includes(searchLower) ||
          r.customerPhone.includes(search as string)
      );
    }

    res.status(200).json({
      success: true,
      data: reservations,
    });
  });

  // Admin can create manual bookings (walk-in, phone)
  createManualBooking = asyncHandler(async (req: Request, res: Response) => {
    const bookingData = {
      ...req.body,
      reservationDate: new Date(req.body.reservationDate),
      bookingSource: req.body.bookingSource || 'ADMIN',
    };

    const result = await this.reservationService.createReservation(bookingData);

    res.status(201).json({
      success: true,
      message: 'Manual booking created successfully',
      data: result.reservation,
    });
  });

  // Admin can update any reservation (no 2-hour restriction)
  updateReservation = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updates = req.body;

    if (updates.reservationDate) {
      updates.reservationDate = new Date(updates.reservationDate);
    }

    const updated = await this.reservationRepo.update(Number(id), updates);

    res.status(200).json({
      success: true,
      message: SUCCESS_MESSAGES.RESERVATION_UPDATED,
      data: updated,
    });
  });

  // Admin can cancel any reservation
  cancelReservation = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { cancellationReason } = req.body;

    await this.reservationRepo.cancel(Number(id), cancellationReason);

    res.status(200).json({
      success: true,
      message: SUCCESS_MESSAGES.RESERVATION_CANCELLED,
    });
  });

  // Mark reservation as completed
  markAsCompleted = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    await this.reservationRepo.update(Number(id), { status: 'COMPLETED' } as any);

    res.status(200).json({
      success: true,
      message: 'Reservation marked as completed',
    });
  });

  // Mark reservation as no-show
  markAsNoShow = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    await this.reservationRepo.update(Number(id), { status: 'NO_SHOW' } as any);

    res.status(200).json({
      success: true,
      message: 'Reservation marked as no-show',
    });
  });
}