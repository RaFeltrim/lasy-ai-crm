-- Update lead_status constraint to match new business requirements
-- Old values: 'new', 'qualified', 'proposal', 'won', 'lost'
-- New values: 'new', 'contacted', 'qualified', 'pending', 'lost'

-- 1. Drop old constraint
ALTER TABLE leads
DROP CONSTRAINT IF EXISTS leads_status_check;

-- 2. Add new constraint with updated values
ALTER TABLE leads
ADD CONSTRAINT leads_status_check 
CHECK (status IN ('new', 'contacted', 'qualified', 'pending', 'lost'));

-- 3. Update the enum type (if using enum instead of check constraint)
-- Note: This migration documents the manual change made directly in Supabase
-- The check constraint approach is simpler than recreating the enum type

-- Refresh PostgREST schema cache
NOTIFY pgrst, 'reload schema';
