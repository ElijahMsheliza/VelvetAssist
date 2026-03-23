import Stripe from 'stripe'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
    throw new Error('[stripe/server] STRIPE_SECRET_KEY environment variable is not set.');
}

export const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2026-02-25.clover',
    // FIX: Added timeout so that a Stripe API hang doesn't hold a serverless
    // function open until Vercel's gateway timeout fires. 10 seconds gives
    // plenty of headroom for a normal request while still failing fast.
    timeout: 10_000,
    appInfo: {
        name: 'VelvetAssist',
        version: '1.0.0'
    }
})
