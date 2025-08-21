import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const redirectTo = searchParams.get("redirectTo") || "/"

  const issuer = String(process.env.AUTH0_ISSUER_BASE_URL || "").replace(/\/+$/, "")
  const clientId = process.env.AUTH0_CLIENT_ID
  const redirectUri = `${String(process.env.AUTH0_BASE_URL || "").replace(/\/+$/, "")}/api/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}`

  const params = new URLSearchParams({
    client_id: String(clientId),
    response_type: "code",
    scope: "openid profile email",
    redirect_uri: redirectUri,
    prompt: "login",
  })

  const url = `${issuer}/authorize?${params.toString()}`
  return NextResponse.redirect(url)
}
