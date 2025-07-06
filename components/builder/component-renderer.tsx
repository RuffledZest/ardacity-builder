"use client"

import { type ComponentInstance, useComponents } from "./component-context"
import { getDynamicComponent, createFallbackComponent, createCompilationFallbackComponent, hasCompilationError, getCompilationError } from "@/lib/dynamic-component-compiler"
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
import { SignerComponent } from "../components/signer-component"
import { ChatBox } from "../components/chat-box"

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
    
    // Special case mapping for components with specific naming conventions
    const specialCaseMapping: Record<string, string> = {
      'ardacity-classic-navbar': 'ArDacityClassicNavbar',
      'ardacity-classic-hero': 'ArDacityClassicHero',
      'nft-theme-hero': 'NftThemeHero',
      'ao-message-signer': 'AOMessageSigner',
      'ao-chatbot': 'AOChatBot',
      'arweave-nft': 'ArweaveNFT',
      'arweave-search': 'ArweaveSearch',
      'clip-path-links': 'ClipPathLinks',
      'flowing-menu': 'FlowingMenu',
      'smooth-scroll-hero': 'SmoothScrollHero',
      'floating-navbar': 'FloatingNavbar',
      'signer-component': 'SignerComponent',
      'chat-box': 'ChatBox'
    };

      // Use special case mapping if available, otherwise use kebabToPascalCase
    const resolvedType = specialCaseMapping[component.type] || kebabToPascalCase(component.type);

  const renderComponent = () => {
    console.log('Rendering component with type:', component.type, 'resolved as:', resolvedType);
    
    // Always check dynamic registry first
    const DynamicComponent = getDynamicComponent(component.type);
    if (DynamicComponent) {
      console.log('Rendering dynamic component:', component.type);
      return <DynamicComponent {...component.props} />;
    }
    // Only fall back to static components if not found in dynamic registry
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
        return <SignerComponent {...component.props} />
      case "ChatBox":
        return <ChatBox {...component.props} />
      default:
        // Fallback for unknown types
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
