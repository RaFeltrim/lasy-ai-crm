# Database Schema & Configuration

Complete database documentation for Supabase PostgreSQL.

---

## Schema Overview

```sql
-- Leads table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  source TEXT DEFAULT 'manual',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Interactions table
CREATE TABLE interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);
```

---

## Row-Level Security (RLS)

### Leads Table Policies

```sql
-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- SELECT: Users can only see their own leads
CREATE POLICY "Users can view own leads"
ON leads FOR SELECT
USING (auth.uid() = user_id);

-- INSERT: Users can only create leads for themselves
CREATE POLICY "Users can insert own leads"
ON leads FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can only update their own leads
CREATE POLICY "Users can update own leads"
ON leads FOR UPDATE
USING (auth.uid() = user_id);

-- DELETE: Users can only delete their own leads
CREATE POLICY "Users can delete own leads"
ON leads FOR DELETE
USING (auth.uid() = user_id);
```

### Interactions Table Policies

```sql
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;

-- SELECT: Users can view interactions for their leads
CREATE POLICY "Users can view own interactions"
ON interactions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM leads
    WHERE leads.id = interactions.lead_id
    AND leads.user_id = auth.uid()
  )
);

-- INSERT: Users can create interactions for their leads
CREATE POLICY "Users can insert own interactions"
ON interactions FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM leads
    WHERE leads.id = interactions.lead_id
    AND leads.user_id = auth.uid()
  )
);
```

---

## Database Triggers

### Auto-Update Timestamp

```sql
-- Function to update updated_at column
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on leads table
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON leads
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();
```

**Important:** Never send `updated_at` in UPDATE payloads - let the trigger handle it.

---

## Indexes

```sql
-- Performance indexes
CREATE INDEX idx_leads_user_id ON leads(user_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_interactions_lead_id ON interactions(lead_id);

-- Composite index for common query
CREATE INDEX idx_leads_user_status ON leads(user_id, status);
```

---

## Migrations

### 0001_initial_schema.sql

Creates tables, RLS policies, and triggers.

**Run in Supabase SQL Editor:**
```bash
cat supabase/migrations/0001_initial_schema.sql
# Copy and paste into Supabase dashboard
```

### 0002_fix_missing_source_column.sql

Adds source column and default value.

```sql
ALTER TABLE leads ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'manual';
```

### Future: 0003_add_position_column.sql

For persistent drag-and-drop ordering.

```sql
ALTER TABLE leads ADD COLUMN position INT DEFAULT 0;

-- Set initial positions
WITH numbered AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (PARTITION BY user_id, status ORDER BY created_at DESC) as pos
  FROM leads
)
UPDATE leads
SET position = numbered.pos
FROM numbered
WHERE leads.id = numbered.id;

-- Add index
CREATE INDEX idx_leads_position ON leads(position);
```

---

## Seed Data

```sql
-- Insert sample user (if not using Supabase Auth UI)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
VALUES (
  'user-uuid-here',
  'admin@example.com',
  crypt('admin123', gen_salt('bf')),
  NOW()
);

-- Insert sample leads
INSERT INTO leads (name, email, phone, company, status, source, user_id)
VALUES
  ('John Doe', 'john@example.com', '+1234567890', 'Acme Inc', 'new', 'website', 'user-uuid-here'),
  ('Jane Smith', 'jane@example.com', '+0987654321', 'Tech Corp', 'qualified', 'referral', 'user-uuid-here'),
  ('Bob Johnson', 'bob@example.com', NULL, 'StartupXYZ', 'contacted', 'linkedin', 'user-uuid-here');
```

---

## Query Examples

### Get Filtered Leads

```sql
SELECT * FROM leads
WHERE user_id = auth.uid()
AND status = 'qualified'
AND (
  name ILIKE '%john%'
  OR email ILIKE '%john%'
  OR company ILIKE '%john%'
)
ORDER BY created_at DESC;
```

### Get Lead with Interactions

```sql
SELECT 
  l.*,
  json_agg(i.*) AS interactions
FROM leads l
LEFT JOIN interactions i ON i.lead_id = l.id
WHERE l.id = 'lead-uuid'
AND l.user_id = auth.uid()
GROUP BY l.id;
```

### Count Leads by Status

```sql
SELECT 
  status,
  COUNT(*) as count
FROM leads
WHERE user_id = auth.uid()
GROUP BY status;
```

---

## Backup & Restore

### Backup (via Supabase Dashboard)

1. Go to **Settings** → **Database**
2. Click **Backup Now**
3. Download backup file

### Restore (via Supabase CLI)

```bash
supabase db restore backup-file.sql
```

---

## Performance Tips

1. **Use Indexes:** All common query columns indexed
2. **Limit Results:** Use pagination for large datasets
3. **Avoid N+1:** Use joins instead of multiple queries
4. **Cache Results:** Consider Redis for frequently accessed data
5. **Monitor Slow Queries:** Use `pg_stat_statements`

---

**Last Updated:** 2025-10-23
