import { type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { env } from "../env";
import { z } from "zod";

const credentialsSchema = z.object({
  identifier: z.string().min(1, "Username or email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type AuthResponse = {
  id: string;
  email?: string | null;
  username: string;
  displayName: string;
  privacyLevel: string;
  roles: string[];
  avatarUrl?: string | null;
  bio?: string | null;
  ageGateStatus: string;
  parentalControlLevel?: number | null;
  onboardingCompleted: boolean;
  token?: string | null;
};

export const authOptions: NextAuthOptions = {
  secret: env.nextauthSecret,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    newUser: "/register",
  },
  providers: [
    Credentials({
      credentials: {
        identifier: { label: "Username or Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);

        if (!parsed.success) {
          throw new Error(parsed.error.issues[0]?.message ?? "Invalid credentials payload");
        }

        const body =
          parsed.data.identifier.includes("@")
            ? { email: parsed.data.identifier, password: parsed.data.password }
            : { username: parsed.data.identifier, password: parsed.data.password };

        const res = await fetch(`${env.backendApiUrl}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
          cache: "no-store",
        });

        if (!res.ok) {
          const errorMessage = res.status === 401 ? "Invalid username/email or password" : "Authentication failed";
          throw new Error(errorMessage);
        }

        const data = (await res.json()) as AuthResponse;

        return {
          id: data.id,
          email: data.email,
          username: data.username,
          displayName: data.displayName,
          privacyLevel: data.privacyLevel,
          roles: data.roles,
          avatarUrl: data.avatarUrl,
          bio: data.bio,
          ageGateStatus: data.ageGateStatus,
          parentalControlLevel: data.parentalControlLevel,
          onboardingCompleted: data.onboardingCompleted,
          token: data.token ?? null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const authUser = user as AuthResponse;
        token.sub = authUser.id;
        token.username = authUser.username;
        token.displayName = authUser.displayName;
        token.roles = authUser.roles;
        token.avatarUrl = authUser.avatarUrl ?? undefined;
        token.privacyLevel = authUser.privacyLevel;
        token.ageGateStatus = authUser.ageGateStatus;
        token.parentalControlLevel = authUser.parentalControlLevel ?? undefined;
        token.onboardingCompleted = authUser.onboardingCompleted;
        token.token = authUser.token ?? undefined;
      } else if (token.token) {
        token.token = token.token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.username = (token.username as string) ?? session.user.username;
        session.user.displayName = (token.displayName as string) ?? session.user.displayName;
        session.user.roles = (token.roles as string[]) ?? [];
        session.user.avatarUrl = (token.avatarUrl as string | null | undefined) ?? null;
        session.user.privacyLevel = (token.privacyLevel as string) ?? "PUBLIC";
        session.user.ageGateStatus = (token.ageGateStatus as string) ?? "UNKNOWN";
        session.user.parentalControlLevel = (token.parentalControlLevel as number | null | undefined) ?? null;
        session.user.onboardingCompleted = Boolean(token.onboardingCompleted);
        session.user.token = (token.token as string | null | undefined) ?? null;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
};

