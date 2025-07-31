"use client"

import { motion } from "framer-motion"
import React from "react"

interface BazaarHeaderProps {
  title?: string
  subtitle?: string
  description?: string
  stats?: {
    totalProfiles?: number
    totalAssets?: number
    networkUptime?: string
  }
  ctaText?: string
  showArweaveInfo?: boolean
  customClassName?: string
}

export const BazaarHeader: React.FC<BazaarHeaderProps> = ({
  title = "Arweave Bazaar",
  subtitle = "Decentralized Profile & Asset Management",
  description = "Create, update, and manage your decentralized identity on the Arweave permaweb. Build your profile, showcase assets, and connect with the decentralized community.",
  stats = {
    totalProfiles: 12500,
    totalAssets: 45800,
    networkUptime: "99.9%"
  },
  ctaText = "Get Started",
  showArweaveInfo = true,
  customClassName = "",
}) => {
  return (
    <header
      className={`relative overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white py-20 ${customClassName}`}
    >
      {/* Professional Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(161,161,170,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(161,161,170,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(161,161,170,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(161,161,170,0.02)_1px,transparent_1px)] bg-[size:10px_10px]" />
      </div>

      {/* Floating Geometric Elements */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="w-full h-full relative">
          {[...Array(20)].map((_, i) => {
            const x = Math.random() * 100
            const y = Math.random() * 100
            const delay = Math.random() * 8
            const size = Math.random() * 40 + 15
            const shapes = ['rounded-full', 'rounded-lg', 'rounded-none']
            const shape = shapes[Math.floor(Math.random() * shapes.length)]
            
            return (
              <motion.div
                key={i}
                className={`absolute border border-zinc-500/20 bg-gradient-to-br from-zinc-600/10 to-zinc-700/5 ${shape}`}
                style={{
                  top: `${y}%`,
                  left: `${x}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                }}
                initial={{ opacity: 0, scale: 0.3, rotate: 0 }}
                animate={{
                  opacity: [0.1, 0.3, 0.1],
                  y: [0, -15, 0],
                  x: [0, 8, 0],
                  scale: [0.3, 0.6, 0.3],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 12 + Math.random() * 8,
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

      {/* Accent Lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-zinc-400/20 to-transparent" />
        <div className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-zinc-400/15 to-transparent" />
      </div>

      <div className="container mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          
          {/* Status Badge */}
          {showArweaveInfo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center px-6 py-3 rounded-full bg-zinc-800/40 border border-zinc-600/30 backdrop-blur-sm"
            >
              <div className="w-3 h-3 bg-emerald-400 rounded-full mr-4 animate-pulse" />
              <span className="text-sm text-zinc-300 font-medium mr-4">Powered by Arweave</span>
              <div className="h-4 w-px bg-zinc-600 mx-2" />
              <span className="text-xs text-zinc-400">Permanent Storage</span>
            </motion.div>
          )}

          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-4"
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[0.9]">
              <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                {title}
              </span>
            </h1>
            
            <h2 className="text-xl sm:text-2xl text-zinc-400 font-light tracking-wide">
              {subtitle}
            </h2>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-lg text-zinc-400 max-w-3xl mx-auto leading-relaxed"
          >
            {description}
          </motion.p>

          {/* Statistics Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8"
            >
              <div className="bg-zinc-800/30 backdrop-blur-sm border border-zinc-700/50 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {stats.totalProfiles?.toLocaleString()}+
                </div>
                <div className="text-sm text-zinc-400">Active Profiles</div>
              </div>
              
              <div className="bg-zinc-800/30 backdrop-blur-sm border border-zinc-700/50 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {stats.totalAssets?.toLocaleString()}+
                </div>
                <div className="text-sm text-zinc-400">Total Assets</div>
              </div>
              
              <div className="bg-zinc-800/30 backdrop-blur-sm border border-zinc-700/50 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-2">
                  {stats.networkUptime}
                </div>
                <div className="text-sm text-zinc-400">Network Uptime</div>
              </div>
            </motion.div>

          {/* CTA Section */}
          {ctaText && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
            >
              <button
                className="group relative px-8 py-4 bg-gradient-to-r from-zinc-700 to-zinc-600 hover:from-zinc-600 hover:to-zinc-500 rounded-xl font-semibold text-white transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-zinc-500/25 transform hover:-translate-y-1"
              >
                <span className="relative z-10">{ctaText}</span>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
              
              <button className="px-8 py-4 border border-zinc-600 hover:border-zinc-500 rounded-xl font-semibold text-zinc-300 hover:text-white transition-all duration-300 hover:bg-zinc-800/30 backdrop-blur-sm">
                Learn More
              </button>
            </motion.div>
          )}

          {/* Feature Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-zinc-700/50"
          >
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-zinc-800/50 rounded-xl flex items-center justify-center mx-auto border border-zinc-700/50">
                <svg className="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold">Create Profile</h3>
              <p className="text-sm text-zinc-400">Build your decentralized identity with custom profiles</p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-zinc-800/50 rounded-xl flex items-center justify-center mx-auto border border-zinc-700/50">
                <svg className="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-white font-semibold">Manage Assets</h3>
              <p className="text-sm text-zinc-400">Organize and showcase your digital assets</p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-zinc-800/50 rounded-xl flex items-center justify-center mx-auto border border-zinc-700/50">
                <svg className="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                </svg>
              </div>
              <h3 className="text-white font-semibold">Permanent Storage</h3>
              <p className="text-sm text-zinc-400">Data stored permanently on Arweave blockchain</p>
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  )
}
