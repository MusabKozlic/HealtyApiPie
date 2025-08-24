import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const logoutUrl = `${process.env.AUTH0_ISSUER_BASE_URL}/v2/logout`
  const clientId = process.env.AUTH0_CLIENT_ID
  const returnTo = `${process.env.AUTH0_BASE_URL}`

  const params = new URLSearchParams({
    client_id: clientId!,
    returnTo,
  })

  const res = NextResponse.redirect(`${logoutUrl}?${params.toString()}`)
  res.cookies.delete("user")
  return res
}