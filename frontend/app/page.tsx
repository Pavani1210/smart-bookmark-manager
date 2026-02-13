import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import BookmarkList from '@/components/dashboard/bookmark-list'
import AddBookmark from '@/components/dashboard/add-bookmark'
import Navbar from '@/components/dashboard/navbar'

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-black text-zinc-100 selection:bg-indigo-500/30">
      <Navbar userEmail={user.email} />

      {/* Subtle background effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[20%] h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[20%] h-[500px] w-[500px] rounded-full bg-purple-500/5 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      <main className="relative z-10 container mx-auto max-w-6xl px-4 pt-28 pb-12">
        <div className="mx-auto max-w-3xl mb-12 text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            Manage your links
          </h1>
          <p className="text-lg text-zinc-400 max-w-lg mx-auto leading-relaxed">
            A simple, intelligent way to organize your favorite websites.
            All in one secure place.
          </p>
        </div>

        <div className="mx-auto max-w-2xl mb-16">
          <AddBookmark />
        </div>

        <div className="mt-8">
          <BookmarkList initialBookmarks={bookmarks || []} userId={user.id} />
        </div>
      </main>
    </div>
  )
}
