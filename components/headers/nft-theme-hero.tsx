"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import React from "react"

interface NftThemeHeroProps {
  title?: string
  description?: string
  backgroundImage?: string
  gradientFrom?: string
  gradientVia?: string
  gradientTo?: string
  showButtons?: boolean
  primaryBtnText?: string
  // primaryBtnAction?: () => void
  secondaryBtnText?: string
  // secondaryBtnAction?: () => void
  secondaryBtnVariant?: "outline" | "ghost" | "default"
  animate?: boolean
  customClassName?: string
  children?: React.ReactNode
}

export function NftThemeHero({
  title = "NFT Collection",
  description = "Discover unique digital assets",
  backgroundImage = "/placeholder.svg?height=1080&width=1920",
  gradientFrom = "purple-900",
  gradientVia = "blue-900",
  gradientTo = "indigo-900",
  showButtons = true,
  primaryBtnText = "Explore Collection",
  // primaryBtnAction,
  secondaryBtnText = "Create NFT",
  // secondaryBtnAction,
  secondaryBtnVariant = "outline",
  animate = true,
  customClassName = "",
  children,
}: NftThemeHeroProps) {
  const Wrapper = animate ? motion.div : "div"

  return (
    <div
      className={`relative min-h-screen bg-gradient-to-br from-${gradientFrom} via-${gradientVia} to-${gradientTo} flex items-center justify-center overflow-hidden ${customClassName}`}
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <Wrapper
          {...(animate && {
            initial: { opacity: 0, y: 50 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.8 },
          })}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
            {title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">{description}</p>

          {showButtons && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                // onClick={primaryBtnAction}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
              >
                {primaryBtnText}
              </Button>
              <Button
                size="lg"
                variant={secondaryBtnVariant}
                // onClick={secondaryBtnAction}
                className={
                  secondaryBtnVariant === "outline"
                    ? "border-white text-black hover:bg-white hover:text-black"
                    : ""
                }
              >
                {secondaryBtnText}
              </Button>
            </div>
          )}

          {children && <div className="mt-8">{children}</div>}
        </Wrapper>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent" />
    </div>
  )
}