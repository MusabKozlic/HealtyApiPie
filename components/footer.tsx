import Link from "next/link"
import { ChefHat, Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ChefHat className="h-6 w-6 text-green-400" />
              <span className="font-serif font-bold text-xl">HealthyRecipes</span>
            </div>
            <p className="text-gray-400 text-sm">
              AI-powered healthy recipe generation for nutritious and delicious meals.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/generate" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Generate Recipe
              </Link>
              <Link href="/recipes" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Browse Recipes
              </Link>
              <Link href="/about" className="block text-gray-400 hover:text-white transition-colors text-sm">
                About Us
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Support</h3>
            <div className="space-y-2">
              <Link href="/help" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Help Center
              </Link>
              <Link href="/contact" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Contact Us
              </Link>
              <Link href="/feedback" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Feedback
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Legal</h3>
            <div className="space-y-2">
              <Link href="/privacy" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Terms of Service
              </Link>
              <Link href="/cookies" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© {new Date().getFullYear()} HealthyRecipes. All rights reserved.</p>
          <div className="flex items-center gap-1 text-gray-400 text-sm mt-4 md:mt-0">
            Made with <Heart className="h-4 w-4 text-red-400" /> for healthy living
          </div>
        </div>
      </div>
    </footer>
  )
}
