"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight } from "lucide-react"
import { useComponents } from "./component-context"
import { searchComponents } from "@/lib/component-registry"

export function ComponentLibrary() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    navigation: true,
    header: true,
    arweave: true,
    footer: true,
    landing : true,
  })
  const { addComponent, searchQuery } = useComponents()

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleDragStart = (e: React.DragEvent, component: any) => {
    e.dataTransfer.setData("application/json", JSON.stringify(component))
  }

  const filteredComponents = searchComponents(searchQuery)
  const sections = [
    { key: "arweave", title: "Arweave Blocks" },
    { key: "navigation", title: "Navigation Bar" },
    { key: "header", title: "Header Section" },
    { key: "footer", title: "Footer Components" },
    { key: "landing", title: "Landing Pages" },
  ]

  return (
    <div className="w-80 border-r border-zinc-800 bg-zinc-900/30 p-4 overflow-y-auto scrollbar-thin scrollbar-track-zinc-900 scrollbar-thumb-zinc-700 hover:scrollbar-thumb-zinc-600">
      <h2 className="text-lg font-semibold mb-4 text-white">Components</h2>

      {sections.map((section) => {
        let sectionComponents = filteredComponents.filter((comp) => comp.category === section.key)
        // For Arweave Blocks, move AO Message Signer to the end
        if (section.key === "arweave") {
          const aoIndex = sectionComponents.findIndex(
            (comp) => comp.type === "AOMessageSigner" || comp.id === "ao-message-signer"
          );
          if (aoIndex !== -1) {
            const [aoComp] = sectionComponents.splice(aoIndex, 1);
            sectionComponents.push(aoComp);
          }
        }

        if (sectionComponents.length === 0 && searchQuery) return null

        return (
          <div key={section.key} className="mb-4">
            <Button
              variant="ghost"
              className="w-full justify-between p-2 h-auto text-zinc-300 hover:text-white hover:bg-zinc-800"
              onClick={() => toggleSection(section.key)}
            >
              <span className="font-medium">{section.title}</span>
              {expandedSections[section.key] ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>

            {expandedSections[section.key] && (
              <div className="mt-2 space-y-2 pl-2">
                {sectionComponents.map((component) => (
                  <div
                    key={component.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, component)}
                    className="p-3 bg-gradient-to-br from-zinc-800 to-black hover:from-black hover:to-zinc-800 rounded-lg cursor-move transition-colors group relative"
                    style={{
                      border: "2px solid transparent",
                      borderRadius: "0.5rem",
                      backgroundOrigin: "border-box",
                      backgroundClip: "padding-box, border-box",
                      backgroundImage:
                        "linear-gradient(to bottom right, #27272a, #000), linear-gradient(120deg, #6366f1, #a21caf, #f59e42)",
                    }}
                  >
                    <div className="text-sm font-medium text-white mb-1">{component.name}</div>
                    <div className="text-xs text-zinc-400 mb-2">{component.description}</div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {component.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-xs bg-black border border-zinc-300/30  text-zinc-300 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full bg-white border-zinc-600 text-black hover:bg-zinc-600 hover:text-white"
                      onClick={() =>
                        addComponent({
                          type: component.type,
                          category: component.category,
                          props: component.defaultProps,
                          position: { x: 0, y: 0 },
                        })
                      }
                    >
                      Add Component
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}

      {filteredComponents.length === 0 && searchQuery && (
        <div className="text-center text-zinc-500 mt-8">
          <div className="text-4xl mb-2">🔍</div>
          <p>No components found for "{searchQuery}"</p>
        </div>
      )}
    </div>
  )
}
