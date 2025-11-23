"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle } from "lucide-react"

export default function WaitlistForm() {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch("https://formspree.io/f/xyzvbvbg", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email }),
            })
            if (res.ok) {
                setSuccess(true)
            } else {
                console.error("Form submission failed")
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <section id="waitlist" className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-black to-purple-950/20" />

            <div className="container relative z-10 px-4 md:px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-xl mx-auto bg-gray-900/80 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-gray-800 shadow-2xl"
                >
                    {!success ? (
                        <>
                            <h2 className="text-3xl font-bold text-white mb-4">Join the Exclusive Waitlist</h2>
                            <p className="text-gray-400 mb-8">
                                We are currently accepting a limited number of beta users. Secure your spot today.
                            </p>

                            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                                <Input
                                    type="email"
                                    placeholder="Enter your email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 h-12"
                                />
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    variant="luxury"
                                    className="h-12 text-base font-bold"
                                >
                                    {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                                    {loading ? "Joining..." : "Get Early Access"}
                                </Button>
                            </form>
                            <p className="text-xs text-gray-500 mt-4">
                                100% private. We never share your data.
                            </p>
                        </>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center py-8"
                        >
                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 mb-6">
                                <CheckCircle className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">You're on the list!</h3>
                            <p className="text-gray-400">
                                We'll notify you as soon as a spot opens up.
                            </p>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </section>
    )
}
