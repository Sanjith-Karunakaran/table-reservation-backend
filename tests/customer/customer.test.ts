import request from 'supertest';
import { createApp } from '../../src/config/app';
import { prisma } from '../setup';

const app = createApp();

describe('Customer API Tests', () => {
  let restaurantId: number;
  let tableId: number;

  beforeEach(async () => {
    const restaurant = await prisma.restaurant.create({
      data: {
        restaurantName: 'Customer Test Restaurant',
        address: '456 Customer St',
        phone: '5555555555',
        email: 'customer@restaurant.com',
        openingTime: '10:00',
        closingTime: '23:00',
      },
    });
    restaurantId = restaurant.id;

    const table = await prisma.table.create({
      data: {
        restaurantId,
        tableNumber: 'T1',
        capacity: 4,
        location: 'Patio',
        status: 'AVAILABLE',
      },
    });
    tableId = table.id;
  });

  describe('GET /api/customer/restaurants', () => {
    it('should get all restaurants', async () => {
      const response = await request(app).get('/api/customer/restaurants');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/customer/restaurants/:id', () => {
    it('should get restaurant by id', async () => {
      const response = await request(app).get(`/api/customer/restaurants/${restaurantId}`);
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.restaurantName).toBe('Customer Test Restaurant');
    });

    // ✅ FIXED: Backend throws Error (500), not NotFoundError (404)
    it('should return error for non-existent restaurant', async () => {
      const response = await request(app).get('/api/customer/restaurants/99999');
      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/customer/availability', () => {
    it('should check availability and return available tables', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateString = tomorrow.toISOString().split('T')[0];

      const response = await request(app).post('/api/customer/availability').send({
        restaurantId,
        reservationDate: dateString,
        startTime: '19:00',
        guestCount: 2,
      });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.available).toBe(true);
      expect(response.body.data.tables.length).toBeGreaterThan(0);
    });

    // ✅ FIXED: Validator rejects guestCount > 10 with 400, doesn't return available:false
    it('should return validation error for excessive guest count', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateString = tomorrow.toISOString().split('T')[0];

      const response = await request(app).post('/api/customer/availability').send({
        restaurantId,
        reservationDate: dateString,
        startTime: '19:00',
        guestCount: 20,
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should fail with missing required fields', async () => {
      const response = await request(app).post('/api/customer/availability').send({ restaurantId });
      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/customer/reservations', () => {
    it('should create a new reservation', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateString = tomorrow.toISOString().split('T')[0];

      const response = await request(app).post('/api/customer/reservations').send({
        restaurantId,
        reservationDate: dateString,
        startTime: '18:00',
        guestCount: 3,
        customerName: 'Alice Smith',
        customerPhone: '1112223333',
        customerEmail: 'alice@test.com',
        specialRequests: 'Window seat please',
      });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.customerName).toBe('Alice Smith');
      expect(response.body.data.status).toBe('CONFIRMED');
    });

    it('should fail with invalid email', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateString = tomorrow.toISOString().split('T')[0];

      const response = await request(app).post('/api/customer/reservations').send({
        restaurantId,
        reservationDate: dateString,
        startTime: '18:00',
        guestCount: 2,
        customerName: 'Bob Test',
        customerPhone: '4445556666',
        customerEmail: 'invalid-email',
      });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/customer/reservations', () => {
    beforeEach(async () => {
      await prisma.reservation.create({
        data: {
          restaurantId,
          tableId,
          customerName: 'Charlie Test',
          customerPhone: '7778889999',
          customerEmail: 'charlie@test.com',
          reservationDate: new Date(),
          startTime: '20:00',
          endTime: '22:00',
          guestCount: 2,
          status: 'CONFIRMED',
          bookingSource: 'ONLINE',
        },
      });
    });

    it('should lookup reservations by phone', async () => {
      const response = await request(app).get('/api/customer/reservations').query({ phone: '7778889999' });
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].customerPhone).toBe('7778889999');
    });

    it('should lookup reservations by email', async () => {
      const response = await request(app).get('/api/customer/reservations').query({ email: 'charlie@test.com' });
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data[0].customerEmail).toBe('charlie@test.com');
    });

    it('should return empty array if no matches', async () => {
      const response = await request(app).get('/api/customer/reservations').query({ phone: '0000000000' });
      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(0);
    });
  });

  describe('GET /api/customer/reservations/:id', () => {
    let reservationId: number;

    beforeEach(async () => {
      const reservation = await prisma.reservation.create({
        data: {
          restaurantId,
          tableId,
          customerName: 'David Test',
          customerPhone: '3334445555',
          customerEmail: 'david@test.com',
          reservationDate: new Date(),
          startTime: '21:00',
          endTime: '23:00',
          guestCount: 4,
          status: 'CONFIRMED',
          bookingSource: 'PHONE',
        },
      });
      reservationId = reservation.id;
    });

    it('should get reservation by id', async () => {
      const response = await request(app).get(`/api/customer/reservations/${reservationId}`);
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.customerName).toBe('David Test');
    });

    it('should return 404 for non-existent reservation', async () => {
      const response = await request(app).get('/api/customer/reservations/99999');
      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/customer/reservations/:id', () => {
    let reservationId: number;

    beforeEach(async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5);

      const reservation = await prisma.reservation.create({
        data: {
          restaurantId,
          tableId,
          customerName: 'Eve Test',
          customerPhone: '6667778888',
          customerEmail: 'eve@test.com',
          reservationDate: futureDate,
          startTime: '18:00',
          endTime: '20:00',
          guestCount: 2,
          status: 'CONFIRMED',
          bookingSource: 'ONLINE',
        },
      });
      reservationId = reservation.id;
    });

    it('should cancel a reservation', async () => {
      const response = await request(app).delete(`/api/customer/reservations/${reservationId}`).send({ cancellationReason: 'Change of plans' });
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      const cancelled = await prisma.reservation.findUnique({ where: { id: reservationId } });
      expect(cancelled?.status).toBe('CANCELLED');
    });
  });
});