"use client";

import { CosmoAuthProvider } from "@/lib/auth/session";
import { ReactNode } from "react";

type ProvidersProps = {
  children: ReactNode;
};

export const Providers = ({ children }: ProvidersProps) => {
  return <CosmoAuthProvider>{children}</CosmoAuthProvider>;
};
