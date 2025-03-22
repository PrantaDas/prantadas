import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import type { Metadata } from "next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Pranta Das - Backend Developer | Backend Specialist",
  description:
    "Portfolio of Pranta Das, a Node.js developer specializing in backend development, bots, and APIs. Experienced in JavaScript, TypeScript, React, and more.",
  keywords: [
    "Node.js Developer",
    "Backend Developer",
    "JavaScript",
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
    title: "Pranta Das - Node.js Developer | Backend Specialist",
    description: "Portfolio of Pranta Das, a Node.js developer specializing in backend development, bots, and APIs.",
    siteName: "Pranta Das Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pranta Das - Node.js Developer | Backend Specialist",
    description: "Portfolio of Pranta Das, a Node.js developer specializing in backend development, bots, and APIs.",
    creator: "@prantadas",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://prantadas.vercel.app" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'