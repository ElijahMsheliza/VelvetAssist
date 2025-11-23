import Hero from "@/components/Hero"
import Problem from "@/components/Problem"
import Solution from "@/components/Solution"
import DemoChat from "@/components/DemoChat"
import Benefits from "@/components/Benefits"
import FAQ from "@/components/FAQ"
import WaitlistForm from "@/components/WaitlistForm"
import Footer from "@/components/Footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Hero />
      <Problem />
      <Solution />
      <DemoChat />
      <Benefits />
      <FAQ />
      <WaitlistForm />
      <Footer />
    </main>
  )
}
