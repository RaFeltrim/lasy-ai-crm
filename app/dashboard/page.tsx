import { createClient } from '@/lib/supabase-server'
import dynamic from 'next/dynamic'
import { redirect } from 'next/navigation'

const DashboardClient = dynamic(
  () => import('@/components/DashboardClient').then(mod => ({ default: mod.DashboardClient })),
  { ssr: false }
)

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
    // Global search across multiple fields
    const searchTerm = `%${searchParams.query}%`
    query = query.or(`name.ilike.${searchTerm},email.ilike.${searchTerm},company.ilike.${searchTerm},notes.ilike.${searchTerm}`)
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
