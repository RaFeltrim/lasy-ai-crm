# Authentication Guide

## User Registration & Login

The application now supports both user registration and login.

### Creating a New Account

1. **Via Signup Page** (Recommended for users)
   - Navigate to http://localhost:3000/signup
   - Fill in:
     - Full Name
     - Email
     - Password (minimum 6 characters)
     - Confirm Password
   - Click "Create Account"
   - Check your email for verification link (if email confirmation is enabled in Supabase)
   - After verification, login at /login

2. **Via Supabase Dashboard** (Admin method)
   - Go to Supabase Dashboard → Authentication → Users
   - Click "Add user" → "Create new user"
   - Enter email and password
   - User can immediately login

### Logging In

1. Navigate to http://localhost:3000/login
2. Enter your email and password
3. Click "Entrar"
4. You'll be redirected to the dashboard automatically

### Routes

- `/login` - Login page
- `/signup` - Registration page
- `/dashboard` - Protected route (requires authentication)
- `/leads/*` - Protected routes (requires authentication)

## Authentication Flow

1. **Signup**:
   - User submits registration form
   - Supabase creates auth user
   - Profile entry is created in `profiles` table
   - User receives confirmation email (if enabled)
   - Redirected to login page

2. **Login**:
   - User submits credentials
   - Supabase validates and creates session
   - Session stored in cookies via SSR
   - User redirected to dashboard using `window.location.href` for reliability

3. **Protected Routes**:
   - Middleware checks authentication status
   - Unauthenticated users redirected to `/login`
   - Authenticated users on `/login` or `/signup` redirected to `/dashboard`

## Troubleshooting

### Login doesn't redirect
✅ **FIXED**: Now uses `window.location.href` instead of `router.push()` for reliable navigation after authentication.

### Email confirmation not working
- Check Supabase settings: Authentication → Settings → Email Auth
- Disable "Confirm email" for development
- Enable for production with proper email templates

### Password requirements
- Minimum 6 characters
- Can be customized in Supabase → Authentication → Policies

### User already exists error
- Email must be unique
- Use password reset if forgotten
- Check Supabase → Authentication → Users to verify

## Security Features

- ✅ Password confirmation on signup
- ✅ Minimum password length validation
- ✅ Server-side authentication via Supabase SSR
- ✅ Row Level Security (RLS) on all database tables
- ✅ Automatic profile creation on signup
- ✅ Session management via cookies
- ✅ Protected routes with middleware

## Development Tips

### Test User Credentials
Create a test user for development:
- Email: demo@lasy.ai
- Password: demo123456

### Disable Email Confirmation (Development)
In Supabase Dashboard:
1. Go to Authentication → Email Templates
2. Disable "Confirm signup" for faster testing

### Enable Email Confirmation (Production)
1. Configure SMTP settings in Supabase
2. Customize email templates
3. Enable "Confirm email" in Auth settings
