import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://kidzone.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/login", "/signup", "/bible", "/saints", "/fun"],
        disallow: ["/parent/", "/select-profile/", "/api/", "/chat/", "/learn/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
