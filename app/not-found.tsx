"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-lg shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="text-center py-16">
          <div className="flex justify-center mb-6">
            <AlertTriangle className="h-16 w-16 text-red-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            404 - Page Not Found
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            Oops! The page you are looking for doesn’t exist or has been moved.
          </p>
          <Button asChild className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-lg rounded-xl">
            <Link href="/">Return Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
