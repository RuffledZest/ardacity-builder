"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"

interface Asset {
  id: string
  name: string
  description: string
  contentType: string
  data?: string
  thumbnail?: string
  banner?: string
  creator: string
  dateCreated: number
  assetType?: string
  [key: string]: any
}

interface AssetCarousel3DProps {
  assets: Asset[]
  onAssetClick?: (asset: Asset) => void
}

export default function AssetCarousel3D({ assets, onAssetClick }: AssetCarousel3DProps) {
  const [progress, setProgress] = useState(50)
  const [active, setActive] = useState(0)
  const [isDown, setIsDown] = useState(false)
  const [startX, setStartX] = useState(0)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const speedWheel = 0.02
  const speedDrag = -0.1

  const assetFallbackImage =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+"

  const getZindex = (array: Asset[], index: number) =>
    array.map((_, i) => (index === i ? array.length : array.length - Math.abs(index - i)))

  const animate = () => {
    if (assets.length === 0) return
    const clampedProgress = Math.max(0, Math.min(progress, 100))
    const newActive = Math.floor((clampedProgress / 100) * (assets.length - 1))
    setActive(newActive)
  }

  useEffect(() => {
    animate()
  }, [progress, assets.length])

  const handleWheel = (e: React.WheelEvent) => {
    const wheelProgress = e.deltaY * speedWheel
    setProgress((prev) => prev + wheelProgress)
  }

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if ("clientX" in e) {
      setCursorPos({ x: e.clientX, y: e.clientY })
    }

    if (!isDown) return

    const clientX = "clientX" in e ? e.clientX : e.touches[0]?.clientX || 0
    const mouseProgress = (clientX - startX) * speedDrag
    setProgress((prev) => prev + mouseProgress)
    setStartX(clientX)
  }

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDown(true)
    const clientX = "clientX" in e ? e.clientX : e.touches[0]?.clientX || 0
    setStartX(clientX)
  }

  const handleMouseUp = () => {
    setIsDown(false)
  }

  const handleItemClick = (index: number, asset: Asset) => {
    setProgress((index / assets.length) * 100 + 10)
    onAssetClick?.(asset)
  }

  const getAssetImage = (asset: Asset) => {
    return `https://7ptgafldwjjywnnog6tz2etox4fvot6piuov5t77beqxshk4lgxa.arweave.net/${asset.id}`
  }

  const truncateText = (text: string | undefined | null, maxLength: number): string => {
    if (!text || typeof text !== "string") return "No information available"
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
  }

  const safeGetProperty = (obj: any, property: string, fallback = "Unknown"): string => {
    return obj && obj[property] ? String(obj[property]) : fallback
  }

  if (!assets || assets.length === 0) {
    return (
      <div className="h-[60vh] flex items-center justify-center text-gray-500 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-xl">
        <p className="text-white">No assets to display</p>
      </div>
    )
  }

  return (
    <div className="relative h-[80vh] overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-xl">
      {/* Custom Cursors */}
      <div
        className="fixed w-10 h-10 border border-white/20 rounded-full pointer-events-none z-10 transition-transform duration-[850ms] ease-[cubic-bezier(0,0.02,0,1)] hidden md:block"
        style={{
          transform: `translate(${cursorPos.x - 20}px, ${cursorPos.y - 20}px)`,
        }}
      />
      <div
        className="fixed w-0.5 h-0.5 bg-white rounded-full pointer-events-none z-10 transition-transform duration-700 ease-[cubic-bezier(0,0.02,0,1)] hidden md:block"
        style={{
          transform: `translate(${cursorPos.x - 1}px, ${cursorPos.y - 1}px)`,
        }}
      />

      {/* Carousel */}
      <div
        ref={containerRef}
        className="relative z-[1] h-full overflow-hidden pointer-events-none"
        onWheel={handleWheel}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
      >
        {assets.map((asset, index) => {
          if (!asset || !asset.id) return null

          const zIndex = getZindex(assets, active)[index]
          const activeOffset = (index - active) / assets.length
          const opacity = (zIndex / assets.length) * 3 - 2

          return (
            <div
              key={asset.id}
              className="absolute overflow-hidden rounded-[10px] top-1/2 left-1/2 select-none pointer-events-auto cursor-pointer shadow-[0_10px_50px_10px_rgba(0,0,0,0.5)] bg-white transition-transform duration-800 ease-[cubic-bezier(0,0.02,0,1)]"
              style={
                {
                  "--items": assets.length,
                  "--width": "clamp(200px, 35vw, 350px)",
                  "--height": "clamp(280px, 45vw, 450px)",
                  "--x": `${activeOffset * 800}%`,
                  "--y": `${activeOffset * 200}%`,
                  "--rot": `${activeOffset * 120}deg`,
                  "--opacity": opacity,
                  zIndex,
                  width: "clamp(200px, 35vw, 350px)",
                  height: "clamp(280px, 45vw, 450px)",
                  marginTop: "calc(clamp(280px, 45vw, 450px) * -0.5)",
                  marginLeft: "calc(clamp(200px, 35vw, 350px) * -0.5)",
                  transformOrigin: "0% 100%",
                  transform: `translate(var(--x), var(--y)) rotate(var(--rot))`,
                } as React.CSSProperties
              }
              onClick={() => handleItemClick(index, asset)}
            >
              <div
                className="absolute z-[1] top-0 left-0 w-full h-full transition-opacity duration-800 ease-[cubic-bezier(0,0.02,0,1)] bg-white rounded-[10px] overflow-hidden"
                style={{ opacity }}
              >
                {/* Asset Image */}
                <div className="relative h-3/5 overflow-hidden">
                  <img
                    src={getAssetImage(asset) || "/placeholder.svg"}
                    alt={safeGetProperty(asset, "name", "Asset")}
                    className="w-full h-full object-cover"
                    onError={(e) => ((e.target as HTMLImageElement).src = assetFallbackImage)}
                  />
                  {asset.assetType === "nft" && (
                    <div className="absolute top-3 right-3 bg-purple-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                      NFT
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </div>

                {/* Asset Info */}
                <div className="p-4 h-2/5 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1 leading-tight">
                      {truncateText(safeGetProperty(asset, "name"), 25)}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2 leading-relaxed">
                      {truncateText(safeGetProperty(asset, "description", "No description available"), 60)}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>Created</span>
                      <span>
                        {asset.dateCreated ? new Date(asset.dateCreated).toLocaleDateString() : "Unknown date"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400 font-mono">
                        {asset.id ? `${asset.id.substring(0, 8)}...` : "No ID"}
                      </span>
                      <a
                        href={`https://arweave.net/${asset.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View →
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Navigation Info */}
      <div className="absolute bottom-6 left-6 text-white/70 text-sm">
        <p>
          Asset {active + 1} of {assets.length}
        </p>
        <p className="text-xs mt-1">Scroll or drag to navigate</p>
      </div>

      {/* Current Asset Title */}
      {assets[active] && (
        <div className="absolute top-6 left-6 text-white">
          <h2 className="text-2xl font-bold mb-1">{safeGetProperty(assets[active], "name")}</h2>
          <p className="text-white/80 text-sm">{assets[active].assetType === "nft" ? "NFT" : "Atomic Asset"}</p>
        </div>
      )}
    </div>
  )
} 