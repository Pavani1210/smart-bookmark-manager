# Smart Bookmark Manager

A modern, secure, and beautiful bookmark manager application built with **Next.js 15 (App Router)**, **Supabase**, and **Tailwind CSS**.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20&%20DB-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8)

## 🚀 Features

- **Authentication**: Secure Google OAuth login via Supabase Auth.
- **Real-time Updates**: Bookmarks sync instantly across devices using Supabase Realtime.
- **Modern UI**: A premium Glassmorphism design with dark mode and smooth animations.
- **Responsive**: Fully responsive interface that works on desktop and mobile.
- **Secure**: Row Level Security (RLS) ensures users can only access their own data.

## 🛠️ Tech Stack

- **Frontend**: [Next.js 15](https://nextjs.org/) (App Router), [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/)
- **Backend**: [Supabase](https://supabase.com/) (PostgreSQL, Auth, Realtime)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Utilities**: `clsx`, `tailwind-merge`

## 📂 Project Structure

```bash
smart-bookmark-manager/
├── backend/            # Database schema and SQL scripts
│   └── schema.sql      # Run this in Supabase SQL Editor
├── frontend/           # Next.js application source code
│   ├── app/            # App Router pages and layouts
│   ├── components/     # Reusable UI components
│   ├── lib/            # Utility functions and Supabase client
│   └── public/         # Static assets
└── README.md           # Project documentation
```

## ⚡ Getting Started

### 1. Prerequisites

- Node.js 18+ installed
- A [Supabase](https://supabase.com/) account

### 2. Backend Setup (Supabase)

1. Create a new project on Supabase.
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Copy the contents of `backend/schema.sql` and run it. This will:
   - Create the `bookmarks` table.
   - Enable Row Level Security (RLS).
   - Create necessary policies for CRUD operations.
4. Go to **Authentication > Providers** and enable **Google**.
   - Configure your Client ID and Secret from Google Cloud Console.
   - Add `https://<YOUR-PROJECT-REF>.supabase.co/auth/v1/callback` to your customized Redirect URLs.

### 3. Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file in the `frontend` directory based on the example:

```bash
cp .env.local.example .env.local
```

Update `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run Locally

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Deployment

The easiest way to deploy is using **Vercel**:

1. Push your code to a Git repository (GitHub/GitLab).
2. Import the project in Vercel.
3. Select the `frontend` directory as the Root Directory.
4. Add your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to the Environment Variables.
5. Deploy!

## 🐛 Troubleshooting

- **Auth Redirect Issues**: Ensure your Redirect URL in Supabase Auth settings exactly matches your deployed URL or `http://localhost:3000/auth/callback` for local development.
- **Database Errors**: Verify that RLS policies are applied correctly in Supabase. Check the `backend/schema.sql` for reference.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
