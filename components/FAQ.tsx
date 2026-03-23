"use client"

import { motion } from "framer-motion"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

const faqItems = [
    {
        question: "What is VelvetAssist?",
        answer: "VelvetAssist is an AI-powered assistant that handles inquiries, screening, and bookings for independent companions — saving time and filtering out low-quality leads, 24/7."
    },
    {
        question: "How much does it cost?",
        answer: "VelvetAssist is $49/month after a 7-day free trial. No credit card is required to start your trial — you only get charged if you decide to continue."
    },
    {
        question: "What happens after my free trial?",
        answer: "After 7 days, your account automatically continues at $49/month. You'll receive an email reminder before your trial ends. If you choose not to continue, simply cancel from your dashboard — no questions asked."
    },
    {
        question: "Can I cancel anytime?",
        answer: "Yes, absolutely. You can cancel your subscription at any time directly from your dashboard. There are no contracts, no cancellation fees, and no lock-in periods."
    },
    {
        question: "Is my information safe and private?",
        answer: "Yes. We prioritize privacy and discretion above all else. Your data, configurations, and client conversations remain confidential and encrypted. We never sell or share your information."
    },
    {
        question: "Do clients know they're speaking to an AI?",
        answer: "You decide. Your assistant can present itself as a professional receptionist, a booking manager, or simply 'your assistant' — whatever fits your brand and preferences."
    },
    {
        question: "Can the assistant match my style or tone?",
        answer: "Yes. It can be customized to sound friendly, professional, strict, soft-spoken, or high-end. You control the voice, the rates it quotes, the screening questions it asks, and the deposit instructions it gives."
    },
    {
        question: "How does the booking workflow work?",
        answer: "The assistant answers inquiries, shares your rates and availability, walks clients through your screening questions, and collects deposit instructions — forwarding only verified, serious bookings to you."
    },
    {
        question: "Do I need technical skills to use it?",
        answer: "Not at all. Create an account, fill out your booking preferences in plain English, and share your personal Magic Link. Setup takes under 5 minutes."
    },
]

export default function FAQ() {
    return (
        <section id="faq" className="py-24 bg-black/40 relative">
            <div className="container px-4 md:px-6 max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
                    <p className="text-gray-400">
                        Everything you need to know about VelvetAssist.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                >
                    <Accordion type="single" collapsible className="w-full">
                        {faqItems.map((item, index) => (
                            <AccordionItem key={index} value={`item-${index}`}>
                                <AccordionTrigger className="text-left text-lg text-gray-200 hover:no-underline">
                                    {item.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-base leading-relaxed">
                                    {item.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </motion.div>
            </div>
        </section>
    )
}
