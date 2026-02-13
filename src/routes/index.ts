import { Router } from 'express';
import customerRoutes from './ customer.routes';
import adminRoutes from './admin.routes';
import { healthCheck, testRoute } from '../controllers/health.controller';

const router = Router();

// Health check routes
router.get('/health', healthCheck);
router.get('/test', testRoute);

// Root route
router.get('/', (req, res) => {
  res.json({
    message: '🍽️ Restaurant Reservation API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      test: '/api/test',
      customer: '/api/customer',
      admin: '/api/admin',
    },
  });
});

// Customer routes
router.use('/customer', customerRoutes);

// Admin routes
router.use('/admin', adminRoutes);

export default router;