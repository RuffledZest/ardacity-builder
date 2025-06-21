export interface ComponentDefinition {
  id: string
  name: string
  category: "navigation" | "header" | "arweave"
  type: string
  description: string
  defaultProps: Record<string, any>
  dependencies: string[]
  imports: string[]
  tags: string[]
}

export const componentRegistry: ComponentDefinition[] = [
  // Navigation Components
  {
    id: "ardacity-classic-navbar",
    name: "ArDacity Classic NavBar",
    category: "navigation",
    type: "ArDacityClassicNavbar",
    description: "Classic navigation bar with wallet integration",
    defaultProps: {
      brand: "ArDacity",
      nav1: "Docs",
      nav2: "Features",
      nav3: "Demo",
      variant: "default",
      position: "sticky",
    },
    dependencies: ["@ar-dacity/ardacity-wallet-btn", "next-themes"],
    imports: ["import { ArDacityClassicNavbar } from '@/components/navigation/ardacity-classic-navbar'"],
    tags: ["navigation", "wallet", "responsive"],
  },
  {
    id: "floating-navbar",
    name: "Floating NavBar",
    category: "navigation",
    type: "FloatingNavbar",
    description: "Modern floating navigation with scroll effects",
    defaultProps: {
      brand: "ArDacity",
      links: ["Home", "About", "Contact"],
      variant: "floating",
    },
    dependencies: [],
    imports: ["import { FloatingNavbar } from '@/components/navigation/floating-navbar'"],
    tags: ["navigation", "floating", "modern"],
  },
  {
    id: "clip-path-links",
    name: "Clip Path Links",
    category: "navigation",
    type: "ClipPathLinks",
    description: "Animated grid of social/media links with clip-path hover effects.",
    defaultProps: {
      links: [
        { icon: "SiGoogle", href: "#", label: "Google" },
        { icon: "SiShopify", href: "#", label: "Shopify" },
        { icon: "SiApple", href: "#", label: "Apple" },
        { icon: "SiSoundcloud", href: "#", label: "Soundcloud" },
        { icon: "SiAdobe", href: "#", label: "Adobe" },
        { icon: "SiFacebook", href: "#", label: "Facebook" },
        { icon: "SiTiktok", href: "#", label: "TikTok" },
        { icon: "SiSpotify", href: "#", label: "Spotify" },
        { icon: "SiLinkedin", href: "#", label: "LinkedIn" }
      ],
      gridLayout: "3x3",
      iconSize: "md",
      hoverColor: "#1a1a1a",
      backgroundColor: "transparent",
      borderColor: "#1a1a1a",
      animationDuration: 0.3
    },
    dependencies: ["framer-motion", "react-icons"],
    imports: ["import { ClipPathLinks } from '@/components/ui/clip-path-links'"],
    tags: ["links", "social", "animation", "clip-path", "grid"],
  },
  {
    id: "flowing-menu",
    name: "Flowing Menu",
    category: "navigation",
    type: "FlowingMenu",
    description: "Animated navigation menu with flowing marquee effects on hover.",
    defaultProps: {
      items: [
        { link: "#", text: "Home", image: "/placeholder.jpg" },
        { link: "#", text: "About", image: "/placeholder.jpg" },
        { link: "#", text: "Services", image: "/placeholder.jpg" },
        { link: "#", text: "Contact", image: "/placeholder.jpg" }
      ],
      className: ""
    },
    dependencies: [],
    imports: ["import { FlowingMenu } from '@/components/ui/flowing-menu'"],
    tags: ["navigation", "menu", "animation", "marquee", "hover"],
  },
  {
    id: "masonry",
    name: "Masonry Grid",
    category: "header",
    type: "Masonry",
    description: "Responsive masonry grid with GSAP animations and hover effects.",
    defaultProps: {
      items: [
        { id: "1", img: "/placeholder.jpg", url: "#", height: 300 },
        { id: "2", img: "/placeholder.jpg", url: "#", height: 400 },
        { id: "3", img: "/placeholder.jpg", url: "#", height: 250 },
        { id: "4", img: "/placeholder.jpg", url: "#", height: 350 },
        { id: "5", img: "/placeholder.jpg", url: "#", height: 280 },
        { id: "6", img: "/placeholder.jpg", url: "#", height: 320 }
      ],
      ease: "power3.out",
      duration: 0.6,
      stagger: 0.05,
      animateFrom: "bottom",
      scaleOnHover: true,
      hoverScale: 0.95,
      blurToFocus: true,
      colorShiftOnHover: false
    },
    dependencies: ["gsap"],
    imports: ["import { Masonry } from '@/components/ui/masonry'"],
    tags: ["grid", "masonry", "animation", "gsap", "responsive", "gallery"],
  },
  // Header Components
  {
    id: "smooth-scroll-hero",
    name: "Smooth Scroll Hero",
    category: "header",
    type: "SmoothScrollHero",
    description: "Parallax hero section with smooth scrolling effects",
    defaultProps: {
      title: "ArDacity NFT",
      subtitle: "Browse NFTs",
    },
    dependencies: ["framer-motion", "react-icons"],
    imports: ["import { SmoothScrollHero } from '@/components/headers/smooth-scroll-hero'"],
    tags: ["hero", "parallax", "animation"],
  },
  {
    id: "ardacity-classic-hero",
    name: "ArDacity Classic Hero",
    category: "header",
    type: "ArDacityClassicHero",
    description: "Elegant hero section with geometric animations",
    defaultProps: {
      badge: "Ardacity UI",
      title1: "ArDacity",
      title2: "Find Your Design",
    },
    dependencies: ["framer-motion", "next/font/google"],
    imports: ["import { ArDacityClassicHero } from '@/components/headers/ardacity-classic-hero'"],
    tags: ["hero", "elegant", "typography"],
  },
  {
    id: "nft-theme-hero",
    name: "NFT Theme Hero",
    category: "header",
    type: "NftThemeHero",
    description: "NFT-focused hero section with gradient effects",
    defaultProps: {
      title: "NFT Collection",
      description: "Discover unique digital assets",
    },
    dependencies: ["framer-motion"],
    imports: ["import { NftThemeHero } from '@/components/headers/nft-theme-hero'"],
    tags: ["hero", "nft", "gradient"],
  },
  // Arweave Blocks
  {
    id: "ao-message-signer",
    name: "AO Message Signer",
    category: "arweave",
    type: "AOMessageSigner",
    description: "Sign messages using AO wallet integration",
    defaultProps: {
      processId: "wTIAdGied4B7wXk1zikACl0Qn-wNdIlDOCkY81YiPBc",
      title: "Sign Message with AO",
      description: "Sign messages using AO wallet",
      theme: "dark",
    },
    dependencies: ["@permaweb/aoconnect"],
    imports: ["import { AOMessageSigner } from '@/components/arweave/ao-message-signer'"],
    tags: ["arweave", "ao", "wallet", "signing"],
  },
  {
    id: "ao-chatbot",
    name: "AO ChatBot",
    category: "arweave",
    type: "AOChatBot",
    description: "Interactive chatbot powered by AO processes",
    defaultProps: {
      processId: "lf9KuIzsIogdOPXc5hdBZNbZ3_CaeM0IrX9maSteWcY",
      theme: "dark",
      title: "AO ChatBot",
    },
    dependencies: ["@permaweb/aoconnect"],
    imports: ["import { AOChatBot } from '@/components/arweave/ao-chatbot'"],
    tags: ["arweave", "ao", "chat", "ai"],
  },
  {
    id: "arweave-nft",
    name: "Arweave NFT",
    category: "arweave",
    type: "ArweaveNFT",
    description: "NFT display and transfer interface with Lua IDE",
    defaultProps: {
      title: "Arweave NFT",
      description: "View and interact with your Arweave NFT",
      tokenId: "your-token-id",
      owner: "your-wallet-address",
    },
    dependencies: ["@permaweb/aoconnect"],
    imports: [
      "import { ArweaveNFT } from '@/components/arweave/arweave-nft'",
      "import { LuaIDE } from '@/components/arweave/lua-ide'",
    ],
    tags: ["arweave", "nft", "lua", "transfer"],
  },
  {
    id: "arweave-search",
    name: "Arweave Search",
    category: "arweave",
    type: "ArweaveSearch",
    description: "Search Arweave transactions using GraphQL with tag filtering",
    defaultProps: {
      initialTags: [
        { name: "Content-Type", value: "image/png" },
        { name: "App-Name", value: "ArweaveSearch" }
      ],
      limit: 10
    },
    dependencies: ["@apollo/client", "graphql"],
    imports: ["import { ArweaveSearch } from '@/components/arweave/arweave-search'"],
    tags: ["arweave", "search", "graphql", "transactions", "indexer"],
  },
]

export function getComponentByType(type: string): ComponentDefinition | undefined {
  return componentRegistry.find((comp) => comp.type === type)
}

export function searchComponents(query: string): ComponentDefinition[] {
  if (!query.trim()) return componentRegistry

  const lowercaseQuery = query.toLowerCase()
  return componentRegistry.filter(
    (comp) =>
      comp.name.toLowerCase().includes(lowercaseQuery) ||
      comp.description.toLowerCase().includes(lowercaseQuery) ||
      comp.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
  )
}
