"use client"

import { Button } from "@/components/ui/button"
import { Menu, Moon, Sun, Wallet, Wand2 } from "lucide-react"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface ArDacityClassicNavbarProps {
  brand?: string
  nav1?: string
  nav2?: string
  nav3?: string
  variant?: "default" | "outline" | "floating"
  position?: "sticky" | "fixed" | "relative"
}

export function ArDacityClassicNavbar({
  brand = "ArDacity",
  nav1 = "Docs",
  nav2 = "Features",
  nav3 = "Demo",
  variant = "default",
  position = "sticky",
}: ArDacityClassicNavbarProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [aiModalOpen, setAiModalOpen] = useState(false)
  const [aiPrompt, setAiPrompt] = useState("")

  useEffect(() => {
    setMounted(true)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  if (!mounted) {
    return null
  }

  const positionClass = {
    sticky: "sticky top-0",
    fixed: "fixed top-0 left-0 right-0",
    relative: "relative",
  }[position]

  return (
    <header
      className={`border-b border-white/10 bg-white/5 backdrop-blur-xl z-50 ${positionClass}`}
    >
      <div className="flex h-16 items-center px-4 lg:px-8">
        <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/10">
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <div className="text-xl font-black text-white bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                {brand}
              </div>
            </div>
          </div>

          <nav className="hidden translate-x-12 md:flex items-center space-x-8">
            <Link 
              href="/docs" 
              className="relative text-sm font-medium text-white/90 transition-all duration-300 hover:text-white group"
            >
              {nav1}
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full" />
            </Link>
            <button
              onClick={() => scrollToSection("features")}
              className="relative text-sm font-medium text-white/90 transition-all duration-300 hover:text-white group"
            >
              {nav2}
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full" />
            </button>
            <button
              onClick={() => scrollToSection("demo")}
              className="relative text-sm font-medium text-white/90 transition-all duration-300 hover:text-white group"
            >
              {nav3}
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full" />
            </button>
          </nav>

          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden md:flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105"
            >
              <Wallet className="h-4 w-4" />
              Connect Wallet
            </Button>

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-white hover:bg-white/10 transition-all duration-300 hover:scale-105"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <Button 
              variant="ghost" 
              size="icon" 
              asChild
              className="text-white hover:bg-white/10 transition-all duration-300 hover:scale-105"
            >
              <a href="https://x.com/ArDacityUI" target="_blank" rel="noopener noreferrer">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/c/ce/X_logo_2023.svg"
                  alt="X Logo"
                  width={12}
                  height={12}
                  className="h-3 w-3 invert brightness-0 contrast-100"
                />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
