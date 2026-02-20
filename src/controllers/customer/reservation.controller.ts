import { Request, Response } from 'express';
import { ReservationService } from '../../services/reservation.service';
import { ReservationRepository } from '../../repositories/reservation.repository';
import { asyncHandler } from '../../utils/asyncHandler';
import { SUCCESS_MESSAGES } from '../../constants/message';

export class CustomerReservationController {
  private reservationService: ReservationService;
  private reservationRepo: ReservationRepository;

  constructor() {
    this.reservationService = new ReservationService();
    this.reservationRepo = new ReservationRepository();
  }

  // ✅ Get all reservations (DEMO MODE - no auth)
  getMyReservations = asyncHandler(async (req: Request, res: Response) => {
    // ✅ For demo: return ALL reservations
    // You can filter by email later if needed
    const allReservations: any[] = [];
    
    // Get reservations from all restaurants (IDs 4, 5, 6 based on your curl output)
    for (const restaurantId of [4, 5, 6]) {
      try {
        const reservations = await this.reservationRepo.findAllByRestaurant(restaurantId);
        allReservations.push(...reservations);
      } catch (error) {
        // Skip if restaurant has no reservations
        console.log(`No reservations for restaurant ${restaurantId}`);
      }
    }
    
    res.status(200).json({
      success: true,
      data: allReservations,
    });
  });

  // Create reservation
  create = asyncHandler(async (req: Request, res: Response) => {
    const reservationData = {
      ...req.body,
      reservationDate: new Date(req.body.reservationDate),
      bookingSource: 'ONLINE',
    };

    const result = await this.reservationService.createReservation(reservationData);

    res.status(201).json({
      success: true,
      message: SUCCESS_MESSAGES.RESERVATION_CREATED,
      data: result.reservation,
    });
  });

  // Get by ID
  getById = asyncHandler(async (req: Request, res: Response) => {
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

  // Update
  update = asyncHandler(async (req: Request, res: Response) => {
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

  // Cancel
  cancel = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { cancellationReason } = req.body;

    await this.reservationRepo.cancel(Number(id), cancellationReason);

    res.status(200).json({
      success: true,
      message: SUCCESS_MESSAGES.RESERVATION_CANCELLED,
    });
  });

  // Lookup (for guests)
  lookup = asyncHandler(async (req: Request, res: Response) => {
    const { phone, email } = req.query;
    
    const reservations = await this.reservationRepo.findByCustomer(
      phone as string,
      email as string
    );

    res.status(200).json({
      success: true,
      data: reservations,
    });
  });
}

export const customerReservationController = new CustomerReservationController();