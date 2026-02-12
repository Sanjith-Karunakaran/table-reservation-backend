import { prisma } from '../config/database';

export class TableRepository {
  async findByRestaurantId(restaurantId: number) {
    return prisma.table.findMany({
      where: { restaurantId },
      orderBy: { tableNumber: 'asc' },
    });
  }

  async findAvailableByCapacity(restaurantId: number, minCapacity: number) {
    return prisma.table.findMany({
      where: {
        restaurantId,
        capacity: { gte: minCapacity },
        status: 'AVAILABLE',
      },
      orderBy: { capacity: 'asc' }, // Smallest table that fits
    });
  }

  async findById(id: number) {
    return prisma.table.findUnique({
      where: { id },
    });
  }

  async updateStatus(id: number, status: 'AVAILABLE' | 'MAINTENANCE') {
    return prisma.table.update({
      where: { id },
      data: { status },
    });
  }
}