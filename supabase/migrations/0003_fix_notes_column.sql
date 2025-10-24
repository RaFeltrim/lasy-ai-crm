-- Ensure notes column exists in leads table
ALTER TABLE leads ADD COLUMN IF NOT EXISTS notes TEXT;

-- Refresh PostgREST schema cache
NOTIFY pgrst, 'reload schema';
