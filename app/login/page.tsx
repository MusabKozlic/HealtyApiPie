"use client"

import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ChefHat } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center mb-8">
            <ChefHat className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h1 className="text-2xl font-serif font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to generate and save your favorite healthy recipes</p>
          </div>

          <div className="space-y-4">
            <Button className="w-full" size="lg">
              Sign in with Google
            </Button>
            <Button variant="outline" className="w-full bg-transparent" size="lg">
              Sign in with GitHub
            </Button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
