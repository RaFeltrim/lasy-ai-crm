# Getting Started with Lasy CRM

This guide will help you set up and run Lasy CRM on your local machine.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.17.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher (comes with Node.js)
- **Git**: For cloning the repository
- **Supabase Account**: Free tier is sufficient ([supabase.com](https://supabase.com))

---

## 🚀 Quick Start (5 Minutes)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd "Nova pasta"
```

### 2. Install Dependencies

```bash
npm install
```

This will install all dependencies with **exact versions** specified in `package.json`:
- Next.js 14.2.33
- React 18.3.1
- Supabase SSR 0.5.2
- @dnd-kit 6.1.0
- And 50+ other packages

### 3. Set Up Environment Variables

Create a `.env.local` file in the project root:

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Where to find these values:**
1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
4. Copy **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4. Set Up Database

Run the migrations in Supabase SQL Editor:

```bash
# Copy the SQL from:
cat supabase/migrations/0001_initial_schema.sql
cat supabase/migrations/0002_fix_missing_source_column.sql
```

**Steps:**
1. Open Supabase dashboard → **SQL Editor**
2. Create a new query
3. Paste the contents of `0001_initial_schema.sql`
4. Click **Run**
5. Repeat for `0002_fix_missing_source_column.sql`

**Optional - Add sample data:**
```bash
cat supabase/seed.sql
```
Paste and run in SQL Editor to create 50 sample leads.

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 First Login

### Default Credentials (if using seed.sql)

**Email**: `admin@example.com`  
**Password**: `admin123`

### Create Your Own Account

1. Navigate to `/login`
2. Click **Sign Up** (if enabled)
3. Or create user manually in Supabase:
   ```sql
   -- In Supabase SQL Editor
   INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
   VALUES ('your@email.com', crypt('your-password', gen_salt('bf')), now());
   ```

---

## 📁 Project Structure

```
Nova pasta/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   └── leads/            # Lead CRUD + import/export
│   ├── dashboard/            # Main dashboard page
│   ├── leads/[id]/           # Lead detail page
│   └── login/                # Authentication page
├── components/               # React components
│   ├── kanban/               # Kanban board components
│   ├── leads/                # Lead-related components
│   └── ui/                   # shadcn/ui components
├── lib/                      # Utilities and configs
│   ├── supabase-server.ts    # Supabase SSR client
│   ├── utils.ts              # Utility functions
│   └── zod-schemas.ts        # Validation schemas
├── supabase/                 # Database migrations
│   └── migrations/           # SQL migration files
├── __tests__/                # Test files
│   ├── unit/                 # Vitest unit tests
│   └── e2e/                  # Playwright E2E tests
└── Crm-Documentation/        # This documentation
```

---

## 🛠️ Available Scripts

### Development

```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Create production build
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Testing

```bash
npm run test              # Run Vitest unit tests
npm run test:ui           # Run Vitest with UI
npm run test:e2e          # Run Playwright E2E tests
npm run test:e2e:ui       # Run Playwright with UI
```

### Database

```bash
# No CLI tools yet - use Supabase dashboard SQL Editor
# Future: supabase db push, supabase db reset
```

---

## 🔧 Configuration Files

### next.config.js
```javascript
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['your-project.supabase.co'], // For Supabase Storage
  },
}
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]  // Absolute imports from root
    }
  }
}
```

### tailwind.config.ts
- Uses shadcn/ui design tokens
- Custom animations and utilities
- Dark mode support (class-based)

---

## 🐛 Common Setup Issues

### Issue 1: "Module not found" errors

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue 2: Supabase connection fails

**Check:**
1. `.env.local` file exists in project root (not in subdirectory)
2. Environment variables have correct values (no quotes, no spaces)
3. Supabase project is active (not paused)

**Test connection:**
```bash
# Add to app/api/test/route.ts
import { createClient } from '@/lib/supabase-server'

export async function GET() {
  const supabase = createClient()
  const { data, error } = await supabase.from('leads').select('count')
  return Response.json({ data, error })
}
```
Visit `/api/test` to check.

### Issue 3: Hydration errors in console

**This is normal during development** if you see:
```
Warning: Expected server HTML to contain...
```

We've fixed all critical hydration errors. If you see new ones:
1. Check [06-BUGS-AND-FIXES.md](./06-BUGS-AND-FIXES.md#bug-1-hydration-failed)
2. Apply `suppressHydrationWarning` pattern
3. Ensure useSearchParams() is only used client-side

### Issue 4: Drag-and-drop not working

**Check:**
1. You're using touch device → TouchSensor is enabled
2. Browser supports Pointer Events
3. No console errors related to @dnd-kit

**Fix:**
```bash
npm install @dnd-kit/core@6.1.0 @dnd-kit/sortable@8.0.0 --save-exact
```

---

## 📱 Mobile Development

### Testing on Mobile Device

1. Find your local IP:
   ```bash
   # Windows
   ipconfig
   # Look for "IPv4 Address" (e.g., 192.168.1.100)
   ```

2. Update `next.config.js`:
   ```javascript
   module.exports = {
     // Add this for mobile testing
     experimental: {
       allowMiddlewareResponseBody: true
     }
   }
   ```

3. Start dev server:
   ```bash
   npm run dev -- -H 0.0.0.0
   ```

4. Visit on mobile: `http://192.168.1.100:3000`

---

## 🎯 Next Steps

After setup is complete:

1. **Explore the UI**: Navigate to `/dashboard` and familiarize yourself with the Kanban board
2. **Try Drag & Drop**: Move leads between columns
3. **Test Filters**: Use search and status filters
4. **Import Data**: Upload a CSV file (see [07-HOW-TO-GUIDES.md](./07-HOW-TO-GUIDES.md#6-how-to-import-leads))
5. **Read Architecture**: Understand how everything works in [02-ARCHITECTURE.md](./02-ARCHITECTURE.md)

---

## 🆘 Need Help?

- **Setup Issues**: See [09-TROUBLESHOOTING.md](./09-TROUBLESHOOTING.md)
- **Understanding Code**: See [02-ARCHITECTURE.md](./02-ARCHITECTURE.md)
- **Known Bugs**: See [06-BUGS-AND-FIXES.md](./06-BUGS-AND-FIXES.md)

---

**Last Updated**: 2025-10-23  
**Tested On**: Node.js v20.11.0, npm v10.2.4, Windows 24H2
