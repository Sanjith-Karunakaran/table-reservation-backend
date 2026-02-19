import { z } from 'zod';

export const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID must be a number').transform(Number),
});

export const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format');

export const timeSchema = z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format');

export const phoneSchema = z
  .string()
  .regex(/^\d{10}$/, 'Phone number must be exactly 10 digits')
  .transform((val) => val.replace(/\D/g, ''));

export const emailSchema = z.string().email('Invalid email address');

export const paginationSchema = z.object({
  page: z.string().optional().default('1').transform(Number),
  limit: z.string().optional().default('20').transform(Number),
});

// ✅ ADD THIS: Availability check schema
export const checkAvailabilitySchema = z.object({
  body: z.object({
    restaurantId: z.number().int().positive(),
    reservationDate: dateSchema,
    startTime: timeSchema,
    guestCount: z.number().int().positive().max(10),
  }),
});