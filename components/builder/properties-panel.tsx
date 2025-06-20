"use client"

import { useComponents } from "./component-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, ArrowUp, ArrowDown, Code, Download } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getComponentByType } from "@/lib/component-registry"

export function PropertiesPanel() {
  const { selectedComponent, updateComponent, deleteComponent, moveComponent, components } = useComponents()
  const [showCode, setShowCode] = useState(false)

  if (!selectedComponent) {
    return (
      <div className="w-80 border-l border-zinc-800 bg-zinc-900/30 p-4 overflow-y-auto scrollbar-thin scrollbar-track-zinc-900 scrollbar-thumb-zinc-700 hover:scrollbar-thumb-zinc-600">
        <h2 className="text-lg font-semibold mb-4 text-white">Properties Panel</h2>
        <div className="text-center text-zinc-500 mt-8">
          <div className="text-4xl mb-2">⚙️</div>
          <p>Select a component to edit its properties</p>
          <div className="mt-4 text-sm text-zinc-600">
            <p>• Click on any component in the canvas</p>
            <p>• Customize properties in real-time</p>
            <p>• View and copy generated code</p>
          </div>
        </div>
      </div>
    )
  }

  const componentIndex = components.findIndex((c) => c.id === selectedComponent.id)
  const isFirst = componentIndex === 0
  const isLast = componentIndex === components.length - 1

  const handlePropertyChange = (key: string, value: any) => {
    updateComponent(selectedComponent.id, { [key]: value })
  }

  const generateCode = () => {
    const definition = getComponentByType(selectedComponent.type)
    if (!definition) return `<${selectedComponent.type} />`

    const propsString = Object.entries(selectedComponent.props)
      .map(([key, value]) => `  ${key}="${value}"`)
      .join("\n")

    return `<${definition.type}\n${propsString}\n/>`
  }

  const renderPropertyInputs = () => {
    return Object.entries(selectedComponent.props).map(([key, value]) => (
      <div key={key} className="space-y-2">
        <Label htmlFor={key} className="text-sm font-medium text-zinc-300 capitalize">
          {key.replace(/([A-Z])/g, " $1").trim()}
        </Label>
        {key === "variant" || key === "position" || key === "theme" ? (
          <Select value={value} onValueChange={(newValue) => handlePropertyChange(key, newValue)}>
            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              {key === "variant" && (
                <>
                  <SelectItem value="default" className="text-white">
                    Default
                  </SelectItem>
                  <SelectItem value="outline" className="text-white">
                    Outline
                  </SelectItem>
                  <SelectItem value="floating" className="text-white">
                    Floating
                  </SelectItem>
                </>
              )}
              {key === "position" && (
                <>
                  <SelectItem value="sticky" className="text-white">
                    Sticky
                  </SelectItem>
                  <SelectItem value="fixed" className="text-white">
                    Fixed
                  </SelectItem>
                  <SelectItem value="relative" className="text-white">
                    Relative
                  </SelectItem>
                </>
              )}
              {key === "theme" && (
                <>
                  <SelectItem value="light" className="text-white">
                    Light
                  </SelectItem>
                  <SelectItem value="dark" className="text-white">
                    Dark
                  </SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        ) : Array.isArray(value) ? (
          <Input
            id={key}
            value={value.join(", ")}
            onChange={(e) => handlePropertyChange(key, e.target.value.split(", ").filter(Boolean))}
            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400"
            placeholder="Comma separated values"
          />
        ) : (
          <Input
            id={key}
            value={value}
            onChange={(e) => handlePropertyChange(key, e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400"
          />
        )}
      </div>
    ))
  }

  return (
    <>
      <div className="w-80 border-l border-zinc-800 bg-zinc-900/30 p-4 overflow-y-auto scrollbar-thin scrollbar-track-zinc-900 scrollbar-thumb-zinc-700 hover:scrollbar-thumb-zinc-600">
        <h2 className="text-lg font-semibold mb-4 text-white">Properties Panel</h2>

        <div className="mb-6">
          <h3 className="text-md font-medium text-white mb-3">
            {selectedComponent.type.replace(/([A-Z])/g, " $1").trim()}
          </h3>

          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              size="sm"
              variant="destructive"
              onClick={() => deleteComponent(selectedComponent.id)}
              className="flex items-center gap-1"
            >
              <Trash2 className="h-3 w-3" />
              Delete
            </Button>
          </div>

          <div className="space-y-3 mb-6">
            <h4 className="text-sm font-medium text-zinc-400">Position</h4>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={isFirst}
                onClick={() => moveComponent(selectedComponent.id, "up")}
                className="flex-1 bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
              >
                <ArrowUp className="h-3 w-3 mr-1" />
                Up
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={isLast}
                onClick={() => moveComponent(selectedComponent.id, "down")}
                className="flex-1 bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
              >
                <ArrowDown className="h-3 w-3 mr-1" />
                Down
              </Button>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowCode(true)}
              className="w-full bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
            >
              <Code className="h-3 w-3 mr-2" />
              View Code
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigator.clipboard.writeText(generateCode())}
              className="w-full bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
            >
              <Download className="h-3 w-3 mr-2" />
              Copy Code
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium text-zinc-400">Properties</h4>
          {renderPropertyInputs()}
        </div>

        <div className="mt-6">
          <h4 className="text-sm font-medium text-zinc-400 mb-3">Code Preview</h4>
          <pre className="bg-zinc-800 p-3 rounded text-xs text-zinc-300 overflow-auto max-h-32 scrollbar-thin scrollbar-track-zinc-800 scrollbar-thumb-zinc-600">
            <code>{generateCode()}</code>
          </pre>
        </div>
      </div>

      <Dialog open={showCode} onOpenChange={setShowCode}>
        <DialogContent className="bg-zinc-900 border-zinc-700 text-white max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Complete Component Code</DialogTitle>
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
