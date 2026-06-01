import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const BASE_URL = "https://prantadas.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/track"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
