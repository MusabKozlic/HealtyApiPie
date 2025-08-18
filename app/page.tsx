import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sparkles, BookOpen, Clock, Users, Flame } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Healthy Recipe Generator - AI-Powered Nutrition & Meal Planning",
  description:
    "Generate personalized healthy recipes using AI. Enter your ingredients and get nutritious meal ideas with detailed nutritional information. Supports vegan, keto, gluten-free, and more dietary preferences.",
  keywords:
    "healthy recipe generator, AI recipe generator, nutrition calculator, meal planning, healthy cooking, vegan recipes, keto recipes, gluten-free recipes, dietary recipes, cooking AI, nutritional information",
  openGraph: {
    title: "Healthy Recipe Generator - AI-Powered Nutrition",
    description: "Transform your ingredients into nutritious, delicious meals with AI-powered recipe generation.",
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Healthy Recipe Generator - AI-Powered Nutrition",
    description: "Generate personalized healthy recipes using AI with detailed nutritional information.",
  },
  alternates: {
    canonical: "/",
  },
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Healthy Recipe Generator",
            description:
              "AI-powered healthy recipe generator that creates personalized nutritious meals based on your available ingredients",
            url: "/",
            applicationCategory: "LifestyleApplication",
            operatingSystem: "Web Browser",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            featureList: [
              "AI-powered recipe generation",
              "Nutritional information calculation",
              "Multi-language support",
              "Dietary preference filtering",
              "Ingredient-based recipe creation",
            ],
            author: {
              "@type": "Organization",
              name: "Healthy Recipe Generator",
            },
          }),
        }}
      />
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {/* Hero Section */}
              <div className="text-center mb-12">
                <h1 className="font-serif text-4xl md:text-6xl font-bold text-gray-900 mb-4">
                  Healthy Recipe Generator
                </h1>
                <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                  Transform your ingredients into nutritious, delicious meals with AI-powered recipe generation
                </p>

                {/* Navigation Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link href="/generate">
                    <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg font-medium">
                      <Sparkles className="mr-2 h-5 w-5" />
                      Generate Recipe
                    </Button>
                  </Link>
                  <Link href="/recipes">
                    <Button
                      variant="outline"
                      className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-6 text-lg font-medium bg-transparent"
                    >
                      <BookOpen className="mr-2 h-5 w-5" />
                      Browse Recipes
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Features Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <Card className="text-center p-6 border-0 bg-white/50">
                  <Clock className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Quick Generation</h3>
                  <p className="text-sm text-gray-600">
                    Get personalized recipes in seconds based on your available ingredients
                  </p>
                </Card>
                <Card className="text-center p-6 border-0 bg-white/50">
                  <Flame className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Nutritional Info</h3>
                  <p className="text-sm text-gray-600">Detailed calorie and nutrition information for every recipe</p>
                </Card>
                <Card className="text-center p-6 border-0 bg-white/50">
                  <Users className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Dietary Preferences</h3>
                  <p className="text-sm text-gray-600">
                    Support for vegan, keto, gluten-free, and many other dietary needs
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}
