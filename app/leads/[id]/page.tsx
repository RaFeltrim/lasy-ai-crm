import { createClient } from '@/lib/supabase-server'
import { notFound, redirect } from 'next/navigation'
import { LeadEditForm } from '@/components/leads/LeadEditForm'

export default async function LeadDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: lead, error } = await supabase
    .from('leads')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (error || !lead) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <LeadEditForm lead={lead} />
      </div>
    </div>
  )
}
