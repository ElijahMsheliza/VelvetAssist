import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Billing Skeleton */}
            <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader className="space-y-2">
                    <Skeleton className="h-6 w-1/3 bg-zinc-800" />
                    <Skeleton className="h-4 w-2/3 bg-zinc-800" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-10 w-48 bg-zinc-800" />
                </CardContent>
            </Card>

            {/* Link Skeleton */}
            <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader className="space-y-2">
                    <Skeleton className="h-6 w-1/4 bg-zinc-800" />
                    <Skeleton className="h-4 w-1/2 bg-zinc-800" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-16 w-full bg-zinc-800 rounded-lg" />
                </CardContent>
            </Card>

            {/* Config Skeleton */}
            <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader className="space-y-2">
                    <Skeleton className="h-6 w-1/3 bg-zinc-800" />
                    <Skeleton className="h-4 w-1/2 bg-zinc-800" />
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-32 bg-zinc-800" />
                        <Skeleton className="h-10 w-full bg-zinc-800" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-32 bg-zinc-800" />
                        <Skeleton className="h-24 w-full bg-zinc-800" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-32 bg-zinc-800" />
                        <Skeleton className="h-24 w-full bg-zinc-800" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
