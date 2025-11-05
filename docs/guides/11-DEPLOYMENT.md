# Deployment Guide

How to deploy Lasy CRM to production.

---

## Vercel Deployment (Recommended)

### Prerequisites

- GitHub account
- Vercel account (free tier is fine)
- Supabase project

### Steps

**1. Push to GitHub**

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/lasy-crm.git
git push -u origin main
```

**2. Connect Vercel**

1. Go to [vercel.com](https://vercel.com)
2. Click **Import Project**
3. Select your GitHub repository
4. Click **Import**

**3. Configure Environment Variables**

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
```

**4. Deploy**

- Click **Deploy**
- Wait 2-3 minutes
- Visit your production URL

**5. Set Up Custom Domain (Optional)**

1. Go to **Settings** → **Domains**
2. Add your domain
3. Update DNS records as shown

---

## Self-Hosted Deployment

### Docker Setup

**1. Create Dockerfile**

```dockerfile
FROM node:20-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

**2. Update next.config.js**

```javascript
module.exports = {
  output: "standalone",
};
```

**3. Build and Run**

```bash
docker build -t lasy-crm .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx... \
  lasy-crm
```

---

## Environment Variables

### Required

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
```

### Optional

```bash
# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Error Tracking
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx

# Feature Flags
NEXT_PUBLIC_ENABLE_EXPORTS=true
NEXT_PUBLIC_ENABLE_REALTIME=false
```

---

## Production Checklist

### Pre-Deployment

- [ ] Run all tests (`npm run test && npm run test:e2e`)
- [ ] Build locally (`npm run build`)
- [ ] Check for TypeScript errors (`npm run lint`)
- [ ] Review environment variables
- [ ] Update database migrations in Supabase
- [ ] Test with production Supabase instance

### Post-Deployment

- [ ] Verify app loads correctly
- [ ] Test authentication flow
- [ ] Test CRUD operations
- [ ] Test import/export
- [ ] Test drag-and-drop
- [ ] Check mobile responsiveness
- [ ] Monitor error logs
- [ ] Set up uptime monitoring

---

## Database Migration

### Run Migrations in Production

**Option 1: Supabase Dashboard**

1. Go to Supabase → SQL Editor
2. Copy migration SQL
3. Run in production project

**Option 2: Supabase CLI**

```bash
# Install CLI
npm install -g supabase

# Link to project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

### Migration Strategy

**1. Backward-compatible changes first**

```sql
-- Good: Add nullable column
ALTER TABLE leads ADD COLUMN new_field TEXT;

-- Bad: Add required column (breaks old code)
ALTER TABLE leads ADD COLUMN new_field TEXT NOT NULL;
```

**2. Deploy code that works with both schemas**

```typescript
// Handle both old and new schema
const value = lead.new_field || lead.old_field;
```

**3. Apply non-backward-compatible changes**

```sql
-- Now safe to make required
ALTER TABLE leads ALTER COLUMN new_field SET NOT NULL;
ALTER TABLE leads DROP COLUMN old_field;
```

---

## Monitoring

### Vercel Analytics

**Enable in Vercel Dashboard:**

1. Go to **Analytics**
2. Click **Enable**
3. View real-time metrics

**Metrics tracked:**

- Page views
- Unique visitors
- Top pages
- Referrers
- Countries

### Error Tracking with Sentry

**1. Install Sentry**

```bash
npm install @sentry/nextjs
```

**2. Configure**

```bash
npx @sentry/wizard@latest -i nextjs
```

**3. Add DSN to .env**

```
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
```

**4. Wrap API routes**

```typescript
// app/api/leads/route.ts
import * as Sentry from "@sentry/nextjs";

export async function GET() {
  try {
    const leads = await getLeads();
    return Response.json(leads);
  } catch (error) {
    Sentry.captureException(error);
    return Response.json({ error: "Internal error" }, { status: 500 });
  }
}
```

---

## Scaling Considerations

### Vertical Scaling

**Increase Vercel resources:**

- Upgrade to Pro plan ($20/mo)
- Increase function memory (1024 MB → 3009 MB)
- Increase function timeout (10s → 60s)

### Horizontal Scaling

**Supabase scaling:**

- Free tier: 500 MB database, 2 GB bandwidth
- Pro tier ($25/mo): 8 GB database, 50 GB bandwidth
- Pay-as-you-go: Unlimited

**Caching layer:**

- Add Redis for query results
- Use Vercel Edge Config for feature flags
- Implement CDN for static assets

---

## Backup Strategy

### Database Backups

**Automatic (Supabase Pro):**

- Daily backups for 7 days
- Point-in-time recovery

**Manual:**

```bash
supabase db dump > backup-$(date +%Y%m%d).sql
```

### Code Backups

- Git repository (GitHub, GitLab)
- Tag releases: `git tag v1.0.0`
- Keep deployment history in Vercel

---

## Rollback Procedure

**Vercel Instant Rollback:**

1. Go to **Deployments**
2. Find previous working deployment
3. Click **...** → **Promote to Production**
4. Confirm rollback

**Database Rollback:**

```bash
# Restore from backup
supabase db restore backup-20250117.sql
```

---

## Security Hardening

### Environment Variables

- ✅ Use Vercel environment variables (encrypted)
- ❌ Never commit `.env.local` to git
- ✅ Rotate keys regularly
- ❌ Don't use service role key in client

### Headers

```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};
```

### Rate Limiting

```typescript
// middleware.ts
import { Ratelimit } from "@upstash/ratelimit";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
});

export async function middleware(request: NextRequest) {
  const ip = request.ip ?? "127.0.0.1";
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return new Response("Too many requests", { status: 429 });
  }

  return NextResponse.next();
}
```

---

**Last Updated:** 2025-10-23
