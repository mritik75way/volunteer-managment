import { z } from 'zod';

export const createOpportunitySchema = z.object({
    body: z.object({
        title: z.string().min(5, 'Title must be at least 5 characters'),
        description: z.string().min(20, 'Description must be detailed'),
        location: z.string().min(2, 'Location is required'),
        requirements: z.array(z.string()).optional(),
        requiredSkills: z.array(z.string()).optional(),
        shifts: z.array(z.object({
            startTime: z.string().datetime(),
            endTime: z.string().datetime(),
            capacity: z.number().min(1)
        })).min(1, 'At least one shift is required')
    })
});

export type CreateOpportunityInput = z.infer<typeof createOpportunitySchema>['body'];