'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent } from '@/components/ui/card'
import { Lead } from './KanbanBoard'
import { Building2, Mail, Phone } from 'lucide-react'

interface LeadCardProps {
  lead: Lead
  onClick: () => void
  isDragging?: boolean
}

export function LeadCard({ lead, onClick, isDragging }: LeadCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: lead.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow ${
        isDragging ? 'shadow-lg rotate-3' : ''
      }`}
      onClick={(e) => {
        if (e.detail === 2) {
          // Double click
          onClick()
        }
      }}
    >
      <CardContent className="p-3 space-y-2">
        <div className="font-semibold text-sm truncate">{lead.name}</div>
        {lead.company && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Building2 className="h-3 w-3" />
            <span className="truncate">{lead.company}</span>
          </div>
        )}
        {lead.email && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Mail className="h-3 w-3" />
            <span className="truncate">{lead.email}</span>
          </div>
        )}
        {lead.phone && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Phone className="h-3 w-3" />
            <span className="truncate">{lead.phone}</span>
          </div>
        )}
        {lead.source && (
          <div className="mt-2">
            <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-secondary text-secondary-foreground">
              {lead.source}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
