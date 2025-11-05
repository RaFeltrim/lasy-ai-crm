# How-To Guides

Step-by-step guides for common tasks.

---

## 1. How to Add a New Field to Leads

**Example:** Add a "Budget" field

### Step 1: Update Database

```sql
-- In Supabase SQL Editor
ALTER TABLE leads ADD COLUMN budget DECIMAL(10,2);
```

### Step 2: Update TypeScript Type

```typescript
// lib/types.ts (or wherever Lead is defined)
export interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  budget?: number // ADD THIS
  status: LeadStatus
  source?: string
  notes?: string
  created_at: string
  updated_at: string
  user_id: string
}
```

### Step 3: Update Zod Schema

```typescript
// lib/zod-schemas.ts
export const leadSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  company: z.string().optional(),
  budget: z.number().positive().optional(), // ADD THIS
  status: z.enum(['new', 'contacted', 'qualified', 'customer', 'lost']),
  source: z.string().optional(),
  notes: z.string().optional(),
})
```

### Step 4: Update Form UI

```tsx
// components/leads/LeadEditForm.tsx
<div>
  <Label htmlFor="budget">Budget</Label>
  <Input
    id="budget"
    type="number"
    step="0.01"
    {...register('budget', { valueAsNumber: true })}
  />
  {errors.budget && (
    <p className="text-sm text-destructive">{errors.budget.message}</p>
  )}
</div>
```

### Step 5: Update Card Display (Optional)

```tsx
// components/kanban/LeadCard.tsx
{lead.budget && (
  <div className="text-sm text-muted-foreground">
    Budget: ${lead.budget.toLocaleString()}
  </div>
)}
```

### Step 6: Test

1. Create new lead with budget
2. Edit existing lead to add budget
3. Import CSV with budget column
4. Verify validation works (negative numbers rejected)

---

## 2. How to Add a New Kanban Column

**Example:** Add "Proposal Sent" status

### Step 1: Update Database Enum

```sql
-- Option A: Modify enum (requires no data in that column)
ALTER TYPE lead_status ADD VALUE 'proposal';

-- Option B: If enum doesn't exist, column is just TEXT
-- No database change needed
```

### Step 2: Update TypeScript Type

```typescript
// lib/types.ts
export type LeadStatus = 
  | 'new' 
  | 'contacted' 
  | 'proposal' // ADD THIS
  | 'qualified' 
  | 'customer' 
  | 'lost'
```

### Step 3: Update Zod Schema

```typescript
// lib/zod-schemas.ts
status: z.enum(['new', 'contacted', 'proposal', 'qualified', 'customer', 'lost']),
```

### Step 4: Add Column to UI

```tsx
// components/kanban/KanbanBoard.tsx
const columns: LeadStatus[] = [
  'new',
  'contacted',
  'proposal', // ADD THIS
  'qualified',
  'customer',
  'lost'
]

return (
  <div className="flex overflow-x-auto gap-4">
    {columns.map(status => (
      <KanbanColumn key={status} status={status} leads={getLeadsForStatus(status)} />
    ))}
  </div>
)
```

### Step 5: Add Column Label

```typescript
// lib/utils.ts or constants.ts
export const STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'New Leads',
  contacted: 'Contacted',
  proposal: 'Proposal Sent', // ADD THIS
  qualified: 'Qualified',
  customer: 'Customers',
  lost: 'Lost',
}
```

### Step 6: Update KanbanColumn

```tsx
// components/kanban/KanbanColumn.tsx
<h3 className="font-semibold">
  {STATUS_LABELS[status]} ({leads.length})
</h3>
```

---

## 3. How to Customize the Theme

### Change Primary Color

```typescript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'hsl(221, 83%, 53%)', // Your brand color
          foreground: 'hsl(0, 0%, 100%)',
        },
      },
    },
  },
}
```

### Add Dark Mode

```tsx
// app/layout.tsx
<html lang="en" className="dark"> {/* Force dark mode */}
  <body>
    {children}
  </body>
</html>

// Or add toggle
<Button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
  Toggle Theme
</Button>
```

### Customize Fonts

```typescript
// app/layout.tsx
import { Inter, Roboto } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
const roboto = Roboto({ weight: ['400', '700'], subsets: ['latin'] })

<body className={inter.className}>
  {children}
</body>
```

---

## 4. How to Enable Real-Time Updates

### Step 1: Create Subscription

```typescript
// components/DashboardClient.tsx
useEffect(() => {
  const channel = supabase
    .channel('leads-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'leads',
        filter: `user_id=eq.${user.id}`,
      },
      (payload) => {
        if (payload.eventType === 'INSERT') {
          setLeads(prev => [...prev, payload.new as Lead])
        } else if (payload.eventType === 'UPDATE') {
          setLeads(prev => prev.map(l => 
            l.id === payload.new.id ? payload.new as Lead : l
          ))
        } else if (payload.eventType === 'DELETE') {
          setLeads(prev => prev.filter(l => l.id !== payload.old.id))
        }
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}, [user.id])
```

### Step 2: Enable Realtime in Supabase

1. Go to Supabase Dashboard
2. Navigate to **Database** → **Replication**
3. Enable replication for `leads` table
4. Click **Save**

### Step 3: Test

1. Open app in two browser tabs
2. Create lead in tab 1
3. Verify it appears in tab 2 immediately

---

## 5. How to Export Leads to PDF

### Step 1: Install jsPDF

```bash
npm install jspdf jspdf-autotable
npm install -D @types/jspdf-autotable
```

### Step 2: Create Export Function

```typescript
// lib/export-pdf.ts
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export function exportLeadsToPDF(leads: Lead[]) {
  const doc = new jsPDF()
  
  doc.setFontSize(18)
  doc.text('Leads Report', 14, 20)
  
  doc.setFontSize(11)
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30)
  
  autoTable(doc, {
    startY: 40,
    head: [['Name', 'Email', 'Status', 'Created']],
    body: leads.map(lead => [
      lead.name,
      lead.email,
      lead.status,
      new Date(lead.created_at).toLocaleDateString(),
    ]),
  })
  
  doc.save('leads-report.pdf')
}
```

### Step 3: Add Export Button

```tsx
// components/leads/ExportButton.tsx
import { exportLeadsToPDF } from '@/lib/export-pdf'

export function ExportButton({ leads }: { leads: Lead[] }) {
  return (
    <Button onClick={() => exportLeadsToPDF(leads)}>
      <FileDown className="mr-2 h-4 w-4" />
      Export PDF
    </Button>
  )
}
```

---

## 6. How to Import Leads from CSV

### CSV Format

```csv
name,email,phone,company,status,source,notes
John Doe,john@example.com,+1234567890,Acme Inc,new,website,Interested in product
Jane Smith,jane@example.com,,Smith Co,contacted,referral,
```

### Import Steps

1. Click **Import** button
2. Select CSV file
3. Review preview
4. Click **Import**
5. See results: "Leads: 10 new, 5 updated, 2 rejected"

### Validation Rules

- **Name:** Required, min 1 character
- **Email:** Required, must be valid email format
- **Phone:** Optional, no validation
- **Status:** Must be one of: new, contacted, qualified, customer, lost
- **Duplicates:** Checked by email (upsert)

### Error Handling

**Invalid Email:**
```
Row 3: Invalid email format
```

**Missing Name:**
```
Row 5: Name is required
```

**Invalid Status:**
```
Row 7: Invalid status 'pending' (must be: new, contacted, qualified, customer, lost)
```

---

## 7. How to Add Custom Validation

**Example:** Require phone for "qualified" leads

```typescript
// lib/zod-schemas.ts
export const leadSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  status: z.enum(['new', 'contacted', 'qualified', 'customer', 'lost']),
}).refine(
  (data) => {
    if (data.status === 'qualified' && !data.phone) {
      return false
    }
    return true
  },
  {
    message: 'Phone is required for qualified leads',
    path: ['phone'],
  }
)
```

---

## 8. How to Debug Issues

### Check Supabase Connection

```tsx
// Add to app/api/test/route.ts
export async function GET() {
  const supabase = createClient()
  const { data, error } = await supabase.from('leads').select('count')
  return Response.json({ data, error })
}
```

Visit `/api/test` to check.

### Check RLS Policies

```sql
-- In Supabase SQL Editor
SELECT * FROM leads; -- Should only show your leads

-- Test with different user
SELECT * FROM leads WHERE user_id = 'other-user-id'; -- Should return empty
```

### Check Hydration Errors

1. Open browser DevTools
2. Go to Console
3. Look for: "Hydration failed"
4. Check component tree for SSR/CSR mismatches
5. Add `suppressHydrationWarning` where needed

---

**Last Updated:** 2025-10-23
