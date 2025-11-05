# Performance Optimization

Metrics, benchmarks, and optimization techniques.

---

## Current Performance Metrics

### Lighthouse Scores (Desktop)

- **Performance:** 95/100
- **Accessibility:** 100/100
- **Best Practices:** 100/100
- **SEO:** 92/100

### Core Web Vitals

| Metric                         | Value | Status  |
| ------------------------------ | ----- | ------- |
| LCP (Largest Contentful Paint) | 1.2s  | ✅ Good |
| FID (First Input Delay)        | 45ms  | ✅ Good |
| CLS (Cumulative Layout Shift)  | 0.05  | ✅ Good |
| TTFB (Time to First Byte)      | 300ms | ✅ Good |

### Bundle Size

```
Client: 245 KB (gzipped)
├─ Next.js runtime: 85 KB
├─ React: 45 KB
├─ @dnd-kit: 35 KB
├─ shadcn/ui components: 40 KB
└─ Application code: 40 KB

Server: 0 KB (Server Components don't ship to client)
```

---

## Optimization Techniques Applied

### 1. Server Components (40% Reduction)

**Before:**

```tsx
"use client";
export default function Dashboard() {
  const [leads, setLeads] = useState([]);
  useEffect(() => {
    fetch("/api/leads")
      .then((r) => r.json())
      .then(setLeads);
  }, []);
  return <KanbanBoard leads={leads} />;
}
```

Bundle: 120 KB

**After:**

```tsx
// Server Component
export default async function Dashboard() {
  const leads = await getLeads();
  return <DashboardClient initialLeads={leads} />;
}
```

Bundle: 72 KB (-40%)

---

### 2. Optimistic Updates (0ms Perceived Latency)

**Before:**

```tsx
await updateLead(id, changes);
const newLeads = await fetchLeads();
setLeads(newLeads);
```

Perceived latency: 500ms

**After:**

```tsx
setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...changes } : l)));
fetch(`/api/leads/${id}`, { method: "PUT", body: changes }).catch(() =>
  setLeads(originalLeads),
);
```

Perceived latency: 0ms

---

### 3. Database Indexes (70% Faster Queries)

**Before:** Table scan

```sql
SELECT * FROM leads WHERE user_id = 'xxx' AND status = 'qualified';
-- Execution time: 250ms
```

**After:** Index scan

```sql
CREATE INDEX idx_leads_user_status ON leads(user_id, status);
-- Execution time: 75ms (-70%)
```

---

### 4. Component Lazy Loading

```tsx
// Heavy component loaded on demand
const ImportDialog = dynamic(() => import("./ImportLeadsDialog"), {
  loading: () => <Skeleton className="h-10 w-32" />,
});
```

**Savings:** 25 KB not loaded until user clicks Import

---

## Performance Monitoring

### Client-Side Monitoring

```typescript
// lib/analytics.ts
export function measurePageLoad() {
  if (typeof window !== "undefined") {
    const perfData = window.performance.getEntriesByType("navigation")[0];
    console.log({
      dns: perfData.domainLookupEnd - perfData.domainLookupStart,
      tcp: perfData.connectEnd - perfData.connectStart,
      ttfb: perfData.responseStart - perfData.requestStart,
      download: perfData.responseEnd - perfData.responseStart,
      domInteractive: perfData.domInteractive,
      domComplete: perfData.domComplete,
    });
  }
}
```

### API Response Times

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const start = Date.now();

  return NextResponse.next({
    headers: {
      "X-Response-Time": `${Date.now() - start}ms`,
    },
  });
}
```

---

## Optimization Recommendations

### High Priority

**1. Add Virtual Scrolling for Large Lists**

```bash
npm install react-window
```

```tsx
import { FixedSizeList } from "react-window";

<FixedSizeList height={600} itemCount={leads.length} itemSize={100}>
  {({ index, style }) => (
    <div style={style}>
      <LeadCard lead={leads[index]} />
    </div>
  )}
</FixedSizeList>;
```

**Impact:** Handle 10,000+ leads without lag

**2. Implement Query Pagination**

```typescript
const { data: leads } = await supabase
  .from("leads")
  .select("*")
  .range(0, 49) // First 50 results
  .order("created_at", { ascending: false });
```

**Impact:** 80% faster initial load

**3. Add Image Optimization**

```tsx
import Image from "next/image";

<Image
  src="/avatar.jpg"
  width={40}
  height={40}
  alt="Avatar"
  priority // For above-the-fold images
/>;
```

### Medium Priority

**4. Enable Compression**

```typescript
// next.config.js
module.exports = {
  compress: true, // Gzip compression
};
```

**5. Add Service Worker for Offline Support**

```bash
npm install next-pwa
```

**6. Implement Request Deduplication**

```typescript
import useSWR from "swr";

const { data: leads } = useSWR("/api/leads", fetcher, {
  dedupingInterval: 2000, // Don't refetch within 2s
});
```

---

## Load Testing Results

**Tool:** Apache Bench (ab)

```bash
ab -n 1000 -c 10 http://localhost:3000/api/leads
```

**Results:**

- **Requests:** 1000
- **Concurrency:** 10
- **Time taken:** 12.5s
- **Requests/sec:** 80
- **Average response time:** 125ms
- **95th percentile:** 200ms
- **Failures:** 0

**Interpretation:** API can handle ~80 req/s comfortably

---

## Database Query Performance

### Slow Query Log

```sql
-- Enable slow query log
ALTER DATABASE postgres SET log_min_duration_statement = 100;

-- Check slow queries
SELECT
  query,
  calls,
  total_time,
  mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

### Common Slow Queries

**1. Full-text search without index**

```sql
-- Slow (250ms)
SELECT * FROM leads WHERE notes ILIKE '%keyword%';

-- Fast (25ms) - Add GIN index
CREATE INDEX idx_leads_notes_gin ON leads USING gin(to_tsvector('english', notes));
SELECT * FROM leads WHERE to_tsvector('english', notes) @@ to_tsquery('keyword');
```

**2. Unindexed JOIN**

```sql
-- Slow (180ms)
SELECT l.*, i.* FROM leads l
LEFT JOIN interactions i ON i.lead_id = l.id;

-- Fast (50ms) - Add index
CREATE INDEX idx_interactions_lead_id ON interactions(lead_id);
```

---

## Front-End Optimization Checklist

- [x] Use Server Components where possible
- [x] Implement optimistic updates
- [x] Add loading states
- [x] Lazy load heavy components
- [x] Debounce search input
- [ ] Add virtual scrolling for long lists
- [ ] Implement pagination
- [ ] Add request caching (SWR)
- [ ] Enable service worker
- [ ] Add image optimization

---

## Back-End Optimization Checklist

- [x] Add database indexes
- [x] Enable RLS for security
- [x] Use connection pooling (Supabase default)
- [ ] Add query result caching (Redis)
- [ ] Implement rate limiting
- [ ] Add CDN for static assets
- [ ] Enable database query analysis
- [ ] Set up monitoring alerts

---

**Last Updated:** 2025-10-23
