import { NextResponse } from 'next/server';
import { stripe } from '@/utils/stripe/server';
import { createClient } from '@supabase/supabase-js';
import type Stripe from 'stripe';

export async function POST(req: Request) {
    const rawBody = await req.text();
    const signature = req.headers.get('stripe-signature');

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
        console.error('[Webhook] STRIPE_WEBHOOK_SECRET is not set. Cannot process events.');
        return new NextResponse('Webhook secret not configured', { status: 500 });
    }

    if (!signature) {
        return new NextResponse('Missing stripe-signature header', { status: 400 });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        console.error(`[Webhook] Signature verification failed: ${message}`);
        return new NextResponse(`Webhook Error: ${message}`, { status: 400 });
    }

    // IMPORTANT: SUPABASE_SERVICE_ROLE_KEY must be set so the webhook can bypass RLS.
    // Without it, writes to `profiles` will fail silently if RLS is enabled (which it should be).
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) {
        console.error('[Webhook] SUPABASE_SERVICE_ROLE_KEY is not set. DB writes will fail with RLS enabled.');
        return new NextResponse('Server misconfiguration: missing service role key', { status: 500 });
    }

    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceRoleKey
    );

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                const customerId = session.customer as string;
                const profileId = session.metadata?.profile_id || session.client_reference_id;

                if (profileId) {
                    // Fetch the actual subscription to get the real status (may be 'trialing')
                    let subscriptionStatus = 'active';
                    if (session.subscription) {
                        const subscription = await stripe.subscriptions.retrieve(
                            session.subscription as string
                        );
                        subscriptionStatus = subscription.status;
                    }

                    const { error } = await supabaseAdmin
                        .from('profiles')
                        .update({
                            stripe_customer_id: customerId,
                            subscription_status: subscriptionStatus,
                        })
                        .eq('id', profileId);

                    if (error) console.error('[Webhook] checkout.session.completed DB error:', error);
                }
                break;
            }

            case 'customer.subscription.updated': {
                const subscription = event.data.object as Stripe.Subscription;
                const customerId = subscription.customer as string;

                const { error } = await supabaseAdmin
                    .from('profiles')
                    .update({ subscription_status: subscription.status })
                    .eq('stripe_customer_id', customerId);

                if (error) console.error('[Webhook] customer.subscription.updated DB error:', error);
                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;
                const customerId = subscription.customer as string;

                const { error } = await supabaseAdmin
                    .from('profiles')
                    .update({ subscription_status: 'canceled' })
                    .eq('stripe_customer_id', customerId);

                if (error) console.error('[Webhook] customer.subscription.deleted DB error:', error);
                break;
            }

            // Fired when a payment attempt fails (e.g. card declined after trial ends).
            // Sets status to 'past_due' so the UI can gate access correctly.
            case 'invoice.payment_failed': {
                const invoice = event.data.object as Stripe.Invoice;
                const customerId = invoice.customer as string;

                const { error } = await supabaseAdmin
                    .from('profiles')
                    .update({ subscription_status: 'past_due' })
                    .eq('stripe_customer_id', customerId);

                if (error) console.error('[Webhook] invoice.payment_failed DB error:', error);
                break;
            }

            default:
                // Unhandled event — log but do not error (Stripe retries on non-2xx)
                console.log(`[Webhook] Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        console.error('[Webhook] Processing error:', message);
        return new NextResponse('Webhook handler failed', { status: 500 });
    }
}
