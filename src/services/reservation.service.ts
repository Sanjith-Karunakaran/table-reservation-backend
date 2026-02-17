import { ReservationRepository } from '../repositories/reservation.repository';
import { AvailabilityService } from './availability.service';
import { DateTimeUtil } from '../utils/dateTime';
import { NotFoundError } from '../errors/NotFoundError';
import { ConflictError } from '../errors/ConflictError';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants/message';

type BookingSource = 'ONLINE' | 'PHONE' | 'WALK_IN' | 'ADMIN';

interface CreateReservationData {
  restaurantId: number;
  reservationDate: Date;
  startTime: string;
  guestCount: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  specialRequests?: string;
  bookingSource?: BookingSource;  // ✅ ADD THIS
}

interface UpdateReservationData {
  reservationDate?: Date;
  startTime?: string;
  endTime?: string;
  guestCount?: number;
  tableId?: number;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  specialRequests?: string;
}

export class ReservationService {
  private reservationRepo: ReservationRepository;
  private availabilityService: AvailabilityService;

  constructor() {
    this.reservationRepo = new ReservationRepository();
    this.availabilityService = new AvailabilityService();
  }

  async createReservation(data: CreateReservationData) {
    // 1. Check availability
    const availability = await this.availabilityService.checkAvailability({
      restaurantId: data.restaurantId,
      reservationDate: data.reservationDate,
      startTime: data.startTime,
      guestCount: data.guestCount,
    });

    if (!availability.available || availability.availableTables.length === 0) {
      throw new ConflictError(availability.message);
    }

    // 2. Select best-fit table
    const selectedTable = availability.availableTables[0];

    // 3. Calculate end time
    const endTime = DateTimeUtil.calculateEndTime(data.startTime, 2);

    // 4. Create reservation
    const reservation = await this.reservationRepo.create({
      restaurantId: data.restaurantId,
      tableId: selectedTable.id,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      reservationDate: data.reservationDate,
      startTime: data.startTime,
      endTime,
      guestCount: data.guestCount,
      specialRequests: data.specialRequests,
      bookingSource: data.bookingSource || 'ONLINE',  // ✅ USE PASSED VALUE, default ONLINE
    });

    return {
      message: SUCCESS_MESSAGES.RESERVATION_CREATED,
      reservation,
    };
  }

  async getReservationById(id: number) {
    const reservation = await this.reservationRepo.findById(id);
    if (!reservation) {
      throw new NotFoundError(ERROR_MESSAGES.RESERVATION_NOT_FOUND);
    }
    return reservation;
  }

  async findReservationsByCustomer(phone?: string, email?: string) {
    if (!phone && !email) {
      throw new Error('Either phone or email is required');
    }
    return this.reservationRepo.findByCustomer(phone, email);
  }

  async updateReservation(id: number, updates: UpdateReservationData) {
    const existing = await this.getReservationById(id);

    const canModify = DateTimeUtil.canModifyReservation(
      existing.reservationDate,
      existing.startTime
    );

    if (!canModify) {
      throw new ConflictError(ERROR_MESSAGES.CANNOT_MODIFY);
    }

    if (updates.reservationDate || updates.startTime || updates.guestCount) {
      const newDate = updates.reservationDate || existing.reservationDate;
      const newTime = updates.startTime || existing.startTime;
      const newGuests = updates.guestCount || existing.guestCount;

      const availability = await this.availabilityService.checkAvailability({
        restaurantId: existing.restaurantId,
        reservationDate: newDate,
        startTime: newTime,
        guestCount: newGuests,
      });

      if (!availability.available) {
        throw new ConflictError(availability.message);
      }

      if (updates.guestCount && updates.guestCount !== existing.guestCount) {
        const newTable = availability.availableTables[0];
        (updates as any).tableId = newTable.id;
      }

      if (updates.startTime) {
        (updates as any).endTime = DateTimeUtil.calculateEndTime(updates.startTime, 2);
      }
    }

    const updated = await this.reservationRepo.update(id, updates);

    return {
      message: SUCCESS_MESSAGES.RESERVATION_UPDATED,
      reservation: updated,
    };
  }

  async cancelReservation(id: number, reason?: string) {
    const existing = await this.getReservationById(id);

    if (existing.status === 'CANCELLED') {
      throw new ConflictError('Reservation is already cancelled');
    }

    const canCancel = DateTimeUtil.canModifyReservation(
      existing.reservationDate,
      existing.startTime
    );

    if (!canCancel) {
      throw new ConflictError(ERROR_MESSAGES.CANNOT_CANCEL);
    }

    await this.reservationRepo.cancel(id, reason);

    return {
      message: SUCCESS_MESSAGES.RESERVATION_CANCELLED,
    };
  }
}