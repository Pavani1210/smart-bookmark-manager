import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import BookmarkList from '@/components/dashboard/bookmark-list'
import AddBookmark from '@/components/dashboard/add-bookmark'
import Navbar from '@/components/dashboard/navbar'
import { Plus } from 'lucide-react'

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
    <div className="flex min-h-screen flex-col bg-neutral-950 text-white">
      <Navbar userEmail={user.email} />

      <main className="container mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8 space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">Your Bookmarks</h2>
          <p className="text-muted-foreground">
            Manage your favorite links privately and securely.
          </p>
        </div>

        <AddBookmark />

        <div className="mt-8">
          <BookmarkList initialBookmarks={bookmarks || []} userId={user.id} />
        </div>
      </main>
    </div>
  )
}
