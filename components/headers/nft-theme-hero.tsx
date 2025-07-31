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
  backgroundImage = "https://images.unsplash.com/photo-1593173930865-2edee2550a40?q=80&w=1338&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?height=1080&width=1920",
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
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Main background image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-5"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
        
        {/* Floating geometric shapes */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-white/10 rounded-full animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-24 h-24 border border-white/10 rounded-lg rotate-45 animate-spin" style={{ animationDuration: '20s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-40 h-40 border border-white/10 rounded-full animate-bounce" style={{ animationDuration: '3s' }} />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }} />
        </div>
        
        {/* Radial glow effects */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      {/* Floating NFT Cards */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-24 h-32 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 shadow-2xl overflow-hidden"
          animate={{ 
            y: [0, -20, 0],
            rotate: 12
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ rotate: 12 }}
        >
          <img 
            src="https://7ptgafldwjjywnnog6tz2etox4fvot6piuov5t77beqxshk4lgxa.arweave.net/--ZgFWOyU4s1rjennRJuvwtXT89FHV7P_wkheR1cWa4"
            alt="NFT Art"
            className="w-full h-full object-cover"
          />
          
        </motion.div>
        
        <motion.div
          className="absolute top-32 right-16 w-20 h-28 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 shadow-2xl overflow-hidden"
          animate={{ 
            y: [0, 15, 0],
            rotate: -6
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          style={{ rotate: -6 }}
        >
          <img 
            src="https://2a22g5st4gt5qbaqighxe63c5qof7bychdat75aqeujebq7wke2a.arweave.net/0DWjdlPhp9gEEEGPcnti7BxfhwI4wT_0ECUSQMP2UTQ"
            alt="Digital Art NFT"
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        <motion.div
          className="absolute bottom-40 left-20 w-28 h-36 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 shadow-2xl overflow-hidden"
          animate={{ 
            y: [0, -25, 0],
            rotate: -18
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          style={{ rotate: -18 }}
        >
          <img 
            src="https://leodnpha4oqlyeruhatk3adl7dw62lsp5c5jyn5tujbn2qmjvtia.arweave.net/WRw2vODjoLwSNDgmrYBr-O3tLk_oupw3s6JC3UGJrNA"
            alt="Abstract NFT"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        <Wrapper
          {...(animate && {
            initial: { opacity: 0, y: 50 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.8 },
          })}
        >
          {/* Premium badge */}
          <motion.div
            className="inline-flex items-center px-4 py-2 mb-6 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white/90 text-sm font-medium"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
            Premium NFT Collection
          </motion.div>

          {/* Main title with enhanced styling */}
          <motion.h1
            className="text-6xl md:text-8xl lg:text-9xl font-black text-white mb-8 leading-tight"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #e0e0e0 50%, #ffffff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 0 60px rgba(255,255,255,0.3)'
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {title}
          </motion.h1>

          {/* Description with glassmorphic background */}
          <motion.div
            className="relative max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10" />
            <p className="relative text-lg md:text-xl text-white/90 px-8 py-6 leading-relaxed">
              {description}
            </p>
          </motion.div>

          {/* Enhanced buttons */}
          {showButtons && (
            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Button
                size="lg"
                // onClick={primaryBtnAction}
                className="relative px-8 py-4 text-lg font-semibold bg-white text-gray-900 hover:bg-white/90 transition-all duration-300 shadow-2xl hover:shadow-white/25 hover:scale-105 rounded-xl border-2 border-white/20"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10">{primaryBtnText}</span>
              </Button>
              
              <Button
                size="lg"
                variant={secondaryBtnVariant}
                // onClick={secondaryBtnAction}
                className="relative px-8 py-4 text-lg font-semibold bg-transparent border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300 shadow-xl hover:shadow-white/20 hover:scale-105 rounded-xl backdrop-blur-sm hover:text-white/50"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10">{secondaryBtnText}</span>
              </Button>
            </motion.div>
          )}

          {/* Stats or additional content */}
          <motion.div
            className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white mb-2">10K+</div>
              <div className="text-white/70 text-sm">Unique NFTs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white mb-2">5.2K</div>
              <div className="text-white/70 text-sm">Collectors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white mb-2">∞</div>
              <div className="text-white/70 text-sm">Possibilities</div>
            </div>
          </motion.div>

          {children && (
            <motion.div
              className="mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              {children}
            </motion.div>
          )}
        </Wrapper>
      </div>

      {/* Enhanced bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      
      {/* Subtle particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  )
}