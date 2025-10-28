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
   git clone https://github.com/RaFeltrim/lasy-ai-crm.git
   cd lasy-ai-crm
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
   
   Get these values from your Supabase project:
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Select your project
   - Navigate to **Settings** → **API**
   - Copy the **Project URL** and **anon public** key

4. **Run database migrations**
   
   Execute the SQL files in `supabase/migrations/` in your Supabase SQL editor (in order):
   - `0001_initial_schema.sql`
   - `0002_fix_missing_source_column.sql`
   - `0003_fix_notes_column.sql`
   - `0004_update_lead_status_values.sql`
   - `0005_ensure_updated_at_column.sql`

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

## 🚀 Deploy to Netlify

This project is configured for deployment on Netlify:

1. **Connect your repository** to Netlify
2. **Configure build settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`
3. **Add environment variables** in Netlify:
   - Go to **Site settings** → **Build & deploy** → **Environment variables**
   - Add `NEXT_PUBLIC_SUPABASE_URL`
   - Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. **Deploy**: Netlify will automatically deploy on every push to master

The app uses Next.js Runtime for Netlify and dynamic routes are configured to prevent static generation errors.

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   └── leads/             # API routes for leads, interactions, import/export
│   │       ├── [id]/          # Individual lead operations
│   │       ├── import/        # CSV/XLSX import
│   │       ├── export.csv/    # CSV export (dynamic route)
│   │       └── export.xlsx/   # XLSX export (dynamic route)
│   ├── dashboard/             # Main dashboard with Kanban board
│   ├── login/                 # Login page (client component)
│   ├── signup/                # Signup page (client component)
│   └── leads/
│       ├── new/               # Create new lead
│       └── [id]/              # Lead details page
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── kanban/                # Kanban board components
│   └── leads/                 # Lead-specific components
├── lib/
│   ├── supabase-server.ts    # Supabase server client (SSR)
│   ├── supabase-client.ts    # Supabase browser client
│   ├── zod-schemas.ts        # Zod validation schemas
│   └── utils.ts              # Utility functions
├── supabase/
│   ├── migrations/           # Database migrations (SQL)
│   └── seed.sql              # Sample data
├── tests/                     # Vitest unit tests
├── playwright/                # Playwright E2E tests
├── docs/                      # Centralized documentation
│   ├── guia/                  # Setup and configuration guides
│   ├── notes/                 # Technical notes and fixes
│   ├── crm-documentation/     # Comprehensive CRM documentation
│   ├── _obsolete/             # Archived/obsolete documentation
│   └── README.md              # Documentation index
└── middleware.ts             # Auth middleware for route protection
```

Para mais informações sobre a documentação do projeto, consulte [docs/README.md](docs/README.md).

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

## 🔒 Security Notes

**IMPORTANT**: Never commit your `.env.local` file or expose your Supabase keys publicly!

- The `.env.local` file is already in `.gitignore`
- Use only the **anon public** key in your environment variables
- Never use the **service_role** key in client-side code
- For production, set environment variables in your hosting platform (Netlify, Vercel, etc.)

## ⚠️ Segurança de Credenciais

### Se Você Expôs Credenciais Acidentalmente

Se você acidentalmente commitou ou expôs suas chaves do Supabase, siga estes passos imediatamente:

#### 1. Rotacionar Chaves Expostas
- Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
- Selecione seu projeto
- Vá para **Settings** → **API**
- Clique em **Reset** ao lado da chave exposta
- Atualize seu `.env.local` com a nova chave
- Atualize as variáveis de ambiente em sua plataforma de hospedagem

#### 2. Revogar Acesso Comprometido
- Revise os logs de acesso em **Logs** → **API** no Supabase Dashboard
- Verifique atividades suspeitas ou não autorizadas
- Se necessário, revogue tokens de sessão em **Authentication** → **Users**
- Considere resetar senhas de usuários se houver suspeita de comprometimento

#### 3. Prevenir Futuras Exposições
- **Nunca** faça commit de arquivos `.env`, `.env.local`, ou `.env.production`
- Verifique que `.env.local` está no `.gitignore`
- Use `git log -p` para verificar histórico de commits antes de fazer push
- Configure pre-commit hooks para detectar credenciais (ex: [git-secrets](https://github.com/awslabs/git-secrets))
- Use ferramentas como [gitleaks](https://github.com/gitleaks/gitleaks) para escanear o repositório
- Se expôs no histórico do Git, considere usar `git filter-branch` ou [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)
- Para projetos públicos, considere usar serviços de gerenciamento de segredos (GitHub Secrets, Vault, etc.)

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

Please read our [Code of Conduct](.github/CODE_OF_CONDUCT.md) before contributing.

## 📧 Contact

For questions or support, please open an issue on GitHub.
