import { prisma } from '../config/database';
import { ReservationStatus, BookingSource } from '@prisma/client';

interface CreateReservationData {
  restaurantId: number;
  tableId: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  reservationDate: Date;
  startTime: string;
  endTime: string;
  guestCount: number;
  specialRequests?: string;
  bookingSource?: BookingSource;
}

export class ReservationRepository {
  async create(data: CreateReservationData) {
    return prisma.reservation.create({
      data: {
        ...data,
        status: 'CONFIRMED',
      },
      include: {
        restaurant: {
          select: {
            restaurantName: true,
            address: true,
            phone: true,
          },
        },
        table: {
          select: {
            tableNumber: true,
            capacity: true,
            location: true,
          },
        },
      },
    });
  }

  async findById(id: number) {
    return prisma.reservation.findUnique({
      where: { id },
      include: {
        restaurant: {
          select: {
            restaurantName: true,
            address: true,
            phone: true,
          },
        },
        table: {
          select: {
            tableNumber: true,
            capacity: true,
            location: true,
          },
        },
      },
    });
  }

  async findByCustomer(phone?: string, email?: string) {
    const where: any = {};
    if (phone) where.customerPhone = phone;
    if (email) where.customerEmail = email;

    return prisma.reservation.findMany({
      where,
      include: {
        restaurant: {
          select: { restaurantName: true },
        },
        table: {
          select: { tableNumber: true },
        },
      },
      orderBy: { reservationDate: 'desc' },
    });
  }

  async findConflicts(
    tableId: number,
    reservationDate: Date,
    startTime: string,
    endTime: string,
    excludeReservationId?: number
  ) {
    const where: any = {
      tableId,
      reservationDate,
      status: 'CONFIRMED',
      OR: [
        {
          AND: [{ startTime: { lt: endTime } }, { endTime: { gt: startTime } }],
        },
      ],
    };

    if (excludeReservationId) {
      where.id = { not: excludeReservationId };
    }

    return prisma.reservation.findMany({ where });
  }

  async update(id: number, data: Partial<CreateReservationData>) {
    return prisma.reservation.update({
      where: { id },
      data,
      include: {
        restaurant: {
          select: { restaurantName: true },
        },
        table: {
          select: { tableNumber: true, location: true },
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
        cancelledAt: new Date(),
      },
    });
  }

  async findByRestaurantAndDate(restaurantId: number, date: Date) {
    return prisma.reservation.findMany({
      where: {
        restaurantId,
        reservationDate: date,
        status: { in: ['CONFIRMED', 'COMPLETED'] },
      },
      include: {
        table: {
          select: { tableNumber: true },
        },
      },
      orderBy: { startTime: 'asc' },
    });
  }
}