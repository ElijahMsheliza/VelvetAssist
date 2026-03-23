"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Save, Link as LinkIcon, ExternalLink, Check, MessageSquare, Calendar } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BookingsView from "./BookingsView"
import CalendarView from "./CalendarView"
import type { Appointment } from "./CalendarView"

interface Profile {
    id: string
    slug: string | null
    display_name: string
    subscription_status: string | null
    stripe_customer_id: string | null
}

interface AssistantConfig {
    availability_rules: string | null
    pricing_rules: string | null
    screening_questions: string | null
    deposit_instructions: string | null
}

export interface Conversation {
    id: string
    profile_id: string
    client_name: string
    status: string
    transcript: { role: 'user' | 'assistant' | 'system'; content: string }[]
    created_at: string
}

interface DashboardClientProps {
    profile: Profile
    initialConfig: AssistantConfig | null
    origin: string
    conversations?: Conversation[]
    appointments?: Appointment[]
}

export default function DashboardClient({ profile, initialConfig, origin, conversations = [], appointments = [] }: DashboardClientProps) {
    const [loading, setLoading] = useState(false)
    const [billingLoading, setBillingLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [copied, setCopied] = useState(false)
    const [widgetCopied, setWidgetCopied] = useState(false)
    const [slug, setSlug] = useState(profile?.slug || "")
    const [config, setConfig] = useState({
        availability_rules: initialConfig?.availability_rules || "",
        pricing_rules: initialConfig?.pricing_rules || "",
        screening_questions: initialConfig?.screening_questions || "",
        deposit_instructions: initialConfig?.deposit_instructions || ""
    })

    const router = useRouter()
    const magicLink = `${origin}/book/${slug}`

    const isSubscribed = profile?.subscription_status === 'active' || profile?.subscription_status === 'trialing'
    const isPastDue = profile?.subscription_status === 'past_due'

    const handleSubscribe = useCallback(async () => {
        setBillingLoading(true)
        try {
            const res = await fetch('/api/stripe/checkout', { method: 'POST' })
            const data = await res.json()
            if (data.url) window.location.href = data.url
        } catch (e) {
            console.error(e)
            alert("Failed to start checkout")
        } finally {
            setBillingLoading(false)
        }
    }, [])

    const handleManageBilling = useCallback(async () => {
        setBillingLoading(true)
        try {
            const res = await fetch('/api/stripe/portal', { method: 'POST' })
            const data = await res.json()
            if (data.url) window.location.href = data.url
        } catch (e) {
            console.error(e)
            alert("Failed to open billing portal")
        } finally {
            setBillingLoading(false)
        }
    }, [])

    const handleSave = useCallback(async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setSuccess(false)

        // Create the client inside the handler — no need to hold an instance on every render
        const supabase = createClient()

        try {
            // Update slug in profiles only if it changed
            if (profile && slug !== profile.slug) {
                await supabase
                    .from('profiles')
                    .update({ slug })
                    .eq('id', profile.id)
            }

            // Upsert config
            const { error: configError } = await supabase
                .from('assistant_config')
                .upsert({
                    profile_id: profile.id,
                    ...config
                })

            if (configError) throw configError

            setSuccess(true)
            setTimeout(() => setSuccess(false), 3000)
            router.refresh()
        } catch (error) {
            console.error("Failed to save", error)
            alert("Failed to save changes. Please check if the slug is already taken.")
        } finally {
            setLoading(false)
        }
    }, [slug, config, profile, router])

    return (
        <Tabs defaultValue="appointments" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 max-w-[600px]">
                <TabsTrigger value="appointments">
                    <Calendar className="w-4 h-4 mr-2 hidden sm:inline" />
                    Appointments
                </TabsTrigger>
                <TabsTrigger value="bookings">
                    <MessageSquare className="w-4 h-4 mr-2 hidden sm:inline" />
                    Chats
                </TabsTrigger>
                <TabsTrigger value="settings">Configuration</TabsTrigger>
            </TabsList>
            
            <TabsContent value="appointments" className="mt-6">
                <CalendarView appointments={appointments} />
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-6 mt-6">
            <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-xl text-yellow-500 flex items-center gap-2">
                        <LinkIcon className="w-5 h-5" />
                        Billing &amp; Subscription
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                        {isSubscribed
                            ? "Your VelvetAssist Pro subscription is active."
                            : "Subscribe to activate your Magic Link and accept bookings."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isSubscribed ? (
                        <Button onClick={handleManageBilling} disabled={billingLoading} variant="outline" className="w-full sm:w-auto">
                            {billingLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Manage Subscription
                        </Button>
                    ) : isPastDue ? (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-md p-3">
                                <span>⚠️</span>
                                <span>Your last payment failed. Update your payment method to restore access.</span>
                            </div>
                            <Button onClick={handleManageBilling} disabled={billingLoading} className="w-full sm:w-auto bg-red-500 hover:bg-red-400 text-white">
                                {billingLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                Update Payment Method
                            </Button>
                        </div>
                    ) : (
                        <Button onClick={handleSubscribe} disabled={billingLoading} className="w-full sm:w-auto bg-yellow-500 text-black hover:bg-yellow-400">
                            {billingLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Start 7-Day Free Trial
                        </Button>
                    )}
                </CardContent>
            </Card>

            <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-xl text-yellow-500 flex items-center gap-2">
                        <LinkIcon className="w-5 h-5" />
                        Your Magic Link
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                        Share this link with clients. VelvetAssist will handle the rest.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4 items-center p-4 bg-zinc-950/50 rounded-lg border border-zinc-800">
                        <div className="flex-1 font-mono text-sm text-zinc-300 break-all">
                            {magicLink}
                        </div>
                        <Button
                            variant="outline"
                            className={`w-full sm:w-auto shrink-0 transition-colors ${copied ? 'bg-green-500/20 text-green-400 border-green-500/50' : ''}`}
                            onClick={() => {
                                navigator.clipboard.writeText(magicLink)
                                setCopied(true)
                                setTimeout(() => setCopied(false), 2000)
                            }}
                        >
                            {copied ? <><Check className="w-4 h-4 mr-2" /> Copied!</> : "Copy Link"}
                        </Button>
                        <Button
                            className="w-full sm:w-auto shrink-0 bg-yellow-500 text-black hover:bg-yellow-400"
                            onClick={() => window.open(magicLink, '_blank')}
                        >
                            Test <ExternalLink className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-xl text-yellow-500 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5" />
                        Website Chat Widget
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                        Paste this code into the &lt;body&gt; of your website to embed your AI assistant.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4 items-center p-4 bg-zinc-950/50 rounded-lg border border-zinc-800">
                        <div className="flex-1 font-mono text-xs text-zinc-300 break-all select-all">
                            {`<script src="${origin}/widget/${profile?.id}/embed.js"></script>`}
                        </div>
                        <Button
                            variant="outline"
                            className={`w-full sm:w-auto shrink-0 transition-colors ${widgetCopied ? 'bg-green-500/20 text-green-400 border-green-500/50' : ''}`}
                            onClick={() => {
                                navigator.clipboard.writeText(`<script src="${origin}/widget/${profile?.id}/embed.js"></script>`)
                                setWidgetCopied(true)
                                setTimeout(() => setWidgetCopied(false), 2000)
                            }}
                        >
                            {widgetCopied ? <><Check className="w-4 h-4 mr-2" /> Copied!</> : "Copy Code"}
                        </Button>
                        <Button
                            className="w-full sm:w-auto shrink-0 bg-yellow-500 text-black hover:bg-yellow-400"
                            onClick={() => window.open(`${origin}/widget/${profile?.id}`, '_blank', 'width=400,height=650')}
                        >
                            Preview <ExternalLink className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <form onSubmit={handleSave}>
                <Card className="bg-zinc-900/50 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-xl text-white">Assistant Configuration</CardTitle>
                        <CardDescription className="text-gray-400">
                            Tell VelvetAssist how to respond to inquiries.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300">Custom Link Slug</label>
                            <Input
                                value={slug}
                                onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                placeholder="e.g. jessica-vip"
                                className="bg-zinc-950 border-zinc-800"
                            />
                            <p className="text-xs text-zinc-500">Only letters, numbers, and hyphens.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300">Rates &amp; Pricing</label>
                            <textarea
                                value={config.pricing_rules}
                                onChange={e => setConfig({...config, pricing_rules: e.target.value})}
                                placeholder="1 hour: $300, 2 hours: $500. Outcall only."
                                className="w-full h-24 px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-md text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300">Availability</label>
                            <textarea
                                value={config.availability_rules}
                                onChange={e => setConfig({...config, availability_rules: e.target.value})}
                                placeholder="Mon-Fri after 6pm. Weekends flexible."
                                className="w-full h-24 px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-md text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300">Screening Questions (Required before booking)</label>
                            <textarea
                                value={config.screening_questions}
                                onChange={e => setConfig({...config, screening_questions: e.target.value})}
                                placeholder="First name, occupation, phone number, references if new."
                                className="w-full h-24 px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-md text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300">Deposit / Payment Instructions</label>
                            <textarea
                                value={config.deposit_instructions}
                                onChange={e => setConfig({...config, deposit_instructions: e.target.value})}
                                placeholder="e.g., CashApp $jessvip for $50 deposit, OR Cash required upon arrival."
                                className="w-full h-24 px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-md text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                                required
                            />
                        </div>

                    </CardContent>
                </Card>

                <div className="mt-6 flex items-center justify-end gap-4">
                    {success && <span className="text-green-400 text-sm">Settings saved!</span>}
                    <Button type="submit" variant="luxury" disabled={loading} className="w-32">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Save</>}
                    </Button>
                </div>
            </form>
            </TabsContent>

            <TabsContent value="bookings" className="mt-6">
                <BookingsView conversations={conversations} />
            </TabsContent>
        </Tabs>
    )
}
