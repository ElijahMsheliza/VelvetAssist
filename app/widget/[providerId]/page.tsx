import { createClient } from '@/utils/supabase/server'
import ClientChat from '@/app/book/[slug]/ClientChat'
import { notFound } from 'next/navigation'

export default async function WidgetPage({ params }: { params: { providerId: string } }) {
    const { providerId } = await params;
    const supabase = await createClient()
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', providerId)
        .single()
        
    if (!profile) return notFound();

    return (
        <div className="w-full h-screen bg-zinc-950 overflow-hidden m-0 p-0">
            <ClientChat profileId={profile.id} displayName={profile.display_name} isWidget />
        </div>
    )
}
