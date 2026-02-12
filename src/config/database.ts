import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Test database connection
prisma
  .$connect()
  .then(async () => {
    logger.info('✅ PostgreSQL connected successfully');
    
    // Test query
    const count = await prisma.restaurant.count();
    logger.info(`📊 Found ${count} restaurants in database`);
  })
  .catch((error) => {
    logger.error('❌ PostgreSQL connection failed:', error);
    process.exit(1);
  });

export { prisma };