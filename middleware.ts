import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Simple middleware without Auth0 edge dependencies for v0 compatibility
  const { pathname } = request.nextUrl

  // For now, just allow all requests to pass through
  // In production, you would implement proper auth checks here
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/auth (Auth0 routes)
     */
    "/((?!_next/static|_next/image|favicon.ico|api/auth).*)",
  ],
}
