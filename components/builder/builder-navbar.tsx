"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search, Download, Share, Rocket, Wand2, Loader2 } from "lucide-react"
import Link from "next/link"
import { useComponents } from "./component-context"
import { generateProjectFiles } from "@/lib/project-generator"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAIGenerator } from "@/hooks/use-ai-generator"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function BuilderNavbar() {
  const { components, searchQuery, setSearchQuery } = useComponents()
  const [isDownloading, setIsDownloading] = useState(false)
  const [aiModalOpen, setAiModalOpen] = useState(false)
  const [aiPrompt, setAiPrompt] = useState("")
  
  const { isGenerating, error, generateComponents, lastResult } = useAIGenerator()

  const handleComingSoon = () => {
    alert("Coming Soon!")
  }

  const handleDownloadProject = async () => {
    if (components.length === 0) {
      alert("Add some components to your canvas first!")
      return
    }

    setIsDownloading(true)
    try {
      const projectFiles = generateProjectFiles(components)

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
    <nav className="h-14 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm flex items-center px-4 gap-4">
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
          Html Deployer
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
        <Button variant="ghost" size="sm" className="text-zinc-300 hover:text-black" onClick={handleComingSoon}>
          <Share className="h-4 w-4 mr-2" />
          Share on X
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-300"
          onClick={handleDownloadProject}
          disabled={isDownloading}
        >
          <Download className="h-4 w-4 mr-2" />
          {isDownloading ? "Generating..." : "Download Project"}
        </Button>

        <Button size="sm" className="bg-white text-black hover:bg-gray-300" onClick={handleComingSoon}>
          <Rocket className="h-4 w-4 mr-2" />
          Deploy
        </Button>
        <Button variant="ghost" size="icon" onClick={() => setAiModalOpen(true)}>
          <Wand2 className="h-5 w-5" />
        </Button>
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
          
          {lastResult && (
            <Alert>
              <AlertDescription>
                Generated {lastResult.components.length} components from library
                {lastResult.generatedComponents.length > 0 && (
                  <span> and {lastResult.generatedComponents.length} new components</span>
                )}
              </AlertDescription>
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
  )
}
