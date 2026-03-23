import { NextResponse } from 'next/server';
import { stripe } from '@/utils/stripe/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        // Wrap Supabase profile fetch in AbortController to avoid holding a
        // serverless function open when the DB is slow or unavailable.
        const controller = new AbortController();
        const dbTimeout = setTimeout(() => controller.abort(), 8_000);

        let profile;
        try {
            const { data } = await supabase
                .from('profiles')
                .select('stripe_customer_id')
                .eq('id', user.id)
                .abortSignal(controller.signal)
                .single();
            profile = data;
        } finally {
            clearTimeout(dbTimeout);
        }

        if (!profile?.stripe_customer_id) {
            return new NextResponse('No active subscription found', { status: 400 })
        }

        const session = await stripe.billingPortal.sessions.create({
            customer: profile.stripe_customer_id,
            return_url: `${req.headers.get('origin')}/dashboard`,
        });

        return NextResponse.json({ url: session.url });
    } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') {
            console.error('[/api/stripe/portal] Supabase query timed out after 8s');
            return new NextResponse('Database timeout — please try again', { status: 504 });
        }
        console.error('Stripe Portal Error:', err)
        const stripeErr = err as { message?: string; statusCode?: number }
        return new NextResponse(stripeErr.message ?? 'Internal Server Error', { status: stripeErr.statusCode ?? 500 });
    }
}
