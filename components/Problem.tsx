"use client"

import { motion } from "framer-motion"
import { MessageSquareX, Clock, ShieldAlert, PhoneOff } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const problems = [
    {
        icon: MessageSquareX,
        title: "Time-Wasting Chats",
        description: "Hours spent replying to 'Hey' and 'u avail?' from people who never book.",
    },
    {
        icon: Clock,
        title: "Repetitive Questions",
        description: "Constantly repeating your rates, boundaries, and availability.",
    },
    {
        icon: ShieldAlert,
        title: "Manual Screening",
        description: "Struggling to verify if a client is safe or legitimate on your own.",
    },
    {
        icon: PhoneOff,
        title: "Missed Opportunities",
        description: "Losing potential bookings because you were asleep or offline.",
    },
]

export default function Problem() {
    return (
        <section className="py-24 bg-black/50 relative">
            <div className="container px-4 md:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">The Old Way is Exhausting</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Managing your own bookings shouldn't feel like a second full-time job.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {problems.map((problem, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <Card className="bg-gray-900/50 border-gray-800 hover:border-purple-900/50 transition-colors">
                                <CardContent className="flex items-start p-6 space-x-4">
                                    <div className="p-3 rounded-lg bg-red-900/20 text-red-400">
                                        <problem.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-white mb-2">{problem.title}</h3>
                                        <p className="text-gray-400">{problem.description}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
