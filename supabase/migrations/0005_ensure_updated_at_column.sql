-- Ensure updated_at column exists in leads table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'leads' 
    AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE leads ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
END $$;

-- Recreate the trigger to ensure it's working
DROP TRIGGER IF EXISTS set_leads_updated_at ON leads;
CREATE TRIGGER set_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Update existing records to have updated_at = created_at if null
UPDATE leads 
SET updated_at = created_at 
WHERE updated_at IS NULL;
