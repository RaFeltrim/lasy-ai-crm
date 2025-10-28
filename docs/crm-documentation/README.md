# Lasy CRM - Complete Documentation Index

Welcome to the comprehensive documentation for **Lasy CRM**, a modern customer relationship management system built with Next.js 14, React 18, and Supabase.

## 📚 Documentation Structure

This documentation is organized into the following sections:

### Getting Started
- **[01-GETTING-STARTED.md](./01-GETTING-STARTED.md)** - Quick setup guide, installation, and first steps

### Architecture & Design
- **[02-ARCHITECTURE.md](./02-ARCHITECTURE.md)** - System architecture, tech stack decisions, and design patterns
- **[08-FLOWCHARTS.md](./08-FLOWCHARTS.md)** - Visual flowcharts showing system behavior

### Technical Reference
- **[03-API-REFERENCE.md](./03-API-REFERENCE.md)** - Complete API documentation for all endpoints
- **[04-COMPONENTS.md](./04-COMPONENTS.md)** - Component API, props, and usage examples
- **[05-DATABASE.md](./05-DATABASE.md)** - Database schema, RLS policies, triggers, and migrations

### Bug Tracking & Fixes
- **[06-BUGS-AND-FIXES.md](./06-BUGS-AND-FIXES.md)** - Detailed history of all bugs encountered and how they were fixed

### Guides & Tutorials
- **[07-HOW-TO-GUIDES.md](./07-HOW-TO-GUIDES.md)** - Step-by-step guides for common tasks
- **[09-TROUBLESHOOTING.md](./09-TROUBLESHOOTING.md)** - Decision trees and solutions for common problems

### Performance & Deployment
- **[10-PERFORMANCE.md](./10-PERFORMANCE.md)** - Performance metrics, benchmarks, and optimization techniques
- **[11-DEPLOYMENT.md](./11-DEPLOYMENT.md)** - Production deployment guides for Vercel, self-hosting, and Docker

### Contributing
- **[12-CONTRIBUTING.md](./12-CONTRIBUTING.md)** - Contribution guidelines, code standards, and PR process

---

## 🎯 Project Overview

**Lasy CRM** is a full-stack Next.js application designed to manage leads through a Kanban-style interface with real-time updates, drag-and-drop functionality, and comprehensive CRUD operations.

### Key Features
- 🎨 **Kanban Board** - Drag-and-drop lead management across status columns
- 🔍 **Advanced Filtering** - Search by name, email, company, notes with URL sync
- 📊 **CSV/XLSX Import/Export** - Bulk operations with deduplication
- 📱 **Mobile-First Design** - Horizontal scroll Kanban optimized for touch
- 🔒 **Row-Level Security** - Supabase RLS for multi-tenant data isolation
- ⚡ **Real-Time Updates** - Optimistic UI with automatic rollback
- 🧪 **Comprehensive Testing** - Unit tests (Vitest) and E2E tests (Playwright)

---

## 🚀 Quick Links

- **Setup**: See [01-GETTING-STARTED.md](./01-GETTING-STARTED.md)
- **Architecture**: See [02-ARCHITECTURE.md](./02-ARCHITECTURE.md)
- **Known Issues**: See [06-BUGS-AND-FIXES.md](./06-BUGS-AND-FIXES.md#known-issues)
- **How to Add a Field**: See [07-HOW-TO-GUIDES.md](./07-HOW-TO-GUIDES.md#1-how-to-add-a-new-field)

---

## 📖 For AI Assistants (GPT-5, Gemini, Claude)

This documentation was specifically created to provide complete context for AI assistants working on this codebase. Key points:

### Project Journey
We started with a clean Next.js 14 setup and encountered **7 critical bugs** during development. Each bug taught us important lessons about:
- React 18 hydration and SSR/CSR mismatches
- Supabase RLS and PostgREST schema cache behavior
- @dnd-kit collision detection and touch sensors
- Mobile-first design patterns

### What Makes This Project Special
1. **No Assumptions**: We document exact versions, exact code, exact errors
2. **Complete History**: Every bug, every fix, every decision is documented
3. **Visual Guides**: Flowcharts show system behavior at a glance
4. **Practical Examples**: Real code snippets you can copy-paste

### How to Use This Documentation
1. Start with [02-ARCHITECTURE.md](./02-ARCHITECTURE.md) to understand the tech stack
2. Review [06-BUGS-AND-FIXES.md](./06-BUGS-AND-FIXES.md) to learn from our mistakes
3. Use [07-HOW-TO-GUIDES.md](./07-HOW-TO-GUIDES.md) for common tasks
4. Reference [08-FLOWCHARTS.md](./08-FLOWCHARTS.md) to visualize system behavior

---

## 🔥 Critical Known Issues (As of 2025-10-23)

| Priority | Issue | Location | Status |
|----------|-------|----------|--------|
| P-0 | Import upsert fails with `updated_at` schema cache error | `app/api/leads/import/route.ts:79` | **NOT FIXED** |
| P-1 | Phone field missing from global search | `app/dashboard/page.tsx:24` | **NOT FIXED** |
| P-1 | D&D positions don't persist to database | `components/kanban/KanbanBoard.tsx` | **NOT FIXED** |
| P-2 | Mobile header cramped on small screens | `app/dashboard/page.tsx` | **NOT FIXED** |

See [06-BUGS-AND-FIXES.md](./06-BUGS-AND-FIXES.md#known-issues) for details and proposed fixes.

---

## 📊 Tech Stack

- **Framework**: Next.js 14.2.33 (App Router, React Server Components)
- **Language**: TypeScript 5.x
- **UI Library**: React 18.3.1
- **Styling**: Tailwind CSS 3.4.1 + shadcn/ui
- **Database**: Supabase (PostgreSQL with RLS)
- **Drag & Drop**: @dnd-kit 6.1.0
- **Forms**: react-hook-form 7.x + Zod validation
- **Testing**: Vitest + Playwright
- **Deployment**: Vercel (recommended)

---

## 🤝 Contributing

We welcome contributions! Please read [12-CONTRIBUTING.md](./12-CONTRIBUTING.md) for:
- Code style guidelines
- PR submission process
- Testing requirements
- Commit message conventions

---

## 📄 License

This project is proprietary. All rights reserved.

---

## 📞 Support

For questions or issues:
1. Check [09-TROUBLESHOOTING.md](./09-TROUBLESHOOTING.md)
2. Review [06-BUGS-AND-FIXES.md](./06-BUGS-AND-FIXES.md)
3. Open an issue on GitHub (if applicable)

---

**Last Updated**: 2025-10-23  
**Version**: 1.0.0  
**Maintained by**: Lasy CRM Team
