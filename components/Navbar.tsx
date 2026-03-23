"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

const navLinks = [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Demo", href: "#demo-chat" },
    { label: "FAQ", href: "#faq" },
]

function scrollTo(id: string) {
    const el = document.getElementById(id.replace("#", ""))
    if (el) el.scrollIntoView({ behavior: "smooth" })
}

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50)
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    return (
        <header
            className={cn(
                "fixed top-0 inset-x-0 z-50 transition-all duration-300",
                scrolled
                    ? "bg-black/70 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/40"
                    : "bg-transparent"
            )}
        >
            <div className="container px-4 md:px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="flex items-center gap-2 group"
                >
                    <span className="font-serif text-xl text-white group-hover:text-yellow-400 transition-colors">
                        Velvet<span className="text-yellow-400">Assist</span>
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                </button>

                {/* Desktop links */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <button
                            key={link.label}
                            onClick={() => scrollTo(link.href)}
                            className="text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            {link.label}
                        </button>
                    ))}
                </nav>

                {/* CTA + hamburger */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => window.location.href = '/login'}
                        className="hidden md:inline-flex text-sm font-semibold text-gray-300 hover:text-white transition-colors"
                    >
                        Log In
                    </button>
                    <Button
                        variant="luxury"
                        size="sm"
                        className="hidden md:inline-flex text-sm font-semibold"
                        onClick={() => window.location.href = '/login'}
                    >
                        Get Started
                    </Button>

                    {/* Mobile burger */}
                    <button
                        className="md:hidden text-gray-400 hover:text-white transition-colors"
                        onClick={() => setMenuOpen((p) => !p)}
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="md:hidden overflow-hidden bg-black/90 backdrop-blur-xl border-b border-white/10"
                    >
                        <nav className="flex flex-col p-4 gap-4">
                            {navLinks.map((link) => (
                                <button
                                    key={link.label}
                                    onClick={() => { scrollTo(link.href); setMenuOpen(false) }}
                                    className="text-left text-base text-gray-300 hover:text-white py-2 border-b border-white/5 transition-colors"
                                >
                                    {link.label}
                                </button>
                            ))}
                            <button
                                onClick={() => { window.location.href = '/login'; setMenuOpen(false) }}
                                className="text-left text-base text-gray-300 hover:text-white py-2 border-b border-white/5 transition-colors"
                            >
                                Log In
                            </button>
                            <Button
                                variant="luxury"
                                className="w-full mt-2 font-semibold"
                                onClick={() => { window.location.href = '/login'; setMenuOpen(false) }}
                            >
                                Get Started
                            </Button>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}
