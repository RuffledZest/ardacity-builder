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
import { getDynamicComponent, isDynamicComponent } from '@/lib/dynamic-component-compiler'

// Utility to detect prop type
function getPropType(value: any): "string" | "number" | "boolean" | "array" | "object" {
  if (Array.isArray(value)) return "array";
  if (value === null) return "string";
  if (typeof value === "object") return "object";
  return typeof value as "string" | "number" | "boolean";
}

// Recursive property editor
function PropertyEditor({
  value,
  onChange,
  propSchema,
  propName = "",
}: {
  value: any;
  onChange: (v: any) => void;
  propSchema: any;
  propName?: string;
}) {
  const type = getPropType(propSchema);

  if (type === "object") {
    return (
      <div className="border border-zinc-700 rounded p-2 mb-2 bg-zinc-900/40">
        <div className="font-semibold text-zinc-400 mb-1">{propName}</div>
        {Object.keys(propSchema).map((key) => (
          <PropertyEditor
            key={key}
            value={value?.[key]}
            onChange={(v) => onChange({ ...value, [key]: v })}
            propSchema={propSchema[key]}
            propName={key}
          />
        ))}
      </div>
    );
  }

  if (type === "array") {
    return (
      <div className="border border-zinc-700 rounded p-2 mb-2 bg-zinc-900/40">
        <div className="font-semibold text-zinc-400 mb-1">{propName}</div>
        {(value || []).map((item: any, idx: number) => (
          <div key={idx} className="mb-2">
            <PropertyEditor
              value={item}
              onChange={(v) => {
                const newArr = [...value];
                newArr[idx] = v;
                onChange(newArr);
              }}
              propSchema={propSchema[0]}
              propName={`${propName}[${idx}]`}
            />
            <Button size="sm" variant="destructive" onClick={() => onChange(value.filter((_: any, i: number) => i !== idx))}>
              Remove
            </Button>
          </div>
        ))}
        <Button
          size="sm"
          variant="outline"
          className="bg-black/60"
          onClick={() => onChange([...(value || []), propSchema[0]])}
        >
          Add {propName}
        </Button>
      </div>
    );
  }

  // Primitive types
  if (propName === "imageUrl") {
    return (
      <div className="mb-2">
        <Label className="text-sm font-medium text-zinc-300 capitalize">{propName}</Label>
        <Input
          type="text"
          value={value ?? ""}
          onChange={e => onChange(e.target.value)}
          className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400"
          placeholder="Paste image URL"
        />
      </div>
    );
  }
  return (
    <div className="mb-2">
      <Label className="text-sm font-medium text-zinc-300 capitalize">{propName}</Label>
      <Input
        type={type === "number" ? "number" : "text"}
        value={value ?? ""}
        onChange={(e) =>
          onChange(type === "number" ? Number(e.target.value) : e.target.value)
        }
        className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400"
      />
    </div>
  );
}

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

  // Get schema from registry
  const definition = getComponentByType(selectedComponent.type)
  const propSchema = definition?.defaultProps || selectedComponent.props

  const handlePropsChange = (newProps: any) => {
    updateComponent(selectedComponent.id, newProps)
  }

  const generateCode = () => {
    if (isDynamicComponent(selectedComponent.type)) {
      const dynamicSample = (window as any).__DYNAMIC_COMPONENTS__?.[selectedComponent.type]
      if (selectedComponent.props && selectedComponent.props.__aiCode) {
        return selectedComponent.props.__aiCode
      }
      if (dynamicSample && dynamicSample.code) {
        return dynamicSample.code
      }
      return `<${selectedComponent.type} {...props} />`
    }
    const definition = getComponentByType(selectedComponent.type)
    if (!definition) return `<${selectedComponent.type} />`

    const propsString = Object.entries(selectedComponent.props)
      .map(([key, value]) => {
        if (typeof value === "object") {
          return `  ${key}={${JSON.stringify(value, null, 2)}}`
        }
        return `  ${key}="${value}"`
      })
      .join("\n")

    return `<${definition.type}\n${propsString}\n/>`
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
          <PropertyEditor
            value={selectedComponent.props}
            onChange={handlePropsChange}
            propSchema={propSchema}
          />
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
