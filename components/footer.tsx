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
              <img
              src="/nutriAIGenie.png"
              alt="Nutri AI Genius Logo"
              className="h-15 w-auto"
            />
              <span className="font-bold text-xl">Nutri AI Genius</span>
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
              <Link href="/contact" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Contact Us
              </Link>
              <Link href="/feedback" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Feedback
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Nutri AI Genius. All rights reserved.</p>
          <div className="flex items-center gap-1 text-gray-400 text-sm mt-4 md:mt-0">
            Made with <Heart className="h-4 w-4 text-red-400" /> for healthy life
          </div>
        </div>
      </div>
    </footer>
  )
}
