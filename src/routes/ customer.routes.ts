import { Router } from 'express';
import { RestaurantController } from '../controllers/customer/restaurant.controller';
import { AvailabilityController } from '../controllers/customer/availability.controller';
import { ReservationController } from '../controllers/customer/reservation.controller';
import { WaitlistController } from '../controllers/customer/waitlist.controller';
import { validate } from '../middlewares/validate.middleware';
import {
  createReservationSchema,
  updateReservationSchema,
  cancelReservationSchema,
  getReservationByIdSchema,
  lookupReservationSchema,
  checkAvailabilitySchema,
} from '../validators/reservation.validator';

const router = Router();

// Initialize controllers
const restaurantController = new RestaurantController();
const availabilityController = new AvailabilityController();
const reservationController = new ReservationController();
const waitlistController = new WaitlistController();

// ===== RESTAURANT ROUTES =====
router.get('/restaurants', restaurantController.getAllRestaurants);
router.get('/restaurants/:id', restaurantController.getRestaurantById);

// ===== AVAILABILITY ROUTES =====
router.post(
  '/availability',
  validate(checkAvailabilitySchema),
  availabilityController.checkAvailability
);

// ===== RESERVATION ROUTES =====
// Create reservation
router.post(
  '/reservations',
  validate(createReservationSchema),
  reservationController.createReservation
);

// Get reservation by ID
router.get(
  '/reservations/:id',
  validate(getReservationByIdSchema),
  reservationController.getReservationById
);

// Lookup reservations by phone/email
router.get(
  '/reservations',
  validate(lookupReservationSchema),
  reservationController.lookupReservations
);

// Update reservation
router.put(
  '/reservations/:id',
  validate(updateReservationSchema),
  reservationController.updateReservation
);

// Cancel reservation
router.delete(
  '/reservations/:id',
  validate(cancelReservationSchema),
  reservationController.cancelReservation
);

// ===== WAITLIST ROUTES =====
router.post('/waitlist', waitlistController.joinWaitlist);
router.get('/waitlist/:id', waitlistController.getWaitlistStatus);

export default router;