"use client"

import { motion } from "framer-motion"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

// Simple Avatar component since I didn't create it yet
function SimpleAvatar({ src, fallback, className }: { src?: string, fallback: string, className?: string }) {
    return (
        <div className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-700", className)}>
            {src ? (
                <img className="aspect-square h-full w-full" src={src} alt="Avatar" />
            ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full bg-muted text-xs font-medium text-white">
                    {fallback}
                </div>
            )}
        </div>
    )
}

const messages = [
    {
        role: "user",
        content: "Hi, I saw your ad and I’m interested in booking. What’s your availability this week?",
        time: "Tue 9:00 AM"
    },
    {
        role: "assistant",
        content: "Hi love, thank you for reaching out. I’m available tomorrow after 6pm and Friday between 12pm–9pm. What time works best for you?",
        time: "Tue 9:01 AM"
    },
    {
        role: "user",
        content: "Tomorrow at 7pm works.",
        time: "Tue 9:05 AM"
    },
    {
        role: "assistant",
        content: "Perfect. Before we confirm, I do a quick light screening for safety. Could you please share: Your first name, general occupation, and a phone number. Nothing sensitive is required.",
        time: "Tue 9:06 AM"
    },
    {
        role: "user",
        content: "Sure. I’m Daniel, I work in IT, and my number is 416-555-8291. What do you do with this info?",
        time: "Tue 9:10 AM"
    },
    {
        role: "assistant",
        content: "It’s only for safety and to ensure clients are real people. I don’t save or store personal information — your privacy matters. Once the booking is complete, it’s deleted.",
        time: "Tue 9:11 AM"
    },
    {
        role: "assistant",
        content: "The rate for the 1-hour booking is $300. A $40 deposit is required to secure your time. Accepted methods: e-Transfer, Cash App, PayPal, or crypto (USDT). Would you like the payment details?",
        time: "Tue 9:11 AM"
    },
    {
        role: "user",
        content: "Yes, send them.",
        time: "Tue 9:12 AM"
    },
    {
        role: "assistant",
        content: "Here you go: [Payment Link]. Once received, I’ll confirm the booking and send the address 1 hour before the session.",
        time: "Tue 9:12 AM"
    },
    {
        role: "user",
        content: "Deposit sent.",
        time: "Tue 9:20 AM"
    },
    {
        role: "assistant",
        content: "Got it, thank you. Your 7pm tomorrow appointment is confirmed. I’ll share the location around 6pm. Looking forward to meeting you.",
        time: "Tue 9:21 AM"
    },
    {
        role: "assistant",
        content: "Hi Daniel, hope your day’s going well. Here is the address for your 7pm booking: [Location]. Please text when you arrive.",
        time: "Wed 6:00 PM"
    },
    {
        role: "user",
        content: "Will do. I’m 10 minutes out.",
        time: "Wed 6:50 PM"
    },
    {
        role: "user",
        content: "Hey, it’s Daniel from last time. Are you available tonight?",
        time: "Fri 4:00 PM"
    },
    {
        role: "assistant",
        content: "Hi Daniel! No screening needed this time — thanks for being a returning client. I’m available after 9pm. Would you like 1 hour or 90 minutes?",
        time: "Fri 4:01 PM"
    }
]

export default function DemoChat() {
    return (
        <section id="demo-chat" className="py-24 bg-black/30">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                    <div className="lg:w-1/2">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                            See It In Action
                        </h2>
                        <p className="text-gray-400 text-lg mb-8">
                            VelvetAssist handles inquiries naturally. It knows your rules, checks your calendar, and guides respectful clients to book—all while you relax.
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

                    <div className="lg:w-1/2 w-full max-w-md mx-auto">
                        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl shadow-purple-900/20">
                            {/* Chat Header */}
                            <div className="bg-gray-800 p-4 flex items-center border-b border-gray-700">
                                <div className="w-3 h-3 bg-red-500 rounded-full mr-2" />
                                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2" />
                                <div className="w-3 h-3 bg-green-500 rounded-full mr-4" />
                                <div className="flex items-center">
                                    <SimpleAvatar fallback="VA" className="h-8 w-8 mr-3 bg-purple-600" />
                                    <div>
                                        <p className="text-sm font-medium text-white">VelvetAssist AI</p>
                                        <p className="text-xs text-green-400">Online</p>
                                    </div>
                                </div>
                            </div>

                            {/* Chat Messages */}
                            <div className="p-6 space-y-4 h-[400px] overflow-y-auto bg-gray-950/50">
                                {messages.map((msg, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: index * 0.5 }}
                                        viewport={{ once: true }}
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
                            </div>

                            {/* Chat Input Placeholder */}
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
