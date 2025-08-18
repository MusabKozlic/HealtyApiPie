import { getSession } from "@auth0/nextjs-auth0"
import { type NextRequest, NextResponse } from "next/server"

export async function requireAuth(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session?.user) {
      // Redirect to login if not authenticated
      const loginUrl = new URL("/api/auth/login", request.url)
      loginUrl.searchParams.set("returnTo", request.url)
      return NextResponse.redirect(loginUrl)
    }

    return null // Continue with the request
  } catch (error) {
    console.error("Auth middleware error:", error)
    // Redirect to login on error
    const loginUrl = new URL("/api/auth/login", request.url)
    return NextResponse.redirect(loginUrl)
  }
}

export function isProtectedRoute(pathname: string): boolean {
  const protectedRoutes = ["/generate", "/dashboard"]
  return protectedRoutes.some((route) => pathname.startsWith(route))
}

export function isPublicRoute(pathname: string): boolean {
  const publicRoutes = ["/", "/recipes", "/login", "/api/auth"]
  return publicRoutes.some((route) => pathname.startsWith(route))
}
