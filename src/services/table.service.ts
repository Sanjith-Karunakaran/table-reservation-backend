import { TableRepository } from '../repositories/table.repository';
import { ReservationRepository } from '../repositories/reservation.repository';
import { ConflictError } from '../errors/ConflictError';

export class TableService {
  private tableRepo: TableRepository;
  private reservationRepo: ReservationRepository;

  constructor() {
    this.tableRepo = new TableRepository();
    this.reservationRepo = new ReservationRepository();
  }

  async getAllTables(restaurantId: number) {
    return this.tableRepo.findByRestaurantId(restaurantId);
  }

  async updateTableStatus(tableId: number, status: 'AVAILABLE' | 'MAINTENANCE') {
    // Only validate when marking as MAINTENANCE
    if (status === 'MAINTENANCE') {
      // Get today's date
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const todayDate = new Date(`${year}-${month}-${day}T00:00:00.000Z`);

      // Get the table details
      const table = await this.tableRepo.findById(tableId);
      if (!table) {
        throw new Error('Table not found');
      }

      // Get all today's reservations for this restaurant
      const todayReservations = await this.reservationRepo.findByRestaurantAndDate(
        table.restaurantId,
        todayDate
      );

      // Check if this specific table has a confirmed reservation today
      const activeReservation = todayReservations.find(
        r => r.tableId === tableId && r.status === 'CONFIRMED'
      );

      if (activeReservation) {
        throw new ConflictError(
          `Cannot mark ${table.tableNumber} as maintenance. ` +
          `It has a confirmed reservation today at ${activeReservation.startTime} ` +
          `for ${activeReservation.customerName}. ` +
          `Please cancel the reservation first.`
        );
      }
    }

    // Safe to update
    return this.tableRepo.updateStatus(tableId, status);
  }
}