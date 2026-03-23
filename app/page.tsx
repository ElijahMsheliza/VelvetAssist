import Navbar from "@/components/Navbar"
import Hero from "@/components/Hero"
import dynamic from "next/dynamic"

const Problem = dynamic(() => import("@/components/Problem"))
const Solution = dynamic(() => import("@/components/Solution"))
const HowItWorks = dynamic(() => import("@/components/HowItWorks"))
const DemoChat = dynamic(() => import("@/components/DemoChat"))
const Benefits = dynamic(() => import("@/components/Benefits"))
const Testimonials = dynamic(() => import("@/components/Testimonials"))
const FAQ = dynamic(() => import("@/components/FAQ"))
const FinalCTA = dynamic(() => import("@/components/FinalCTA"))
const Footer = dynamic(() => import("@/components/Footer"))

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <Hero />
      <Problem />
      <Solution />
      <HowItWorks />
      <DemoChat />
      <Benefits />
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  )
}
