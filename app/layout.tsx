import type React from "react"
import type { Metadata } from "next"
import { AR_One_Sans, Roboto } from "next/font/google"
import "./globals.css"

const arOneSans = AR_One_Sans({
  subsets: ["latin"],
  display: "swap",   // optimizacija za FCP
  variable: "--font-ar-one-sans", // CSS varijabla
})

const roboto = Roboto({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
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
    <html lang="en">
      <body className={`${arOneSans.variable} ${roboto.variable}`}>{children}</body>
    </html>
  )
}
