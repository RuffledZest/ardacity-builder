"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import React from "react"

interface DarkHeaderProps {
  title?: string
  subtitle?: string
  ctaText?: string
  onCtaClick?: () => void
  imageSrc?: string
  showImage?: boolean
  customClassName?: string
}

export const DarkHeader: React.FC<DarkHeaderProps> = ({
  title = "Precision in Motion",
  subtitle = "A balance of structure and creativity, brought to life.",
  ctaText = "Start Building",
  onCtaClick,
  imageSrc = "/header-image.png",
  showImage = true,
  customClassName = "",
}) => {
  return (
    <header
      className={`relative overflow-hidden bg-zinc-950 text-white py-24 px-6 md:px-12 lg:px-20 flex flex-col lg:flex-row items-center justify-between gap-12 ${customClassName}`}
    >
      {/* ✨ Geometric Background Pattern */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="w-full h-full relative">
          {[...Array(40)].map((_, i) => {
            const x = Math.random() * 100
            const y = Math.random() * 100
            const delay = Math.random() * 5
            const size = Math.random() * 20 + 10
            return (
              <motion.div
                key={i}
                className="absolute border border-fuchsia-700/30 bg-fuchsia-500/5 rotate-45"
                style={{
                  top: `${y}%`,
                  left: `${x}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                }}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{
                  opacity: 0.4,
                  y: [0, -10, 0],
                  x: [0, 5, 0],
                  scale: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 6 + Math.random() * 4,
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

      {/* 🚀 Left Content */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="z-10 max-w-xl"
      >
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
          {title}
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-neutral-400 max-w-lg">{subtitle}</p>

        {ctaText && (
          <button
            onClick={onCtaClick}
            className="mt-8 inline-block px-6 py-3 text-base sm:text-lg font-semibold rounded-lg bg-gradient-to-r from-pink-600 to-orange-500 hover:from-pink-700 hover:to-orange-600 transition-all duration-300 shadow-lg"
          >
            {ctaText}
          </button>
        )}
      </motion.div>

      {/* 🎨 Right Image */}
      {showImage && (
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-full max-w-lg aspect-[4/3] z-10"
        >
          <Image
            src={imageSrc}
            alt="Hero Visual"
            fill
            className="object-contain drop-shadow-xl pointer-events-none"
          />
        </motion.div>
      )}
    </header>
  )
}