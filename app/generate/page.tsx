import { RecipeGeneratorForm } from "@/components/recipe-generator-form"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Generate Recipe - Healthy Recipe Generator",
  description:
    "Create personalized healthy recipes using AI. Enter your ingredients, select dietary preferences, and get nutritious meal ideas with detailed nutritional information.",
  keywords:
    "generate recipe, AI recipe generator, healthy cooking, meal planning, dietary recipes, nutrition calculator",
  openGraph: {
    title: "Generate Recipe - Healthy Recipe Generator",
    description: "Create personalized healthy recipes using AI based on your ingredients and dietary preferences.",
    type: "website",
    url: "/generate",
  },
  twitter: {
    card: "summary_large_image",
    title: "Generate Recipe - Healthy Recipe Generator",
    description: "Create personalized healthy recipes using AI with detailed nutritional information.",
  },
  alternates: {
    canonical: "/generate",
  },
}

export default function GeneratePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <RecipeGeneratorForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}
