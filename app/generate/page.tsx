"use client"

import { RecipeGeneratorForm } from "@/components/recipe-generator-form"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

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
