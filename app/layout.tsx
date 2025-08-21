import type React from "react"
import type { Metadata } from "next"
import { Inter, Geist  } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
})

export const metadata: Metadata = {
  title: "Healthy Recipe Generator - AI-Powered Nutrition",
  description:
    "Generate personalized healthy recipes using AI. Enter your ingredients and get nutritious meal ideas with detailed nutritional information.",
  keywords: "healthy recipes, AI recipe generator, nutrition, cooking, meal planning",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${geist.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
