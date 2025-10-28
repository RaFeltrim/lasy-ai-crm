# Netlify Environment Variables Setup

## Required Environment Variables

Add these environment variables to your Netlify site to fix the build errors:

### In Netlify Dashboard:
1. Go to: **Site settings → Build & deploy → Environment → Environment variables**
2. Click **Add variables**
3. Add the following:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Where to find these values:
- Go to your Supabase project dashboard
- Navigate to **Settings → API**
- Copy:
  - **Project URL** → use for `NEXT_PUBLIC_SUPABASE_URL`
  - **anon/public key** → use for `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## What was fixed in the code:

All API routes now have these exports at the top:
```typescript
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
```

This ensures:
- Routes are not statically exported (they need runtime features like cookies)
- Routes run in Node.js runtime (not Edge) since Supabase uses Node APIs

### Files updated:
- ✅ `app/api/leads/route.ts`
- ✅ `app/api/leads/[id]/route.ts`
- ✅ `app/api/leads/[id]/interactions/route.ts`
- ✅ `app/api/leads/import/route.ts`
- ✅ `app/api/leads/export.csv/route.ts`
- ✅ `app/api/leads/export.xlsx/route.ts`

## Next steps:
1. Add the environment variables to Netlify
2. Commit and push these code changes
3. Redeploy on Netlify

The build should now succeed!
