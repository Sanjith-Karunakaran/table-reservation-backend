import { Router } from 'express';
import { customerAuthController } from '../controllers/customer/auth.controller';
import { customerReservationController } from '../controllers/customer/reservation.controller';
import { RestaurantController } from '../controllers/customer/restaurant.controller';
import { AvailabilityController } from '../controllers/customer/availability.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticateCustomer } from '../middlewares/customer-auth.middleware';
import { customerLoginSchema } from '../validators/customer-auth.validator';
import { 
  createReservationSchema, 
  updateReservationSchema,
  cancelReservationSchema 
} from '../validators/reservation.validator';

const router = Router();

const restaurantController = new RestaurantController();
const availabilityController = new AvailabilityController();

// ─── AUTHENTICATION ROUTES ────────────────────────────────────────────────────
router.post(
  '/login',
  validate(customerLoginSchema),
  customerAuthController.login
);

router.get(
  '/me',
  authenticateCustomer,
  customerAuthController.getCurrentUser
);

// ─── RESTAURANT ROUTES ────────────────────────────────────────────────────────
router.get('/restaurants', restaurantController.getAllRestaurants);
router.get('/restaurants/:id', restaurantController.getRestaurantById);

// ─── AVAILABILITY ROUTES ──────────────────────────────────────────────────────
// ✅ FIXED: Changed from POST to GET and added /check path
router.get(
  '/availability/check',
  availabilityController.checkAvailability
);

// ─── RESERVATION ROUTES ───────────────────────────────────────────────────────
router.get(
  '/reservations/my',
  customerReservationController.getMyReservations
);

router.post(
  '/reservations',
  validate(createReservationSchema),
  customerReservationController.create
);

router.get(
  '/reservations',
  customerReservationController.lookup
);

router.get(
  '/reservations/:id',
  customerReservationController.getById
);

router.patch(
  '/reservations/:id',
  validate(updateReservationSchema),
  customerReservationController.update
);

router.delete(
  '/reservations/:id',
  validate(cancelReservationSchema),
  customerReservationController.cancel
);

export default router;