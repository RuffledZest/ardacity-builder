"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { 
  compileAndRegisterComponents, 
  getDynamicComponent, 
  isDynamicComponent,
  type GeneratedComponent 
} from "@/lib/dynamic-component-compiler"

export interface ComponentInstance {
  id: string
  type: string
  category: string
  props: Record<string, any>
  position: { x: number; y: number }
}

interface ComponentContextType {
  components: ComponentInstance[]
  selectedComponent: ComponentInstance | null
  searchQuery: string
  setSearchQuery: (query: string) => void
  addComponent: (component: Omit<ComponentInstance, "id">) => void
  updateComponent: (id: string, props: Record<string, any>) => void
  selectComponent: (component: ComponentInstance | null) => void
  deleteComponent: (id: string) => void
  moveComponent: (id: string, direction: "up" | "down") => void
  // New methods for dynamic components
  addGeneratedComponents: (generatedComponents: GeneratedComponent[]) => void
  isComponentAvailable: (type: string) => boolean
}

const ComponentContext = createContext<ComponentContextType | undefined>(undefined)

export function ComponentProvider({ children }: { children: ReactNode }) {
  const [components, setComponents] = useState<ComponentInstance[]>([])
  const [selectedComponent, setSelectedComponent] = useState<ComponentInstance | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const addComponent = (component: Omit<ComponentInstance, "id">) => {
    const newComponent: ComponentInstance = {
      ...component,
      id: `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }
    setComponents((prev) => [...prev, newComponent])
    setSelectedComponent(newComponent)
  }

  const updateComponent = (id: string, props: Record<string, any>) => {
    setComponents((prev) =>
      prev.map((comp) => (comp.id === id ? { ...comp, props: { ...comp.props, ...props } } : comp)),
    )
    if (selectedComponent?.id === id) {
      setSelectedComponent((prev) => (prev ? { ...prev, props: { ...prev.props, ...props } } : null))
    }
  }

  const selectComponent = (component: ComponentInstance | null) => {
    setSelectedComponent(component)
  }

  const deleteComponent = (id: string) => {
    setComponents((prev) => prev.filter((comp) => comp.id !== id))
    if (selectedComponent?.id === id) {
      setSelectedComponent(null)
    }
  }

  const moveComponent = (id: string, direction: "up" | "down") => {
    setComponents((prev) => {
      const index = prev.findIndex((comp) => comp.id === id)
      if (index === -1) return prev

      const newIndex = direction === "up" ? index - 1 : index + 1
      if (newIndex < 0 || newIndex >= prev.length) return prev

      const newComponents = [...prev]
      const [movedComponent] = newComponents.splice(index, 1)
      newComponents.splice(newIndex, 0, movedComponent)
      return newComponents
    })
  }

  // New method to handle AI-generated components
  const addGeneratedComponents = (generatedComponents: GeneratedComponent[]) => {
    // First, compile and register the components
    const result = compileAndRegisterComponents(generatedComponents)
    
    console.log('Dynamic component compilation result:', result)
    
    // Then add them to the builder
    generatedComponents.forEach((genComponent) => {
      const newComponent: ComponentInstance = {
        id: `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: genComponent.type,
        category: genComponent.category,
        props: genComponent.props,
        position: { x: 0, y: 0 } // Default position
      }
      
      setComponents((prev) => [...prev, newComponent])
    })
  }

  // Check if a component type is available (either static or dynamic)
  const isComponentAvailable = (type: string): boolean => {
    // Check if it's a dynamic component
    if (isDynamicComponent(type)) {
      return true
    }
    
    // Check if it's a static component (you might want to add a static component registry here)
    // For now, we'll assume all components are available
    return true
  }

  return (
    <ComponentContext.Provider
      value={{
        components,
        selectedComponent,
        searchQuery,
        setSearchQuery,
        addComponent,
        updateComponent,
        selectComponent,
        deleteComponent,
        moveComponent,
        addGeneratedComponents,
        isComponentAvailable,
      }}
    >
      {children}
    </ComponentContext.Provider>
  )
}

export function useComponents() {
  const context = useContext(ComponentContext)
  if (context === undefined) {
    throw new Error("useComponents must be used within a ComponentProvider")
  }
  return context
}
