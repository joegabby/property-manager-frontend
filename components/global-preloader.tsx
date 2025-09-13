"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export default function GlobalPreloader() {
  const [isLoading, setIsLoading] = useState(true)
  const [isNavigating, setIsNavigating] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Initial load
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  ; 
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Navigation loading
    setIsNavigating(true)
    const timer = setTimeout(() => {
      setIsNavigating(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [pathname])

  if (!isLoading && !isNavigating) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="mb-8">
          <div className="relative">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-gray-200 border-t-cyan-600 animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 mx-auto rounded-full border-4 border-transparent border-r-pink-500 animate-spin animation-delay-150"></div>
          </div>
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Castle and Castle Properties</h1>
          <p className="text-gray-600">Your Gateway to Perfect Properties</p>
        </div>

        <div className="w-64 mx-auto">
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-600 to-pink-500 rounded-full animate-pulse"></div>
          </div>
          <p className="text-sm text-gray-500 mt-2">{isLoading ? "Loading..." : "Navigating..."}</p>
        </div>

        <div className="flex justify-center space-x-4 mt-8">
          <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center animate-bounce">
            <svg className="w-4 h-4 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          </div>
          <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center animate-bounce animation-delay-200">
            <svg className="w-4 h-4 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center animate-bounce animation-delay-400">
            <svg className="w-4 h-4 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animation-delay-150 {
          animation-delay: 150ms;
        }
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        .animation-delay-400 {
          animation-delay: 400ms;
        }
      `}</style>
    </div>
  )
}
