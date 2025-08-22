// app/loading.tsx
"use client"

import { ChefHat } from "lucide-react"
import { motion } from "framer-motion"

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white to-green-50">
      {/* Animated logo */}
      <motion.div
        initial={{ rotate: 0, scale: 0.8, opacity: 0 }}
        animate={{ rotate: 360, scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, repeat: Infinity, repeatType: "loop" }}
        className="mb-6"
      >
        <ChefHat className="h-16 w-16 text-green-600" />
      </motion.div>

      {/* Loading text */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
        className="text-xl sm:text-2xl font-semibold text-gray-800"
      >
        Cooking something delicious...
      </motion.h2>

      {/* Subtext with subtle fade-in */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
        className="text-sm text-gray-500 mt-2"
      >
        Please wait a moment
      </motion.p>
    </div>
  )
}
