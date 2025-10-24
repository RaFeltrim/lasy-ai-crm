-- Seed data for demo user: demo@lasy.ai
-- Note: User must be created in Supabase Auth first

-- Insert demo leads (assuming user_id exists in auth.users)
-- Replace 'DEMO_USER_ID' with actual UUID after creating the user

-- Example seed (uncomment and replace with actual user_id):
/*
INSERT INTO leads (user_id, name, email, phone, company, status, source, notes)
VALUES
  ('DEMO_USER_ID', 'John Smith', 'john.smith@example.com', '+1-555-0101', 'Acme Corp', 'new', 'website', 'Interested in enterprise plan'),
  ('DEMO_USER_ID', 'Sarah Johnson', 'sarah.j@techstart.io', '+1-555-0102', 'TechStart', 'qualified', 'referral', 'Referred by existing customer'),
  ('DEMO_USER_ID', 'Michael Brown', 'mbrown@innovate.com', '+1-555-0103', 'Innovate Inc', 'proposal', 'linkedin', 'Sent proposal on 2024-01-15'),
  ('DEMO_USER_ID', 'Emily Davis', 'emily.davis@globalco.com', '+1-555-0104', 'Global Co', 'won', 'cold_call', 'Deal closed successfully'),
  ('DEMO_USER_ID', 'David Wilson', 'dwilson@startup.io', '+1-555-0105', 'Startup IO', 'lost', 'email_campaign', 'Budget constraints');

INSERT INTO interactions (lead_id, user_id, type, content, occurred_at)
SELECT 
  l.id,
  'DEMO_USER_ID',
  'call',
  'Initial discovery call - discussed requirements',
  NOW() - INTERVAL '2 days'
FROM leads l
WHERE l.name = 'John Smith' AND l.user_id = 'DEMO_USER_ID';
*/
