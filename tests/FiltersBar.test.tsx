import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FiltersBar } from '@/components/leads/FiltersBar'

// Mock next/navigation
const mockReplace = vi.fn()
const mockSearchParams = new URLSearchParams()

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
  useSearchParams: () => mockSearchParams,
}))

describe('FiltersBar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should call router.replace on search', async () => {
    render(<FiltersBar />)
    
    const searchButton = screen.getByRole('button', { name: /search/i })
    fireEvent.click(searchButton)

    expect(mockReplace).toHaveBeenCalled()
  })

  it('should call router.replace on clear', () => {
    render(<FiltersBar />)
    
    const clearButton = screen.getByRole('button', { name: /clear/i })
    fireEvent.click(clearButton)

    expect(mockReplace).toHaveBeenCalledWith('/dashboard')
  })
})
