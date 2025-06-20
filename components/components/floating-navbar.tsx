"use client"

import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

interface FloatingNavbarProps {
  brand?: string
  links?: string[]
  variant?: "floating" | "default"
}

export function FloatingNavbar({
  brand = "ArDacity",
  links = ["Home", "About", "Contact"],
  variant = "floating",
}: FloatingNavbarProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== "undefined") {
        if (window.scrollY > lastScrollY) {
          setIsVisible(false)
        } else {
          setIsVisible(true)
        }
        setLastScrollY(window.scrollY)
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar)
      return () => {
        window.removeEventListener("scroll", controlNavbar)
      }
    }
  }, [lastScrollY])

  return (
    <nav
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 shadow-lg">
        <div className="flex items-center space-x-8">
          <div className="font-bold text-white">{brand}</div>

          <div className="flex items-center space-x-6">
            {links.map((link, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="text-white/80 hover:text-white hover:bg-white/10 rounded-full"
              >
                {link}
              </Button>
            ))}
          </div>

          <Button size="sm" className="bg-white text-black hover:bg-white/90 rounded-full">
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  )
}
