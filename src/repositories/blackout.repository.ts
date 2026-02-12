import { prisma } from '../config/database';

export class BlackoutRepository {
  async isBlackoutDate(restaurantId: number, date: Date): Promise<boolean> {
    const blackout = await prisma.blackoutDate.findFirst({
      where: {
        restaurantId,
        blackoutDate: date,
      },
    });
    return !!blackout;
  }

  async findByRestaurantId(restaurantId: number) {
    return prisma.blackoutDate.findMany({
      where: { restaurantId },
      orderBy: { blackoutDate: 'asc' },
    });
  }

  async create(restaurantId: number, date: Date, reason?: string, createdBy?: number) {
    return prisma.blackoutDate.create({
      data: {
        restaurantId,
        blackoutDate: date,
        reason,
        createdBy,
      },
    });
  }

  async delete(id: number) {
    return prisma.blackoutDate.delete({
      where: { id },
    });
  }
}