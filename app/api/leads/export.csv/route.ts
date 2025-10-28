import { createClient } from '@/lib/supabase-server'
import { LeadFilterSchema } from '@/lib/zod-schemas'
import { sanitizeCSVValue } from '@/lib/utils'
import { NextRequest, NextResponse } from 'next/server'
import Papa from 'papaparse'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const filters = LeadFilterSchema.parse({
      query: searchParams.get('query') || undefined,
      status: searchParams.get('status') || undefined,
      source: searchParams.get('source') || undefined,
      from: searchParams.get('from') || undefined,
      to: searchParams.get('to') || undefined,
    })

    let query = supabase
      .from('leads')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    // Apply same filters as main list
    if (filters.query) {
      query = query.ilike('name', `%${filters.query}%`)
    }
    if (filters.status) {
      query = query.eq('status', filters.status)
    }
    if (filters.source) {
      query = query.eq('source', filters.source)
    }
    if (filters.from) {
      query = query.gte('created_at', filters.from)
    }
    if (filters.to) {
      query = query.lte('created_at', filters.to)
    }

    const { data: leads, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Prepare data for CSV (exclude auto-generated fields like created_at, updated_at, id, user_id)
    const csvData = leads.map((lead) => ({
      name: sanitizeCSVValue(lead.name || ''),
      email: sanitizeCSVValue(lead.email || ''),
      phone: sanitizeCSVValue(lead.phone || ''),
      company: sanitizeCSVValue(lead.company || ''),
      status: lead.status || '',
      source: sanitizeCSVValue(lead.source || ''),
      notes: sanitizeCSVValue(lead.notes || ''),
    }))

    const csv = Papa.unparse(csvData)

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="leads-export-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error('Error in GET /api/leads/export.csv:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
