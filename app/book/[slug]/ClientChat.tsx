'use client'

import { useChat } from '@ai-sdk/react'
import type { Message } from 'ai'
import { motion, AnimatePresence } from 'framer-motion'
import { Send } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useEffect, useRef, useState } from 'react'

export default function ClientChat({ profileId, displayName, isWidget = false }: { profileId: string, displayName: string, isWidget?: boolean }) {
  const [conversationId] = useState(() => crypto.randomUUID())
  
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    body: {
      profileId,
      conversationId
    },
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: `Hi there! I'm ${displayName}'s virtual assistant. How can I help you book an appointment today?`
      }
    ]
  })

  const endOfMessagesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className={`w-full max-w-lg bg-zinc-950 flex flex-col relative shadow-2xl overflow-hidden ${isWidget ? 'h-screen w-screen border-none rounded-none' : 'h-[100dvh] md:h-[85vh] md:min-h-[600px] md:border border-zinc-800 md:rounded-2xl'}`}>
        <div className="h-16 border-b border-zinc-800/50 bg-black/50 backdrop-blur-md flex items-center px-4 shrink-0 z-10 relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-500 to-amber-700 flex flex-col items-center justify-center shrink-0">
                <span className="text-white font-serif font-bold text-sm">
                    {displayName.charAt(0).toUpperCase()}
                </span>
            </div>
            
            <div className="ml-3">
                <h3 className="text-sm font-semibold text-white leading-tight">
                    {displayName}&apos;s Assistant
                </h3>
                <p className="text-xs text-yellow-500 font-medium">
                    {isLoading ? "Typing..." : "Online"}
                </p>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 relative scroll-smooth bg-black">
            <AnimatePresence>
                {messages.map((m: Message) => (
                    <motion.div
                        key={m.id}
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`
                            max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed
                            ${m.role === 'user' 
                                ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-medium border border-yellow-400 rounded-br-sm shadow-md' 
                                : 'bg-gradient-to-br from-zinc-900 to-zinc-950 text-zinc-100 rounded-bl-sm border border-zinc-800 shadow-xl'
                            }
                        `}>
                            {m.content}
                            {m.toolInvocations?.map(tool => (
                                <div key={tool.toolCallId} className="text-xs text-yellow-500 mt-2 p-2 bg-yellow-500/10 rounded-lg flex flex-col gap-1 border border-yellow-500/20">
                                    <span className="font-semibold uppercase tracking-wider text-[10px]">System Notification</span>
                                    {tool.toolName === 'book_appointment' && tool.state === 'result' ? (
                                        <span>Action complete. Status: {(tool.result as any).message || 'Success'}</span>
                                    ) : (
                                        <span className="animate-pulse">Requesting appointment slot...</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex justify-start"
              >
                  <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 text-zinc-100 rounded-2xl rounded-bl-sm px-4 py-3 border border-zinc-800 shadow-xl flex items-center space-x-1 w-[60px]">
                      <span className="w-1.5 h-1.5 bg-yellow-500/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-yellow-500/70 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-yellow-500/90 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
              </motion.div>
            )}
            <div ref={endOfMessagesRef} className="h-4" />
        </div>

        <div className="p-4 bg-zinc-950/80 backdrop-blur-md border-t border-zinc-800/50 shrink-0">
            <form onSubmit={handleSubmit} className="relative flex items-center">
                <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Type your message..."
                    className="w-full bg-black/50 border-zinc-800 text-white placeholder:text-zinc-600 rounded-full pl-4 pr-12 h-12 focus-visible:ring-1 focus-visible:ring-yellow-500/50"
                    disabled={isLoading}
                />
                <Button 
                    type="submit" 
                    size="icon"
                    className="absolute right-1 w-10 h-10 rounded-full bg-yellow-500 hover:bg-yellow-400 text-black shrink-0 transition-transform active:scale-95 disabled:opacity-50"
                    disabled={isLoading || !input.trim()}
                >
                    <Send className="w-4 h-4 ml-0.5" />
                </Button>
            </form>
            <div className="text-center mt-3">
                <span className="text-[10px] text-zinc-600 font-medium">Powered by VelvetAssist</span>
            </div>
        </div>
    </div>
  )
}
