"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

function SimpleAvatar({ fallback, className }: { fallback: string; className?: string }) {
    return (
        <div className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}>
            <div className="flex h-full w-full items-center justify-center rounded-full text-xs font-medium text-white">
                {fallback}
            </div>
        </div>
    )
}

const messages = [
    {
        role: "user",
        content: "Hi, I saw your ad and I'm interested in booking. What's your availability this week?",
        time: "Tue 9:00 AM"
    },
    {
        role: "assistant",
        content: "Hi love, thank you for reaching out. I'm available tomorrow after 6pm and Friday between 12pm–9pm. What time works best for you?",
        time: "Tue 9:01 AM"
    },
    {
        role: "user",
        content: "Tomorrow at 7pm works.",
        time: "Tue 9:05 AM"
    },
    {
        role: "assistant",
        content: "Perfect. Before we confirm, I do a quick light screening for safety. Could you share your first name, general occupation, and a phone number?",
        time: "Tue 9:06 AM"
    },
    {
        role: "user",
        content: "Sure. I'm Daniel, I work in IT, and my number is 416-555-8291.",
        time: "Tue 9:10 AM"
    },
    {
        role: "assistant",
        content: "Thank you, Daniel. Your privacy matters — this info is only for safety and deleted once the booking is complete.",
        time: "Tue 9:11 AM"
    },
    {
        role: "assistant",
        content: "The rate for 1 hour is $300. A $40 deposit secures your time. Would you like the payment details?",
        time: "Tue 9:11 AM"
    },
    {
        role: "user",
        content: "Yes, send them.",
        time: "Tue 9:12 AM"
    },
    {
        role: "assistant",
        content: "Here you go: [Payment Link]. Once received, I'll confirm the booking and send the address 1 hour before.",
        time: "Tue 9:12 AM"
    },
    {
        role: "user",
        content: "Deposit sent.",
        time: "Tue 9:20 AM"
    },
    {
        role: "assistant",
        content: "Got it — your 7pm appointment is confirmed. I'll share the location around 6pm. Looking forward to meeting you. ✨",
        time: "Tue 9:21 AM"
    },
    {
        role: "user",
        content: "Hey, it's Daniel from last time. Are you available tonight?",
        time: "Fri 4:00 PM"
    },
    {
        role: "assistant",
        content: "Hi Daniel! No screening needed — thanks for being a returning client. I'm available after 9pm. Would you like 1 hour or 90 minutes?",
        time: "Fri 4:01 PM"
    }
]

const MESSAGE_DELAY_MS = 1200
const TYPING_DURATION_MS = 900

export default function DemoChat() {
    const [visibleCount, setVisibleCount] = useState(0)
    const [isTyping, setIsTyping] = useState(false)
    const [hasStarted, setHasStarted] = useState(false)

    useEffect(() => {
        if (!hasStarted) return
        if (visibleCount >= messages.length) return

        const next = messages[visibleCount]
        const delay = next.role === "assistant" ? TYPING_DURATION_MS : MESSAGE_DELAY_MS * 0.4

        const typingTimer = next.role === "assistant"
            ? setTimeout(() => setIsTyping(true), MESSAGE_DELAY_MS * 0.3)
            : null

        const revealTimer = setTimeout(() => {
            setIsTyping(false)
            setVisibleCount((c) => c + 1)
        }, MESSAGE_DELAY_MS + delay)

        return () => {
            if (typingTimer) clearTimeout(typingTimer)
            clearTimeout(revealTimer)
        }
    }, [visibleCount, hasStarted])

    return (
        <section id="demo-chat" className="py-24 bg-black/30">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                    {/* Left copy */}
                    <div className="lg:w-1/2">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                            See It In Action
                        </h2>
                        <p className="text-gray-400 text-lg mb-8">
                            VelvetAssist handles inquiries naturally. It knows your rules, checks your calendar, and guides respectful clients to book — all while you relax.
                        </p>
                        <ul className="space-y-4 text-gray-300">
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                                Responds in under 5 seconds
                            </li>
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                                Polite but firm on boundaries
                            </li>
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                                Escalates only important messages to you
                            </li>
                        </ul>
                    </div>

                    {/* Chat window */}
                    <div className="lg:w-1/2 w-full max-w-md mx-auto">
                        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl shadow-purple-900/20">
                            {/* Chat header */}
                            <div className="bg-gray-800 p-4 flex items-center border-b border-gray-700">
                                <div className="w-3 h-3 bg-red-500 rounded-full mr-2" />
                                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2" />
                                <div className="w-3 h-3 bg-green-500 rounded-full mr-4" />
                                <div className="flex items-center">
                                    <SimpleAvatar fallback="VA" className="h-8 w-8 mr-3 bg-purple-600" />
                                    <div>
                                        <p className="text-sm font-medium text-white">VelvetAssist AI</p>
                                        <p className={cn("text-xs transition-colors", isTyping ? "text-yellow-400" : "text-green-400")}>
                                            {isTyping ? "typing..." : "Online"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="p-6 space-y-4 h-[420px] overflow-y-auto bg-gray-950/50 scroll-smooth">
                                <AnimatePresence>
                                    {messages.slice(0, visibleCount).map((msg, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 12, scale: 0.96 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            transition={{ duration: 0.3, ease: "easeOut" }}
                                            className={cn(
                                                "flex w-full",
                                                msg.role === "user" ? "justify-end" : "justify-start"
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
                                                    msg.role === "user"
                                                        ? "bg-purple-600 text-white rounded-br-none"
                                                        : "bg-gray-800 text-gray-200 rounded-bl-none"
                                                )}
                                            >
                                                <p>{msg.content}</p>
                                                <p className="text-[10px] opacity-50 mt-1 text-right">{msg.time}</p>
                                            </div>
                                        </motion.div>
                                    ))}

                                    {/* Typing indicator */}
                                    {isTyping && (
                                        <motion.div
                                            key="typing"
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="flex justify-start"
                                        >
                                            <div className="bg-gray-800 rounded-2xl rounded-bl-none px-4 py-3">
                                                <span className="flex gap-1 items-center h-4">
                                                    {[0, 1, 2].map((i) => (
                                                        <span
                                                            key={i}
                                                            className="w-1.5 h-1.5 rounded-full bg-gray-400"
                                                            style={{
                                                                animation: "bounce 1.2s infinite",
                                                                animationDelay: `${i * 0.2}s`
                                                            }}
                                                        />
                                                    ))}
                                                </span>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Start prompt */}
                                {!hasStarted && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex flex-col items-center justify-center h-full gap-4 py-12"
                                    >
                                        <p className="text-gray-500 text-sm">Watch a live booking unfold</p>
                                        <button
                                            onClick={() => setHasStarted(true)}
                                            className="px-5 py-2 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors"
                                        >
                                            ▶ Play Demo
                                        </button>
                                    </motion.div>
                                )}
                            </div>

                            {/* Input placeholder */}
                            <div className="p-4 bg-gray-800 border-t border-gray-700">
                                <div className="h-10 bg-gray-700/50 rounded-full w-full animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    )
}
