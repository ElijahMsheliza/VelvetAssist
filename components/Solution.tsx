"use client"

import { motion } from "framer-motion"
import { Zap, ShieldCheck, MessageCircleHeart, CalendarCheck, Lock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const features = [
    {
        icon: Zap,
        title: "Instant Replies",
        description: "Responds to inquiries in seconds, 24/7, so you never miss a client.",
    },
    {
        icon: ShieldCheck,
        title: "Automated Screening",
        description: "Smartly filters out time-wasters and flags red flags before they reach you.",
    },
    {
        icon: MessageCircleHeart,
        title: "Tone Matching",
        description: "Learns your unique voice so clients feel like they're talking to you.",
    },
    {
        icon: CalendarCheck,
        title: "Booking Flow",
        description: "Handles scheduling and deposit guidance automatically.",
    },
    {
        icon: Lock,
        title: "Privacy First",
        description: "Operates without revealing your personal phone number.",
    },
]

export default function Solution() {
    return (
        <section className="py-24 bg-background relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[100px] -translate-y-1/2" />

            <div className="container px-4 md:px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Meet Your New <span className="text-yellow-500">Super-Assistant</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        VelvetAssist takes over the tedious parts of booking, giving you control back.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <Card className="h-full bg-gray-900/40 border-gray-800 hover:border-yellow-500/30 hover:bg-gray-900/60 transition-all duration-300">
                                <CardHeader>
                                    <div className="w-12 h-12 rounded-lg bg-purple-900/20 flex items-center justify-center text-purple-400 mb-4">
                                        <feature.icon className="w-6 h-6" />
                                    </div>
                                    <CardTitle className="text-white">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-gray-400 text-base">
                                        {feature.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
