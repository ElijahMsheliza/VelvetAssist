"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface Conversation {
    id: string
    client_name: string | null
    created_at: string
    status: string | null
    transcript: Message[]
}

const BookingsView = React.memo(({ conversations }: { conversations: Conversation[] }) => {
    const [selectedConv, setSelectedConv] = useState<Conversation | null>(null)

    if (!conversations || conversations.length === 0) {
        return (
            <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-xl text-white">Recent Bookings</CardTitle>
                    <CardDescription className="text-gray-400">
                        No bookings yet. When clients complete the booking flow, their chat transcripts will appear here.
                    </CardDescription>
                </CardHeader>
            </Card>
        )
    }

    return (
        <Card className="bg-zinc-900/50 border-zinc-800 relative">
            <CardHeader>
                <CardTitle className="text-xl text-white">Recent Bookings</CardTitle>
                <CardDescription className="text-gray-400">
                    Review completed booking chats to manually confirm meeting details or verify payment drops.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {conversations.map(conv => (
                    <div key={conv.id} className="p-4 bg-zinc-950 border border-zinc-800 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h4 className="text-emerald-400 font-medium tracking-wide">
                                {conv.client_name || "Client Booking Request"}
                            </h4>
                            <p className="text-sm text-zinc-400 mt-1">
                                {new Date(conv.created_at).toLocaleDateString()} at {new Date(conv.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                            <span className="inline-flex items-center mt-2 px-2 py-0.5 rounded text-xs font-semibold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                                {conv.status || "Completed"}
                            </span>
                        </div>
                        <Button 
                            variant="outline" 
                            className="bg-zinc-900 border-zinc-700 hover:bg-zinc-800 text-white w-full sm:w-auto shrink-0"
                            onClick={() => setSelectedConv(conv)}
                        >
                            <MessageSquare className="w-4 h-4 mr-2 text-yellow-500" />
                            View Transcript
                        </Button>
                    </div>
                ))}
            </CardContent>

            {/* Transcript Modal */}
            <AnimatePresence>
                {selectedConv && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setSelectedConv(null)}
                    >
                        <motion.div 
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-zinc-950 border border-zinc-800 rounded-xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center p-4 border-b border-zinc-800 shrink-0">
                                <div>
                                    <h3 className="text-lg font-medium text-white">Transcript: {selectedConv.client_name || "Client"}</h3>
                                    <p className="text-xs text-zinc-500">{new Date(selectedConv.created_at).toLocaleString()}</p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setSelectedConv(null)} className="text-zinc-400 hover:text-white">
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {selectedConv.transcript?.filter(m => m.role !== 'system').map((msg, idx) => (
                                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                                            msg.role === 'user' 
                                                ? 'bg-yellow-500 text-black font-medium rounded-br-sm' 
                                                : 'bg-zinc-900 text-zinc-100 border border-zinc-800 rounded-bl-sm'
                                        }`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </Card>
    )
})

BookingsView.displayName = "BookingsView"

export default BookingsView
