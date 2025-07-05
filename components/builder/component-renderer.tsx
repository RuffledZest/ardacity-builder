"use client"

import { type ComponentInstance, useComponents } from "./component-context"
import { getDynamicComponent, createFallbackComponent } from "@/lib/dynamic-component-compiler"
import { ArDacityClassicNavbar } from "../navigation/ardacity-classic-navbar"
import { FloatingNavbar } from "../navigation/floating-navbar"
import { SmoothScrollHero } from "../headers/smooth-scroll-hero"
import { ArDacityClassicHero } from "../headers/ardacity-classic-hero"
import { NftThemeHero } from "../headers/nft-theme-hero"
import { AOMessageSigner } from "../arweave/ao-message-signer"
import { AOChatBot } from "../arweave/ao-chatbot"
import { ArweaveNFT } from "../arweave/arweave-nft"
import { ArweaveSearch } from "../arweave/arweave-search"
import { ClipPathLinks } from "../ui/clip-path-links"
import { FlowingMenu } from "../ui/flowing-menu"
import { Masonry } from "../ui/masonry"
import { Card } from "../ui/card"
import { Button } from "../ui/button"

interface ComponentRendererProps {
  component: ComponentInstance
}

export function ComponentRenderer({ component }: ComponentRendererProps) {
  const { selectComponent, selectedComponent } = useComponents()

  const handleClick = () => {
    selectComponent(component)
  }

  const isSelected = selectedComponent?.id === component.id

  // Utility to convert kebab-case to PascalCase
  function kebabToPascalCase(str: string) {
    return str
      .split('-')
      .map(s => s.charAt(0).toUpperCase() + s.slice(1))
      .join('');
  }

  const resolvedType = kebabToPascalCase(component.type);

  const renderComponent = () => {
    console.log('Rendering component with type:', component.type, 'resolved as:', resolvedType);
    
    // First, check if it's a dynamic component
    const DynamicComponent = getDynamicComponent(component.type);
    if (DynamicComponent) {
      console.log('Rendering dynamic component:', component.type);
      return <DynamicComponent {...component.props} />
    }
    
    // Then check static components
    switch (resolvedType) {
      case "ArDacityClassicNavbar":
        return <ArDacityClassicNavbar {...component.props} />
      case "FloatingNavbar":
        return <FloatingNavbar {...component.props} />
      case "SmoothScrollHero":
        return <SmoothScrollHero {...component.props} />
      case "ArDacityClassicHero":
        return <ArDacityClassicHero {...component.props} />
      case "NftThemeHero":
        return <NftThemeHero {...component.props} />
      case "AOMessageSigner":
        return <AOMessageSigner {...component.props} />
      case "AOChatBot":
        return <AOChatBot {...component.props} />
      case "ArweaveNFT":
        return <ArweaveNFT {...component.props} />
      case "ArweaveSearch":
        return <ArweaveSearch {...component.props} />
      case "ClipPathLinks":
        return <ClipPathLinks {...component.props} />
      case "FlowingMenu":
        return <FlowingMenu {...component.props} />
      case "Masonry":
        return <Masonry {...component.props} />
      case "Card":
        return <Card {...component.props}>{component.props.children}</Card>
      case "Button":
        return (
          <Button 
            variant={component.props.variant} 
            size={component.props.size}
            className={component.props.className}
            {...component.props}
          >
            {component.props.children}
          </Button>
        )
      case "SignerComponent":
        // Dynamically import if not statically imported
        const SignerComponent = require("../components/signer-component").SignerComponent;
        return <SignerComponent {...component.props} />
      case "ChatBox":
        const ChatBox = require("../components/chat-box").ChatBox;
        return <ChatBox {...component.props} />
      default:
        console.log('No matching case found for type:', component.type);
        // Create a fallback component that shows the missing component info
        const FallbackComponent = createFallbackComponent(component.type, "Component not found in registry");
        return <FallbackComponent {...component.props} />
    }
  }

  return (
    <div
      onClick={handleClick}
      className={`cursor-pointer transition-all ${isSelected ? "ring-2 ring-blue-500 ring-opacity-50" : ""}`}
    >
      {renderComponent()}
    </div>
  )
}
