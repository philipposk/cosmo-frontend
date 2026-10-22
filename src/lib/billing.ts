/** Paid plans stay off until Stripe is live. Set NEXT_PUBLIC_BILLING_ENABLED=true to turn them on. */
export const billingEnabled = process.env.NEXT_PUBLIC_BILLING_ENABLED === "true";
