import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function TermsOfService() {
    return (
        <main className="min-h-screen bg-background text-foreground py-24 px-4 md:px-6">
            <div className="max-w-3xl mx-auto">
                <Link href="/">
                    <Button variant="ghost" className="mb-8 pl-0 hover:bg-transparent hover:text-yellow-500">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Home
                    </Button>
                </Link>

                <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">Terms of Service</h1>

                <div className="space-y-8 text-gray-300 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
                        <p>
                            Welcome to VelvetAssist. By joining our waitlist, you agree to these simple terms. We are currently in a pre-launch phase, gathering interest from future users.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">2. The Waitlist</h2>
                        <p>
                            Joining the waitlist does not guarantee access to the final product. It simply means you will be notified when spots become available. We reserve the right to curate our community to ensure safety and quality for all members.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">3. User Conduct</h2>
                        <p>
                            VelvetAssist is built on trust and discretion. Any attempt to abuse the waitlist system, including bot sign-ups or malicious activity, will result in immediate removal.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">4. Disclaimer</h2>
                        <p>
                            VelvetAssist is provided &quot;as is&quot; during this beta phase. We make no warranties regarding the availability or functionality of the future service.
                        </p>
                    </section>

                    <section className="pt-8 border-t border-white/10">
                        <p className="text-sm text-gray-500">
                            Last Updated: December 2025
                        </p>
                    </section>
                </div>
            </div>
        </main>
    )
}
