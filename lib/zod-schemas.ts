import { z } from 'zod'

// Lead status enum (lowercase to match DB)
export const LeadStatusEnum = z.enum(['new', 'contacted', 'qualified', 'pending', 'lost'])
export type LeadStatus = z.infer<typeof LeadStatusEnum>

// Interaction type enum
export const InteractionTypeEnum = z.enum(['call', 'email', 'meeting', 'note'])
export type InteractionType = z.infer<typeof InteractionTypeEnum>

// Lead Create Schema
export const LeadCreateSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z
    .string()
    .email('Invalid email format')
    .or(z.literal(''))
    .optional()
    .transform((v) => v || undefined),
  phone: z
    .string()
    .trim()
    .regex(
      /^(\+?\d{1,3}[\s-]?)?\(?\d{1,4}\)?[\s-]?\d{1,5}[\s-]?\d{1,5}$/,
      'Invalid phone format. Use numbers, spaces, dashes, or parentheses only'
    )
    .or(z.literal(''))
    .optional()
    .transform((v) => v || undefined),
  company: z.string().trim().optional(),
  status: LeadStatusEnum.optional().default('new'),
  notes: z.string().trim().optional(),
  source: z.string().trim().optional(),
})

export type LeadCreate = z.infer<typeof LeadCreateSchema>

// Lead Update Schema (all fields optional)
export const LeadUpdateSchema = LeadCreateSchema.partial()
export type LeadUpdate = z.infer<typeof LeadUpdateSchema>

// Interaction Create Schema
export const InteractionCreateSchema = z.object({
  type: InteractionTypeEnum,
  content: z.string().trim().min(1, 'Content is required'),
  occurred_at: z.string().optional(),
})

export type InteractionCreate = z.infer<typeof InteractionCreateSchema>

// Filter Schema
export const LeadFilterSchema = z.object({
  query: z.string().optional(),
  status: LeadStatusEnum.optional(),
  source: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
})

export type LeadFilter = z.infer<typeof LeadFilterSchema>
