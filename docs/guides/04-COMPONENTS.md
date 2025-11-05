# Component Reference

Documentation for all React components.

---

## DashboardClient

Main client component that manages lead state.

**Location:** `components/DashboardClient.tsx`

**Props:**

```typescript
interface Props {
  initialLeads: Lead[];
}
```

**State:**

```typescript
const [leads, setLeads] = useState<Lead[]>(initialLeads);
const [editingLead, setEditingLead] = useState<Lead | null>(null);
```

**Key Functions:**

- `handleLeadUpdate(id, changes)` - Optimistic update with API call
- `handleLeadDelete(id)` - Delete with confirmation
- `handleNewLead()` - Open create dialog

**Usage:**

```tsx
// In Server Component
const leads = await getLeads();
return <DashboardClient initialLeads={leads} />;
```

---

## KanbanBoard

Drag-and-drop Kanban board using @dnd-kit.

**Location:** `components/kanban/KanbanBoard.tsx`

**Props:**

```typescript
interface Props {
  leads: Lead[];
  onLeadUpdate: (id: string, changes: Partial<Lead>) => void;
  onLeadEdit: (lead: Lead) => void;
  onLeadDelete: (id: string) => void;
}
```

**Features:**

- Touch support (250ms long-press)
- Real-time reordering (onDragOver)
- Status change on drop (onDragEnd)
- Horizontal scroll on mobile

**Sensors:**

```typescript
const sensors = useSensors(
  useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 5 },
  }),
);
```

---

## FiltersBar

Search and filter form with URL sync.

**Location:** `components/leads/FiltersBar.tsx`

**Props:** None (reads from URL)

**Features:**

- Search by name, email, company, notes
- Filter by status
- Date range filter
- Debounced input (300ms)
- URL synchronization

**Hydration Fix:**

```typescript
const [isClient, setIsClient] = useState(false);

useEffect(() => {
  setIsClient(true);
  reset({ query: searchParams.get("query") || "" });
}, [searchParams]);
```

---

## LeadEditForm

Form for creating/editing leads with validation.

**Location:** `components/leads/LeadEditForm.tsx`

**Props:**

```typescript
interface Props {
  lead?: Lead | null;
  onSave: (data: Lead) => Promise<void>;
  onClose: () => void;
}
```

**Validation:**

```typescript
const form = useForm<Lead>({
  resolver: zodResolver(leadSchema),
  defaultValues: lead || {
    name: "",
    email: "",
    status: "new",
  },
});
```

**Fields:**

- Name (required)
- Email (required, validated)
- Phone (optional)
- Company (optional)
- Status (dropdown)
- Source (dropdown)
- Notes (textarea)

---

## ImportLeadsDialog

CSV/XLSX import dialog with preview.

**Location:** `components/leads/ImportLeadsDialog.tsx`

**Features:**

- File upload (CSV/XLSX)
- Base64 encoding
- Progress feedback
- Detailed results toast

**Usage:**

```tsx
<ImportLeadsDialog onImportComplete={() => router.refresh()} />
```

**Toast Messages:**

```typescript
toast.success("Import Successful", {
  description: "Leads: 10 new, 5 updated, 2 rejected",
  duration: 10000,
});
```

---

## LeadCard

Individual lead card in Kanban column.

**Location:** `components/kanban/LeadCard.tsx`

**Props:**

```typescript
interface Props {
  lead: Lead;
  onClick: () => void;
}
```

**Features:**

- Single-click to edit
- Drag handle
- Timestamp display
- Status badge

**Display:**

- Lead name
- Email
- Company (if available)
- Relative time ("5m ago")

---

## KanbanColumn

Single column in Kanban board.

**Location:** `components/kanban/KanbanColumn.tsx`

**Props:**

```typescript
interface Props {
  status: LeadStatus;
  leads: Lead[];
  onLeadClick: (lead: Lead) => void;
}
```

**Styling:**

```tsx
<div className="min-w-[300px] flex-shrink-0">
  <SortableContext items={leads} strategy={verticalListSortingStrategy}>
    {leads.map((lead) => (
      <LeadCard key={lead.id} lead={lead} />
    ))}
  </SortableContext>
</div>
```

---

## shadcn/ui Components Used

### Button

```tsx
<Button variant="default | outline | ghost" size="default | sm | lg | icon">
  Click me
</Button>
```

### Input

```tsx
<Input
  type="text | email | number"
  placeholder="Enter value"
  {...register("fieldName")}
/>
```

### Dialog

```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
    </DialogHeader>
    {/* Content */}
  </DialogContent>
</Dialog>
```

### Select

```tsx
<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Choose..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

### Toast

```tsx
import { toast } from "sonner";

toast.success("Title", {
  description: "Message",
  duration: 10000,
});

toast.error("Error", {
  description: error.message,
  duration: 10000,
});
```

---

**Last Updated:** 2025-10-23
