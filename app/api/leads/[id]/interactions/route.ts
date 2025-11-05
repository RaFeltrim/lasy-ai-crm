import { createClient } from '@/lib/supabase-server'
import { InteractionCreateSchema } from '@/lib/zod-schemas'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify lead belongs to user
    const { data: lead } = await supabase
      .from('leads')
      .select('id')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    const { data: interactions, error } = await supabase
      .from('interactions')
      .select('*')
      .eq('lead_id', params.id)
      .eq('user_id', user.id)
      .order('occurred_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(interactions)
  } catch (error) {
    console.error('Error in GET /api/leads/[id]/interactions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify lead belongs to user
    const { data: lead } = await supabase
      .from('leads')
      .select('id')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    const body = await request.json()
    const validatedData = InteractionCreateSchema.parse(body)

    const interactionData = {
      ...validatedData,
      lead_id: params.id,
      user_id: user.id,
    }

    const { data: interaction, error } = await supabase
      .from('interactions')
      .insert([interactionData])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(interaction, { status: 201 })
  } catch (error: unknown) {
    console.error('Error in POST /api/leads/[id]/interactions:', error)

    // Check if error is a Zod validation error
    if (
      error &&
      typeof error === 'object' &&
      'name' in error &&
      error.name === 'ZodError' &&
      'errors' in error &&
      Array.isArray((error as { errors: unknown }).errors)
    ) {
      const zodError = error as { errors: Array<{ message: string; path: Array<string | number> }> }
      return NextResponse.json(
        { error: 'Validation error', details: zodError.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
