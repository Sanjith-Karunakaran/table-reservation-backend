import { prisma } from '../config/database';

export class AdminRepository {
  async findByUsername(username: string) {
    return prisma.admin.findUnique({
      where: { username },
      include: {
        restaurant: {
          select: {
            id: true,
            restaurantName: true,
          },
        },
      },
    });
  }

  async findById(id: number) {
    return prisma.admin.findUnique({
      where: { id },
      include: {
        restaurant: {
          select: {
            id: true,
            restaurantName: true,
          },
        },
      },
    });
  }

  async updateLastLogin(adminId: number) {
    return prisma.admin.update({
      where: { id: adminId },
      data: { lastLogin: new Date() },
    });
  }
}