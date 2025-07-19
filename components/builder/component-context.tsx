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
  children?: ComponentInstance[] // <-- Add this line for tree structure
}

interface ComponentContextType {
  components: ComponentInstance[]
  selectedComponent: ComponentInstance | null
  searchQuery: string
  setSearchQuery: (query: string) => void
  addComponent: (component: Omit<ComponentInstance, "id">, parentId?: string) => void // <-- Add parentId
  updateComponent: (id: string, props: Record<string, any>) => void
  selectComponent: (component: ComponentInstance | null) => void
  deleteComponent: (id: string) => void
  moveComponent: (id: string, direction: "up" | "down") => void
  addGeneratedComponents: (generatedComponents: GeneratedComponent[]) => void
  isComponentAvailable: (type: string) => boolean
  clearComponents: () => void
}

const ComponentContext = createContext<ComponentContextType | undefined>(undefined)

export function ComponentProvider({ children }: { children: ReactNode }) {
  const [components, setComponents] = useState<ComponentInstance[]>([])
  const [selectedComponent, setSelectedComponent] = useState<ComponentInstance | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Helper: Find and update a node in the tree
  function updateTree(
    nodes: ComponentInstance[],
    id: string,
    updater: (node: ComponentInstance, parent?: ComponentInstance, index?: number, arr?: ComponentInstance[]) => boolean | void,
    parent?: ComponentInstance
  ): boolean {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].id === id) {
        if (updater(nodes[i], parent, i, nodes) !== false) return true
      }
      if (nodes[i].children) {
        if (updateTree(nodes[i].children!, id, updater, nodes[i])) return true
      }
    }
    return false
  }

  // Helper: Remove a node from the tree
  function removeFromTree(nodes: ComponentInstance[], id: string): ComponentInstance[] {
    return nodes
      .map(node => {
        if (node.id === id) return null
        if (node.children) {
          node = { ...node, children: removeFromTree(node.children, id) }
        }
        return node
      })
      .filter(Boolean) as ComponentInstance[]
  }

  // Helper: Move a node up/down among siblings
  function moveInTree(nodes: ComponentInstance[], id: string, direction: "up" | "down"): ComponentInstance[] {
    let changed = false
    function move(nodes: ComponentInstance[]): ComponentInstance[] {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id === id) {
          const newIndex = direction === "up" ? i - 1 : i + 1
          if (newIndex >= 0 && newIndex < nodes.length) {
            const newNodes = [...nodes]
            const [moved] = newNodes.splice(i, 1)
            newNodes.splice(newIndex, 0, moved)
            changed = true
            return newNodes
          }
        }
        if (nodes[i].children) {
          const newChildren = move(nodes[i].children!)
          if (changed) {
            nodes[i] = { ...nodes[i], children: newChildren }
            return nodes
          }
        }
      }
      return nodes
    }
    return move(nodes)
  }

  // Add component as root or as child of parentId
  const addComponent = (component: Omit<ComponentInstance, "id">, parentId?: string) => {
    const newComponent: ComponentInstance = {
      ...component,
      id: `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      children: [],
    }
    setComponents(prev => {
      if (!parentId) {
        return [...prev, newComponent]
      } else {
        // Add as child to parent
        const newTree = JSON.parse(JSON.stringify(prev))
        updateTree(newTree, parentId, (node) => {
          node.children = node.children || []
          node.children.push(newComponent)
        })
        return newTree
      }
    })
    setSelectedComponent(newComponent)
  }

  // Update component props (recursive)
  const updateComponent = (id: string, props: Record<string, any>) => {
    setComponents(prev => {
      const newTree = JSON.parse(JSON.stringify(prev))
      updateTree(newTree, id, (node) => {
        node.props = { ...node.props, ...props }
      })
      return newTree
    })
    if (selectedComponent?.id === id) {
      setSelectedComponent(prev => (prev ? { ...prev, props: { ...prev.props, ...props } } : null))
    }
  }

  // Select component (no change needed)
  const selectComponent = (component: ComponentInstance | null) => {
    setSelectedComponent(component)
  }

  // Delete component (recursive)
  const deleteComponent = (id: string) => {
    setComponents(prev => removeFromTree(prev, id))
    if (selectedComponent?.id === id) {
      setSelectedComponent(null)
    }
  }

  // Move component up/down among siblings (recursive)
  const moveComponent = (id: string, direction: "up" | "down") => {
    setComponents(prev => moveInTree(prev, id, direction))
  }

  // New method to handle AI-generated components
  const addGeneratedComponents = (generatedComponents: GeneratedComponent[]) => {
    console.log('Adding generated components:', generatedComponents);
    
    // First, compile and register the components
    const result = compileAndRegisterComponents(generatedComponents)
    
    console.log('Dynamic component compilation result:', result)
    console.log('Successful compilations:', result.success);
    console.log('Failed compilations:', result.failed);
    
    // Then add them to the builder
    generatedComponents.forEach((genComponent) => {
      const newComponent: ComponentInstance = {
        id: `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: genComponent.type,
        category: genComponent.category,
        props: genComponent.props,
        position: { x: 0, y: 0 } // Default position
      }
      
      console.log('Adding component to builder:', newComponent);
      setComponents((prev) => [...prev, newComponent])
    })
  }

  // Check if a component type is available (either static or dynamic)
  const isComponentAvailable = (type: string): boolean => {
    console.log('Checking if component is available:', type);
    
    // Check if it's a dynamic component
    if (isDynamicComponent(type)) {
      console.log('Component is available as dynamic component:', type);
      return true
    }
    
    // Check if it's a static component by trying to resolve it
    const resolvedType = type
      .split('-')
      .map(s => s.charAt(0).toUpperCase() + s.slice(1))
      .join('');
    
    console.log('Resolved type for static component check:', resolvedType);
    
    // List of known static component types
    const staticComponentTypes = [
      "ArDacityClassicNavbar",
      "FloatingNavbar", 
      "SmoothScrollHero",
      "ArDacityClassicHero",
      "NftThemeHero",
      "AOMessageSigner",
      "AOChatBot",
      "ArweaveNFT",
      "ArweaveSearch",
      "ClipPathLinks",
      "FlowingMenu",
      "Masonry",
      "Card",
      "Button",
      "SignerComponent",
      "ChatBox"
    ];
    
    const isStatic = staticComponentTypes.includes(resolvedType);
    console.log('Is static component:', isStatic);
    
    return isStatic;
  }

  const clearComponents = () => {
    setComponents([])
    setSelectedComponent(null)
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
        clearComponents, // new method
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
