import { Footer } from "@/components/footer"
import { Navigation } from "@/components/navigation"
import { Leaf } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us - Healthy Recipe Generator",
  description:
    "Learn more about Healthy Recipe Generator, our mission to provide AI-generated nutritious recipes, and our commitment to healthy eating.",
  keywords: "about us, healthy recipes, AI recipes, nutrition, team",
  openGraph: {
    title: "About Us - Healthy Recipe Generator",
    description: "Learn more about Healthy Recipe Generator and our mission to promote healthy eating.",
    type: "website",
    url: "/about",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us - Healthy Recipe Generator",
    description: "Learn more about Healthy Recipe Generator and our mission to promote healthy eating.",
  },
  alternates: {
    canonical: "/about",
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <Navigation />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center">
            <Leaf className="w-16 h-16 text-green-500 animate-bounce" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About Us
          </h1>
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">
            Healty. Personal. Powered by AI.
          </h3>
          <p className="text-lg text-gray-700 mb-6">
            At Healthy Recipe Generator, our mission is to make nutritious cooking easy, fun, and accessible for everyone.
            We use advanced AI to generate recipes that are tailored to your dietary preferences and nutritional needs.
          </p>
          <p className="text-lg text-gray-700 mb-6">
            Whether you're vegan, keto, gluten-free, or just looking for healthy meal ideas, our platform helps you discover
            delicious recipes that fuel your body and delight your taste buds.
          </p>
          <p className="text-lg text-gray-700 mb-6">
            Our team is passionate about healthy living and technology, combining culinary expertise with AI innovation
            to bring you a constantly growing collection of wholesome recipes.
          </p>
          <p className="text-lg text-gray-700">
            Join us on our journey to make healthy eating simple, enjoyable, and sustainable for everyone.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
