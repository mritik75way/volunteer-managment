import { z } from 'zod';

export const opportunitySchema = z.object({
  title: z.string().min(5, 'Title is too short'),
  description: z.string().min(20, 'Description must be detailed'),
  location: z.string().min(2, 'Location is required'),
  requiredSkills: z.array(z.string()).optional(),
  shifts: z.array(z.object({
    startTime: z.string().min(1, 'Start time is required'),
    endTime: z.string().min(1, 'End time is required'),
    capacity: z.number().min(1, 'Capacity must be at least 1')
  })).min(1, 'At least one shift is required')
});

export type OpportunityFormValues = z.infer<typeof opportunitySchema>;