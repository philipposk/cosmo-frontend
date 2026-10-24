import type { MetadataRoute } from "next";

const SITE_URL = "https://cosmo.6x7.gr";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/login", "/register"],
        disallow: [
          "/api/",
          "/auth/",
          "/onboarding",
          "/admin",
          "/dashboard",
          "/forums",
          "/goals",
          "/libraries",
          "/membership",
          "/notifications",
          "/profile",
          "/settings",
          "/stories",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
