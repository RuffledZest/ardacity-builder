"use client"

import { Button } from "@/components/ui/button"
import { Menu, Moon, Sun, Wallet } from "lucide-react"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"

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

  const variantClass = {
    default: "bg-white dark:bg-black text-gray-800 dark:text-gray-200",
    outline: "border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200",
    floating: "bg-white dark:bg-gray-900 shadow-lg text-gray-800 dark:text-gray-200",
  }[variant]

  return (
    <header
      className={`border-b bg-black backdrop-blur supports-[backdrop-filter]:bg-black z-50 ${positionClass} 
        ${variantClass}
        `}
    >
      <div className="flex h-14 items-center px-4 lg:px-8">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex items-center justify-between w-full ">
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <div className="text-xl font-bold ">{brand}</div>
            </div>
          </div>

          <nav className="hidden translate-x-12 md:flex items-center space-x-6">
            <Link href="/docs" className="text-sm font-medium transition-colors hover:text-cyan-500">
              {nav1}
            </Link>
            <button
              onClick={() => scrollToSection("features")}
              className="text-sm font-medium transition-colors hover:text-cyan-500"
            >
              {nav2}
            </button>
            <button
              onClick={() => scrollToSection("demo")}
              className="text-sm font-medium transition-colors hover:text-cyan-500"
            >
              {nav3}
            </button>
          </nav>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="hidden md:flex items-center gap-2 bg-black text-white">
              <Wallet className="h-4 w-4" />
              Connect Wallet
            </Button>

            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <Button variant="ghost" size="icon" asChild>
              <a href="https://x.com/ArDacityUI" target="_blank" rel="noopener noreferrer">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/c/ce/X_logo_2023.svg"
                  alt="X Logo"
                  width={12}
                  height={12}
                  className="h-3 w-3 text-black dark:text-white dark:invert"
                />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
