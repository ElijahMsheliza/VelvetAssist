import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import ClientChat from './ClientChat'

export default async function BookingPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  
  // Clean up the slug
  const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '')

  const supabase = await createClient()

  // Fetch the profile matching the slug
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, display_name, subscription_status')
    .eq('slug', cleanSlug)
    .single()

  if (!profile) {
    notFound()
  }

  // Enforce Subscription Gate 
  if (profile.subscription_status !== 'active' && profile.subscription_status !== 'trialing') {
      return (
          <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
              <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px]" />
              <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-[128px]" />
              
              <div className="text-center space-y-4 max-w-sm relative z-10 border border-zinc-800/50 bg-black/50 backdrop-blur-md p-8 rounded-2xl shadow-2xl">
                  <h1 className="text-3xl font-serif text-white tracking-tight">Calendar Closed</h1>
                  <p className="text-zinc-400 leading-relaxed text-sm">
                      The availability for this companion is currently closed or fully booked. Please try again later.
                  </p>
                  <p className="text-[10px] text-zinc-600 font-medium uppercase tracking-widest pt-4">VelvetAssist</p>
              </div>
          </div>
      )
  }

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center p-0 md:p-4">
        <ClientChat profileId={profile.id} displayName={profile.display_name} />
    </main>
  )
}
