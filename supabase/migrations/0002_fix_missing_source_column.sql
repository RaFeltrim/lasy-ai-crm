-- Ensure source column exists (in case it was missing)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS source TEXT;

-- Create index if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
