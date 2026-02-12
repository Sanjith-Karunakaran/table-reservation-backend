import { prisma } from '../config/database';

export class RestaurantRepository {
  async findAll() {
    return prisma.restaurant.findMany({
      where: { status: 'ACTIVE' },
      select: {
        id: true,
        restaurantName: true,
        address: true,
        phone: true,
        email: true,
        openingTime: true,
        closingTime: true,
      },
    });
  }

  async findById(id: number) {
    return prisma.restaurant.findUnique({
      where: { id },
      include: {
        tables: {
          where: { status: 'AVAILABLE' },
          select: {
            id: true,
            tableNumber: true,
            capacity: true,
            location: true,
          },
        },
      },
    });
  }
}