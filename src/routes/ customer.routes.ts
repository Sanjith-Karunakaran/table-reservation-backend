import { Router } from 'express';
import { customerAuthController } from '../controllers/customer/auth.controller';
import { customerReservationController } from '../controllers/customer/reservation.controller';
import { RestaurantController } from '../controllers/customer/restaurant.controller';  // ✅ IMPORT CLASS
import { AvailabilityController } from '../controllers/customer/availability.controller';  // ✅ IMPORT CLASS
import { validate } from '../middlewares/validate.middleware';
import { authenticateCustomer } from '../middlewares/customer-auth.middleware';
import { customerLoginSchema } from '../validators/customer-auth.validator';
import { 
  createReservationSchema, 
  updateReservationSchema,
  cancelReservationSchema 
} from '../validators/reservation.validator';

const router = Router();

// ✅ CREATE INSTANCES
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
router.get('/restaurants', restaurantController.getAllRestaurants);  // ✅ FIXED METHOD NAME
router.get('/restaurants/:id', restaurantController.getRestaurantById);  // ✅ FIXED METHOD NAME

// ─── AVAILABILITY ROUTES ──────────────────────────────────────────────────────
router.post(
  '/availability',
  availabilityController.checkAvailability  // ✅ FIXED METHOD NAME
);

// ─── RESERVATION ROUTES ───────────────────────────────────────────────────────
router.get(
  '/reservations/my',
  authenticateCustomer,
  customerReservationController.getMyReservations
);

router.post(
  '/reservations',
  authenticateCustomer,
  validate(createReservationSchema),
  customerReservationController.create
);

router.get(
  '/reservations',
  customerReservationController.lookup
);

router.get(
  '/reservations/:id',
  authenticateCustomer,
  customerReservationController.getById
);

router.patch(
  '/reservations/:id',
  authenticateCustomer,
  validate(updateReservationSchema),
  customerReservationController.update
);

router.delete(
  '/reservations/:id',
  authenticateCustomer,
  validate(cancelReservationSchema),
  customerReservationController.cancel
);

export default router;