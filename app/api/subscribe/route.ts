import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email } = body

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 })
        }

        // Here you would typically save to a database or send to an email service
        console.log("New subscriber:", email)

        // Simulate delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
