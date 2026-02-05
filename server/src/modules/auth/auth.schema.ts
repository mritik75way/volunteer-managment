import { z } from 'zod';

export const registerSchema = z.object({
    body: z.object({
        name: z.string().min(2, 'Name must be at least 2 characters'),
        email: z.email('Invalid email format'),
        password: z.string().min(4, 'Password must be at least 4 characters'),
        role: z.enum(['volunteer', 'coordinator', 'admin']).optional(),
        skills: z.array(z.string()).optional(),
        availability: z.array(z.object({
            day: z.string(),
            startTime: z.string(),
            endTime: z.string()
        })).optional()
    })
});

export const loginSchema = z.object({
    body: z.object({
        email: z.email('Invalid email format'),
        password: z.string().min(1, 'Password is required')
    })
});

export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];