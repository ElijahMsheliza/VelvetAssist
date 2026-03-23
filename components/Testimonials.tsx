"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"

const testimonials = [
    {
        name: "Isabelle M.",
        handle: "@isa_luxe",
        quote: "I used to spend 3 hours a day just replying to messages. VelvetAssist cut that down to 20 minutes. It handles everything professionally and I only step in for confirmed bookings.",
        rating: 5,
    },
    {
        name: "Camille R.",
        handle: "@camille.vip",
        quote: "The tone matching is incredible — clients can't distinguish it from a human assistant. My no-show rate dropped by 60% since I started collecting deposits automatically.",
        rating: 5,
    },
    {
        name: "Natalie V.",
        handle: "@nataliev.priv",
        quote: "Privacy was my biggest concern. It never shares anything I haven't approved, and my real contact details stay 100% hidden. I couldn't go back to managing this manually.",
        rating: 5,
    },
    {
        name: "Sofia L.",
        handle: "@sofia.l.private",
        quote: "Setting it up took less than 5 minutes. Within the first week it had already screened out time-wasters I would have spent an hour going back and forth with. Worth every penny.",
        rating: 5,
    },
]

function StarRating({ count }: { count: number }) {
    return (
        <div className="flex gap-0.5">
            {Array.from({ length: count }).map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            ))}
        </div>
    )
}

export default function Testimonials() {
    return (
        <section className="py-24 bg-background relative overflow-hidden">
            {/* Glow */}
            <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-yellow-600/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="container px-4 md:px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <span className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase bg-purple-500/10 border border-purple-500/20 text-purple-400">
                            Real Results
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            What Our Users <span className="text-yellow-400">Are Saying</span>
                        </h2>
                        <p className="text-gray-400 max-w-xl mx-auto">
                            From companions who use VelvetAssist every day. Names and handles are anonymised for privacy.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    {testimonials.map((t, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="relative flex flex-col bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-yellow-500/20 hover:bg-gray-900/70 transition-all duration-300"
                        >
                            {/* Big quote mark */}
                            <span className="absolute top-4 right-6 text-6xl text-gray-800 font-serif leading-none select-none">
                                &ldquo;
                            </span>

                            {/* Stars */}
                            <StarRating count={t.rating} />

                            {/* Quote */}
                            <p className="mt-4 mb-6 text-gray-300 leading-relaxed text-sm flex-1 relative z-10">
                                {t.quote}
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-3 border-t border-gray-800 pt-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-yellow-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                                    {t.name[0]}
                                </div>
                                <div>
                                    <p className="text-white text-sm font-semibold">{t.name}</p>
                                    <p className="text-gray-500 text-xs">{t.handle}</p>
                                </div>
                                <span className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                                    Verified User
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
