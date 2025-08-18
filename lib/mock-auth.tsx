"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  sub: string
  name: string
  email: string
  picture?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading and check for existing session
    const savedUser = localStorage.getItem("mock-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = () => {
    const mockUser: User = {
      sub: "mock-user-123",
      name: "Demo User",
      email: "demo@example.com",
      picture: "/diverse-user-avatars.png",
    }
    setUser(mockUser)
    localStorage.setItem("mock-user", JSON.stringify(mockUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("mock-user")
  }

  return <AuthContext.Provider value={{ user, isLoading, login, logout }}>{children}</AuthContext.Provider>
}

export function useUser() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useUser must be used within an AuthProvider")
  }
  return context
}

// Mock page protection HOC
export function withPageAuthRequired<P extends object>(Component: React.ComponentType<P>) {
  return function ProtectedPage(props: P) {
    const { user, isLoading } = useUser()

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )
    }

    if (!user) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h1>
            <p className="text-gray-600 mb-6">Please log in to access this page.</p>
            <button
              onClick={() => (window.location.href = "/api/auth/login")}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md"
            >
              Log In
            </button>
          </div>
        </div>
      )
    }

    return <Component {...props} />
  }
}
