import { createClient } from '@/lib/supabase-server'
import { DashboardClient } from '@/components/DashboardClient'
import { redirect } from 'next/navigation'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Build query with filters
  let query = supabase
    .from('leads')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (searchParams.query && typeof searchParams.query === 'string') {
    query = query.ilike('name', `%${searchParams.query}%`)
  }

  if (searchParams.status && typeof searchParams.status === 'string') {
    query = query.eq('status', searchParams.status)
  }

  if (searchParams.source && typeof searchParams.source === 'string') {
    query = query.eq('source', searchParams.source)
  }

  if (searchParams.from && typeof searchParams.from === 'string') {
    query = query.gte('created_at', searchParams.from)
  }

  if (searchParams.to && typeof searchParams.to === 'string') {
    query = query.lte('created_at', searchParams.to)
  }

  const { data: leads, error } = await query

  if (error) {
    console.error('Error fetching leads:', error)
    return <div>Error loading leads</div>
  }

  return <DashboardClient initialLeads={leads || []} />
}
