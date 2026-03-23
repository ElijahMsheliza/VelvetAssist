import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch the profile
    let { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
        
    // If profile is totally missing (e.g. signed up without hitting callback), create it
    if (!profile) {
        const { data: newProfile } = await supabase
            .from('profiles')
            .insert({ 
                id: user.id, 
                display_name: user.email?.split('@')[0] || 'Unknown',
                slug: user.id.substring(0, 8) 
            })
            .select()
            .single();
            
        profile = newProfile
    }

    if (!profile.persona_tone) {
        redirect('/onboarding')
    }

    // Fetch the config (might be null for first time users)
    const { data: config } = await supabase
        .from('assistant_config')
        .select('*')
        .eq('profile_id', user.id)
        .single()

    // Fetch conversations (bookings)
    const { data: conversations } = await supabase
        .from('conversations')
        .select('*')
        .eq('profile_id', user.id)
        .order('created_at', { ascending: false })

    // Fetch appointments
    const { data: appointments } = await supabase
        .from('appointments')
        .select('*')
        .eq('profile_id', user.id)
        .order('start_time', { ascending: true })

    return (
        <div className="min-h-screen bg-background text-foreground py-12 px-4 md:px-6">
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome, {profile?.display_name}</h1>
                    <p className="text-gray-400">Manage your Assistant and bookings below.</p>
                </div>

                <DashboardClient 
                    profile={profile} 
                    initialConfig={config} 
                    conversations={conversations || []}
                    appointments={appointments || []}
                    origin={`${process.env.NODE_ENV === 'development' ? 'http' : 'https'}://${(await headers()).get('host')}`} 
                />
            </div>
        </div>
    )
}
