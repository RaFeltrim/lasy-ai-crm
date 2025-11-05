# Supabase Setup Guide

## Step 1: Apply Database Migrations

1. Go to your Supabase project: https://qxbgltpxqhuhzyjfbcdp.supabase.co
2. Navigate to **SQL Editor** in the left sidebar
3. Run the migrations in order:

### Migration 1: Initial Schema

Copy and paste the contents of `supabase/migrations/0001_initial_schema.sql` and click **Run**.

This will create:

- Extensions (uuid-ossp)
- Enums (lead_status, interaction_type)
- Tables (profiles, leads, interactions)
- Indexes for performance
- Row Level Security (RLS) policies
- Triggers for updated_at

### Migration 2: Fix Missing Source Column

Copy and paste the contents of `supabase/migrations/0002_fix_missing_source_column.sql` and click **Run**.

This ensures the source column exists and is properly indexed.

### Migration 3: Fix Notes Column (IMPORTANT)

Copy and paste the contents of `supabase/migrations/0003_fix_notes_column.sql` and click **Run**.

This ensures the notes column is recognized by PostgREST and fixes the schema cache issue.

### Migration 4: Update Lead Status Values

Copy and paste the contents of `supabase/migrations/0004_update_lead_status_values.sql` and click **Run**.

This updates the lead status constraint to use the new values: 'new', 'contacted', 'qualified', 'pending', 'lost'.

## Step 2: Create a Test User

1. Go to **Authentication** > **Users** in Supabase dashboard
2. Click **Add user** > **Create new user**
3. Enter:
   - Email: demo@lasy.ai (or your preferred email)
   - Password: Your secure password
4. Click **Create user**

## Step 3: (Optional) Add Seed Data

If you want to populate the database with sample data:

1. Open `supabase/seed.sql`
2. Replace `'DEMO_USER_ID'` with the actual UUID of the user you created
   - You can find the UUID in **Authentication** > **Users** table
3. Run the modified seed.sql in the SQL Editor

## Step 4: Verify Setup

1. Go to **Table Editor** in Supabase
2. You should see three tables: `profiles`, `leads`, `interactions`
3. Click on each table to verify the schema matches the migration

## Troubleshooting

### RLS Error: "new row violates row-level security policy"

- Ensure you're logged in with a valid user
- Check that the user_id in your data matches auth.uid()

### Column "source" does not exist

- Run migration 0002_fix_missing_source_column.sql
- Run `NOTIFY pgrst, 'reload schema'` in SQL Editor

### Foreign key constraint error

- Make sure the user exists in auth.users before creating leads
- Verify user_id values match existing users

## API Keys

Your project is already configured with:

- URL: `https://qxbgltpxqhuhzyjfbcdp.supabase.co`
- Anon Key: Already set in `.env.local`

These are stored in your `.env.local` file and are ready to use.

## Next Steps

After completing the setup:

1. Start the development server: `npm run dev`
2. Open http://localhost:3000
3. Log in with your test user credentials
4. Start managing leads!
