"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lead } from "./KanbanBoard";
import { LeadCard } from "./LeadCard";

interface KanbanColumnProps {
  id: string;
  title: string;
  leads: Lead[];
  onLeadClick: (leadId: string) => void;
}

export function KanbanColumn({
  id,
  title,
  leads = [],
  onLeadClick,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <Card
      ref={setNodeRef}
      className={`flex flex-col h-[400px] lg:h-[calc(100vh-250px)] min-w-[300px] flex-shrink-0 lg:min-w-0 lg:flex-shrink transition-colors ${
        isOver ? "border-primary" : ""
      }`}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span>{title}</span>
          <span className="text-muted-foreground">({leads?.length || 0})</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto space-y-2 p-3 pt-0">
        <SortableContext
          items={leads.map((l) => l.id)}
          strategy={verticalListSortingStrategy}
        >
          {leads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onClick={() => onLeadClick(lead.id)}
            />
          ))}
        </SortableContext>
        {leads.length === 0 && (
          <div className="text-center text-sm text-muted-foreground py-8">
            No leads
          </div>
        )}
      </CardContent>
    </Card>
  );
}
