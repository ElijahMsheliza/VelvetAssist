"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, CheckCircle2, XCircle, Clock, Loader2 } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

export interface Appointment {
    id: string
    profile_id: string
    client_name: string
    start_time: string
    end_time: string
    status: 'pending' | 'confirmed' | 'rejected'
    created_at: string
}

export default function CalendarView({ appointments }: { appointments: Appointment[] }) {
    const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set())
    const router = useRouter()
    
    // Create supabase client instance
    const supabase = createClient()

    const handleUpdateStatus = async (id: string, status: 'confirmed' | 'rejected') => {
        setLoadingIds(prev => new Set(prev).add(id))
        try {
            const { error } = await supabase
                .from('appointments')
                .update({ status })
                .eq('id', id)
            
            if (error) throw error
            router.refresh()
        } catch (err) {
            console.error("Failed to update appointment", err)
            alert("Failed to update appointment status.")
        } finally {
            setLoadingIds(prev => {
                const next = new Set(prev)
                next.delete(id)
                return next
            })
        }
    }

    if (!appointments || appointments.length === 0) {
        return (
            <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-xl text-white flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Appointments Calendar
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                        No appointments currently scheduled. When the AI requests a booking, it will appear here.
                    </CardDescription>
                </CardHeader>
            </Card>
        )
    }

    return (
        <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Appointments Calendar
                </CardTitle>
                <CardDescription className="text-gray-400">
                    Manage your requested bookings and upcoming appointments.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {appointments.map(apt => (
                    <div key={apt.id} className="p-4 bg-zinc-950 border border-zinc-800 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <h4 className="text-emerald-400 font-medium tracking-wide text-lg flex items-center gap-2">
                                {apt.client_name}
                                {apt.status === 'pending' && <span className="px-2 py-0.5 rounded text-xs font-semibold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 uppercase tracking-wider">Pending request</span>}
                                {apt.status === 'confirmed' && <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase tracking-wider">Confirmed</span>}
                                {apt.status === 'rejected' && <span className="px-2 py-0.5 rounded text-xs font-semibold bg-red-500/10 text-red-500 border border-red-500/20 uppercase tracking-wider">Declined</span>}
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-zinc-400 pt-1">
                                <span className="flex items-center gap-1.5 min-w-[140px]">
                                    <Clock className="w-4 h-4 text-zinc-500 shrink-0" />
                                    {new Date(apt.start_time).toLocaleString(undefined, {
                                        month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
                                    })}
                                </span>
                                <span className="text-zinc-600 hidden sm:inline">&rarr;</span>
                                <span className="flex items-center gap-1.5 text-zinc-300">
                                    {new Date(apt.end_time).toLocaleString(undefined, {
                                        hour: 'numeric', minute: '2-digit'
                                    })}
                                </span>
                            </div>
                            <p className="text-xs text-zinc-600 pt-1">Requested on {new Date(apt.created_at).toLocaleDateString()}</p>
                        </div>
                        
                        <div className="flex gap-2 shrink-0 md:justify-end">
                            {apt.status === 'pending' ? (
                                <>
                                    <Button 
                                        variant="outline" 
                                        className="bg-emerald-500/10 text-emerald-400 border-emerald-500/50 hover:bg-emerald-500/20 hover:text-emerald-300"
                                        disabled={loadingIds.has(apt.id)}
                                        onClick={() => handleUpdateStatus(apt.id, 'confirmed')}
                                    >
                                        {loadingIds.has(apt.id) ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                                        Accept
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        className="bg-red-500/10 text-red-400 border-red-500/50 hover:bg-red-500/20 hover:text-red-300"
                                        disabled={loadingIds.has(apt.id)}
                                        onClick={() => handleUpdateStatus(apt.id, 'rejected')}
                                    >
                                        {loadingIds.has(apt.id) ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <XCircle className="w-4 h-4 mr-2" />}
                                        Decline
                                    </Button>
                                </>
                            ) : apt.status === 'confirmed' ? (
                                <Button 
                                    variant="ghost" 
                                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                    disabled={loadingIds.has(apt.id)}
                                    onClick={() => handleUpdateStatus(apt.id, 'rejected')}
                                >
                                    Cancel Booking
                                </Button>
                            ) : null}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
