import { z } from 'zod';

// Password validation: min 8 chars + at least 1 special character
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(
    /[!@#$%^&*(),.?":{}|<>]/,
    'Password must contain at least one special character (!@#$%^&*...)'
  );

// Login validation
export const customerLoginSchema = z.object({
  body: z
    .object({
      email: z.string().email('Invalid email address').optional(),
      phone: z.string().min(10, 'Phone number must be at least 10 digits').optional(),
      password: passwordSchema,
    })
    .refine(
      (data) => data.email || data.phone,
      {
        message: 'Either email or phone is required',
        path: ['email'], // Show error on email field
      }
    ),
});

// Signup validation (for future use)
export const customerSignupSchema = z.object({
  body: z.object({
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    password: passwordSchema,
    confirmPassword: z.string(),
  }).refine(
    (data) => data.password === data.confirmPassword,
    {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }
  ),
});