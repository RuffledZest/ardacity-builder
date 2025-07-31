"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import React from "react"

interface DarkHeaderProps {
  title?: string
  subtitle?: string
  ctaText?: string
  imageSrc?: string
  customClassName?: string
}

export const DarkHeader: React.FC<DarkHeaderProps> = ({
  title = "Precision in Motion",
  subtitle = "A balance of structure and creativity, brought to life.",
  ctaText = "Start Building",
  imageSrc = "/header-image.png",
  customClassName = "",
}) => {
  return (
    <header
      className={`relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white min-h-screen flex items-center ${customClassName}`}
    >
      {/* Professional Grid Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.02)_1px,transparent_1px)] bg-[size:10px_10px]" />
      </div>

      {/* Floating Geometric Elements */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="w-full h-full relative">
          {[...Array(25)].map((_, i) => {
            const x = Math.random() * 100
            const y = Math.random() * 100
            const delay = Math.random() * 8
            const size = Math.random() * 60 + 20
            const shapes = ['rounded-full', 'rounded-lg', 'rounded-none']
            const shape = shapes[Math.floor(Math.random() * shapes.length)]
            
            return (
              <motion.div
                key={i}
                className={`absolute border border-slate-500/20 bg-gradient-to-br from-slate-600/10 to-slate-700/5 ${shape}`}
                style={{
                  top: `${y}%`,
                  left: `${x}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                }}
                initial={{ opacity: 0, scale: 0.3, rotate: 0 }}
                animate={{
                  opacity: [0.1, 0.3, 0.1],
                  y: [0, -20, 0],
                  x: [0, 10, 0],
                  scale: [0.3, 0.7, 0.3],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 15 + Math.random() * 10,
                  delay,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                }}
              />
            )
          })}
        </div>
      </div>

      {/* Glowing Accent Lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-400/30 to-transparent" />
        <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-400/20 to-transparent" />
        <div className="absolute left-1/4 top-0 h-full w-px bg-gradient-to-b from-transparent via-slate-400/20 to-transparent" />
      </div>

      <div className="container mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
          
          {/* Left Content - Enhanced Layout */}
          <motion.div
            initial={{ x: -80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Status Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-slate-800/50 border border-slate-600/30 backdrop-blur-sm"
            >
              <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3 animate-pulse" />
              <span className="text-sm text-slate-300 font-medium">Enterprise Ready</span>
            </motion.div>

            {/* Main Title with Professional Typography */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[0.9]"
              >
                <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  {title}
                </span>
              </motion.h1>
              
              {/* Subtitle with enhanced styling */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-xl sm:text-2xl text-slate-400 max-w-2xl leading-relaxed font-light"
              >
                {subtitle}
              </motion.p>
            </div>

            {/* Enhanced CTA Section */}
            {ctaText && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-4 pt-4"
              >
                <button className="group relative px-8 py-4 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 rounded-xl font-semibold text-white transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-slate-500/25 transform hover:-translate-y-1">
                  <span className="relative z-10">{ctaText}</span>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
                
                <button className="px-8 py-4 border border-slate-600 hover:border-slate-500 rounded-xl font-semibold text-slate-300 hover:text-white transition-all duration-300 hover:bg-slate-800/30 backdrop-blur-sm">
                  Watch Demo
                </button>
              </motion.div>
            )}

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="flex items-center gap-6 pt-8 border-t border-slate-700/50"
            >
              <div className="text-sm text-slate-400">Trusted by</div>
              <div className="flex items-center gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-8 h-8 bg-slate-700/50 rounded border border-slate-600/30" />
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Image - Enhanced Container */}
          
            <motion.div
              initial={{ x: 80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
              className="relative"
            >
              {/* Glass Container */}
              <div className="relative bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm border border-slate-600/30 rounded-2xl p-8 shadow-2xl">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent" />
                
                {/* Image Container */}
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-700/20">
                  <Image
                    src={imageSrc}
                    alt="SaaS Platform Preview"
                    fill
                    className="object-contain drop-shadow-2xl pointer-events-none"
                  />
                  
                  {/* Image Overlay Effects */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent" />
                </div>

                {/* Floating Stats/Metrics */}
                <div className="absolute -top-4 -right-4 bg-slate-800/80 backdrop-blur-sm border border-slate-600/30 rounded-xl p-4 shadow-xl">
                  <div className="text-2xl font-bold text-white">99.9%</div>
                  <div className="text-xs text-slate-400">Uptime</div>
                </div>
                
                <div className="absolute -bottom-4 -left-4 bg-slate-800/80 backdrop-blur-sm border border-slate-600/30 rounded-xl p-4 shadow-xl">
                  <div className="text-2xl font-bold text-emerald-400">24/7</div>
                  <div className="text-xs text-slate-400">Support</div>
                </div>
              </div>

              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-600/20 to-slate-800/20 rounded-2xl blur-3xl scale-110 -z-10" />
            </motion.div>
        </div>
      </div>
    </header>
  )
}