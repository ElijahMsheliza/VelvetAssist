export default function Footer() {
    return (
        <footer className="py-12 border-t border-gray-900 bg-black text-center">
            <div className="container px-4 md:px-6">
                <p className="text-gray-500 text-sm mb-4">
                    Discreet. Private. Built for you.
                </p>
                <p className="text-gray-600 text-xs">
                    &copy; {new Date().getFullYear()} VelvetAssist. All rights reserved.
                </p>
                <p className="text-gray-700 text-xs mt-2">
                    Contact: support@velvetassist.com
                </p>
            </div>
        </footer>
    )
}
