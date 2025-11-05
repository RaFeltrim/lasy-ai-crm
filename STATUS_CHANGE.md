# Lead Status Values Update

## What Changed

The lead status values were updated to better reflect the sales pipeline workflow.

### Old Status Values (Original)

1. `new` - New leads
2. `qualified` - Qualified leads
3. `proposal` - Proposal sent
4. `won` - Deal won
5. `lost` - Deal lost

### New Status Values (Current)

1. `new` - New leads
2. `contacted` - Initial contact made
3. `qualified` - Lead qualified
4. `pending` - Awaiting action/follow-up
5. `lost` - Deal lost

## Why the Change?

The new pipeline is more aligned with typical CRM workflows:

- **contacted**: Tracks when first contact is made
- **pending**: Useful for leads awaiting decisions or next steps
- Removed `proposal` and `won` which were less commonly used

## Database Changes Applied

```sql
-- 1. Remove old constraint
ALTER TABLE leads
DROP CONSTRAINT leads_status_check;

-- 2. Add new constraint
ALTER TABLE leads
ADD CONSTRAINT leads_status_check
CHECK (status IN ('new', 'contacted', 'qualified', 'pending', 'lost'));
```

## Code Changes Made

✅ Updated files:

- [`lib/zod-schemas.ts`](lib/zod-schemas.ts) - Zod enum updated
- [`components/kanban/KanbanBoard.tsx`](components/kanban/KanbanBoard.tsx) - Kanban columns updated
- [`app/leads/new/page.tsx`](app/leads/new/page.tsx) - Form select options updated
- [`components/leads/FiltersBar.tsx`](components/leads/FiltersBar.tsx) - Filter options updated
- [`supabase/migrations/0004_update_lead_status_values.sql`](supabase/migrations/0004_update_lead_status_values.sql) - Migration created
- [`README.md`](README.md) - Documentation updated

## Migration Status

✅ **Database**: Already applied (manually via SQL commands)
✅ **Code**: Updated to match database
✅ **Migration file**: Created for documentation (0004)

## Kanban Board Layout

The dashboard now shows 5 columns:

```
┌─────────┬───────────┬───────────┬─────────┬──────┐
│   New   │ Contacted │ Qualified │ Pending │ Lost │
└─────────┴───────────┴───────────┴─────────┴──────┘
```

## Testing

After these changes, you can:

1. ✅ Create leads with any of the 5 new status values
2. ✅ Drag leads between columns in the Kanban board
3. ✅ Filter by status in the filters bar
4. ✅ No more constraint errors

## Important Notes

- **Existing leads**: If you had leads with old status values (`proposal`, `won`), they may need to be manually updated
- **API**: All API endpoints now expect the new status values
- **Frontend**: All forms and selects use the new values
- **Validation**: Zod schemas validate against the new enum

## Rollback (If Needed)

To revert to old status values:

```sql
ALTER TABLE leads DROP CONSTRAINT leads_status_check;
ALTER TABLE leads ADD CONSTRAINT leads_status_check
CHECK (status IN ('new', 'qualified', 'proposal', 'won', 'lost'));
```

Then revert the code changes in the files listed above.
