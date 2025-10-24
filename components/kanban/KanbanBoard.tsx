'use client'

import { useMemo, useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { LeadStatus } from '@/lib/zod-schemas'
import { LeadCard } from './LeadCard'
import { KanbanColumn } from './KanbanColumn'

export interface Lead {
  id: string
  name: string
  email?: string
  phone?: string
  company?: string
  status: LeadStatus
  notes?: string
  source?: string
  created_at: string
  updated_at: string
  user_id: string
}

interface KanbanBoardProps {
  leads: Lead[]
  onStatusChange: (leadId: string, newStatus: LeadStatus) => Promise<void>
  onLeadClick: (leadId: string) => void
}

const columns: { id: LeadStatus; title: string }[] = [
  { id: 'new', title: 'New' },
  { id: 'contacted', title: 'Contacted' },
  { id: 'qualified', title: 'Qualified' },
  { id: 'pending', title: 'Pending' },
  { id: 'lost', title: 'Lost' },
]

export function KanbanBoard({ leads, onStatusChange, onLeadClick }: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const leadsByStatus = useMemo(() => {
    const grouped: Record<LeadStatus, Lead[]> = {
      new: [],
      contacted: [],
      qualified: [],
      pending: [],
      lost: [],
    }

    leads.forEach((lead) => {
      if (grouped[lead.status]) {
        grouped[lead.status].push(lead)
      }
    })

    return grouped
  }, [leads])

  const activeLead = useMemo(() => {
    if (!activeId) return null
    return leads.find((lead) => lead.id === activeId)
  }, [activeId, leads])

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const leadId = active.id as string
    const newStatus = over.id as LeadStatus

    const lead = leads.find((l) => l.id === leadId)
    if (!lead || lead.status === newStatus) return

    // Optimistic update handled in parent component
    await onStatusChange(leadId, newStatus)
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col gap-4 md:flex-row md:grid md:grid-cols-3 lg:grid-cols-5">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            leads={leadsByStatus[column.id]}
            onLeadClick={onLeadClick}
          />
        ))}
      </div>

      <DragOverlay>
        {activeLead && (
          <LeadCard lead={activeLead} onClick={() => {}} isDragging />
        )}
      </DragOverlay>
    </DndContext>
  )
}
