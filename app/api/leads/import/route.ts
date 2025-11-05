import { createClient } from '@/lib/supabase-server'
import { LeadCreateSchema } from '@/lib/zod-schemas'
import { sanitizeCSVValue } from '@/lib/utils'
import { NextRequest, NextResponse } from 'next/server'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'

// Helper function to clean phone number format
function cleanPhoneNumber(phone: string | undefined | null): string | undefined {
  if (!phone) return undefined
  // Keep only digits, +, -, spaces, and parentheses
  const cleaned = phone.toString().trim()
  if (!cleaned) return undefined
  return cleaned
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const fileBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(fileBuffer)

    let rows: Record<string, unknown>[] = []

    // Parse based on file type
    if (file.name.endsWith('.csv')) {
      const text = buffer.toString('utf-8')
      const result = Papa.parse(text, { header: true, skipEmptyLines: true })
      rows = result.data as Record<string, unknown>[]
    } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      const workbook = XLSX.read(buffer, { type: 'buffer' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      rows = XLSX.utils.sheet_to_json(worksheet)
    } else {
      return NextResponse.json(
        { error: 'Unsupported file type. Please use CSV or XLSX.' },
        { status: 400 }
      )
    }

    const results = {
      inserted: 0,
      updated: 0,
      skipped: 0,
      rejected: 0,
      errors: [] as Array<{ row: number; data: unknown; error: string }>,
    }

    // Process each row
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]

      try {
        // Map common column names (case-insensitive)
        const leadData: Record<string, unknown> = {}

        Object.keys(row).forEach((key) => {
          const lowerKey = key.toLowerCase().trim()
          const value = row[key]

          if (lowerKey.includes('name') && !lowerKey.includes('company')) {
            leadData.name = value
          } else if (lowerKey.includes('email')) {
            leadData.email = value
          } else if (lowerKey.includes('phone') || lowerKey.includes('tel')) {
            leadData.phone = value
          } else if (lowerKey.includes('company') || lowerKey.includes('organization')) {
            leadData.company = value
          } else if (lowerKey.includes('status')) {
            leadData.status = value
          } else if (lowerKey.includes('source') || lowerKey.includes('origin')) {
            leadData.source = value
          } else if (lowerKey.includes('note')) {
            leadData.notes = value
          }
        })

        // Sanitize CSV injection and normalize empty values
        if (leadData.name && typeof leadData.name === 'string') {
          leadData.name = sanitizeCSVValue(leadData.name)
        }
        if (leadData.email && typeof leadData.email === 'string') {
          leadData.email = sanitizeCSVValue(leadData.email)
        }
        
        // Special handling for phone - convert null/empty/undefined to undefined
        if (leadData.phone !== undefined) {
          const phoneValue = leadData.phone
          if (phoneValue && typeof phoneValue === 'string') {
            const sanitized = sanitizeCSVValue(phoneValue)
            leadData.phone = cleanPhoneNumber(sanitized)
          } else {
            leadData.phone = undefined
          }
        } else {
          leadData.phone = undefined // Explicitly set to undefined if not present
        }
        
        if (leadData.company && typeof leadData.company === 'string') {
          leadData.company = sanitizeCSVValue(leadData.company)
        }
        if (leadData.source && typeof leadData.source === 'string') {
          leadData.source = sanitizeCSVValue(leadData.source)
        }

        // Validate with Zod
        const validatedData = LeadCreateSchema.parse(leadData)

        // Check for duplicates based on email (if email exists)
        let existingLead = null
        if (validatedData.email) {
          const { data } = await supabase
            .from('leads')
            .select('id')
            .eq('user_id', user.id)
            .eq('email', validatedData.email)
            .single()
          
          existingLead = data
        }

        if (existingLead) {
          // Update existing lead
          const { error } = await supabase
            .from('leads')
            .update({
              ...validatedData,
              status: (validatedData.status || 'new').toLowerCase(),
              updated_at: new Date().toISOString(),
            })
            .eq('id', existingLead.id)

          if (error) {
            results.rejected++
            results.errors.push({
              row: i + 1,
              data: row,
              error: error.message,
            })
          } else {
            results.updated++
          }
        } else {
          // Insert new lead
          const { error } = await supabase.from('leads').insert([
            {
              ...validatedData,
              status: (validatedData.status || 'new').toLowerCase(),
              user_id: user.id,
            },
          ])

          if (error) {
            results.rejected++
            results.errors.push({
              row: i + 1,
              data: row,
              error: error.message,
            })
          } else {
            results.inserted++
          }
        }
      } catch (error: unknown) {
        results.rejected++
        results.errors.push({
          row: i + 1,
          data: row,
          error: error instanceof Error ? error.message : 'Validation failed',
        })
      }
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error('Error in POST /api/leads/import:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
