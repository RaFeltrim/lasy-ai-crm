# Troubleshooting Guide

Common problems and solutions.

---

## Hydration Errors

### Symptom

```
Error: Hydration failed because the initial UI does not match what was rendered on the server
```

### Solution

**Step 1:** Identify the component

- Check browser console for component name
- Look for "Warning: Expected server HTML to contain..."

**Step 2:** Check for SSR/CSR mismatches
Common causes:

- `useSearchParams()` before hydration
- `localStorage` access during render
- `Date.now()` or `Math.random()` in JSX
- Browser-only APIs (window, document)

**Step 3:** Apply fix

```tsx
// Option A: Defer to useEffect
const [isClient, setIsClient] = useState(false)
useEffect(() => setIsClient(true), [])

// Option B: suppressHydrationWarning
<div suppressHydrationWarning>
  {typeof window !== 'undefined' && localStorage.getItem('key')}
</div>

// Option C: Dynamic import with ssr: false
const Component = dynamic(() => import('./Component'), { ssr: false })
```

---

## Import Fails

### Symptom

"Could not find the 'updated_at' column in the schema cache"

### Solution

**Remove `updated_at` from UPDATE payloads:**

```typescript
// ❌ BAD
await supabase.from("leads").update({
  name: "John",
  updated_at: new Date().toISOString(), // REMOVE THIS
});

// ✅ GOOD
await supabase.from("leads").update({
  name: "John",
  // Let trigger handle updated_at
});
```

---

## Drag-and-Drop Not Working

### Symptom

- Can't drag on mobile
- Drag starts but doesn't drop
- Cards jump around

### Solutions

**Mobile: Add TouchSensor**

```tsx
const sensors = useSensors(
  useSensor(PointerSensor),
  useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 5 },
  }),
);
```

**Collision: Use closestCorners**

```tsx
<DndContext collisionDetection={closestCorners}>
```

**Overflow: Check parent container**

```tsx
// Parent needs overflow visible
<div className="overflow-visible">
  <DndContext>...</DndContext>
</div>
```

---

## Filters Not Updating

### Symptom

- Type in search → URL changes → UI doesn't update

### Solution

**Sync initialLeads prop to state:**

```tsx
const [leads, setLeads] = useState(initialLeads);

useEffect(() => {
  setLeads(initialLeads);
}, [initialLeads]);
```

---

## Authentication Issues

### Symptom

- "Unauthorized" on every request
- Cookie not set
- Redirect loop

### Solutions

**Check cookie domain:**

```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [{ key: "Access-Control-Allow-Credentials", value: "true" }],
      },
    ];
  },
};
```

**Check middleware:**

```typescript
// middleware.ts
export const config = {
  matcher: ["/dashboard/:path*", "/leads/:path*"],
};
```

**Check Supabase URL:**

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co # Must match project
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx... # Must be anon key, not service role
```

---

## Database Connection Fails

### Symptom

- "Failed to connect to Supabase"
- Empty responses
- Timeout errors

### Solutions

**Check environment variables:**

```bash
# Print to verify
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

**Check Supabase project status:**

1. Go to dashboard
2. Check for "Paused" status
3. Click "Restore" if paused

**Test connection:**

```typescript
// app/api/test/route.ts
export async function GET() {
  const supabase = createClient();
  const { data, error } = await supabase.from("leads").select("count");
  return Response.json({ data, error });
}
```

---

## Build Errors

### Symptom

```
Type error: Property 'X' does not exist on type 'Y'
```

### Solutions

**Update types:**

```typescript
// Add to lib/types.ts
export interface Lead {
  // ... existing fields
  newField?: string; // Add new field
}
```

**Check imports:**

```typescript
// Use absolute imports
import { Lead } from "@/lib/types"; // ✅
import { Lead } from "../../../lib/types"; // ❌
```

**Clear cache:**

```bash
rm -rf .next
npm run build
```

---

## Performance Issues

### Symptom

- Slow page loads
- Laggy drag-and-drop
- High memory usage

### Solutions

**Enable React DevTools Profiler:**

1. Open DevTools → Profiler
2. Click Record
3. Perform slow action
4. Stop recording
5. Look for long render times

**Optimize queries:**

```typescript
// ❌ BAD: N+1 query
for (const lead of leads) {
  const interactions = await getInteractions(lead.id);
}

// ✅ GOOD: Single query with join
const leadsWithInteractions = await supabase
  .from("leads")
  .select("*, interactions(*)");
```

**Memoize expensive calculations:**

```typescript
const sortedLeads = useMemo(
  () => leads.sort((a, b) => a.name.localeCompare(b.name)),
  [leads],
);
```

---

## Decision Tree: Import Not Working

```
Import fails
├─ "Validation error"
│  ├─ Check CSV format (name,email headers required)
│  └─ Check email format (must be valid)
├─ "Schema cache error"
│  └─ Remove updated_at from payload
├─ "Unauthorized"
│  └─ Check auth cookie exists
└─ "Duplicates created"
   └─ Verify upsert logic (email check)
```

---

## Decision Tree: Hydration Errors

```
Hydration error
├─ In FiltersBar?
│  └─ Apply isClient + useEffect pattern
├─ In custom component?
│  ├─ Using localStorage? → Move to useEffect
│  ├─ Using Date.now()? → Use suppressHydrationWarning
│  └─ Using window/document? → Check typeof window !== 'undefined'
└─ In third-party component?
   └─ Dynamic import with ssr: false
```

---

## Getting More Help

1. **Check documentation:** Search this folder for keywords
2. **Check console:** Look for error messages and stack traces
3. **Check Network tab:** Look for failed API requests
4. **Check Supabase logs:** Dashboard → Logs → API
5. **Search GitHub issues:** Look for similar problems

---

**Last Updated:** 2025-10-23
