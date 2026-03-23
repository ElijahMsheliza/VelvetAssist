import { NextResponse } from 'next/server';
import { stripe } from '@/utils/stripe/server';
import { createClient } from '@/utils/supabase/server';
import { checkoutRateLimit } from '@/lib/rateLimit';

export async function POST(req: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        // Rate limiting — 5 checkout sessions per 60 seconds per user.
        // Prevents a session-creation spam loop from a compromised or scripted account.
        const rl = checkoutRateLimit(user.id);
        if (!rl.allowed) {
            const retryAfterSecs = Math.ceil((rl.resetAt - Date.now()) / 1_000);
            return new NextResponse('Too Many Requests', {
                status: 429,
                headers: {
                    'Retry-After': String(retryAfterSecs),
                    'X-RateLimit-Limit': '5',
                    'X-RateLimit-Remaining': '0',
                },
            });
        }

        // Validate STRIPE_PRICE_ID before calling the API.
        const priceId = process.env.STRIPE_PRICE_ID;
        if (!priceId) {
            console.error('[/api/stripe/checkout] STRIPE_PRICE_ID environment variable is not set.');
            return new NextResponse('Server misconfiguration: missing price ID', { status: 500 });
        }

        // Wrap Supabase profile fetch in AbortController to avoid holding a
        // serverless function open when the DB is slow or unavailable.
        const controller = new AbortController();
        const dbTimeout = setTimeout(() => controller.abort(), 8_000);

        let profile;
        try {
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .abortSignal(controller.signal)
                .single();
            profile = data;
        } finally {
            clearTimeout(dbTimeout);
        }

        // Create Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer: profile?.stripe_customer_id || undefined,
            customer_email: profile?.stripe_customer_id ? undefined : user.email,
            client_reference_id: user.id,
            mode: 'subscription',
            subscription_data: {
                trial_period_days: 7,
            },
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: `${req.headers.get('origin')}/dashboard?checkout_success=true`,
            cancel_url: `${req.headers.get('origin')}/dashboard?checkout_canceled=true`,
            metadata: {
                profile_id: user.id
            }
        });

        return NextResponse.json({ url: session.url });
    } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') {
            console.error('[/api/stripe/checkout] Supabase query timed out after 8s');
            return new NextResponse('Database timeout — please try again', { status: 504 });
        }
        console.error('Stripe Checkout Error:', err)
        const stripeErr = err as { message?: string; statusCode?: number }
        return new NextResponse(stripeErr.message ?? 'Internal Server Error', { status: stripeErr.statusCode ?? 500 });
    }
}
