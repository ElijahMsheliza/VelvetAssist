"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { Users } from "lucide-react"

interface WaitlistCounterProps {
    count: number
}

export default function WaitlistCounter({ count }: WaitlistCounterProps) {
    const [displayed, setDisplayed] = useState(0)
    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { once: true, margin: "-50px" })

    useEffect(() => {
        if (!isInView) return

        const duration = 1800 // ms
        const startTime = performance.now()

        const animate = (now: number) => {
            const elapsed = now - startTime
            const progress = Math.min(elapsed / duration, 1)
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3)
            setDisplayed(Math.floor(eased * count))
            if (progress < 1) requestAnimationFrame(animate)
        }

        const raf = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(raf)
    }, [isInView, count])

    return (
        <motion.div
            ref={ref}
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
                <Users className="w-3.5 h-3.5 text-yellow-400" />
                <span className="text-sm font-medium text-yellow-200/90">
                    <span className="font-bold text-yellow-400 tabular-nums">{displayed}+</span> companions are already using VelvetAssist
                </span>
            </div>
        </motion.div>
    )
}
