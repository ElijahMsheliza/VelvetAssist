"use client"

import { motion } from "framer-motion"
import { Users } from "lucide-react"

interface WaitlistCounterProps {
    count: string | number
}

export default function WaitlistCounter({ count }: WaitlistCounterProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-2 mb-6"
        >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.1)]">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                </span>
                <span className="text-sm font-medium text-yellow-200/90">
                    <span className="font-bold text-yellow-400">{count}</span> companions have already joined
                </span>
            </div>
        </motion.div>
    )
}
