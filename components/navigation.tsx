"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { DbUser } from "@/lib/types/DBUser"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [user, setUser] = useState<DbUser | null>(null)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setUser(data.user))
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
        setIsProfileMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    window.location.href = "/api/auth/logout"
  }

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-gray-900 dark:text-gray-100">
            <img
              src="/nutriAIGenie.png"
              alt="Nutri AI Genius Logo"
              className="h-15 w-auto"
            />
            Nutri AI Genius
          </Link>

          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          <div
            ref={dropdownRef}
            className={`${isMenuOpen ? "block" : "hidden"} absolute top-16 left-0 w-full bg-white dark:bg-gray-900 border-t dark:border-gray-800 md:static md:block md:w-auto md:border-0`}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 p-4 md:p-0">
              <Link
                href="/recipes"
                className="text-gray-700 dark:text-gray-300 hover:text-green-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Browse Recipes
              </Link>
              <Link
                href="/generate"
                className="text-gray-700 dark:text-gray-300 hover:text-green-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Generate Recipe
              </Link>

              {user ? (
                <div className="relative">
                  <button
                    className="flex items-center gap-2 focus:outline-none"
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  >
                    <img
                      src={user.picture || "/diverse-user-avatars.png"}
                      alt={user.name || "User Avatar"}
                      className="h-8 w-8 rounded-full"
                    />
                    <span className="text-gray-700 dark:text-gray-300">{user.name}</span>
                  </button>

                  {isProfileMenuOpen && (
                    <div className="hidden md:absolute md:right-0 md:mt-2 md:w-48 md:bg-white md:dark:bg-gray-800 md:border md:dark:border-gray-700 md:rounded-lg md:shadow-lg md:block">
                      <Link
                        href={`/profile/${user.id}`}
                        className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                        className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </div>
                  )}

                  <div className="flex flex-col md:hidden gap-2 mt-2">
                    <Link
                      href={`/profile/${user.id}`}
                      className="text-gray-700 dark:text-gray-300 hover:text-green-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      className="text-left text-gray-700 dark:text-gray-300 hover:text-green-600"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full md:w-auto">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => (window.location.href = "/api/login")}
                  >
                    Login / Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
