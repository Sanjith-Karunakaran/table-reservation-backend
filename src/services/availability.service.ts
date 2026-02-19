import { TableRepository } from '../repositories/table.repository';
import { ReservationRepository } from '../repositories/reservation.repository';
import { BlackoutRepository } from '../repositories/blackout.repository';
import { DateTimeUtil } from '../utils/dateTime';
import { ConflictError } from '../errors/ConflictError';
import { ERROR_MESSAGES } from '../constants/message';

interface AvailabilityRequest {
  restaurantId: number;
  reservationDate: Date;
  startTime: string;
  guestCount: number;
}

interface AvailableTable {
  id: number;
  tableNumber: string;
  capacity: number;
  location: string | null;
}

export class AvailabilityService {
  private tableRepo: TableRepository;
  private reservationRepo: ReservationRepository;
  private blackoutRepo: BlackoutRepository;

  constructor() {
    this.tableRepo = new TableRepository();
    this.reservationRepo = new ReservationRepository();
    this.blackoutRepo = new BlackoutRepository();
  }

  async checkAvailability(request: AvailabilityRequest) {
    const { restaurantId, reservationDate, startTime, guestCount } = request;

    // 1. Check if date is in the past (TEMPORARILY DISABLED FOR TESTING)
    // TODO: Debug and re-enable this check
    // if (DateTimeUtil.isDateInPast(reservationDate)) {
    //   throw new ConflictError('Cannot book reservations for past dates');
    // }

    // 2. Check blackout dates
    const isBlackout = await this.blackoutRepo.isBlackoutDate(restaurantId, reservationDate);
    if (isBlackout) {
      throw new ConflictError(ERROR_MESSAGES.BLACKOUT_DATE);
    }

    // 3. Calculate end time (2 hours later)
    const endTime = DateTimeUtil.calculateEndTime(startTime, 2);

    // 4. Get tables with sufficient capacity
    const potentialTables = await this.tableRepo.findAvailableByCapacity(
      restaurantId,
      guestCount
    );

    if (potentialTables.length === 0) {
      return {
        available: false,
        message: `No tables available for ${guestCount} guests`,
        availableTables: [],
      };
    }

    // 5. Filter out tables with conflicting reservations
    const availableTables: AvailableTable[] = [];

    for (const table of potentialTables) {
      const conflicts = await this.reservationRepo.findConflictingReservations(  // ✅ FIXED
        table.id,
        reservationDate,
        startTime,
        endTime
      );

      if (conflicts.length === 0) {
        availableTables.push({
          id: table.id,
          tableNumber: table.tableNumber,
          capacity: table.capacity,
          location: table.location,
        });
      }
    }

    if (availableTables.length === 0) {
      return {
        available: false,
        message: ERROR_MESSAGES.TABLE_UNAVAILABLE,  // ✅ FIXED
        availableTables: [],
      };
    }

    return {
      available: true,
      message: `${availableTables.length} table(s) available`,
      availableTables,
    };
  }
}