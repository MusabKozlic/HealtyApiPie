import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type User = {
  id: string
  name?: string | null
  email?: string | null
  roles: string[] // roles for authorization management
  avatar?: string | null
  created_at?: string | null
}

export type Recipe = {
  id: string
  title: string
  description: string | null
  ingredients: string[]
  instructions: string[]
  calories: number | null
  nutrition: Record<string, any> | null
  category: string | null
  budget?: string | number
  language: string
  created_at: string
  updated_at: string
  imageurl?: string
}
