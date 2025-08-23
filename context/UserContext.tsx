"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"

export interface DbUser {
  id: string
  name?: string
  email?: string
  picture?: string
}

interface UserContextType {
  user: DbUser | null
  loading: boolean
  refreshUser: () => Promise<void>
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  refreshUser: async () => {},
})

export const useUser = () => useContext(UserContext)

interface UserProviderProps {
  children: ReactNode
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<DbUser | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/auth/me")
      if (!res.ok) throw new Error("Failed to fetch user")
      const data = await res.json()
      setUser(data.user || null)
    } catch (err) {
      console.error("User fetch error:", err)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  return (
    <UserContext.Provider value={{ user, loading, refreshUser: fetchUser }}>
      {children}
    </UserContext.Provider>
  )
}
