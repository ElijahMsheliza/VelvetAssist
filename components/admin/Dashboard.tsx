"use client"

import { motion } from "framer-motion"
import { Users, Activity, ShieldCheck, Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AdminStats {
    totalProfiles: number
    activeAssistants: number
    totalConversations: number
}

interface RecentProfile {
    display_name: string
    created_at: string
}

export default function Dashboard({ stats, recentProfiles }: { stats: AdminStats, recentProfiles: RecentProfile[] }) {
    // Dynamic Data
    const metrics = [
        {
            title: "Total Users",
            value: stats.totalProfiles.toString(),
            change: "Registered profiles",
            icon: Users,
            color: "text-blue-400"
        },
        {
            title: "Active Assistants",
            value: stats.activeAssistants.toString(),
            change: "Configured bots",
            icon: ShieldCheck,
            color: "text-green-400"
        },
        {
            title: "Total Conversations",
            value: stats.totalConversations.toString(),
            change: "All-time chats",
            icon: Activity,
            color: "text-purple-400"
        },
        {
            title: "System Status",
            value: "Online",
            change: "All services running",
            icon: Star,
            color: "text-yellow-400"
        }
    ]

    const activities = recentProfiles.map(p => ({
        user: p.display_name || "Unknown User",
        action: "Joined VelvetAssist",
        time: new Date(p.created_at).toLocaleDateString(),
        icon: Users
    }))

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    }

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                        <p className="text-zinc-400">Welcome back, Admin</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900 rounded-full border border-zinc-800">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-sm font-medium text-zinc-300">System Operational</span>
                    </div>
                </div>

                {/* Metrics Grid */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {metrics.map((metric) => (
                        <motion.div key={metric.title} variants={item}>
                            <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm hover:border-zinc-700 transition-colors">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-zinc-400">
                                        {metric.title}
                                    </CardTitle>
                                    <metric.icon className={`h-4 w-4 ${metric.color}`} />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-white">{metric.value}</div>
                                    <p className="text-xs text-zinc-500 mt-1">{metric.change}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-xl text-white">Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {activities.map((activity, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-zinc-950/50 border border-zinc-800/50 hover:border-zinc-700 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 rounded-full bg-zinc-900 border border-zinc-800">
                                                <activity.icon className="w-4 h-4 text-zinc-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-white">{activity.user}</p>
                                                <p className="text-xs text-zinc-500">{activity.action}</p>
                                            </div>
                                        </div>
                                        <div className="text-xs text-zinc-500 font-mono">
                                            {activity.time}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}
