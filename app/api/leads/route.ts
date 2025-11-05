import { createClient } from '@/lib/supabase-server'
import { LeadCreateSchema, LeadFilterSchema } from '@/lib/zod-schemas'
import { NextRequest, NextResponse } from 'next/server'

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

    // Apply filters
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
      console.error('Error fetching leads:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(leads)
  } catch (error) {
    console.error('Error in GET /api/leads:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
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

    const body = await request.json()
    const validatedData = LeadCreateSchema.parse(body)

    // Ensure status is lowercase to match DB enum
    const leadData = {
      ...validatedData,
      status: (validatedData.status || 'new').toLowerCase(),
      user_id: user.id,
    }

    const { data: lead, error } = await supabase
      .from('leads')
      .insert([leadData])
      .select()
      .single()

    if (error) {
      console.error('Error creating lead:', error)
      
      // Check if it's a schema cache issue
      if (error.message.includes('schema cache') || error.message.includes('column')) {
        return NextResponse.json({ 
          error: 'Database schema error. Please reload the schema in Supabase.',
          details: error.message,
          solution: 'Run: NOTIFY pgrst, \'reload schema\'; in Supabase SQL Editor'
        }, { status: 500 })
      }
      
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(lead, { status: 201 })
  } catch (error: unknown) {
    console.error('Error in POST /api/leads:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: (error as { errors?: unknown }).errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
