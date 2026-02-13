# Smart Bookmark App

A simple, secure, and beautiful bookmark manager built with Next.js 15 (App Router), Supabase, and Tailwind CSS.

## Features

- **Google Login**: Secure authentication with Google OAuth.
- **Private Bookmarks**: Each user has their own private list of bookmarks.
- **Real-time Updates**: Changes reflect instantly across tabs/devices without refresh.
- **Glassmorphism UI**: Modern, premium dark mode design.

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com) and create a new project.
2. Under **Authentication > Providers**, enable **Google**.
   - You will need to set up a Google Cloud Project to get the Client ID and Secret.
   - Add `https://<YOUR-PROJECT-REF>.supabase.co/auth/v1/callback` to the redirect URIs in Google Console.
3. Run the SQL schema provided in `backend/schema.sql` in the Supabase SQL Editor to create the tables and policies.
   - Make sure to enable Realtime for the `bookmarks` table (Database > Replication).

### 2. Configure Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your Supabase details:

```bash
cp .env.local.example .env.local
```

### 3. Run Locally

Navigate to the frontend directory and install dependencies:

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Deployment

Deploy on Vercel:

1. Push this code to GitHub.
2. Import the repository in Vercel.
3. Add the environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in Vercel settings.
4. Deploy!

## Problems & Solutions

During development, I encountered and solved the following challenges:

### 1. Authentication Persistence with Server-Side Rendering (SSR)
**Problem:** Managing authentication state across Server Components, Client Components, and Middleware is complex in Next.js App Router.
**Solution:**
- Implemented `middleware.ts` to refresh the session token on every request, ensuring secure access to protected routes.
- Used `@supabase/ssr`'s `createServerClient` with `cookies` helper in Server Components and Route Handlers.
- Used `createBrowserClient` for Client Components.

### 2. Real-time Privacy and Security
**Problem:** Ensuring users only receive real-time updates for their *own* bookmarks. Without proper filtering, a user might receive events for other users if Row Level Security (RLS) isn't strictly enforced on the publication channel.
**Solution:**
- Added a `filter: 'user_id=eq.${userId}'` to the Supabase Realtime subscription. This ensures the client only listens for changes relevant to the logged-in user.
- Enforced strict RLS policies on the database table for all CRUD operations.

### 3. Next.js 15 Async APIs
**Problem:** Next.js 15 introduces async APIs for request data (cookies, headers, params).
**Solution:**
- Updated the `createClient` utility in `lib/supabase/server.ts` to `await cookies()` before accessing the cookie store, complying with the latest Next.js 15 requirements.

### 4. Glassmorphism Design Consistency
**Problem:** Creating a consistent glassmorphism effect across different components (Cards, Inputs).
**Solution:**
- Created reusable UI components (`Card`, `Input`, `Button`) with `backdrop-blur`, semi-transparent backgrounds, and subtle borders in Tailwind to maintain a premium look.
