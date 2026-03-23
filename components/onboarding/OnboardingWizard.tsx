"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

export default function OnboardingWizard({ userId, email }: { userId: string, email: string }) {
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const [form, setForm] = useState({
        displayName: email.split('@')[0],
        personaTone: "professional",
        serviceArea: "",
        rates: { hourly: "", multi_hour: "", overnight: "" },
        schedule: { monday: "", tuesday: "", wednesday: "", thursday: "", friday: "", saturday: "", sunday: "" },
        hardLimits: "",
        screeningReqs: [] as string[],
        depositRequired: false,
        depositAmount: ""
    })

    const supabase = createClient()

    const handleNext = () => setStep(s => s + 1)
    const handlePrev = () => setStep(s => s - 1)

    const toggleScreening = (req: string) => {
        setForm(prev => ({
            ...prev,
            screeningReqs: prev.screeningReqs.includes(req) 
                ? prev.screeningReqs.filter(r => r !== req)
                : [...prev.screeningReqs, req]
        }))
    }

    const handleSubmit = async () => {
        setLoading(true)
        try {
            const { error } = await supabase.from('profiles').update({
                display_name: form.displayName,
                persona_tone: form.personaTone,
                service_area: form.serviceArea,
                rates: form.rates,
                schedule: form.schedule,
                hard_limits: form.hardLimits,
                screening_reqs: form.screeningReqs,
                deposit_required: form.depositRequired,
                deposit_amount: form.depositRequired ? parseFloat(form.depositAmount) || 0 : 0
            }).eq('id', userId)

            if (error) throw error
            router.push('/dashboard')
            router.refresh()
        } catch (error) {
            console.error("Failed to save onboarding", error)
            alert("Failed to save profile. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <motion.div key="step1" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300">Working Name</label>
                            <Input value={form.displayName} onChange={e => setForm({...form, displayName: e.target.value})} className="bg-zinc-950 border-zinc-800 text-white" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300">City / Service Area</label>
                            <Input placeholder="e.g. NYC / Manhattan" value={form.serviceArea} onChange={e => setForm({...form, serviceArea: e.target.value})} className="bg-zinc-950 border-zinc-800 text-white" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300">Persona Tone</label>
                            <select 
                                value={form.personaTone} 
                                onChange={e => setForm({...form, personaTone: e.target.value})}
                                className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-md h-10 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
                            >
                                <option value="professional">Professional & Discreet</option>
                                <option value="warm">Warm & Girlfriend Experience (GFE)</option>
                                <option value="playful">Playful & Flirty</option>
                            </select>
                        </div>
                    </motion.div>
                )
            case 2:
                return (
                    <motion.div key="step2" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-300">Hourly Rate</label>
                                <Input placeholder="$300" value={form.rates.hourly} onChange={e => setForm({...form, rates: {...form.rates, hourly: e.target.value}})} className="bg-zinc-950 border-zinc-800 text-white" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-300">Multi-Hour Rate</label>
                                <Input placeholder="$500 / 2hrs" value={form.rates.multi_hour} onChange={e => setForm({...form, rates: {...form.rates, multi_hour: e.target.value}})} className="bg-zinc-950 border-zinc-800 text-white" />
                            </div>
                            <div className="col-span-2 space-y-2">
                                <label className="text-sm font-medium text-zinc-300">Overnight Rate</label>
                                <Input placeholder="$1500" value={form.rates.overnight} onChange={e => setForm({...form, rates: {...form.rates, overnight: e.target.value}})} className="bg-zinc-950 border-zinc-800 text-white" />
                            </div>
                        </div>
                        <div className="space-y-2 pt-2">
                            <label className="text-sm font-medium text-zinc-300">Hard Limits & Services Not Offered</label>
                            <textarea 
                                value={form.hardLimits} 
                                onChange={e => setForm({...form, hardLimits: e.target.value})}
                                placeholder="e.g. No Greek, no bare." 
                                className="w-full h-20 bg-zinc-950 border border-zinc-800 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
                            />
                        </div>
                    </motion.div>
                )
            case 3:
                return (
                    <motion.div key="step3" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="space-y-4">
                         <div className="space-y-3">
                            <label className="text-sm font-medium text-zinc-300">Weekly Availability</label>
                            {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                                <div key={day} className="flex items-center gap-2">
                                    <span className="w-24 text-sm text-zinc-400 capitalize">{day}</span>
                                    <Input 
                                        placeholder="e.g. 10am - 8pm or Off" 
                                        value={form.schedule[day as keyof typeof form.schedule]} 
                                        onChange={e => setForm({...form, schedule: {...form.schedule, [day]: e.target.value}})} 
                                        className="h-9 bg-zinc-950 border-zinc-800 text-white flex-1" 
                                    />
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )
            case 4:
                return (
                    <motion.div key="step4" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="space-y-4">
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-zinc-300">Screening Requirements</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {["Full Name", "Provider Reference", "Social Media Link", "Employer Info"].map(req => (
                                    <label key={req} className="flex items-center gap-2 text-sm text-zinc-300 bg-zinc-950 p-3 rounded-md border border-zinc-800 cursor-pointer hover:border-zinc-700 transition-colors">
                                        <input 
                                            type="checkbox" 
                                            checked={form.screeningReqs.includes(req)} 
                                            onChange={() => toggleScreening(req)}
                                            className="accent-yellow-500"
                                        />
                                        {req}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3 pt-6 border-t border-zinc-800">
                            <label className="flex items-center gap-2 text-sm text-zinc-300 font-medium cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={form.depositRequired} 
                                    onChange={e => setForm({...form, depositRequired: e.target.checked, depositAmount: ""})}
                                    className="accent-yellow-500"
                                />
                                Require a deposit to secure booking?
                            </label>
                            {form.depositRequired && (
                                <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} className="pl-6 pt-2 space-y-2">
                                    <label className="text-sm text-zinc-400">Deposit Amount ($)</label>
                                    <Input 
                                        type="number" 
                                        placeholder="50" 
                                        value={form.depositAmount} 
                                        onChange={e => setForm({...form, depositAmount: e.target.value})} 
                                        className="bg-zinc-950 border-zinc-800 text-white max-w-[150px]" 
                                    />
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )
        }
    }

    return (
        <Card className="w-full max-w-lg bg-zinc-900/80 border-zinc-800 backdrop-blur-xl shadow-2xl">
            <CardHeader>
                <div className="flex justify-between items-center mb-2">
                    <CardTitle className="text-2xl text-white font-serif tracking-tight">Setup Assistant</CardTitle>
                    <span className="text-zinc-500 text-sm font-medium">Step {step} of 4</span>
                </div>
                <CardDescription className="text-zinc-400">
                    {step === 1 && "Let's personalize your AI to match your brand."}
                    {step === 2 && "Set your expected rates and boundaries."}
                    {step === 3 && "Tell us when you are generally available."}
                    {step === 4 && "Configure your screening and deposit rules."}
                </CardDescription>
                
                <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-4 overflow-hidden">
                    <div 
                        className="bg-gradient-to-r from-yellow-500 to-amber-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${(step / 4) * 100}%` }}
                    />
                </div>
            </CardHeader>
            <CardContent>
                <div className="min-h-[320px] py-4">
                    <AnimatePresence mode="wait">
                        {renderStepContent()}
                    </AnimatePresence>
                </div>
                
                <div className="flex justify-between mt-4 pt-4 border-t border-zinc-800">
                    <Button 
                        variant="ghost" 
                        onClick={handlePrev} 
                        disabled={step === 1 || loading}
                        className="text-zinc-400 hover:text-white"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                    
                    {step < 4 ? (
                        <Button 
                            onClick={handleNext}
                            className="bg-yellow-500 text-black hover:bg-yellow-400"
                        >
                            Next <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    ) : (
                        <Button 
                            onClick={handleSubmit} 
                            disabled={loading}
                            className="bg-yellow-500 text-black hover:bg-yellow-400"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                            Complete Setup
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
