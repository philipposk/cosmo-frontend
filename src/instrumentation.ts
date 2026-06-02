/**
 * Next.js instrumentation entry — runs once at server cold start. Env-gated
 * Sentry hook. Cosmo runs fine without `@sentry/nextjs` installed; only
 * activates when SENTRY_DSN is set.
 */
export async function register(): Promise<void> {
  const dsn = process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) return;
  try {
    const dynamicImport = new Function(
      "spec",
      "return import(spec)",
    ) as (spec: string) => Promise<unknown>;
    const mod = (await dynamicImport("@sentry/nextjs").catch(() => null)) as
      | { init: (opts: Record<string, unknown>) => void }
      | null;
    if (!mod) {
      console.warn(
        "[sentry] DSN is set but @sentry/nextjs is not installed. Run `npm install @sentry/nextjs` in the frontend to enable.",
      );
      return;
    }
    mod.init({
      dsn,
      environment: process.env.SENTRY_ENVIRONMENT ?? "development",
      tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? "0"),
    });
  } catch (err) {
    console.warn("[sentry] init failed:", (err as Error).message);
  }
}
