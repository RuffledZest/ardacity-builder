"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search, Download, Share, Rocket, Wand2, Loader2 } from "lucide-react"
import Link from "next/link"
import { useComponents } from "./component-context"
import { generateProjectFiles } from "@/lib/project-generator"
import { useState } from "react"
import { useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAIGenerator } from "@/hooks/use-ai-generator"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function BuilderNavbar() {
  const { components, searchQuery, setSearchQuery } = useComponents()
  const [isDownloading, setIsDownloading] = useState(false)
  const [aiModalOpen, setAiModalOpen] = useState(false)
  const [aiPrompt, setAiPrompt] = useState("")
  const [showMobileBanner, setShowMobileBanner] = useState(false)

  const { isGenerating, error, generateComponents, lastResult } = useAIGenerator()

  // Show banner if on small screen
  useEffect(() => {
    const checkScreen = () => {
      setShowMobileBanner(window.innerWidth < 1280)
    }
    checkScreen()
    window.addEventListener('resize', checkScreen)
    return () => window.removeEventListener('resize', checkScreen)
  }, [])

  const handleComingSoon = () => {
    alert("Coming Soon!")
  }

  const handleDownloadProject = async () => {
    if (components.length === 0) {
      alert("Add some components to your canvas first!")
      return
    }

    console.log("[Download Project] Button clicked.")
    console.log("[Download Project] Components:", components)

    setIsDownloading(true)
    try {
      console.log("[Download Project] Generating project files...")
      const projectFiles = generateProjectFiles(components)
      console.log("[Download Project] Project files generated:", Object.keys(projectFiles))

      // Create and download zip file
      const JSZip = (await import("jszip")).default
      const zip = new JSZip()

      // Add all project files to zip
      Object.entries(projectFiles).forEach(([filePath, content]) => {
        zip.file(filePath, content)
      })

      const blob = await zip.generateAsync({ type: "blob" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "ardacity-project.zip"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Download failed:", error)
      alert("Download failed. Please try again.")
    } finally {
      setIsDownloading(false)
    }
  }

  const handleAIGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!aiPrompt.trim()) return

    try {
      await generateComponents(aiPrompt)
      setAiModalOpen(false)
      setAiPrompt("")
    } catch (err) {
      console.error('AI generation failed:', err)
    }
  }

  return (
    <>
      {showMobileBanner && (
        <div className="block w-full bg-fuchsia-700 text-white text-center py-2 text-xs font-semibold z-50">
          Use desktop mode for a wonderful experience of builder 
        </div>
      )}
      <nav className="h-14 w-full overflow-hidden border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm flex items-center px-4 gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-white">ArDacity Builder</h1>

          <Select defaultValue="arweave">
            <SelectTrigger className="w-32 bg-zinc-800 border-zinc-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              <SelectItem value="arweave" className="text-white">
                Arweave
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/docs">
            <Button variant="ghost" size="sm" className="text-zinc-300 hover:text-black">
              Docs
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            className="text-zinc-300 hover:text-black"
            onClick={() => window.open("https://ardacityui.ar.io", "_blank")}
          >
            UI Library
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="text-zinc-300 hover:text-black"
            onClick={() => window.open("https://perma-way.vercel.app", "_blank")}
          >
            PermaWay
          </Button>
        </div>

        <div className="flex-1 flex justify-center">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-zinc-500">⌘ + K</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* <Button variant="ghost" size="sm" className="text-zinc-300 hover:text-black" onClick={handleComingSoon}>
            <Share className="h-4 w-4 mr-2" />
            <p className="md:hidden lg:inline">
              Share on X
            </p>
          </Button> */}

          <Button
            variant="outline"
            size="sm"
            className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-300 mr-4"
            onClick={handleDownloadProject}
            disabled={isDownloading}
          >
            <Download className="h-4 w-4 mr-2" />
            <p className="md:hidden lg:inline">
              {isDownloading ? "Generating..." : "Download Project"}
            </p>
          </Button>

          {/* <Button size="sm" className="bg-white text-black hover:bg-gray-300" onClick={handleComingSoon}>
            <Rocket className="h-4 w-4 mr-2" />
            <p className="md:hidden lg:inline">
              Deploy
            </p>
          </Button> */}
          <button
            type="button"
            onClick={() => setAiModalOpen(true)}
            className="relative group rounded-lg p-[2px] shadow-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-fuchsia-400 h-10 min-w-[160px] flex items-center justify-center bg-white/30"
            style={{ boxShadow: '0 0 16px 2px #a21caf55, 0 0 32px 8px #38bdf855' }}
            aria-label="AI Generate"
          >
            {/* Animated conic-gradient border */}
            <span className="absolute inset-[-20%] overflow-hidden animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#e7029a_0%,#f472b6_50%,#bd5fff_100%)] rounded-lg" />
            {/* Sparkle layer */}
            <span className="pointer-events-none absolute inset-0 flex items-center justify-center z-10">
              <span className="animate-ai-sparkle w-2 h-2 bg-white/80 rounded-full shadow-lg opacity-80 absolute left-3 top-2" />
              <span className="animate-ai-sparkle2 w-1.5 h-1.5 bg-fuchsia-300 rounded-full shadow-md opacity-70 absolute right-4 bottom-3" />
              <span className="animate-ai-sparkle3 w-1 h-1 bg-blue-300 rounded-full shadow-md opacity-60 absolute left-6 bottom-2" />
            </span>
            {/* Content layer */}
            <span className="relative z-20 flex items-center justify-center w-full h-full px-6 py-2 bg-[#27272A] rounded-lg group-hover:bg-zinc-900/90 transition-colors duration-300">
              <span className="text-fuchsia-200 font-semibold text-base mr-2 select-none">Build With AI</span>
              <Wand2 className="h-5 w-5 text-fuchsia-300 drop-shadow-[0_0_6px_#a21caf] animate-ai-wand group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300 ml-1" />
            </span>
            {/* Hover mask effect */}
            <span className="absolute inset-0 rounded-lg z-30 pointer-events-none group-hover:bg-fuchsia-500/10 group-hover:backdrop-blur-[0.5px] transition-all duration-300" />
          </button>
          {/* Tailwind keyframes for animation */}
          <style jsx>{`
          @keyframes ai-glow {
            0%, 100% { filter: blur(2px) brightness(1); opacity: 0.7; }
            50% { filter: blur(4px) brightness(1.2); opacity: 1; }
          }
          .animate-ai-glow { animation: ai-glow 2.5s ease-in-out infinite; }
          @keyframes ai-sparkle {
            0%, 100% { transform: scale(1) translateY(0); opacity: 0.8; }
            50% { transform: scale(1.3) translateY(-2px); opacity: 1; }
          }
          .animate-ai-sparkle { animation: ai-sparkle 1.8s infinite; }
          @keyframes ai-sparkle2 {
            0%, 100% { transform: scale(1) translateY(0); opacity: 0.7; }
            50% { transform: scale(1.2) translateY(2px); opacity: 1; }
          }
          .animate-ai-sparkle2 { animation: ai-sparkle2 2.2s infinite; }
          @keyframes ai-sparkle3 {
            0%, 100% { transform: scale(1) translateX(0); opacity: 0.6; }
            50% { transform: scale(1.4) translateX(2px); opacity: 1; }
          }
          .animate-ai-sparkle3 { animation: ai-sparkle3 2.7s infinite; }
          @keyframes ai-wand {
            0%, 100% { transform: rotate(-8deg) scale(1); filter: drop-shadow(0 0 6px #a21caf); }
            50% { transform: rotate(8deg) scale(1.15); filter: drop-shadow(0 0 12px #a21caf); }
          }
          .animate-ai-wand { animation: ai-wand 2.5s infinite; }
        `}</style>
        </div>

        <Dialog open={aiModalOpen} onOpenChange={setAiModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>AI Assistant</DialogTitle>
            </DialogHeader>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleAIGenerate} className="flex flex-col gap-4">
              <Input
                autoFocus
                placeholder="Describe the webpage you want..."
                value={aiPrompt}
                onChange={e => setAiPrompt(e.target.value)}
                disabled={isGenerating}
              />
              <Button type="submit" disabled={!aiPrompt.trim() || isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate'
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </nav>
    </>
  )
}
