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
        answer: "VelvetAssist is an AI-powered assistant that handles inquiries, screening, and bookings for independent companions—saving time and filtering out low-quality leads."
    },
    {
        question: "Is my information safe and private?",
        answer: "Yes. We prioritize privacy and discretion. Your data and conversations remain confidential and secure."
    },
    {
        question: "Do clients know they’re speaking to an AI?",
        answer: "You decide. Your assistant can sound like a professional receptionist, booking manager, or simply “your assistant.”"
    },
    {
        question: "Can the assistant match my style or tone?",
        answer: "Yes. It can be customized to sound friendly, professional, strict, soft-spoken, or high-end—whatever fits your brand."
    },
    {
        question: "How does the booking workflow work?",
        answer: "The assistant answers inquiries, shares your rates/availability, handles screening questions, and sends only verified bookings to you."
    },
    {
        question: "Do I need technical skills to use it?",
        answer: "Not at all. Setup is done for you. You simply provide your details and booking preferences."
    },
    {
        question: "When will the product launch?",
        answer: "The first beta version will launch soon. Join the waitlist to get early access and exclusive perks."
    }
]

export default function FAQ() {
    return (
        <section className="py-24 bg-black/40 relative">
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
