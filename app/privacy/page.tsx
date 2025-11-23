import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPolicy() {
    return (
        <main className="min-h-screen bg-background text-foreground py-24 px-4 md:px-6">
            <div className="max-w-3xl mx-auto">
                <Link href="/">
                    <Button variant="ghost" className="mb-8 pl-0 hover:bg-transparent hover:text-yellow-500">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Home
                    </Button>
                </Link>

                <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">Privacy Policy</h1>

                <div className="space-y-8 text-gray-300 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">Your Privacy Matters</h2>
                        <p>
                            At VelvetAssist, we believe privacy is the ultimate luxury. We treat your personal information with the same discretion and respect that you expect from a professional assistant.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">What We Collect</h2>
                        <p>
                            Right now, we only collect one thing: <strong>your email address</strong>.
                        </p>
                        <p className="mt-2">
                            We ask for this solely to add you to our waitlist so we can let you know when VelvetAssist is ready for you.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">How We Use It</h2>
                        <p>
                            We use your email for one purpose: to send you updates about our launch and your spot on the waitlist. That’s it. We won't spam you with unrelated offers.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">Who Sees Your Data?</h2>
                        <p>
                            <strong>We do not sell your data.</strong> Ever.
                        </p>
                        <p className="mt-2">
                            We use a trusted service called Formspree to securely handle our email list. They process the data on our behalf, but they don't own it—we do. And we keep it safe.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">Your Control</h2>
                        <p>
                            If you change your mind and want to leave the waitlist, just reply to any email we send you, or contact us directly. We will remove your information immediately.
                        </p>
                    </section>

                    <section className="pt-8 border-t border-white/10">
                        <p className="text-sm text-gray-500">
                            Questions? Contact us at <a href="mailto:support@velvetassist.com" className="text-yellow-500 hover:underline">support@velvetassist.com</a>
                        </p>
                    </section>
                </div>
            </div>
        </main>
    )
}
