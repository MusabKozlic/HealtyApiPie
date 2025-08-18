"use client"

import { useState } from "react"
import Link from "next/link"
import { useUser } from "@/lib/mock-auth"
import { Button } from "@/components/ui/button"
import { Menu, X, ChefHat, User, LogOut } from "lucide-react"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, isLoading, login, logout } = useUser()

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

            {!isLoading && (
              <>
                {user ? (
                  <div className="flex items-center gap-4">
                    <Link href="/generate" className="text-gray-700 hover:text-green-600 transition-colors">
                      Generate Recipe
                    </Link>
                    <Link href="/dashboard" className="text-gray-700 hover:text-green-600 transition-colors">
                      My Dashboard
                    </Link>
                    <div className="flex items-center gap-2">
                      {user.picture ? (
                        <img
                          src={user.picture || "/placeholder.svg"}
                          alt={user.name || "User"}
                          className="w-6 h-6 rounded-full"
                        />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                      <span className="text-sm text-gray-600">{user.name}</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={logout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Button onClick={login}>Login</Button>
                )}
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

              {!isLoading && (
                <>
                  {user ? (
                    <>
                      <Link
                        href="/generate"
                        className="text-gray-700 hover:text-green-600 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Generate Recipe
                      </Link>
                      <Link
                        href="/dashboard"
                        className="text-gray-700 hover:text-green-600 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        My Dashboard
                      </Link>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        {user.picture ? (
                          <img
                            src={user.picture || "/placeholder.svg"}
                            alt={user.name || "User"}
                            className="w-4 h-4 rounded-full"
                          />
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                        {user.name}
                      </div>
                      <Button variant="outline" size="sm" onClick={logout} className="w-fit bg-transparent">
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <Button onClick={login} className="w-fit">
                      Login
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
