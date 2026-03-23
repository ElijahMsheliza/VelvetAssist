"use client"

import { motion } from "framer-motion"
import { MessageCircle, Settings, Zap } from "lucide-react"

const steps = [
    {
        number: "01",
        icon: MessageCircle,
        title: "Claim Your Link",
        description: "Create an account and get your personal Magic Link (e.g., velvetassist.com/book/jessica) to put in your bio or ads.",
        color: "text-purple-400",
        bg: "bg-purple-900/20",
        border: "border-purple-800/40",
    },
    {
        number: "02",
        icon: Settings,
        title: "Configure Rules",
        description: "Set your rates, availability, screening questions, and deposit instructions in your private dashboard.",
        color: "text-yellow-400",
        bg: "bg-yellow-900/20",
        border: "border-yellow-800/40",
    },
    {
        number: "03",
        icon: Zap,
        title: "Share & Earn",
        description: "Clients click your link and chat with your AI. It acts as your receptionist, screens them, and takes deposits.",
        color: "text-green-400",
        bg: "bg-green-900/20",
        border: "border-green-800/40",
    },
]

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-24 bg-black/40 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="container px-4 md:px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <span className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
                            Simple Setup
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Up and Running in <span className="text-yellow-400">Three Steps</span>
                        </h2>
                        <p className="text-gray-400 max-w-xl mx-auto">
                            No technical skills required. We do the heavy lifting — you just answer a few questions.
                        </p>
                    </motion.div>
                </div>

                {/* Steps */}
                <div className="relative flex flex-col md:flex-row gap-8 md:gap-6 max-w-5xl mx-auto">
                    {/* Connector line (desktop) */}
                    <div className="hidden md:block absolute top-14 left-[16.66%] right-[16.66%] h-px bg-gradient-to-r from-purple-800/50 via-yellow-700/40 to-green-800/50" />

                    {steps.map((step, index) => (
                        <motion.div
                            key={step.number}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.15 }}
                            viewport={{ once: true }}
                            className="flex-1 relative"
                        >
                            <div className={`flex flex-col items-center text-center p-8 rounded-2xl border ${step.border} bg-gray-900/40 backdrop-blur-sm hover:bg-gray-900/60 transition-colors`}>
                                {/* Number badge + icon */}
                                <div className="relative mb-6">
                                    <div className={`w-14 h-14 rounded-2xl ${step.bg} border ${step.border} flex items-center justify-center`}>
                                        <step.icon className={`w-7 h-7 ${step.color}`} />
                                    </div>
                                    <span className="absolute -top-2 -right-2 text-xs font-bold text-gray-600 bg-gray-900 border border-gray-800 rounded-full w-6 h-6 flex items-center justify-center">
                                        {step.number}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                                <p className="text-gray-400 leading-relaxed text-sm">{step.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
