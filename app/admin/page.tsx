import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Dashboard from '@/components/admin/Dashboard'

export default async function AdminPage() {
    const supabase = await createClient()

    // 1. Check Supabase session
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login?next=/admin')
    }

    // 2. Check server-side ADMIN_EMAIL env var (NOT NEXT_PUBLIC_ — never exposed to browser)
    const adminEmail = process.env.ADMIN_EMAIL
    if (!adminEmail || user.email !== adminEmail) {
        // Authenticated but not the admin — redirect to their own dashboard
        redirect('/dashboard')
    }

    // 3. Fetch Admin Stats
    const { count: totalProfiles } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
    const { count: activeAssistants } = await supabase.from('assistant_config').select('*', { count: 'exact', head: true })
    const { count: totalConversations } = await supabase.from('conversations').select('*', { count: 'exact', head: true })
    
    const { data: recentProfiles } = await supabase
        .from('profiles')
        .select('display_name, created_at')
        .order('created_at', { ascending: false })
        .limit(4)

    return (
        <Dashboard 
            stats={{
                totalProfiles: totalProfiles || 0,
                activeAssistants: activeAssistants || 0,
                totalConversations: totalConversations || 0,
            }}
            recentProfiles={recentProfiles || []}
        />
    )
}
