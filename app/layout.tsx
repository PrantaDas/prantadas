import type React from "react";
import "@/app/globals.css";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import type { Metadata, Viewport } from "next";
import { Toaster } from "@/components/ui/sonner";
import { TrackVisit } from "@/components/analytics/track-visit";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
  display: "swap",
});

const BASE_URL = "https://prantadas.vercel.app";

export const viewport: Viewport = {
  themeColor: "#00d4ff",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Pranta Das — Backend Developer & Team Lead",
    template: "%s | Pranta Das",
  },
  description:
    "Backend Developer & Team Lead from Dhaka, Bangladesh. Specializing in Node.js, TypeScript, REST APIs, and scalable distributed systems. 3+ years of experience building production-grade platforms.",
  keywords: [
    "Pranta Das",
    "Backend Developer",
    "Node.js Engineer",
    "TypeScript Developer",
    "REST API Developer",
    "Software Engineer Bangladesh",
    "Dhaka Developer",
    "NestJS",
    "Distributed Systems",
    "Team Lead",
    "Portfolio",
  ],
  authors: [{ name: "Pranta Das", url: BASE_URL }],
  creator: "Pranta Das",
  publisher: "Pranta Das",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "en_GB",
    url: BASE_URL,
    title: "Pranta Das — Backend Developer & Team Lead",
    description:
      "Backend Developer & Team Lead from Dhaka, Bangladesh. Node.js · TypeScript · Distributed Systems · 3+ years building production platforms.",
    siteName: "Pranta Das",
    images: [
      {
        url: "/photo.webp",
        width: 1200,
        height: 630,
        alt: "Pranta Das — Backend Developer from Bangladesh",
        type: "image/webp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pranta Das — Backend Developer & Team Lead",
    description:
      "Backend Developer & Team Lead from Dhaka, Bangladesh. Node.js · TypeScript · Distributed Systems.",
    images: ["/photo.webp"],
    creator: "@prantadas",
    site: "@prantadas",
  },
  alternates: {
    canonical: BASE_URL,
  },
  category: "technology",
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Pranta Das",
  url: BASE_URL,
  image: `${BASE_URL}/photo.webp`,
  jobTitle: "Backend Developer & Team Lead",
  description:
    "Backend Developer specializing in Node.js, TypeScript, REST APIs, and scalable distributed systems. Team Lead at Root Devs. Based in Dhaka, Bangladesh.",
  email: "prantodas043@gmail.com",
  telephone: "+8801708088432",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Dhanmondi 32",
    addressLocality: "Dhaka",
    postalCode: "1210",
    addressCountry: "BD",
  },
  nationality: { "@type": "Country", name: "Bangladesh" },
  sameAs: [
    "https://github.com/Prantadas",
    "https://linkedin.com/in/pranta-das7",
    `${BASE_URL}`,
  ],
  knowsAbout: [
    "Node.js",
    "TypeScript",
    "REST API",
    "Backend Development",
    "Distributed Systems",
    "NestJS",
    "PostgreSQL",
    "Redis",
    "RabbitMQ",
    "Kafka",
    "Docker",
  ],
  alumniOf: {
    "@type": "EducationalOrganization",
    name: "Daffodil International University",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dhaka",
      addressCountry: "BD",
    },
  },
  worksFor: {
    "@type": "Organization",
    name: "Root Devs",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dhaka",
      addressCountry: "BD",
    },
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Pranta Das — Portfolio",
  url: BASE_URL,
  description:
    "Personal portfolio of Pranta Das, Backend Developer from Bangladesh.",
  author: { "@type": "Person", name: "Pranta Das" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="canonical" href={BASE_URL} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} font-sans bg-background text-foreground antialiased`}
      >
        <TrackVisit />
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
