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
import { FancyColumnFooter } from "../footers/fancy-column-footer"
import { LiquidGlassNavbar } from "../navigation/liquid-glass-navbar"
import { AppDownloadFooter } from "../footers/app-download-footer"
import { NewsletterFooter } from "../footers/newsletter-footer"
import { ProductFooter } from "../footers/product-footer"
import Web3LandingPage from "../landing/web3-landing-page"
import Web3LandingPage2 from "../landing/web3-landing-page-2"
import ProductLandingPage from "../landing/product-landing-page"
import { ChatRoom } from "../arweave/chatroom-on-chain"
import { DarkHeader } from "../headers/dark-theme-header"
import { ComponentHoverControls } from "./component-hover-controls"
import ProfileManager from "../arweave/create-bazaar-profile"
import FetchProfileCard from "../arweave/fetch-bazaar-profile"
import AtomicAssetsManager from "../arweave/atomic-asset"
import ARNSRecordLookup from "../arweave/arns-record-lookup"
import BotegaLiquidityPoolInfo from "../arweave/botega-liquidity-pool-info"
import StakingPanel from "../arweave/staking-panel"
import BazaarNftPortfolio from "../arweave/bazaar-nft-portfolio"
import AOTokenDemo from "../arweave/ao-token-demo"

interface ComponentRendererProps {
  component: ComponentInstance
  isRoot?: boolean
  index?: number
  totalSiblings?: number
  hoveredComponent?: string | null
  setHoveredComponent?: (id: string | null) => void
}

export function ComponentRenderer({ component, isRoot = false, index = 0, totalSiblings = 1, hoveredComponent, setHoveredComponent }: ComponentRendererProps) {
  const { selectComponent, selectedComponent } = useComponents()

  const handleClick = () => {
    selectComponent(component)
  }

  const isSelected = selectedComponent?.id === component.id
  const isHovered = hoveredComponent === component.id

  // Drag-and-drop handlers for nested drop
  const handleDrop = (e: React.DragEvent) => {
    e.stopPropagation()
    e.preventDefault()
    const componentData = JSON.parse(e.dataTransfer.getData("application/json"))
    // Try to get AI-generated sample data for this component type
    // (reuse logic from builder-canvas if needed)
    // addComponent({
    //   type: componentData.type,
    //   category: componentData.category,
    //   props: componentData.defaultProps,
    //   position: { x: 0, y: 0 },
    // }, component.id)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

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
      'liquid-glass-navbar':'LiquidGlassNavbar',
      'fancy-classic-footer': 'FancyColumnFooter',
      'app-download-footer':'AppDownloadFooter',
      'newsletter-footer':'NewsletterFooter',
      'product-footer':'ProductFooter',
      'nft-theme-hero': 'NftThemeHero',
      'ao-message-signer': 'AOMessageSigner',
      'ao-chatbot': 'AOChatBot',
      'chatroom-on-chain': 'ChatRoom',
      'arweave-nft': 'ArweaveNFT',
      'arweave-search': 'ArweaveSearch',
      'clip-path-links': 'ClipPathLinks',
      'flowing-menu': 'FlowingMenu',
      'smooth-scroll-hero': 'SmoothScrollHero',
      'dark-theme-header': 'DarkHeader',
      'floating-navbar': 'FloatingNavbar',
      'signer-component': 'SignerComponent',
      'chat-box': 'ChatBox',
      'create-bazaar-profile':'ProfileManager',
      'fetch-bazaar-profile':'FetchProfileCard',
      'atomic-asset':'AtomicAssetsManager',
      'arns-record-lookup':'ARNSRecordLookup',
      'botega-liquidity-pool-info':'BotegaLiquidityPoolInfo',
      'staking-panel':'StakingPanel',
      'bazaar-nft-portfolio':'BazaarNftPortfolio',
      'web3-landing-page':'Web3LandingPage',
      'web3-landing-page-2':'Web3LandingPage2',
      'product-landing-page':'ProductLandingPage'
    };

      // Use special case mapping if available, otherwise use kebabToPascalCase
    const resolvedType = specialCaseMapping[component.type] || kebabToPascalCase(component.type);

  const renderComponent = () => {
    
    // Always check dynamic registry first
    const DynamicComponent = getDynamicComponent(component.type);
    if (DynamicComponent) {
      return <DynamicComponent {...component.props} />;
    }
    // Only fall back to static components if not found in dynamic registry
    switch (resolvedType) {
      case "ArDacityClassicNavbar":
        return <ArDacityClassicNavbar {...component.props} />
      case "LiquidGlassNavbar":
        return <LiquidGlassNavbar {...component.props as any}/>
      case "FancyColumnFooter":
        return <FancyColumnFooter {...component.props as any}/>
      case "AppDownloadFooter":
        return <AppDownloadFooter {...component.props}/>
      case "NewsletterFooter":
        return <NewsletterFooter {...component.props}/>
      case "ProductFooter":
        return <ProductFooter {...component.props}/>
      case "FloatingNavbar":
        return <FloatingNavbar {...component.props} />
      case "SmoothScrollHero":
        return <SmoothScrollHero {...component.props} />
      case "DarkHeader":
        return <DarkHeader {...component.props} />
      case "ArDacityClassicHero":
        return <ArDacityClassicHero {...component.props} />
      case "NftThemeHero":
        return <NftThemeHero {...component.props} />
      case "AOMessageSigner":
        return <AOMessageSigner {...component.props} />
      case "AOChatBot":
        return <AOChatBot {...component.props} />
      case "ChatRoom":
        return <ChatRoom {...component.props} />
      case "ArweaveNFT":
        return <ArweaveNFT {...component.props} />
      case "ArweaveSearch":
        return <ArweaveSearch {...component.props} />
      case "ProfileManager":
        return <ProfileManager {...component.props} />
      case "FetchProfileCard":
        return <FetchProfileCard {...component.props} />
      case "AtomicAssetsManager":
        return <AtomicAssetsManager {...component.props} />
      case "ARNSRecordLookup":
        return <ARNSRecordLookup {...component.props} />
      case "BotegaLiquidityPoolInfo":
        return <BotegaLiquidityPoolInfo {...component.props} />
      case "StakingPanel":
        return <StakingPanel {...component.props} />
      case "BazaarNftPortfolio":
        return <BazaarNftPortfolio {...component.props} />
      case "AOTokenDemo":
        return <AOTokenDemo {...component.props} />
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
      case "Web3LandingPage":
        return <Web3LandingPage {...component.props}/>
      case "Web3LandingPage2":
        return <Web3LandingPage2 {...component.props}/>
      case "ProductLandingPage":
        return <ProductLandingPage {...component.props}/>
      default:
        // Fallback for unknown types
        const FallbackComponent = createFallbackComponent(component.type, "Component not found in registry");
        return <FallbackComponent {...component.props} />
    }
  }

  return (
    <div
      className={`relative group${isRoot ? '' : ' ml-4'}${isSelected ? ' ring-2 ring-blue-500 ring-opacity-50' : ''}`}
      onClick={handleClick}
      onMouseEnter={() => setHoveredComponent && setHoveredComponent(component.id)}
      onMouseLeave={() => setHoveredComponent && setHoveredComponent(null)}
    >
      {renderComponent()}
      {isHovered && typeof isRoot !== 'undefined' && setHoveredComponent && (
        <ComponentHoverControls
          component={component}
          isFirst={index === 0}
          isLast={index === (totalSiblings - 1)}
        />
      )}
    </div>
  )
}
