import type { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      username: string;
      displayName: string;
      roles: string[];
      avatarUrl?: string | null;
      privacyLevel: string;
      ageGateStatus: string;
      parentalControlLevel?: number | null;
      onboardingCompleted: boolean;
      token?: string | null;
    };
  }

  interface User extends DefaultUser {
    id: string;
    username: string;
    displayName: string;
    roles: string[];
    avatarUrl?: string | null;
    privacyLevel: string;
    ageGateStatus: string;
    parentalControlLevel?: number | null;
    onboardingCompleted: boolean;
    token?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    username?: string;
    displayName?: string;
    roles?: string[];
    avatarUrl?: string | null;
    privacyLevel?: string;
    ageGateStatus?: string;
    parentalControlLevel?: number | null;
    onboardingCompleted?: boolean;
    token?: string | null;
  }
}

