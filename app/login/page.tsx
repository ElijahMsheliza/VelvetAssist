"use client"

import { useState, Suspense } from "react"
import { motion } from "framer-motion"
import { Lock, AlertCircle, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/utils/supabase/client"
import { useRouter, useSearchParams } from "next/navigation"

function LoginForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const nextPath = searchParams.get('next') || '/dashboard'
    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        
        try {
            const { error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            })
            if (authError) {
                setError(authError.message)
            } else {
                router.push(nextPath)
                router.refresh()
            }
        } finally {
            setLoading(false)
        }
    }

    const handleSignUp = async () => {
        setLoading(true)
        setError(null)
        try {
            const { error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
                }
            })
            if (signUpError) {
                setError(signUpError.message)
            } else {
                setError("Check your email for the confirmation link.")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-xl">
            <CardHeader className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center mb-2">
                    <Lock className="w-6 h-6 text-yellow-500" />
                </div>
                <CardTitle className="text-3xl text-white font-serif tracking-tight">VelvetAssist Access</CardTitle>
                <CardDescription className="text-zinc-400">
                    Enter your credentials to manage your Assistant
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-4">
                        <Input
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600 h-11"
                            required
                        />
                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600 h-11"
                            required
                        />
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex items-center justify-center gap-2 text-sm p-3 rounded-md ${error.includes('Check your email') ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}
                        >
                            {!error.includes('Check your email') && <AlertCircle className="w-4 h-4 shrink-0" />}
                            <span className="text-center">{error}</span>
                        </motion.div>
                    )}

                    <div className="flex flex-col gap-2 pt-2">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-11 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold"
                        >
                            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                            Sign In
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            disabled={loading}
                            onClick={handleSignUp}
                            className="w-full h-11 text-zinc-400 hover:text-white"
                        >
                            Create Account
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black p-4 relative overflow-hidden">
            <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px]" />
            <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-[128px]" />
            
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Suspense fallback={<div className="flex items-center justify-center p-8"><Loader2 className="w-8 h-8 text-yellow-500 animate-spin" /></div>}>
                    <LoginForm />
                </Suspense>
            </motion.div>
        </div>
    )
}
