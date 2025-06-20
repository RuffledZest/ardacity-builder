"use client"

import { Button } from "@/components/ui/button"
import { ArrowUp, ArrowDown, Code, Copy, Trash2 } from "lucide-react"
import { type ComponentInstance, useComponents } from "./component-context"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getComponentByType } from "@/lib/component-registry"

interface ComponentHoverControlsProps {
  component: ComponentInstance
  isFirst: boolean
  isLast: boolean
}

export function ComponentHoverControls({ component, isFirst, isLast }: ComponentHoverControlsProps) {
  const { moveComponent, deleteComponent } = useComponents()
  const [showCode, setShowCode] = useState(false)

  const generateCode = () => {
    const definition = getComponentByType(component.type)
    if (!definition) return `<${component.type} />`

    const propsString = Object.entries(component.props)
      .map(([key, value]) => `  ${key}="${value}"`)
      .join("\n")

    return `<${definition.type}\n${propsString}\n/>`
  }

  const copyCode = () => {
    navigator.clipboard.writeText(generateCode())
    // You could add a toast notification here
    console.log("Code copied to clipboard!")
  }

  return (
    <>
      <div className="absolute top-2 right-2 flex gap-1 bg-zinc-800/90 backdrop-blur-sm rounded-lg p-1 border border-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity">
        {!isFirst && (
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 hover:bg-zinc-700 text-zinc-300 hover:text-white"
            onClick={() => moveComponent(component.id, "up")}
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        )}

        {!isLast && (
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 hover:bg-zinc-700 text-zinc-300 hover:text-white"
            onClick={() => moveComponent(component.id, "down")}
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
        )}

        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 hover:bg-zinc-700 text-zinc-300 hover:text-white"
          onClick={() => setShowCode(true)}
        >
          <Code className="h-4 w-4" />
        </Button>

        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 hover:bg-zinc-700 text-zinc-300 hover:text-white"
          onClick={copyCode}
        >
          <Copy className="h-4 w-4" />
        </Button>

        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 hover:bg-zinc-700 hover:text-red-400 text-zinc-300"
          onClick={() => deleteComponent(component.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <Dialog open={showCode} onOpenChange={setShowCode}>
        <DialogContent className="bg-zinc-900 border-zinc-700 text-white max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Component Code</DialogTitle>
          </DialogHeader>
          <div className="overflow-auto max-h-[60vh] scrollbar-thin scrollbar-track-zinc-800 scrollbar-thumb-zinc-600">
            <pre className="bg-zinc-800 p-4 rounded-lg text-sm">
              <code>{generateCode()}</code>
            </pre>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
