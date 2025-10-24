# System Flowcharts

Visual diagrams showing how the system works.

---

## 1. Authentication Flow

```mermaid
graph TB
    A[User visits /dashboard] --> B{Has auth cookie?}
    B -->|No| C[middleware.ts redirects to /login]
    B -->|Yes| D[Verify JWT token]
    C --> E[Login Page]
    E --> F[User enters credentials]
    F --> G[Supabase Auth]
    G -->|Success| H[Set HTTP-only cookie]
    G -->|Failure| I[Show error toast]
    H --> J[Redirect to /dashboard]
    D -->|Valid| K[Allow access]
    D -->|Invalid| C
```

---

## 2. Lead CRUD Flow

```mermaid
graph TB
    A[User clicks New Lead] --> B[Open LeadEditForm dialog]
    B --> C[User fills form]
    C --> D[Click Save]
    D --> E{Zod validation}
    E -->|Fail| F[Show field errors]
    E -->|Pass| G[POST /api/leads]
    G --> H[Create Supabase client]
    H --> I{Get auth user}
    I -->|No user| J[Return 401]
    I -->|Has user| K[INSERT into leads table]
    K --> L{RLS policy check}
    L -->|Fail| M[Return 403]
    L -->|Pass| N[Trigger: handle_updated_at]
    N --> O[Return new lead]
    O --> P[Update local state optimistically]
    P --> Q[Show success toast]
    P --> R[Close dialog]
```

---

## 3. Drag and Drop Flow

```mermaid
graph TB
    A[User starts dragging lead] --> B[TouchSensor: long-press 250ms]
    B --> C[onDragStart fires]
    C --> D[Set active lead state]
    D --> E[User drags over another lead]
    E --> F[onDragOver fires]
    F --> G[Calculate activeIndex & overIndex]
    G --> H[arrayMove to reorder]
    H --> I[Update local state immediately]
    I --> J[User releases drag]
    J --> K[onDragEnd fires]
    K --> L{Status changed?}
    L -->|Yes| M[PUT /api/leads/id with new status]
    L -->|No| N[No API call needed]
    M --> O{API success?}
    O -->|Yes| P[Keep optimistic update]
    O -->|No| Q[Rollback to original state]
    Q --> R[Show error toast]
```

---

## 4. Import CSV Flow

```mermaid
graph TB
    A[User selects CSV file] --> B[Convert to base64]
    B --> C[POST /api/leads/import]
    C --> D[Parse CSV with Papa Parse]
    D --> E{Valid CSV?}
    E -->|No| F[Return 400 error]
    E -->|Yes| G[For each row...]
    G --> H[Validate with Zod schema]
    H -->|Fail| I[Add to rejected]
    H -->|Pass| J{Check if email exists}
    J -->|Yes| K[UPDATE existing lead]
    J -->|No| L[INSERT new lead]
    K --> M{Update success?}
    M -->|Yes| N[Increment updated count]
    M -->|No| I
    L --> O{Insert success?}
    O -->|Yes| P[Increment inserted count]
    O -->|No| I
    I --> Q[Continue to next row]
    N --> Q
    P --> Q
    Q --> R{More rows?}
    R -->|Yes| G
    R -->|No| S[Return counts: inserted, updated, rejected]
    S --> T[Show toast with stats]
```

---

## 5. Filter Flow

```mermaid
graph TB
    A[User types in search input] --> B[react-hook-form updates state]
    B --> C{Debounce 300ms}
    C --> D[onSubmit triggered]
    D --> E[Build URLSearchParams]
    E --> F[router.replace with new params]
    F --> G[URL changes without reload]
    G --> H[Server Component re-renders]
    H --> I[Read new searchParams]
    I --> J[Build Supabase query with filters]
    J --> K[Execute query with RLS]
    K --> L[Return filtered leads]
    L --> M[Pass as initialLeads prop]
    M --> N[useEffect detects prop change]
    N --> O[Update local state]
    O --> P[KanbanBoard re-renders]
```

---

## 6. Row-Level Security

```mermaid
graph TB
    A[Client makes request] --> B[Include JWT in Authorization header]
    B --> C[Supabase validates JWT]
    C -->|Invalid| D[Return 401]
    C -->|Valid| E[Extract user_id from JWT]
    E --> F[Execute SQL query]
    F --> G[PostgreSQL applies RLS policy]
    G --> H{auth.uid = user_id?}
    H -->|No| I[Filter out row]
    H -->|Yes| J[Include row in result]
    I --> K[Return filtered results]
    J --> K
```

---

## 7. Lead Lifecycle

```mermaid
graph LR
    A[New] --> B[Contacted]
    B --> C[Qualified]
    C --> D{Decision}
    D -->|Won| E[Customer]
    D -->|Lost| F[Lost]
    B --> F
    F --> A
    A --> G[Unqualified]
```

**Status Meanings:**
- **New:** Just imported/created
- **Contacted:** First outreach made
- **Qualified:** Met criteria (budget, authority, need, timeline)
- **Customer:** Deal closed
- **Lost:** Rejected or went with competitor
- **Unqualified:** Doesn't meet criteria

---

## 8. Component Hierarchy

```mermaid
graph TB
    A[app/dashboard/page.tsx - Server] --> B[DashboardClient.tsx]
    B --> C[FiltersBar.tsx]
    B --> D[KanbanBoard.tsx]
    D --> E[KanbanColumn.tsx]
    E --> F[SortableContext]
    F --> G[LeadCard.tsx]
    G --> H[useSortable hook]
    B --> I[LeadEditForm Dialog]
    B --> J[ImportLeadsDialog]
```

---

**Last Updated:** 2025-10-23
