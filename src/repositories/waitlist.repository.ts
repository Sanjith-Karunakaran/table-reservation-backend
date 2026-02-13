import { prisma } from '../config/database';

interface CreateWaitlistData {
  restaurantId: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  requestedDate: Date;
  requestedTime: string;
  guestCount: number;
}

export class WaitlistRepository {
  async create(data: CreateWaitlistData) {
    return prisma.waitlist.create({
      data: {
        ...data,
        status: 'WAITING',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });
  }

  async findById(id: number) {
    return prisma.waitlist.findUnique({
      where: { id },
      include: {
        restaurant: {
          select: {
            restaurantName: true,
            phone: true,
          },
        },
      },
    });
  }

  async getPosition(id: number) {
    const entry = await prisma.waitlist.findUnique({ where: { id } });
    if (!entry) return 0;

    const position = await prisma.waitlist.count({
      where: {
        restaurantId: entry.restaurantId,
        requestedDate: entry.requestedDate,
        requestedTime: entry.requestedTime,
        status: 'WAITING',
        createdAt: { lt: entry.createdAt },
      },
    });

    return position + 1;
  }

  async findByRestaurantAndDate(restaurantId: number, date: Date) {
    return prisma.waitlist.findMany({
      where: {
        restaurantId,
        requestedDate: date,
        status: 'WAITING',
      },
      orderBy: { createdAt: 'asc' },
    });
  }
}