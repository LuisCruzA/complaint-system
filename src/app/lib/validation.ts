import { z } from 'zod'

export const createComplaintSchema = z.object({
  email: z.string().email(),
  description: z.string().min(5).max(2000),
})

export const updateComplaintSchema = z.object({
  status: z.enum(['NEW','IN_PROGRESS','RESOLVED','CLOSED']).optional(),

  dueDate: z.string().datetime().nullable().optional(),
})

export const createNoteSchema = z.object({
  body: z.string().min(1).max(2000),
})
