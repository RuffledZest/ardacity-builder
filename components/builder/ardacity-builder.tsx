"use client"

import { BuilderNavbar } from "./builder-navbar"
import { ComponentLibrary } from "./component-library"
import { BuilderCanvas } from "./builder-canvas"
import { PropertiesPanel } from "./properties-panel"
import { ComponentProvider } from "./component-context"

export function ArDacityBuilder() {
  return (
    <ComponentProvider>
      <div className="h-screen flex flex-col bg-zinc-950 text-white">
        <BuilderNavbar />
        <div className="flex-1 flex overflow-hidden relative">
          <ComponentLibrary />
          <BuilderCanvas />
          <PropertiesPanel />
        </div>
      </div>
    </ComponentProvider>
  )
}
