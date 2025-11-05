# Bugs and Fixes - Complete History

Complete chronicle of all bugs encountered, diagnosis, and fixes.

---

## 📋 Bug Summary Table

| ID  | Priority | Status       | Bug                  | Location              | Fix Applied                          |
| --- | -------- | ------------ | -------------------- | --------------------- | ------------------------------------ |
| #1  | P-0      | ✅ FIXED     | Hydration Failed     | FiltersBar.tsx        | suppressHydrationWarning + useEffect |
| #2  | P-0      | ✅ FIXED     | Import Duplicates    | import/route.ts       | Email-based upsert                   |
| #3  | P-0      | ⚠️ NOT FIXED | Upsert Schema Error  | import/route.ts:79    | Remove updated_at                    |
| #4  | P-1      | ✅ FIXED     | Filters Not Working  | DashboardClient.tsx   | useEffect prop sync                  |
| #5  | P-1      | ✅ FIXED     | D&D Wrong Position   | KanbanBoard.tsx       | arrayMove in onDragOver              |
| #6  | P-1      | ⚠️ NOT FIXED | Phone Not Searchable | dashboard/page.tsx:24 | Add phone to query                   |
| #7  | P-1      | ⚠️ NOT FIXED | D&D Not Persistent   | Needs migration       | Add position column                  |

---

## 🔴 BUG #1: Hydration Failed (FIXED)

**Symptom:** `Error: Hydration failed because the initial UI does not match what was rendered on the server`

**Root Cause:** `useSearchParams()` returns different values on server vs client

**Fix Applied:**

```tsx
// FiltersBar.tsx
const [isClient, setIsClient] = useState(false);

useEffect(() => {
  setIsClient(true);
  const query = searchParams.get("query") || "";
  reset({ query });
}, [searchParams]);

return (
  <form suppressHydrationWarning>
    <Input suppressHydrationWarning {...register("query")} />
  </form>
);
```

**Files:** `components/leads/FiltersBar.tsx`

---

## 🔴 BUG #2: Import Creates Duplicates (FIXED)

**Symptom:** Importing same CSV twice creates duplicate leads

**Root Cause:** Only INSERT logic, no duplicate detection

**Fix Applied:**

```typescript
// Check if exists
const { data: existingLead } = await supabase
  .from("leads")
  .select("id")
  .eq("email", row.email)
  .single();

if (existingLead) {
  // UPDATE
  await supabase.from("leads").update(data).eq("id", existingLead.id);
  updated++;
} else {
  // INSERT
  await supabase.from("leads").insert(data);
  inserted++;
}
```

**Files:** `app/api/leads/import/route.ts`

---

## 🔴 BUG #3: Upsert Fails with Schema Error (NOT FIXED)

**Symptom:** `Could not find the 'updated_at' column in the schema cache`

**Root Cause:** Sending `updated_at` manually conflicts with database trigger

**Fix Required:**

```typescript
// Line 79 - REMOVE THIS:
updated_at: new Date().toISOString(),

// Let trigger handle it automatically
```

**Files:** `app/api/leads/import/route.ts:79`

**Identified By:** GPT-4 analysis (100% accurate diagnosis)

---

## 🟠 BUG #4: Filters Don't Update UI (FIXED)

**Symptom:** URL changes but Kanban doesn't filter until refresh

**Root Cause:** `initialLeads` prop changes not synced to local state

**Fix Applied:**

```tsx
// DashboardClient.tsx
useEffect(() => {
  setLeads(initialLeads);
}, [initialLeads]);
```

**Files:** `components/DashboardClient.tsx`

---

## 🟠 BUG #5: D&D Wrong Position (FIXED)

**Symptom:** Dragging to top moves lead to bottom

**Root Cause:** Missing `onDragOver` handler with reordering logic

**Fix Applied:**

```tsx
import { arrayMove } from "@dnd-kit/sortable";

const handleDragOver = (event: DragOverEvent) => {
  const activeIndex = localLeads.findIndex((l) => l.id === active.id);
  const overIndex = localLeads.findIndex((l) => l.id === over.id);

  setLocalLeads((leads) => arrayMove(leads, activeIndex, overIndex));
};
```

**Files:** `components/kanban/KanbanBoard.tsx`

**Note:** Visual only - doesn't persist (see Bug #7)

---

## 🟡 BUG #6: Phone Not Searchable (NOT FIXED)

**Symptom:** Searching by phone number returns no results

**Root Cause:** Phone field missing from global search query

**Fix Required:**

```typescript
// dashboard/page.tsx:24
query = query.or(`
  name.ilike.${searchQuery},
  email.ilike.${searchQuery},
  phone.ilike.${searchQuery}, // ADD THIS LINE
  company.ilike.${searchQuery}
`);
```

**Files:** `app/dashboard/page.tsx:24-36`

---

## 🟡 BUG #7: D&D Order Not Persistent (NOT FIXED)

**Symptom:** Drag reordering lost on page refresh

**Root Cause:** No `position` column in database

**Fix Required:**

**1. Migration:**

```sql
-- 0003_add_position_column.sql
ALTER TABLE leads ADD COLUMN position INT DEFAULT 0;

UPDATE leads SET position = ROW_NUMBER() OVER (PARTITION BY status ORDER BY created_at);
```

**2. Update Query:**

```typescript
.order('position', { ascending: true })
```

**3. Persist on Drag:**

```typescript
await fetch("/api/leads/reorder", {
  method: "POST",
  body: JSON.stringify({ updates: newPositions }),
});
```

**Requires:** Database migration + API endpoint + client updates

---

## 📚 Lessons Learned

### Hydration Errors

- Always defer URL param reading to `useEffect`
- Use `suppressHydrationWarning` on inputs with dynamic values
- Guard client-only operations with `isClient` flag

### Database Triggers

- Never send auto-updated columns in payloads
- Let PostgreSQL triggers handle `updated_at`, `created_at`
- PostgREST schema cache excludes auto-generated columns

### Drag and Drop

- `onDragEnd` for final position
- `onDragOver` for real-time visual feedback
- `arrayMove` for reordering arrays
- TouchSensor for mobile support

### Import/Export

- Always implement upsert for imports
- Use unique identifier (email) for deduplication
- Provide detailed feedback (X new, Y updated, Z rejected)

---

**Last Updated:** 2025-10-23
