# Contributing Guide

Guidelines for contributing to Lasy CRM.

---

## Code Standards

### TypeScript

**Use explicit types:**

```typescript
// ✅ Good
function updateLead(id: string, changes: Partial<Lead>): Promise<Lead> {
  return fetch(`/api/leads/${id}`, {
    method: "PUT",
    body: JSON.stringify(changes),
  });
}

// ❌ Bad
function updateLead(id, changes) {
  return fetch(`/api/leads/${id}`, {
    method: "PUT",
    body: JSON.stringify(changes),
  });
}
```

**Avoid `any`:**

```typescript
// ✅ Good
const response: Response = await fetch("/api/leads");
const leads: Lead[] = await response.json();

// ❌ Bad
const response: any = await fetch("/api/leads");
const leads: any = await response.json();
```

---

### React Components

**Use functional components:**

```typescript
// ✅ Good
export default function LeadCard({ lead }: Props) {
  return <div>{lead.name}</div>
}

// ❌ Bad (class components)
export default class LeadCard extends React.Component {
  render() {
    return <div>{this.props.lead.name}</div>
  }
}
```

**Use TypeScript interfaces for props:**

```typescript
interface Props {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
}
```

---

### File Naming

| Type      | Convention | Example             |
| --------- | ---------- | ------------------- |
| Component | PascalCase | `LeadCard.tsx`      |
| Utility   | camelCase  | `formatDate.ts`     |
| API Route | lowercase  | `route.ts`          |
| Test      | .test.tsx  | `LeadCard.test.tsx` |

---

### Code Formatting

**Use Prettier:**

```bash
npm run format
```

**ESLint rules:**

```bash
npm run lint
npm run lint:fix
```

**Auto-format on save (VS Code):**

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

---

## Git Workflow

### Branch Naming

```bash
feature/add-email-templates
bugfix/fix-hydration-error
hotfix/security-patch
chore/update-dependencies
```

### Commit Messages

**Format:**

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructure
- `test`: Add tests
- `chore`: Maintenance

**Examples:**

```
feat(kanban): add drag-and-drop reordering

Implemented onDragOver handler with arrayMove to enable
real-time visual feedback during drag operations.

Closes #42
```

```
fix(import): remove updated_at from upsert payload

Sending updated_at manually conflicts with database trigger,
causing "schema cache" error.

Fixes #53
```

---

## Testing Requirements

### Unit Tests (Vitest)

**Required for:**

- Utility functions (100% coverage)
- Zod schemas (100% coverage)
- React components (70% coverage)

**Example:**

```typescript
// lib/utils.test.ts
import { formatRelativeTime } from "./utils";

describe("formatRelativeTime", () => {
  it('returns "just now" for current time', () => {
    expect(formatRelativeTime(new Date())).toBe("just now");
  });

  it('returns "5m ago" for 5 minutes ago', () => {
    const date = new Date(Date.now() - 5 * 60 * 1000);
    expect(formatRelativeTime(date)).toBe("5m ago");
  });
});
```

### E2E Tests (Playwright)

**Required for:**

- Critical user flows
- Authentication
- CRUD operations
- Import/export

**Example:**

```typescript
// __tests__/e2e/crm.spec.ts
test("should create new lead", async ({ page }) => {
  await page.goto("/dashboard");
  await page.click('button:has-text("New Lead")');
  await page.fill('input[name="name"]', "John Doe");
  await page.fill('input[name="email"]', "john@example.com");
  await page.click('button:has-text("Save")');
  await expect(page.locator("text=John Doe")).toBeVisible();
});
```

---

## Pull Request Process

### 1. Create Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Changes

- Write code
- Add tests
- Update documentation

### 3. Test Locally

```bash
npm run test
npm run test:e2e
npm run build
```

### 4. Commit

```bash
git add .
git commit -m "feat(scope): description"
```

### 5. Push

```bash
git push origin feature/your-feature-name
```

### 6. Open PR

**PR Template:**

```markdown
## Description

What does this PR do?

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Unit tests pass
- [ ] E2E tests pass
- [ ] Manual testing completed

## Screenshots

(if applicable)

## Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings
```

### 7. Code Review

**Reviewers check:**

- Code quality
- Test coverage
- Documentation
- Performance impact
- Security implications

### 8. Merge

After approval:

```bash
# Squash and merge (preferred)
# or
# Merge commit
```

---

## Documentation Standards

### Code Comments

**Use JSDoc for functions:**

```typescript
/**
 * Formats a date as relative time (e.g., "5m ago")
 * @param date - The date to format
 * @returns Formatted relative time string
 */
export function formatRelativeTime(date: Date): string {
  // Implementation
}
```

**Explain complex logic:**

```typescript
// Check if lead exists by email (upsert logic)
// This prevents duplicate leads when importing
const { data: existingLead } = await supabase
  .from("leads")
  .select("id")
  .eq("email", row.email)
  .single();
```

### README Updates

**When adding a feature:**

1. Update main README.md
2. Add to HOW-TO-GUIDES.md
3. Update API-REFERENCE.md (if API changes)
4. Add flowchart (if complex flow)

---

## Release Process

### Version Numbering (Semantic Versioning)

```
MAJOR.MINOR.PATCH
1.2.3

MAJOR: Breaking changes
MINOR: New features (backward-compatible)
PATCH: Bug fixes
```

### Release Steps

**1. Update version**

```bash
npm version minor # or major/patch
```

**2. Update CHANGELOG.md**

```markdown
## [1.2.0] - 2025-01-17

### Added

- Drag-and-drop reordering with real-time feedback
- Import deduplication based on email

### Fixed

- Hydration errors in FiltersBar component
- Filters not updating UI after search

### Changed

- Error toast duration increased to 10 seconds
```

**3. Create tag**

```bash
git tag -a v1.2.0 -m "Release v1.2.0"
git push origin v1.2.0
```

**4. Deploy**

- Vercel auto-deploys on push to main
- Tag deployment with version

---

## Getting Help

**Questions?**

- Check documentation first
- Search closed issues
- Ask in team chat
- Open a discussion (not an issue)

**Found a bug?**

- Check if already reported
- Provide minimal reproduction
- Include error logs
- Specify environment (OS, browser, versions)

---

**Last Updated:** 2025-10-23
