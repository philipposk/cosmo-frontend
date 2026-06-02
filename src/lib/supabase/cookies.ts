// Shared cookie config so the auth session is readable across every *.6x7.gr
// app (single sign-on). In local dev the domain is left unset so the cookie
// works on localhost.
const isProd = process.env.NODE_ENV === "production";

export const sharedCookieOptions = {
  name: "sb-6x7-auth",
  ...(isProd ? { domain: ".6x7.gr" } : {}),
  sameSite: "lax" as const,
  secure: isProd,
  path: "/",
};

export const APP_NAME = "cosmo";
