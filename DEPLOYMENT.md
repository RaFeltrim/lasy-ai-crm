# Deployment Guide

## Quick Deploy to Vercel

1. **Push to GitHub** (already done)

   ```bash
   git push -u origin master
   ```

2. **Import to Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository: `RaFeltrim/Nova-pasta`

3. **Configure Environment Variables**

   In Vercel project settings, add:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://qxbgltpxqhuhzyjfbcdp.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4YmdsdHB4cWh1aHp5amZiY2RwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDc3MDM3MSwiZXhwIjoyMDc2MzQ2MzcxfQ.MIpiv8UrBTtba3pJXlxVLbqRCeD4SuMYGb3DwOjWA5U
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `your-project.vercel.app`

## Deploy to Netlify

1. **Connect Repository**
   - Go to https://netlify.com
   - Click "New site from Git"
   - Select your repository

2. **Build Settings**

   ```
   Build command: npm run build
   Publish directory: .next
   ```

3. **Environment Variables**
   Add the same env vars as Vercel

4. **Deploy**

## Local Production Build

Test production build locally:

```bash
npm run build
npm run start
```

The app will run on http://localhost:3000

## Performance Optimization

The app is already optimized with:

- ✅ Server-side rendering (SSR)
- ✅ Static page generation where possible
- ✅ Image optimization
- ✅ Code splitting
- ✅ CSS optimization with TailwindCSS
- ✅ Database indexes on all queries

## Monitoring

After deployment, monitor:

- Vercel Analytics (automatic)
- Supabase Dashboard > Logs
- Error tracking (Sentry recommended)

## Scaling

The application is ready to scale:

- Supabase handles auto-scaling
- Vercel/Netlify edge functions
- Global CDN distribution
- Optimistic UI updates reduce server load
