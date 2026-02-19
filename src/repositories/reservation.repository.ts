import { prisma } from '../config/database';

interface CreateReservationData {
  restaurantId: number;
  tableId: number;
  userId?: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  reservationDate: Date;
  startTime: string;
  endTime: string;
  guestCount: number;
  status?: string;
  specialRequests?: string;
  bookingSource?: string;
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
  status?: string;
}

export class ReservationRepository {
  async create(data: CreateReservationData) {
    return prisma.reservation.create({
      data: {
        restaurantId: data.restaurantId,
        tableId: data.tableId,
        userId: data.userId,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail,
        reservationDate: data.reservationDate,
        startTime: data.startTime,
        endTime: data.endTime,
        guestCount: data.guestCount,
        status: (data.status as any) || 'CONFIRMED',
        specialRequests: data.specialRequests,
        bookingSource: (data.bookingSource as any) || 'ONLINE',
      },
      include: {
        restaurant: true,
        table: true,
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
      },
    });
  }

  async findById(id: number) {
    return prisma.reservation.findUnique({
      where: { id },
      include: {
        restaurant: true,
        table: true,
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
      },
    });
  }

  async findByUserId(userId: number) {
    return prisma.reservation.findMany({
      where: { userId },
      include: {
        restaurant: true,
        table: true,
      },
      orderBy: [
        { reservationDate: 'desc' },
        { startTime: 'desc' },
      ],
    });
  }

  // ✅ ADDED: Used by admin reservation controller
  async findAllByRestaurant(restaurantId: number) {
    return prisma.reservation.findMany({
      where: { restaurantId },
      include: {
        restaurant: true,
        table: true,
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: [
        { reservationDate: 'desc' },
        { startTime: 'desc' },
      ],
    });
  }

  // ✅ ADDED: Used by dashboard and table services
  async findByRestaurantAndDate(restaurantId: number, date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return prisma.reservation.findMany({
      where: {
        restaurantId,
        reservationDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        restaurant: true,
        table: true,
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: [
        { startTime: 'asc' },
      ],
    });
  }

  async findByRestaurant(restaurantId: number, filters?: {
    status?: string;
    date?: Date;
    startDate?: Date;
    endDate?: Date;
  }) {
    const where: any = { restaurantId };

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.date) {
      const startOfDay = new Date(filters.date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(filters.date);
      endOfDay.setHours(23, 59, 59, 999);

      where.reservationDate = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    if (filters?.startDate && filters?.endDate) {
      where.reservationDate = {
        gte: filters.startDate,
        lte: filters.endDate,
      };
    }

    return prisma.reservation.findMany({
      where,
      include: {
        restaurant: true,
        table: true,
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: [
        { reservationDate: 'asc' },
        { startTime: 'asc' },
      ],
    });
  }

  async findByCustomer(phone?: string, email?: string) {
    const where: any = {};

    if (phone && email) {
      where.OR = [
        { customerPhone: phone },
        { customerEmail: email },
      ];
    } else if (phone) {
      where.customerPhone = phone;
    } else if (email) {
      where.customerEmail = email;
    }

    return prisma.reservation.findMany({
      where,
      include: {
        restaurant: true,
        table: true,
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { reservationDate: 'desc' },
    });
  }

  async update(id: number, data: UpdateReservationData) {
    return prisma.reservation.update({
      where: { id },
      data: data as any,
      include: {
        restaurant: true,
        table: true,
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
      },
    });
  }

  async cancel(id: number, reason?: string) {
    return prisma.reservation.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        cancellationReason: reason,
      },
      include: {
        restaurant: true,
        table: true,
      },
    });
  }

  async delete(id: number) {
    return prisma.reservation.delete({
      where: { id },
    });
  }

  // ✅ ADDED ALIAS: availability.service.ts calls this as "findConflicts"
  async findConflicts(
    tableId: number,
    reservationDate: Date,
    startTime: string,
    endTime: string,
    excludeId?: number
  ) {
    return this.findConflictingReservations(tableId, reservationDate, startTime, endTime, excludeId);
  }

  async findConflictingReservations(
    tableId: number,
    reservationDate: Date,
    startTime: string,
    endTime: string,
    excludeId?: number
  ) {
    const startOfDay = new Date(reservationDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(reservationDate);
    endOfDay.setHours(23, 59, 59, 999);

    const where: any = {
      tableId,
      reservationDate: {
        gte: startOfDay,
        lte: endOfDay,
      },
      status: {
        in: ['CONFIRMED', 'COMPLETED'],
      },
      OR: [
        {
          AND: [
            { startTime: { lte: startTime } },
            { endTime: { gt: startTime } },
          ],
        },
        {
          AND: [
            { startTime: { lt: endTime } },
            { endTime: { gte: endTime } },
          ],
        },
        {
          AND: [
            { startTime: { gte: startTime } },
            { endTime: { lte: endTime } },
          ],
        },
      ],
    };

    if (excludeId) {
      where.id = { not: excludeId };
    }

    return prisma.reservation.findMany({
      where,
    });
  }
}