import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // Password signup / forgot / reset pages are gone: old links and bookmarks land on the sign-in page.
    return [
      { source: "/register", destination: "/login", permanent: false },
      { source: "/auth/forgot", destination: "/login", permanent: false },
      { source: "/auth/reset", destination: "/login", permanent: false },
    ];
  },
};

export default nextConfig;
