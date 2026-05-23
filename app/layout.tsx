import type React from "react";
import "@/app/globals.css";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import type { Metadata } from "next";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Pranta Das — Backend Developer",
  description:
    "Backend Developer specializing in Node.js, TypeScript, REST APIs, and scalable distributed systems. Team Lead at Root Devs.",
  keywords: [
    "Node.js Developer",
    "Backend Developer",
    "TypeScript",
    "API Development",
    "Bot Development",
    "Web3",
    "Pranta Das",
    "Portfolio",
  ],
  authors: [{ name: "Pranta Das" }],
  creator: "Pranta Das",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://prantadas.vercel.app",
    title: "Pranta Das — Backend Developer",
    description:
      "Backend Developer specializing in Node.js, TypeScript, and scalable distributed systems.",
    siteName: "Pranta Das",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pranta Das — Backend Developer",
    description:
      "Backend Developer specializing in Node.js, TypeScript, and scalable distributed systems.",
    creator: "@prantadas",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://prantadas.vercel.app" />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} font-sans bg-background text-foreground antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

import "./globals.css";
