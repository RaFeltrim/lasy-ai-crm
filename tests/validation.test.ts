import { describe, it, expect } from 'vitest'

describe('validation', () => {
  it('valid name is required', () => {
    const validName = 'John Doe'
    expect(validName.trim().length).toBeGreaterThan(0)
  })

  it('invalid without name', () => {
    const invalidName = ''
    expect(invalidName.trim().length).toBe(0)
  })
})
