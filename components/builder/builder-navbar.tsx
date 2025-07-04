"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search, Download, Share, Rocket, Wand2 } from "lucide-react"
import Link from "next/link"
import { useComponents } from "./component-context"
import { generateProjectFiles } from "@/lib/project-generator"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Utility to convert kebab-case to PascalCase
function pascalCase(str: string) {
  return str
    .split('-')
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
}

// Utility to extract and clean JSON array from Gemini response
function extractJsonArray(text: string) {
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```[a-zA-Z]*\n?/, '').replace(/```$/, '').trim();
  }
  const firstBracket = cleaned.indexOf('[');
  const lastBracket = cleaned.lastIndexOf(']');
  if (firstBracket !== -1 && lastBracket !== -1) {
    cleaned = cleaned.substring(firstBracket, lastBracket + 1);
  }
  return cleaned;
}

// Transform Gemini response to ComponentInstance input
function fromGeminiResponse(geminiArray: any[]) {
  return geminiArray.map(item => {
    const [category, type] = item.type.split('/');
    return {
      type: pascalCase(type),
      category: category || "AI",
      props: item.props || {},
      position: item.position || { x: 0, y: 0 }
    };
  });
}

export function BuilderNavbar() {
  const { components, searchQuery, setSearchQuery, addComponent } = useComponents()
  const [isDownloading, setIsDownloading] = useState(false)
  const [aiModalOpen, setAiModalOpen] = useState(false)
  const [aiPrompt, setAiPrompt] = useState("")

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
          <form
            onSubmit={async e => {
              e.preventDefault()
              try {
                const res = await fetch('/api/ai-generate', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ prompt: aiPrompt }),
                })
                const data = await res.json()
                // Gemini's response is in data.gemini.candidates[0].content.parts[0].text
                const content = data.gemini?.candidates?.[0]?.content?.parts?.[0]?.text || data.candidates?.[0]?.content?.parts?.[0]?.text
                if (content) {
                  try {
                    const cleaned = extractJsonArray(content);
                    const componentsArray = JSON.parse(cleaned)
                    if (Array.isArray(componentsArray)) {
                      const transformed = fromGeminiResponse(componentsArray)
                      for (const comp of transformed) {
                        addComponent(comp)
                      }
                    } else {
                      alert("AI did not return a component array.")
                    }
                  } catch (err) {
                    alert("Failed to parse AI response as JSON. Check the console for details.")
                    console.error('JSON parse error:', err, content)
                  }
                } else {
                  alert("No response from AI.")
                }
              } catch (err) {
                console.error('AI request failed:', err)
                alert("AI request failed. Check the console for details.")
              }
              setAiModalOpen(false)
              setAiPrompt("")
            }}
            className="flex flex-col gap-4"
          >
            <Input
              autoFocus
              placeholder="Describe the webpage you want..."
              value={aiPrompt}
              onChange={e => setAiPrompt(e.target.value)}
            />
            <Button type="submit" disabled={!aiPrompt.trim()}>
              Generate
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </nav>
  )
}
