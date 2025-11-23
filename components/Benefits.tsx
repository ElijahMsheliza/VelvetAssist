"use client"

import { CheckCircle2 } from "lucide-react"

const benefits = [
    "Filter out 90% of time-wasters instantly",
    "Increase booking conversion by 40%",
    "Never miss a late-night inquiry again",
    "Keep your personal number private",
    "Look professional with instant responses",
    "Collect deposits automatically",
]

export default function Benefits() {
    return (
        <section className="py-24 bg-background">
            <div className="container px-4 md:px-6 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">Why Top Companions Choose VelvetAssist</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center space-x-4 p-4 rounded-xl bg-gray-900/30 border border-gray-800/50">
                            <CheckCircle2 className="w-6 h-6 text-yellow-500 shrink-0" />
                            <span className="text-lg text-gray-300 text-left">{benefit}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
