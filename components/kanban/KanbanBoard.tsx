"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverEvent,
  closestCorners,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { LeadStatus } from "@/lib/zod-schemas";
import { LeadCard } from "./LeadCard";
import { KanbanColumn } from "./KanbanColumn";

export interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  status: LeadStatus;
  notes?: string;
  source?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface KanbanBoardProps {
  leads: Lead[];
  onStatusChange: (leadId: string, newStatus: LeadStatus) => Promise<void>;
  onLeadClick: (leadId: string) => void;
}

const columns: { id: LeadStatus; title: string }[] = [
  { id: "new", title: "New" },
  { id: "contacted", title: "Contacted" },
  { id: "qualified", title: "Qualified" },
  { id: "pending", title: "Pending" },
  { id: "lost", title: "Lost" },
];

export function KanbanBoard({
  leads,
  onStatusChange,
  onLeadClick,
}: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [localLeads, setLocalLeads] = useState<Lead[]>(leads);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
      },
    }),
  );

  // Update local leads when props change
  useMemo(() => {
    setLocalLeads(leads);
  }, [leads]);

  const leadsByStatus = useMemo(() => {
    const grouped: Record<LeadStatus, Lead[]> = {
      new: [],
      contacted: [],
      qualified: [],
      pending: [],
      lost: [],
    };

    localLeads.forEach((lead) => {
      if (grouped[lead.status]) {
        grouped[lead.status].push(lead);
      }
    });

    return grouped;
  }, [localLeads]);

  const activeLead = useMemo(() => {
    if (!activeId) return null;
    return localLeads.find((lead) => lead.id === activeId);
  }, [activeId, localLeads]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const activeLead = localLeads.find((l) => l.id === activeId);
    const overLead = localLeads.find((l) => l.id === overId);

    if (!activeLead) return;

    // If dragging over another lead (reordering within or between columns)
    if (overLead) {
      const activeIndex = localLeads.findIndex((l) => l.id === activeId);
      const overIndex = localLeads.findIndex((l) => l.id === overId);

      if (activeIndex !== overIndex) {
        setLocalLeads((leads) => {
          const newLeads = arrayMove(leads, activeIndex, overIndex);
          // Update the status if moved to different column
          if (activeLead.status !== overLead.status) {
            newLeads[overIndex] = {
              ...newLeads[overIndex],
              status: overLead.status,
            };
          }
          return newLeads;
        });
      }
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const leadId = active.id as string;
    const overId = over.id as string;

    const lead = localLeads.find((l) => l.id === leadId);
    if (!lead) return;

    // Check if dropped over a valid column
    const validStatuses: LeadStatus[] = [
      "new",
      "contacted",
      "qualified",
      "pending",
      "lost",
    ];
    if (validStatuses.includes(overId as LeadStatus)) {
      // Dropped directly on a column
      const newStatus = overId as LeadStatus;
      if (lead.status !== newStatus) {
        await onStatusChange(leadId, newStatus);
      }
    } else {
      // Dropped over a card
      const targetLead = localLeads.find((l) => l.id === overId);
      if (targetLead && lead.status !== targetLead.status) {
        await onStatusChange(leadId, targetLead.status);
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {/* Mobile: Horizontal scroll, Desktop: Grid */}
      <div className="flex gap-4 overflow-x-auto lg:overflow-x-visible lg:grid lg:grid-cols-5 pb-4 lg:pb-0">
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
  );
}
