"use client"

import { type ComponentInstance, useComponents } from "./component-context"
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
import { ArDacityBuilder } from "./ardacity-builder"

interface ComponentRendererProps {
  component: ComponentInstance
}

export function ComponentRenderer({ component }: ComponentRendererProps) {
  const { selectComponent, selectedComponent } = useComponents()

  const handleClick = () => {
    selectComponent(component)
  }

  const isSelected = selectedComponent?.id === component.id

  const renderComponent = () => {
    console.log('Rendering component with type:', component.type);
    switch (component.type) {
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
      case "ArDacityBuilder":
        console.log('Found ArDacityBuilder case, rendering component');
        return <ArDacityBuilder {...component.props} />
      default:
        console.log('No matching case found for type:', component.type);
        return (
          <div className="p-8 bg-red-500/20 text-red-300 border border-red-500/50 rounded-lg m-4">
            <h3 className="text-lg font-semibold mb-2">Unknown Component</h3>
            <p>Component type "{component.type}" not found</p>
          </div>
        )
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
