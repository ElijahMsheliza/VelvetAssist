export const maxDuration = 60
export const dynamic = 'force-dynamic'

export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
        <div className="min-h-screen flex flex-col">
            <header className="border-b border-zinc-800 bg-black/50 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <span className="font-serif text-xl font-bold bg-gradient-to-r from-yellow-200 to-yellow-500 bg-clip-text text-transparent">
                        VelvetAssist
                    </span>
                    <form action="/auth/signout" method="post">
                        <button type="submit" className="text-sm text-zinc-400 hover:text-white transition-colors">
                            Sign Out
                        </button>
                    </form>
                </div>
            </header>
            <main className="flex-1 bg-black">
                {children}
            </main>
        </div>
    )
  }
