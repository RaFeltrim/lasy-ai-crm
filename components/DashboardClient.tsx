'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { KanbanBoard, Lead } from '@/components/kanban/KanbanBoard'
import { FiltersBar } from '@/components/leads/FiltersBar'
import { ImportLeadsDialog } from '@/components/leads/ImportLeadsDialog'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { Download, Plus, LogOut } from 'lucide-react'
import { LeadStatus } from '@/lib/zod-schemas'

interface DashboardClientProps {
  initialLeads: Lead[]
}

export function DashboardClient({ initialLeads }: DashboardClientProps) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads)
  const router = useRouter()
  const supabase = createClient()

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    const previousLeads = leads
    
    // Optimistic update
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      )
    )

    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus.toLowerCase() }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update lead')
      }

      const updatedLead = await response.json()
      
      // Update with server response
      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === leadId ? updatedLead : lead
        )
      )

      toast({
        title: 'Success',
        description: 'Lead status updated',
      })
    } catch (error: any) {
      // Revert optimistic update
      setLeads(previousLeads)
      
      console.error('Error updating lead status:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to update lead status',
        variant: 'destructive',
      })
    }
  }

  const handleLeadClick = (leadId: string) => {
    router.push(`/leads/${leadId}`)
  }

  const handleExportCSV = () => {
    const params = new URLSearchParams(window.location.search)
    window.location.href = `/api/leads/export.csv?${params.toString()}`
  }

  const handleExportXLSX = () => {
    const params = new URLSearchParams(window.location.search)
    window.location.href = `/api/leads/export.xlsx?${params.toString()}`
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-[1800px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Lasy CRM</h1>
            <p className="text-muted-foreground">Manage your leads pipeline</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => router.push('/leads/new')}>
              <Plus className="h-4 w-4 mr-2" />
              New Lead
            </Button>
            <ImportLeadsDialog />
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <Download className="h-4 w-4 mr-2" />
              CSV
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportXLSX}>
              <Download className="h-4 w-4 mr-2" />
              XLSX
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Filters */}
        <FiltersBar />

        {/* Kanban Board */}
        <KanbanBoard
          leads={leads}
          onStatusChange={handleStatusChange}
          onLeadClick={handleLeadClick}
        />
      </div>
    </div>
  )
}
