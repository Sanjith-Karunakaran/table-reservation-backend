import { Router } from 'express';
import { AdminAuthController } from '../controllers/admin/auth.controller';
import { AdminDashboardController } from '../controllers/admin/dashboard.controller';
import { AdminReservationController } from '../controllers/admin/reservation.controller';
import { AdminTableController } from '../controllers/admin/table.controller';

const router = Router();

// Initialize controllers
const authController = new AdminAuthController();
const dashboardController = new AdminDashboardController();
const reservationController = new AdminReservationController();
const tableController = new AdminTableController();

// ===== AUTHENTICATION =====
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// ===== DASHBOARD =====
router.get('/dashboard', dashboardController.getDashboardStats);

// ===== RESERVATIONS =====
router.get('/reservations', reservationController.getAllReservations);
router.get('/reservations/:id', reservationController.getReservationById);  
router.post('/reservations', reservationController.createManualBooking);
router.put('/reservations/:id', reservationController.updateReservation);
router.delete('/reservations/:id', reservationController.cancelReservation);
router.patch('/reservations/:id/complete', reservationController.markAsCompleted);
router.patch('/reservations/:id/no-show', reservationController.markAsNoShow);

// ===== TABLES =====
router.get('/tables', tableController.getAllTables);
router.patch('/tables/:id/status', tableController.toggleMaintenance);

export default router;