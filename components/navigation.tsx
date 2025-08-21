"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, ChefHat } from "lucide-react"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setUser(data.user))
  }, [])

  const handleLogout = () => {
    window.location.href = "/api/auth/logout"
  }

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-serif font-bold text-xl text-gray-900">
            <ChefHat className="h-6 w-6 text-green-600" />
            HealthyRecipes
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/recipes" className="text-gray-700 hover:text-green-600 transition-colors">
              Browse Recipes
            </Link>
            <Link href="/generate" className="text-gray-700 hover:text-green-600 transition-colors">
              Generate Recipe
            </Link>

            {/* Auth buttons */}
            {user ? (
              <div className="relative">
                <button
                  className="flex items-center gap-2 focus:outline-none"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="h-8 w-8 rounded-full"
                  />
                  <span className="text-gray-700">{user.name}</span>
                </button>
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
                    <button
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => (window.location.href = "/api/login")}>
                  Login
                </Button>
                <Button size="sm" className="bg-green-600 text-white hover:bg-green-700" onClick={() => (window.location.href = "/api/signup")}>
                  Sign up
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-4">
              <Link
                href="/recipes"
                className="text-gray-700 hover:text-green-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Browse Recipes
              </Link>
              <Link
                href="/generate"
                className="text-gray-700 hover:text-green-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Generate Recipe
              </Link>

              {/* Mobile auth links */}
              {user ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="h-8 w-8 rounded-full"
                    />
                    <span className="text-gray-700">{user.name}</span>
                  </div>
                  <button
                    className="text-left text-gray-700 hover:text-green-600"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <a href="/api/login" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-green-600">
                    Login
                  </a>
                  <a href="/api/signup" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-green-600">
                    Sign up
                  </a>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
