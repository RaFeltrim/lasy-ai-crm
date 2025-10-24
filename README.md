# Lasy CRM

A modern, full-stack Customer Relationship Management (CRM) system built with Next.js 14, Supabase, and TypeScript.

## 🚀 Features

- **Authentication**: Secure user authentication with Supabase Auth
- **Kanban Pipeline**: Drag-and-drop interface for managing leads across 5 stages (New → Contacted → Qualified → Pending → Lost)
- **Lead Management**: Full CRUD operations for leads with detailed information
- **Advanced Filtering**: Search and filter leads by name, status, source, and date range
- **Import/Export**: Bulk import leads from CSV/XLSX and export data in multiple formats
- **Interaction History**: Track all interactions with leads (calls, emails, meetings, notes)
- **Responsive Design**: Modern, dark-themed UI that works on desktop and mobile
- **Real-time Updates**: Optimistic UI updates for smooth user experience
- **Type-Safe**: Built with TypeScript and Zod for runtime validation

## 🛠️ Tech Stack

- **Framework**: Next.js 14.2.33 (App Router)
- **Language**: TypeScript 5.6.2
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with SSR
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: TailwindCSS 3.4.14
- **Drag & Drop**: @dnd-kit
- **Forms**: React Hook Form + Zod validation
- **Data Fetching**: @tanstack/react-query
- **Testing**: Vitest (unit) + Playwright (E2E)

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account and project

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RaFeltrim/Nova-pasta.git
   cd Nova-pasta
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://qxbgltpxqhuhzyjfbcdp.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4YmdsdHB4cWh1aHp5amZiY2RwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDc3MDM3MSwiZXhwIjoyMDc2MzQ2MzcxfQ.MIpiv8UrBTtba3pJXlxVLbqRCeD4SuMYGb3DwOjWA5U
   ```

4. **Run database migrations**
   
   Execute the SQL files in `supabase/migrations/` in your Supabase SQL editor:
   - `0001_initial_schema.sql`
   - `0002_fix_missing_source_column.sql`

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🧪 Testing

### Unit Tests (Vitest)
```bash
npm test
```

### E2E Tests (Playwright)
```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run E2E tests
npm run test:e2e
```

## 🏗️ Build for Production

```bash
# Build the application
npm run build

# Start production server
npm run start
```

## 📁 Project Structure

```
├── app/
│   ├── (app)/
│   │   └── dashboard/          # Main dashboard with Kanban
│   ├── api/
│   │   └── leads/             # API routes for leads, interactions, import/export
│   ├── login/                  # Authentication page
│   └── leads/
│       ├── new/                # Create new lead
│       └── [id]/               # Lead details page
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── kanban/                 # Kanban board components
│   └── leads/                  # Lead-specific components
├── lib/
│   ├── supabase-server.ts     # Supabase server client
│   ├── supabase-client.ts     # Supabase browser client
│   ├── zod-schemas.ts         # Zod validation schemas
│   └── utils.ts               # Utility functions
├── supabase/
│   ├── migrations/            # Database migrations
│   └── seed.sql               # Sample data
├── tests/                      # Vitest unit tests
├── playwright/                 # Playwright E2E tests
└── middleware.ts              # Auth middleware for route protection
```

## 🔐 Authentication

The application uses Supabase Auth with server-side rendering (SSR). Protected routes are automatically redirected to the login page if the user is not authenticated.

To create a test user:
1. Go to your Supabase project dashboard
2. Navigate to Authentication > Users
3. Create a new user with email and password

## 🗄️ Database Schema

### Tables

- **profiles**: User profile information
- **leads**: Lead data with fields for name, email, phone, company, status, source, and notes
- **interactions**: Interaction history for each lead (calls, emails, meetings, notes)

### Row Level Security (RLS)

All tables have RLS enabled. Users can only access their own data (`user_id` column).

## 📝 API Routes

- `GET /api/leads` - List leads with filtering
- `POST /api/leads` - Create new lead
- `GET /api/leads/[id]` - Get lead by ID
- `PUT /api/leads/[id]` - Update lead
- `DELETE /api/leads/[id]` - Delete lead
- `GET /api/leads/[id]/interactions` - Get lead interactions
- `POST /api/leads/[id]/interactions` - Create interaction
- `GET /api/leads/export.csv` - Export leads as CSV
- `GET /api/leads/export.xlsx` - Export leads as XLSX
- `POST /api/leads/import` - Import leads from CSV/XLSX

## 🎨 UI Components

The project uses shadcn/ui components with a dark theme. All components are fully typed and accessible.

## 🐛 Troubleshooting

### Common Issues

1. **Module not found errors**: Run `npm install` to ensure all dependencies are installed
2. **Database connection errors**: Verify your Supabase credentials in `.env.local`
3. **RLS errors**: Make sure migrations are applied and RLS policies are active
4. **Build errors**: Clear `.next` folder and rebuild: `rm -rf .next && npm run build`

### Test Failures

- **Vitest tests fail**: Ensure all imports are correct and Zod schemas are properly exported
- **Playwright tests fail**: Make sure the dev server is running on port 3000

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or support, please open an issue on GitHub.
