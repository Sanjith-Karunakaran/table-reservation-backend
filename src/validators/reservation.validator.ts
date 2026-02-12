import { z } from 'zod';
import { dateSchema, timeSchema, phoneSchema, emailSchema } from './common.validator';

export const createReservationSchema = z.object({
  body: z.object({
    restaurantId: z.number().int().positive('Restaurant ID must be positive'),
    reservationDate: dateSchema,
    startTime: timeSchema,
    guestCount: z.number().int().min(1, 'At least 1 guest required').max(10, 'Maximum 10 guests'),
    customerName: z.string().min(2, 'Name must be at least 2 characters').max(100),
    customerPhone: phoneSchema,
    customerEmail: emailSchema,
    specialRequests: z.string().max(500, 'Special requests must be under 500 characters').optional(),
  }),
});

export const updateReservationSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
  body: z.object({
    reservationDate: dateSchema.optional(),
    startTime: timeSchema.optional(),
    guestCount: z.number().int().min(1).max(10).optional(),
    customerName: z.string().min(2).max(100).optional(),
    customerPhone: phoneSchema.optional(),
    customerEmail: emailSchema.optional(),
    specialRequests: z.string().max(500).optional(),
  }),
});

export const cancelReservationSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
  body: z.object({
    cancellationReason: z.string().max(255).optional(),
  }),
});

export const getReservationByIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
});

export const lookupReservationSchema = z.object({
  query: z.object({
    phone: phoneSchema.optional(),
    email: emailSchema.optional(),
    reservationId: z.string().optional().transform((val) => (val ? Number(val) : undefined)),
  }),
});

export const checkAvailabilitySchema = z.object({
  body: z.object({
    restaurantId: z.number().int().positive(),
    reservationDate: dateSchema,
    startTime: timeSchema,
    guestCount: z.number().int().min(1).max(10),
  }),
});