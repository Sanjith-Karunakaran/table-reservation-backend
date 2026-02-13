import { ReservationRepository } from '../repositories/reservation.repository';
import { TableRepository } from '../repositories/table.repository';

export class DashboardService {
  private reservationRepo: ReservationRepository;
  private tableRepo: TableRepository;

  constructor() {
    this.reservationRepo = new ReservationRepository();
    this.tableRepo = new TableRepository();
  }

  async getDashboardStats(restaurantId: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get today's reservations
    const todayReservations = await this.reservationRepo.findByRestaurantAndDate(
      restaurantId,
      today
    );

    // Count by status
    const confirmedCount = todayReservations.filter(r => r.status === 'CONFIRMED').length;
    const completedCount = todayReservations.filter(r => r.status === 'COMPLETED').length;
    const cancelledCount = todayReservations.filter(r => r.status === 'CANCELLED').length;

    // Get all tables
    const allTables = await this.tableRepo.findByRestaurantId(restaurantId);
    const tablesUnderMaintenance = allTables.filter(t => t.status === 'MAINTENANCE').length;

    // Calculate current occupancy (reservations happening now)
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}:00`;

    const currentOccupancy = todayReservations.filter(r => {
      if (r.status !== 'CONFIRMED') return false;
      return r.startTime <= currentTime && r.endTime > currentTime;
    }).length;

    return {
      today: {
        date: today.toISOString().split('T')[0],
        totalReservations: todayReservations.length,
        confirmed: confirmedCount,
        completed: completedCount,
        cancelled: cancelledCount,
        currentOccupancy: currentOccupancy,
        totalTables: allTables.length,
      },
      tables: {
        total: allTables.length,
        available: allTables.length - tablesUnderMaintenance,
        maintenance: tablesUnderMaintenance,
      },
      upcomingReservations: todayReservations
        .filter(r => r.status === 'CONFIRMED' && r.startTime > currentTime)
        .slice(0, 5)
        .map(r => ({
          id: r.id,
          customerName: r.customerName,
          time: r.startTime,
          guests: r.guestCount,
          tableNumber: r.table.tableNumber,
        })),
    };
  }
}