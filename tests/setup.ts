import { PrismaClient } from '@prisma/client';

process.env.DATABASE_URL = 'postgresql://postgres:postgres123@localhost:5432/restaurant_db_test';

export const prisma = new PrismaClient();

beforeAll(async () => {
  // Connect
});

afterEach(async () => {
  // ✅ Delete in correct order (foreign key constraints)
  await prisma.reservation.deleteMany();
  await prisma.table.deleteMany();
  await prisma.admin.deleteMany();        // Delete admins BEFORE restaurants
  await prisma.restaurant.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});