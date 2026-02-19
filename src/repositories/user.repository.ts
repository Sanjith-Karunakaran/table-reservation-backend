import { prisma } from '../config/database';

interface CreateUserData {
  email: string;
  phone: string;
  password: string;
  fullName: string;  // ✅ Use camelCase (Prisma generates this from @map)
}

export class UserRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findByPhone(phone: string) {
    return prisma.user.findUnique({
      where: { phone },
    });
  }

  async findById(id: number) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        phone: true,
        fullName: true,    // ✅ Use camelCase
        createdAt: true,   // ✅ Use camelCase
        // Don't return password
      },
    });
  }

  async create(data: CreateUserData) {
    return prisma.user.create({
      data,
      select: {
        id: true,
        email: true,
        phone: true,
        fullName: true,    // ✅ Use camelCase
        createdAt: true,   // ✅ Use camelCase
        // Don't return password
      },
    });
  }

  async findAll() {
    return prisma.user.findMany({
      select: {
        id: true,
        email: true,
        phone: true,
        fullName: true,    // ✅ Use camelCase
        createdAt: true,   // ✅ Use camelCase
        // Don't return password
      },
      orderBy: { createdAt: 'desc' },  // ✅ Use camelCase
    });
  }
}