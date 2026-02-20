import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding PostgreSQL database...');

  // Clear existing data (optional - for development)
  await prisma.reservation.deleteMany();
  await prisma.table.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.user.deleteMany();  // ✅ ADD THIS
  await prisma.blackoutDate.deleteMany();
  await prisma.waitlist.deleteMany();
  await prisma.restaurant.deleteMany();

  console.log('🗑️  Cleared existing data');

  // ✅ CREATE 3 CUSTOMER USERS
  console.log('👥 Creating customer users...');
  
  const user1 = await prisma.user.create({
    data: {
      email: 'john@example.com',
      phone: '+1234567890',
      password: await bcrypt.hash('Pass@123', 10),
      fullName: 'John Smith',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'sarah@example.com',
      phone: '+1987654321',
      password: await bcrypt.hash('Pass@456', 10),
      fullName: 'Sarah Johnson',
    },
  });

  const user3 = await prisma.user.create({
    data: {
      email: 'mike@example.com',
      phone: '+1122334455',
      password: await bcrypt.hash('Pass@789', 10),
      fullName: 'Mike Williams',
    },
  });

  console.log('✅ Created 3 customer users');

  // Create 3 Restaurants
  const restaurant1 = await prisma.restaurant.create({
    data: {
      restaurantName: 'Downtown Bistro',
      address: '123 Main St, City, State 12345',
      phone: '1234567890',
      email: 'info@downtownbistro.com',
      maxTables: 10,
      openingTime: '12:00:00',
      closingTime: '23:00:00',
    },
  });

  const restaurant2 = await prisma.restaurant.create({
    data: {
      restaurantName: 'Harbor View',
      address: '456 Ocean Ave, City, State 12345',
      phone: '0987654321',
      email: 'info@harborview.com',
      maxTables: 10,
      openingTime: '12:00:00',
      closingTime: '23:00:00',
    },
  });

  const restaurant3 = await prisma.restaurant.create({
    data: {
      restaurantName: 'Garden Terrace',
      address: '789 Park Blvd, City, State 12345',
      phone: '5551234567',
      email: 'info@gardenterrace.com',
      maxTables: 10,
      openingTime: '12:00:00',
      closingTime: '23:00:00',
    },
  });

  console.log('✅ Created 3 restaurants');

  // Create 10 tables for each restaurant
  const tableTypes = [
    { capacity: 2, location: 'Window' },
    { capacity: 2, location: 'Window' },
    { capacity: 4, location: 'Center' },
    { capacity: 4, location: 'Center' },
    { capacity: 4, location: 'Patio' },
    { capacity: 6, location: 'Private Room' },
    { capacity: 6, location: 'Main Hall' },
    { capacity: 8, location: 'Main Hall' },
    { capacity: 8, location: 'VIP Area' },
    { capacity: 10, location: 'Banquet' },
  ];

  for (const restaurant of [restaurant1, restaurant2, restaurant3]) {
    for (let i = 0; i < 10; i++) {
      await prisma.table.create({
        data: {
          restaurantId: restaurant.id,
          tableNumber: `T${i + 1}`,
          capacity: tableTypes[i].capacity,
          location: tableTypes[i].location,
          status: 'AVAILABLE',
        },
      });
    }
  }

  console.log('✅ Created 30 tables (10 per restaurant)');

  // Create 3 Admin accounts (1 per restaurant)
  const passwordHash = await bcrypt.hash('admin123', 10);

  await prisma.admin.create({
    data: {
      username: 'admin_downtown',
      passwordHash,
      fullName: 'Downtown Admin',
      email: 'admin@downtownbistro.com',
      phone: '1234567890',
      restaurantId: restaurant1.id,
      role: 'ADMIN',
    },
  });

  await prisma.admin.create({
    data: {
      username: 'admin_harbor',
      passwordHash,
      fullName: 'Harbor Admin',
      email: 'admin@harborview.com',
      phone: '0987654321',
      restaurantId: restaurant2.id,
      role: 'ADMIN',
    },
  });

  await prisma.admin.create({
    data: {
      username: 'admin_garden',
      passwordHash,
      fullName: 'Garden Admin',
      email: 'admin@gardenterrace.com',
      phone: '5551234567',
      restaurantId: restaurant3.id,
      role: 'ADMIN',
    },
  });

  console.log('✅ Created 3 admin accounts');
  console.log('\n📋 Admin Credentials:');
  console.log('   Username: admin_downtown | Password: admin123');
  console.log('   Username: admin_harbor   | Password: admin123');
  console.log('   Username: admin_garden   | Password: admin123');

  console.log('\n👤 Customer Credentials:');
  console.log('   Email: john@example.com  | Password: Pass@123');
  console.log('   Email: sarah@example.com | Password: Pass@456');
  console.log('   Email: mike@example.com  | Password: Pass@789');

  console.log('\n🎉 PostgreSQL database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });