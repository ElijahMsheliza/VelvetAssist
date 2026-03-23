"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import WaitlistCounter from "@/components/WaitlistCounter"

export default function FinalCTA() {
    return (
        <section id="get-started" className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-black to-purple-950/30" />

            <div className="container relative z-10 px-4 md:px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="max-w-xl mx-auto bg-gray-900/80 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-gray-800 shadow-2xl"
                >
                    <WaitlistCounter count={500} />
                    <h2 className="text-3xl font-bold text-white mb-4">Start Taking Better Bookings Today</h2>
                    <p className="text-gray-400 mb-8">
                        Join hundreds of independent companions who trust VelvetAssist to screen their clients and secure their deposits.
                    </p>

                    <Button
                        onClick={() => window.location.href = '/login'}
                        variant="luxury"
                        className="w-full h-14 text-lg font-bold"
                    >
                        Create Your Magic Link
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>

                    <p className="text-sm text-gray-500 mt-6 font-medium">
                        Setup takes less than 5 minutes. No coding required.
                    </p>
                </motion.div>
            </div>
        </section>
    )
}
