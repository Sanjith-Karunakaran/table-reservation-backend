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
    // Get today's date as a string in YYYY-MM-DD format
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const todayString = `${year}-${month}-${day}`; // "2026-02-16"

    console.log('📅 Server time:', now.toISOString());
    console.log('📅 Today string:', todayString);

    // Create proper Date object for database query
    const todayDate = new Date(todayString + 'T00:00:00.000Z');

    console.log('🔍 Querying for date:', todayDate.toISOString());
    console.log('🏪 Restaurant ID:', restaurantId);

    // Get today's reservations
    const todayReservations = await this.reservationRepo.findByRestaurantAndDate(
      restaurantId,
      todayDate
    );

    console.log('📋 Found reservations:', todayReservations.length);

    // Count by status
    const confirmedCount = todayReservations.filter(r => r.status === 'CONFIRMED').length;
    const completedCount = todayReservations.filter(r => r.status === 'COMPLETED').length;
    const cancelledCount = todayReservations.filter(r => r.status === 'CANCELLED').length;
    const noShowCount = todayReservations.filter(r => r.status === 'NO_SHOW').length;

    // Get all tables
    const allTables = await this.tableRepo.findByRestaurantId(restaurantId);
    const tablesUnderMaintenance = allTables.filter(t => t.status === 'MAINTENANCE').length;

    // Calculate current occupancy (reservations happening RIGHT NOW)
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}:00`;

    console.log('⏰ Current time:', currentTime);

    // Get currently occupied table IDs (reservations active right now)
    const currentlyOccupiedTableIds = todayReservations
      .filter(r => {
        if (r.status !== 'CONFIRMED') return false;
        const isActive = r.startTime <= currentTime && r.endTime > currentTime;
        if (isActive) {
          console.log(`🔴 Table ${r.table.tableNumber} occupied NOW (${r.startTime} - ${r.endTime})`);
        }
        return isActive;
      })
      .map(r => r.tableId);

    const currentOccupancy = currentlyOccupiedTableIds.length;

    // ✅ NEW: Get ALL reserved table IDs for today (confirmed reservations)
    const reservedTableIds = todayReservations
      .filter(r => r.status === 'CONFIRMED')
      .map(r => {
        console.log(`📅 Table ${r.table.tableNumber} reserved (${r.startTime} - ${r.endTime})`);
        return r.tableId;
      });

    // Remove duplicates (in case same table has multiple reservations)
    const uniqueReservedTableIds = [...new Set(reservedTableIds)];
    const reservedTablesCount = uniqueReservedTableIds.length;

    console.log('📊 Reserved tables:', uniqueReservedTableIds);

    // ✅ Calculate available tables: Total - Maintenance - Reserved
    const availableTables = allTables.length - tablesUnderMaintenance - reservedTablesCount;

    console.log('📊 Stats:', {
      total: allTables.length,
      maintenance: tablesUnderMaintenance,
      reserved: reservedTablesCount,
      occupied: currentOccupancy,
      available: availableTables,
    });

    // Get upcoming reservations (next 5 that haven't started yet)
    const upcomingReservations = todayReservations
      .filter(r => r.status === 'CONFIRMED' && r.startTime > currentTime)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
      .slice(0, 5)
      .map(r => ({
        id: r.id,
        customerName: r.customerName,
        startTime: r.startTime,
        guestCount: r.guestCount,
        table: {
          tableNumber: r.table.tableNumber,
          location: r.table.location,
        },
      }));

    return {
      today: {
        date: todayString,
        totalReservations: todayReservations.length,
        confirmed: confirmedCount,
        completed: completedCount,
        cancelled: cancelledCount,
        noShow: noShowCount,
        currentOccupancy: currentOccupancy,
        totalTables: allTables.length,
      },
      tables: {
        total: allTables.length,
        available: availableTables,
        reserved: reservedTablesCount,  // ✅ NEW: Show reserved count
        occupied: currentOccupancy,
        maintenance: tablesUnderMaintenance,
      },
      upcomingReservations,
    };
  }
}