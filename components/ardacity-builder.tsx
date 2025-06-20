"use client"
import { BuilderNavbar } from "./builder/builder-navbar"
import { ComponentLibrary } from "./builder/component-library"
import { BuilderCanvas } from "./builder/builder-canvas"
import { PropertiesPanel } from "./builder/properties-panel"
import { ComponentProvider } from "./builder/component-context"

export function ArDacityBuilder() {
  return (
    <ComponentProvider>
      <div className="h-screen flex flex-col bg-zinc-950 text-white">
        <BuilderNavbar />
        <div className="flex-1 flex overflow-hidden">
          <ComponentLibrary />
          <BuilderCanvas />
          <PropertiesPanel />
        </div>
      </div>
    </ComponentProvider>
  )
}
