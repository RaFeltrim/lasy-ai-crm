# Quick Reference Guide

Fast lookup for common tasks and issues.

---

## 🚀 Quick Setup

```bash
# 1. Install
npm install

# 2. Environment
cp .env.example .env.local
# Add your Supabase credentials

# 3. Database
# Run migrations in Supabase SQL Editor

# 4. Start
npm run dev
```

---

## 🐛 Common Fixes

### Hydration Error
```tsx
const [isClient, setIsClient] = useState(false)
useEffect(() => setIsClient(true), [])
return <form suppressHydrationWarning>
```

### Import Schema Error
```typescript
// Remove this line:
updated_at: new Date().toISOString()
```

### Filters Not Working
```tsx
useEffect(() => {
  setLeads(initialLeads)
}, [initialLeads])
```

---

## 📚 Quick Links

| Need to... | See File |
|-----------|----------|
| **Set up project** | [01-GETTING-STARTED.md](./01-GETTING-STARTED.md) |
| **Understand architecture** | [02-ARCHITECTURE.md](./02-ARCHITECTURE.md) |
| **Use API endpoints** | [03-API-REFERENCE.md](./03-API-REFERENCE.md) |
| **Work with components** | [04-COMPONENTS.md](./04-COMPONENTS.md) |
| **Modify database** | [05-DATABASE.md](./05-DATABASE.md) |
| **Fix a bug** | [06-BUGS-AND-FIXES.md](./06-BUGS-AND-FIXES.md) |
| **Add a feature** | [07-HOW-TO-GUIDES.md](./07-HOW-TO-GUIDES.md) |
| **Visualize system flow** | [08-FLOWCHARTS.md](./08-FLOWCHARTS.md) |
| **Debug an issue** | [09-TROUBLESHOOTING.md](./09-TROUBLESHOOTING.md) |
| **Optimize performance** | [10-PERFORMANCE.md](./10-PERFORMANCE.md) |
| **Deploy to production** | [11-DEPLOYMENT.md](./11-DEPLOYMENT.md) |
| **Contribute code** | [12-CONTRIBUTING.md](./12-CONTRIBUTING.md) |

---

## 🔍 Search by Topic

### Authentication
- Setup: [01-GETTING-STARTED.md](./01-GETTING-STARTED.md#-first-login)
- Flow: [08-FLOWCHARTS.md](./08-FLOWCHARTS.md#1-authentication-flow)
- Issues: [09-TROUBLESHOOTING.md](./09-TROUBLESHOOTING.md#authentication-issues)

### Drag & Drop
- Architecture: [02-ARCHITECTURE.md](./02-ARCHITECTURE.md#why-dnd-kit)
- Flow: [08-FLOWCHARTS.md](./08-FLOWCHARTS.md#3-drag-and-drop-flow)
- Bug Fix: [06-BUGS-AND-FIXES.md](./06-BUGS-AND-FIXES.md#-bug-5-dd-wrong-position-fixed)
- Issues: [09-TROUBLESHOOTING.md](./09-TROUBLESHOOTING.md#drag-and-drop-not-working)

### Import/Export
- API: [03-API-REFERENCE.md](./03-API-REFERENCE.md#importexport-endpoints)
- How-to: [07-HOW-TO-GUIDES.md](./07-HOW-TO-GUIDES.md#6-how-to-import-leads-from-csv)
- Flow: [08-FLOWCHARTS.md](./08-FLOWCHARTS.md#4-import-csv-flow)
- Bug Fix: [06-BUGS-AND-FIXES.md](./06-BUGS-AND-FIXES.md#-bug-2-import-creates-duplicates-fixed)

### Database
- Schema: [05-DATABASE.md](./05-DATABASE.md#schema-overview)
- RLS: [05-DATABASE.md](./05-DATABASE.md#row-level-security-rls)
- Migrations: [05-DATABASE.md](./05-DATABASE.md#migrations)

### Performance
- Metrics: [10-PERFORMANCE.md](./10-PERFORMANCE.md#current-performance-metrics)
- Optimizations: [10-PERFORMANCE.md](./10-PERFORMANCE.md#optimization-techniques-applied)

---

## ⚠️ Known Issues (NOT FIXED)

| Priority | Issue | File | Line |
|----------|-------|------|------|
| P-0 | Import upsert schema error | `import/route.ts` | 79 |
| P-1 | Phone not in search | `dashboard/page.tsx` | 24 |
| P-1 | D&D order not persistent | Needs migration | - |
| P-2 | Mobile header cramped | `dashboard/page.tsx` | - |

See [06-BUGS-AND-FIXES.md](./06-BUGS-AND-FIXES.md) for details.

---

## 📊 Tech Stack at a Glance

```
Frontend:
├─ Next.js 14.2.33 (App Router)
├─ React 18.3.1 (Server Components)
├─ TypeScript 5.x
├─ Tailwind CSS 3.4.1
├─ shadcn/ui
└─ @dnd-kit 6.1.0

Backend:
├─ Next.js API Routes
├─ Supabase (PostgreSQL + Auth)
└─ @supabase/ssr 0.5.2

Testing:
├─ Vitest (unit)
└─ Playwright (e2e)
```

---

## 🎯 For AI Assistants

**Before answering questions:**
1. Check [06-BUGS-AND-FIXES.md](./06-BUGS-AND-FIXES.md) for known issues
2. Review [02-ARCHITECTURE.md](./02-ARCHITECTURE.md) for design decisions
3. Consult [08-FLOWCHARTS.md](./08-FLOWCHARTS.md) for visual understanding

**When suggesting changes:**
1. Check existing patterns in [04-COMPONENTS.md](./04-COMPONENTS.md)
2. Follow standards in [12-CONTRIBUTING.md](./12-CONTRIBUTING.md)
3. Consider performance impact from [10-PERFORMANCE.md](./10-PERFORMANCE.md)

**Complete context in:**
- Full project history → [README.md](./README.md)
- All bugs encountered → [06-BUGS-AND-FIXES.md](./06-BUGS-AND-FIXES.md)
- System architecture → [02-ARCHITECTURE.md](./02-ARCHITECTURE.md)

---

**Last Updated:** 2025-10-23  
**Documentation Version:** 1.0.0
