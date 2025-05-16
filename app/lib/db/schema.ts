import { z } from 'zod';

// Address schema
export const addressSchema = z.object({
  id: z.string(),
  line1: z.string(),
  line2: z.string().optional(),
  town: z.string(),
  county: z.string().optional(),
  postcode: z.string(),
  country: z.string().default('UK'),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Move schema
export const moveSchema = z.object({
  id: z.string(),
  userId: z.string(),
  fromAddressId: z.string(),
  toAddressId: z.string(),
  moveDate: z.date(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED']),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Service Update schema
export const serviceUpdateSchema = z.object({
  id: z.string(),
  moveId: z.string(),
  serviceId: z.string(),
  serviceName: z.string(),
  serviceCategory: z.string(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED']),
  errorMessage: z.string().optional(),
  retryCount: z.number().default(0),
  lastAttempt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Address = z.infer<typeof addressSchema>;
export type Move = z.infer<typeof moveSchema>;
export type ServiceUpdate = z.infer<typeof serviceUpdateSchema>; 