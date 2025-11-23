import Link from "next/link"

export default function Footer() {
    return (
        <footer className="py-12 bg-black border-t border-white/10">
            <div className="container px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                    <p className="text-lg font-serif text-white mb-2">VelvetAssist</p>
                    <p className="text-sm text-gray-500">Discreet. Private. Built for you.</p>
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-500">
                    <Link href="/privacy" className="hover:text-yellow-500 transition-colors">
                        Privacy Policy
                    </Link>
                    <a href="mailto:support@velvetassist.com" className="hover:text-yellow-500 transition-colors">
                        support@velvetassist.com
                    </a>
                </div>

                <div className="text-xs text-gray-600">
                    © {new Date().getFullYear()} VelvetAssist. All rights reserved.
                </div>
            </div>
        </footer>
    )
}
