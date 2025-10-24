import { describe, it, expect } from 'vitest'
import { LeadCreateSchema } from '@/lib/zod-schemas'

describe('zod-schemas', () => {
  it('should accept valid email', () => {
    const result = LeadCreateSchema.safeParse({
      name: 'John Doe',
      email: 'john@example.com',
    })
    expect(result.success).toBe(true)
  })

  it('should reject invalid email', () => {
    const result = LeadCreateSchema.safeParse({
      name: 'John Doe',
      email: 'invalid-email',
    })
    expect(result.success).toBe(false)
  })

  it('should trim and apply default status', () => {
    const result = LeadCreateSchema.safeParse({
      name: '  John Doe  ',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.name).toBe('John Doe')
      expect(result.data.status).toBe('new')
    }
  })

  it('should transform empty email to undefined', () => {
    const result = LeadCreateSchema.safeParse({
      name: 'John Doe',
      email: '',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.email).toBeUndefined()
    }
  })
})
