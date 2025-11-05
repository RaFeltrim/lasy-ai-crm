# API Reference

Complete reference for all API endpoints.

---

## Base URL

```
http://localhost:3000/api (Development)
https://your-domain.com/api (Production)
```

## Authentication

All endpoints require authentication via Supabase JWT cookie.

**Unauthorized Response:**

```json
{
  "error": "Unauthorized"
}
```

---

## Leads Endpoints

### GET /api/leads

Get all leads for authenticated user.

**Headers:**

```
Cookie: sb-access-token=<jwt>
```

**Response 200:**

```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "company": "Acme Inc",
    "status": "qualified",
    "source": "website",
    "notes": "Interested in product",
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-16T14:20:00Z",
    "user_id": "user-uuid"
  }
]
```

---

### POST /api/leads

Create a new lead.

**Request:**

```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+0987654321",
  "company": "Tech Corp",
  "status": "new",
  "source": "referral",
  "notes": "Hot lead"
}
```

**Validation:**

- `name`: Required, min 1 char
- `email`: Required, valid email format
- `status`: Must be: new, contacted, qualified, customer, lost

**Response 200:**

```json
{
  "id": "new-uuid",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "created_at": "2025-01-17T09:00:00Z",
  "user_id": "user-uuid"
}
```

**Response 400:**

```json
{
  "error": "Invalid email format"
}
```

---

### GET /api/leads/[id]

Get single lead by ID.

**Parameters:**

- `id`: Lead UUID

**Response 200:**

```json
{
  "id": "lead-uuid",
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Response 404:**

```json
{
  "error": "Lead not found"
}
```

---

### PUT /api/leads/[id]

Update existing lead.

**Request:**

```json
{
  "status": "qualified",
  "notes": "Follow up next week"
}
```

**Note:** Don't send `updated_at` - handled by database trigger.

**Response 200:**

```json
{
  "id": "lead-uuid",
  "status": "qualified",
  "updated_at": "2025-01-17T10:15:00Z"
}
```

---

### DELETE /api/leads/[id]

Delete lead.

**Response 200:**

```json
{
  "message": "Lead deleted successfully"
}
```

---

## Import/Export Endpoints

### POST /api/leads/import

Import leads from CSV/XLSX.

**Request:**

```json
{
  "file": "base64-encoded-file-content",
  "type": "csv"
}
```

**Response 200:**

```json
{
  "message": "Leads: 10 new, 5 updated, 2 rejected",
  "inserted": 10,
  "updated": 5,
  "rejected": 2,
  "errors": ["Row 3: Invalid email format", "Row 7: Name is required"]
}
```

**CSV Format:**

```csv
name,email,phone,company,status,source,notes
John Doe,john@example.com,+1234567890,Acme,new,website,Note
```

**Upsert Logic:**

- Check if lead exists by `email`
- If exists → UPDATE
- If new → INSERT

---

### GET /api/leads/export

Export leads to XLSX.

**Query Parameters:**

- `format`: "xlsx" or "csv" (default: "xlsx")

**Response 200:**

```
Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
Content-Disposition: attachment; filename="leads-2025-01-17.xlsx"

<binary file data>
```

**Response 400:**

```json
{
  "error": "Invalid format"
}
```

---

## Interactions Endpoints

### GET /api/interactions

Get all interactions for a lead.

**Query Parameters:**

- `leadId`: Lead UUID (required)

**Response 200:**

```json
[
  {
    "id": "interaction-uuid",
    "lead_id": "lead-uuid",
    "type": "call",
    "notes": "Discussed pricing",
    "created_at": "2025-01-17T11:00:00Z",
    "user_id": "user-uuid"
  }
]
```

---

### POST /api/interactions

Create interaction for a lead.

**Request:**

```json
{
  "lead_id": "lead-uuid",
  "type": "email",
  "notes": "Sent proposal"
}
```

**Validation:**

- `type`: Must be: call, email, meeting, note

**Response 200:**

```json
{
  "id": "new-uuid",
  "created_at": "2025-01-17T12:00:00Z"
}
```

---

## Error Responses

### 400 Bad Request

```json
{
  "error": "Validation error",
  "details": {
    "email": "Invalid email format",
    "status": "Invalid status value"
  }
}
```

### 401 Unauthorized

```json
{
  "error": "Unauthorized"
}
```

### 403 Forbidden

```json
{
  "error": "Access denied"
}
```

### 404 Not Found

```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal server error",
  "message": "Detailed error message"
}
```

---

**Last Updated:** 2025-10-23
