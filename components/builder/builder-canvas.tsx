"use client"

import type React from "react"

import { useComponents } from "./component-context"
import { ComponentRenderer } from "./component-renderer"
import { ComponentHoverControls } from "./component-hover-controls"
import { useState } from "react"
import { getDynamicComponentSampleData } from '@/lib/dynamic-component-compiler'

export function BuilderCanvas() {
  const { components, addComponent } = useComponents()
  const [hoveredComponent, setHoveredComponent] = useState<string | null>(null)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const componentData = JSON.parse(e.dataTransfer.getData("application/json"))

    // Try to get AI-generated sample data for this component type
    const sampleData = getDynamicComponentSampleData(componentData.type)

    addComponent({
      type: componentData.type,
      category: componentData.category,
      props: sampleData || componentData.defaultProps,
      position: { x: 0, y: 0 },
    })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  return (
    <div
      className="flex-1 bg-zinc-950 overflow-auto relative scrollbar-thin scrollbar-track-zinc-900 scrollbar-thumb-zinc-700 hover:scrollbar-thumb-zinc-600"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {components.length === 0 ? (
        <div className="h-full flex items-center justify-center">
          <div className="text-center text-zinc-500">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold mb-2">Start Building Your ArDacity Project</h3>
            <p className="text-zinc-400">Drag and drop components from the library to get started</p>
            <div className="mt-4 text-sm text-zinc-500">
              <p>• Navigation components for site structure</p>
              <p>• Header sections for landing pages</p>
              <p>• Arweave blocks for Web3 functionality</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-full">
          {components.map((component, index) => (
            <ComponentRenderer
              key={component.id}
              component={component}
              isRoot={true}
              index={index}
              totalSiblings={components.length}
              hoveredComponent={hoveredComponent}
              setHoveredComponent={setHoveredComponent}
            />
          ))}
        </div>
      )}
    </div>
  )
}
