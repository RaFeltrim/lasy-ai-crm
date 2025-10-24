'use client'

import { useState, useEffect } from 'react'
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
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Handle hydration
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Update leads when initialLeads changes (e.g., after filter)
  useEffect(() => {
    setLeads(initialLeads)
  }, [initialLeads])

  // Prevent hydration mismatch
  if (!isClient) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-[1800px] mx-auto space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Lasy CRM</h1>
              <p className="text-sm text-muted-foreground">Manage your leads pipeline</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

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
        duration: 3000,
      })
    } catch (error: any) {
      // Revert optimistic update
      setLeads(previousLeads)
      
      console.error('Error updating lead status:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to update lead status',
        variant: 'destructive',
        duration: 10000, // 10 seconds for errors
      })
    }
  }

  const handleLeadClick = (leadId: string) => {
    router.push(`/leads/${leadId}`)
  }

  const handleExportCSV = () => {
    window.location.href = `/api/leads/export.csv${window.location.search}`
  }

  const handleExportXLSX = () => {
    window.location.href = `/api/leads/export.xlsx${window.location.search}`
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8" suppressHydrationWarning>
      <div className="max-w-[1800px] mx-auto space-y-6" suppressHydrationWarning>
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Lasy CRM</h1>
            <p className="text-sm text-muted-foreground">Manage your leads pipeline</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => router.push('/leads/new')} className="flex-1 sm:flex-none">
              <Plus className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">New Lead</span>
            </Button>
            <ImportLeadsDialog />
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <Download className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">CSV</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportXLSX}>
              <Download className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">XLSX</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Logout</span>
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
