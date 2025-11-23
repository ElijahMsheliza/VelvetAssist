"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export default function Hero() {
    const scrollToWaitlist = () => {
        const element = document.getElementById("waitlist")
        if (element) {
            element.scrollIntoView({ behavior: "smooth" })
        }
    }

    const scrollToDemo = () => {
        const element = document.getElementById("demo-chat")
        if (element) {
            element.scrollIntoView({ behavior: "smooth" })
        }
    }

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background pt-20 pb-32">
            {/* Background Gradients */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-purple-900/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-yellow-600/10 rounded-full blur-[100px]" />
            </div>

            <div className="container relative z-10 px-4 md:px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="inline-flex items-center rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-sm text-yellow-500 mb-8"
                >
                    <Sparkles className="mr-2 h-4 w-4" />
                    <span className="font-medium">The AI Assistant for Independent Companions</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6"
                >
                    Your 24/7 <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">AI Booking Assistant</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mx-auto max-w-2xl text-lg md:text-xl text-gray-400 mb-10"
                >
                    Built for independent companions who want fewer time-wasters, better clients, and more freedom.
                    Let VelvetAssist handle the screening while you focus on what matters.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Button size="lg" variant="luxury" onClick={scrollToWaitlist} className="w-full sm:w-auto text-base font-semibold px-8 h-12">
                        Join the Waitlist
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button size="lg" variant="outline" onClick={scrollToDemo} className="w-full sm:w-auto border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white h-12">
                        View Demo
                    </Button>
                </motion.div>
            </div>
        </section>
    )
}
