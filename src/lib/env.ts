import { z } from "zod";

const envSchema = z.object({
  NEXTAUTH_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z
    .string()
    .min(16, "NEXTAUTH_SECRET must be at least 16 characters")
    .default("development-secret"),
  BACKEND_API_URL: z.string().url().default("http://localhost:4000"),
  NEXT_PUBLIC_BACKEND_API_URL: z.string().url().optional(),
});

const parsed = envSchema.safeParse({
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  BACKEND_API_URL: process.env.BACKEND_API_URL,
  NEXT_PUBLIC_BACKEND_API_URL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
});

if (!parsed.success) {
  const fields = parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("\n");
  throw new Error(`Invalid environment configuration:\n${fields}`);
}

const data = parsed.data;

export const env = {
  nextauthUrl: data.NEXTAUTH_URL,
  nextauthSecret: data.NEXTAUTH_SECRET,
  backendApiUrl: data.NEXT_PUBLIC_BACKEND_API_URL ?? data.BACKEND_API_URL,
  publicBackendApiUrl: data.NEXT_PUBLIC_BACKEND_API_URL ?? data.BACKEND_API_URL,
};

