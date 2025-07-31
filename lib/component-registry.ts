export interface ComponentDefinition {
  id: string;
  name: string;
  category: "navigation" | "header" | "arweave" | "ui" | "footer" | "landing";
  type: string;
  description: string;
  defaultProps: Record<string, any>;
  dependencies: string[];
  imports: string[];
  tags: string[];
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
    imports: [
      "import { ArDacityClassicNavbar } from '@/components/navigation/ardacity-classic-navbar'",
    ],
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
    imports: [
      "import { FloatingNavbar } from '@/components/navigation/floating-navbar'",
    ],
    tags: ["navigation", "floating", "modern"],
  },
  {
    id: "clip-path-links",
    name: "Clip Path Links",
    category: "navigation",
    type: "ClipPathLinks",
    description:
      "Animated grid of social/media links with clip-path hover effects.",
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
        { icon: "SiLinkedin", href: "#", label: "LinkedIn" },
      ],
      gridLayout: "3x3",
      iconSize: "md",
      hoverColor: "#1a1a1a",
      backgroundColor: "transparent",
      borderColor: "#1a1a1a",
      animationDuration: 0.3,
    },
    dependencies: ["framer-motion", "react-icons"],
    imports: [
      "import { ClipPathLinks } from '@/components/ui/clip-path-links'",
    ],
    tags: ["links", "social", "animation", "clip-path", "grid"],
  },
  {
    id: "flowing-menu",
    name: "Flowing Menu",
    category: "navigation",
    type: "FlowingMenu",
    description:
      "Animated navigation menu with flowing marquee effects on hover.",
    defaultProps: {
      items: [
        { link: "#", text: "Home", image: "/placeholder.jpg" },
        { link: "#", text: "About", image: "/placeholder.jpg" },
        { link: "#", text: "Services", image: "/placeholder.jpg" },
        { link: "#", text: "Contact", image: "/placeholder.jpg" },
      ],
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
    description:
      "Responsive masonry grid with GSAP animations and hover effects.",
    defaultProps: {
      items: [
        {
          id: "1",
          img: "https://images.unsplash.com/photo-1751795195789-8dab6693475d?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          url: "#",
          height: 300,
        },
        {
          id: "2",
          img: "https://images.unsplash.com/photo-1752805936214-bbdd8c94a576?q=80&w=685&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          url: "#",
          height: 400,
        },
        {
          id: "3",
          img: "https://images.unsplash.com/photo-1749947393466-cb5e81bc943d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          url: "#",
          height: 250,
        },
        {
          id: "4",
          img: "https://plus.unsplash.com/premium_photo-1746417461105-51b89a61907f?q=80&w=706&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          url: "#",
          height: 350,
        },
        {
          id: "5",
          img: "https://images.unsplash.com/photo-1704094516867-d8ff1d9b71cc?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          url: "#",
          height: 280,
        },
        {
          id: "6",
          img: "https://images.unsplash.com/photo-1752867823419-e56031e9d737?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          url: "#",
          height: 320,
        },
      ],
      ease: "power3.out",
      duration: 0.6,
      stagger: 0.05,
      animateFrom: "bottom",
      scaleOnHover: true,
      hoverScale: 0.95,
      blurToFocus: true,
      colorShiftOnHover: false,
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
    description:
      "Parallax hero section with smooth scrolling effects. Accepts 'images' (array) and 'centerImageUrl' (string) props to customize the parallax and center images.",
    defaultProps: {
      title: "ArDacity NFT",
      subtitle: "Browse NFTs",
      centerImageUrl:
        "https://images.unsplash.com/photo-1460186136353-977e9d6085a1?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      images: [
        {
          src: "https://images.unsplash.com/photo-1484600899469-230e8d1d59c0?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          alt: "Space launch",
          start: -200,
          end: 200,
          className: "w-1/3",
        },
        {
          src: "https://images.unsplash.com/photo-1446776709462-d6b525c57bd3?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          alt: "Space launch",
          start: 200,
          end: -250,
          className: "mx-auto w-2/3",
        },
      ],
    },
    dependencies: ["framer-motion", "react-icons"],
    imports: [
      "import { SmoothScrollHero } from '@/components/headers/smooth-scroll-hero'",
    ],
    tags: ["hero", "parallax", "animation", "custom-images", "center-image"],
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
    imports: [
      "import { ArDacityClassicHero } from '@/components/headers/ardacity-classic-hero'",
    ],
    tags: ["hero", "elegant", "typography"],
  },
  {
    id: "nft-theme-hero",
    name: "NFT Theme Hero",
    category: "header",
    type: "NftThemeHero",
    description: "NFT-focused hero section with gradient effects",
    defaultProps: {
      title: "Explore Metaverse Art",
      description: "Dive into exclusive collections of digital art",
      backgroundImage:
        "https://images.unsplash.com/photo-1593173930865-2edee2550a40?q=80&w=1338&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      gradientFrom: "indigo-900",
      gradientVia: "purple-800",
      gradientTo: "pink-900",
      primaryBtnText: "Start Exploring",
      secondaryBtnText: "Mint Your NFT",
      animate: true,
    },
    dependencies: ["framer-motion"],
    imports: [
      "import { NftThemeHero } from '@/components/headers/nft-theme-hero'",
    ],
    tags: ["hero", "nft", "gradient"],
  },
  {
    id: "bazaar-header",
    name: "Bazaar Header",
    category: "header",
    type: "BazaarHeader",
    description:
      "Header with Bazaar theme, featuring animated elements and a modern design.",
    defaultProps: {
      title: "Arweave Bazaar",
      subtitle: "Decentralized Profile & Asset Management",
      description: "Create, update, and manage your decentralized identity on the Arweave permaweb. Build your profile, showcase assets, and connect with the decentralized community.",
      stats: {
        totalProfiles: 12500,
        totalAssets: 45800,
        networkUptime: "99.9%",
      },
      ctaText: "Get Started",
      showArweaveInfo: true,
      customClassName: "",
    },
    dependencies: ["framer-motion", "next/image"],
    imports: [
      "import  {BazaarHeader}  from '@/components/headers/bazaar-header'",
    ],
    tags: ["header", "bazaar", "animated", "modern"],
  },
  {
    id: "fancy-column-footer",
    name: "Fancy Column Footer",
    category: "footer",
    type: "FancyColumnFooter",
    description:
      "Modern, responsive multi-column footer with glass/gradient backgrounds and animated links.",
    defaultProps: {
      logo: { src: "/placeholder-ArDacity.png", alt: "Logo" },
      description: "A modern, beautiful footer for by ArDacity.",
      columns: [
        {
          title: "Product",
          icon: "box",
          links: [
            { label: "Features", url: "#features" },
            { label: "Pricing", url: "#pricing" },
            { label: "Docs", url: "#docs" },
          ],
        },
        {
          title: "Company",
          icon: "company",
          links: [
            { label: "About", url: "#about" },
            { label: "Careers", url: "#careers" },
          ],
        },
        {
          title: "Resources",
          icon: "resources",
          links: [
            { label: "Blog", url: "#blog" },
            { label: "Support", url: "#support" },
          ],
        },
        {
          title: "Legal",
          icon: "legal",
          links: [
            { label: "Privacy Policy", url: "#privacy" },
            { label: "Terms of Service", url: "#terms" },
          ],
        },
      ],
      backgroundStyle: "dark-abstract",
      bottomNote: "© 2025 Ardacity. All rights reserved.",
      socialIcons: ["twitter", "github", "discord"],
      layout: "center",
    },
    dependencies: ["react-icons"],
    imports: [
      "import { FancyColumnFooter } from '@/components/footers/fancy-column-footer'",
    ],
    tags: [
      "footer",
      "responsive",
      "glassmorphism",
      "gradient",
      "columns",
      "modern",
      "animated",
      "ui",
    ],
  },
  {
    id: "app-download-footer",
    name: "App Download Footer",
    category: "footer",
    type: "AppDownloadFooter",
    description:
      "Footer with app download badges, social icons, and quick links. Includes animated visuals and dark mode support.",
    defaultProps: {
      logoKey: "default",
      logoUrl: "/ArDacitypfp.png",
      tagline: "ArDacity just enhanced your Footer!",
      appStoreLink: "https://apple.com/app-store",
      playStoreLink: "https://play.google.com/store",
      quickLinks: [
        { label: "Support", href: "/support" },
        { label: "Contact", href: "/contact" },
      ],
      socialIconKeys: ["twitter", "instagram", "facebook"],
      darkTheme: true,
      motionDecor: true,
    },
    dependencies: ["react-icons"],
    imports: [
      "import { AppDownloadFooter } from '@/components/footers/app-download-footer'",
    ],
    tags: [
      "footer",
      "app",
      "download",
      "badges",
      "social",
      "links",
      "animated",
      "dark",
      "modern",
    ],
  },
  {
    id: "newsletter-footer",
    name: "Newsletter Footer",
    category: "footer",
    type: "NewsletterFooter",
    description:
      "Footer with newsletter subscription, social icons, and legal links. Animated, modern, and builder-friendly.",
    defaultProps: {
      title: "Stay updated with our latest news",
      description: "Get product updates, company news, and more.",
      // onSubscribe is left undefined for builder compatibility
      socialIcons: ["Twitter", "Instagram", "Github"], // Builder can map icon keys to ReactNodes if needed
      legalLinks: [
        { label: "Privacy", href: "/privacy" },
        { label: "Terms", href: "/terms" },
      ],
    },
    dependencies: ["framer-motion", "react-icons"],
    imports: [
      "import { NewsletterFooter } from '@/components/footers/newsletter-footer'",
    ],
    tags: [
      "footer",
      "newsletter",
      "subscription",
      "social",
      "legal",
      "animated",
      "modern",
    ],
  },
  {
    id: "product-footer",
    name: "SaaS Product Footer",
    category: "footer",
    type: "ProductFooter",
    description:
      "Modern SaaS-style footer with logo, description, social icons, quick links, legal links, and newsletter subscription.",
    defaultProps: {
      logoUrl: "/ArDacitypfp.png",
      description: "Modern SaaS for your business.",
      socialIconKeys: ["github", "twitter", "linkedin"],
      quickLinks: [
        { label: "Features", href: "/features" },
        { label: "Pricing", href: "/pricing" },
        { label: "Docs", href: "/docs" },
        { label: "Blog", href: "/blog" },
        { label: "Careers", href: "/careers" },
      ],
      legalLinks: [
        { label: "Privacy", href: "/privacy" },
        { label: "Terms", href: "/terms" },
      ],
    },
    dependencies: ["react-icons"],
    imports: [
      "import { ProductFooter } from '@/components/footers/product-footer'",
    ],
    tags: [
      "footer",
      "saas",
      "product",
      "newsletter",
      "social",
      "links",
      "legal",
      "modern",
    ],
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
    imports: [
      "import { AOMessageSigner } from '@/components/arweave/ao-message-signer'",
    ],
    tags: ["arweave", "ao", "wallet", "signing"],
  },
  {
    id: "create-permaweb-profile",
    name: "Create Permaweb Profile",
    category: "arweave",
    type: "ProfileManager",
    description: "Create your Permaweb profile on Arweave",
    defaultProps:{},
    dependencies: ["react-icons"],
    imports: [
      "import  ProfileManager from '@/components/arweave/create-permaweb-profile'",
    ],
    tags: ["arweave", "profile", "permaweb"],
  },
  {
    id: "atomic-asset",
    name: "Create Atomic Assets",
    category: "arweave",
    type: "AtomicAssetsManager",
    description: "Create atomic assets on Arweave Permaweb",
    defaultProps: {},
    dependencies: ["react-icons"],
    imports: [
      "import AtomicAssetsManager from '@/components/arweave/atomic-asset'",
    ],
    tags: ["arweave", "permaweb", "atomic assets", "create assets"],
  },
  {
    id: "fetch-bazaar-profile",
    name: "Fetch Permaweb/Bazaar Profile",
    category: "arweave",
    type: "FetchProfileCard",
    description: "Fetch your Permaweb/Bazaar profile with a click",
    defaultProps:{},
    dependencies: [],
    imports: [
      "import  FetchProfileCard  from '@/components/arweave/fetch-bazaar-profile'",
    ],
    tags: ["arweave", "profile", "permaweb", "bazaar", "fetch profile"],
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
      imageUrl: "/ArweaveNFT.png",
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
      initialTags: [],
      limit: 10,
    },
    dependencies: ["@apollo/client", "graphql"],
    imports: [
      "import { ArweaveSearch } from '@/components/arweave/arweave-search'",
    ],
    tags: ["arweave", "search", "graphql", "transactions", "indexer"],
  },
  {
    id: "chatroom-on-chain",
    name: "Chatroom On-Chain",
    category: "arweave",
    type: "ChatRoomHolder",
    description:
      "Real-time on-chain chatroom with emoji picker and quick messages, powered by Socket.IO. Builder-friendly and fully self-contained.",
    defaultProps: {
      serverUrl: "https://ardacity-backrooms.onrender.com",
      className: "",
      quickMessages: [
        "ggs",
        "nice play",
        "let's play again",
        "good luck",
        "well played",
        "wp",
        "ez",
        "clutch",
        "noob",
        "pro",
      ],
    },
    dependencies: ["socket.io-client", "lucide-react"],
    imports: [
      "import  ChatRoomHolder  from '@/components/arweave/chatroom-on-chain'",
    ],
    tags: [
      "arweave",
      "chat",
      "realtime",
      "socket.io",
      "emoji",
      "quick-messages",
      "builder-friendly",
    ],
  },
  {
    id: "arns-record-lookup",
    name: "ARNS Record Lookup",
    category: "arweave",
    type: "ARNSRecordLookup",
    description:
      "Minecraft-themed ARNS record lookup interface with wallet integration and JSON viewer. Lookup ARNS names and interact with AO processes.",
    defaultProps: {},
    dependencies: ["ao-js-sdk"],
    imports: [
      "import ARNSRecordLookup from '@/components/arweave/arns-record-lookup'",
    ],
    tags: ["arweave", "arns", "wallet", "minecraft", "json", "lookup", "ao"],
  },
  {
    id: "botega-liquidity-pool-info",
    name: "Botega Liquidity Pool Info",
    category: "arweave",
    type: "BotegaLiquidityPoolInfo",
    description:
      "Comprehensive liquidity pool interface with price operations, token management, and real-time data display. Connect to Botega liquidity pools and manage trading operations.",
    defaultProps: {
      processId: "ixjnbCaGfzSJ64IQ9X_B3dQUWyMy2OGSFUP2Yw-NpRM",
      tokenId: "xU9zFkq3X2ZQ6olwNVvr1vUWIjc3kXTWr7xKQD6dh10"
    },
    dependencies: ["ao-js-sdk"],
    imports: [
      "import BotegaLiquidityPoolInfo from '@/components/arweave/botega-liquidity-pool-info'",
    ],
    tags: [
      "arweave",
      "liquidity",
      "pool",
      "trading",
      "price",
      "tokens",
      "botega",
      "defi",
    ],
  },
  {
    id: "staking-panel",
    name: "Staking Panel",
    category: "arweave",
    type: "StakingPanel",

    description: "Retro-style staking interface with real-time message logging. Stake, unstake, and finalize operations with AO process integration and ArConnect wallet support.",
    defaultProps: {
      processId: "78Nrydz-vMmm16cAMHhLxvNE6Wr_1afaQb_EoS0YxG8"
    },
    dependencies: ["@permaweb/aoconnect"],
    imports: ["import StakingPanel from '@/components/arweave/staking-panel'"],
    tags: ["arweave", "staking", "retro", "logging", "ao", "defi", "wallet"],
  },
  {
    id: "bazaar-nft-portfolio",
    name: "Bazaar NFT Portfolio",
    category: "arweave",
    type: "BazaarNftPortfolio",
    description:
      "Comprehensive NFT portfolio explorer with 3D carousel, profile management, and asset discovery. Search by wallet address or profile ID with retro pixel art styling.",
    defaultProps: {},
    dependencies: ["@permaweb/libs", "@permaweb/aoconnect", "arweave"],
    imports: [
      "import BazaarNftPortfolio from '@/components/arweave/bazaar-nft-portfolio'",
    ],
    tags: [
      "arweave",
      "nft",
      "portfolio",
      "carousel",
      "3d",
      "profile",
      "assets",
      "bazaar",
      "pixel-art",
    ],
  },

  {
    id: "dark-theme-header",
    name: "Dark Theme Header",
    category: "header",
    type: "DarkHeader",
    description:
      "Animated dark theme header with geometric background, hero text, CTA button, and image. Builder-friendly and highly customizable.",
    defaultProps: {
      title: "Experience Creative Precision",
      subtitle: "Visual harmony driven by real geometry and motion.",
      ctaText: "Request Demo",
      imageSrc:
        "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?q=80&w=1106&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      customClassName: "",
    },
    dependencies: ["framer-motion", "react"],
    imports: [
      "import { DarkHeader } from '@/components/headers/dark-theme-header'",
    ],
    tags: [
      "header",
      "dark",
      "animated",
      "hero",
      "cta",
      "image",
      "geometric",
      "builder-friendly",
    ],
  },
  {
    id: "card",
    name: "Card",
    category: "ui",
    type: "Card",
    description: "A flexible card container with header, content, and footer.",
    defaultProps: {
      children: "Card content here",
    },
    dependencies: [],
    imports: ["import { Card } from '@/components/ui/card'"],
    tags: ["ui", "container", "card"],
  },
  {
    id: "button",
    name: "Button",
    category: "ui",
    type: "Button",
    description: "A styled button component supporting variants and sizes.",
    defaultProps: {
      children: "Click me",
      variant: "default",
      size: "default",
      className: "",
    },
    dependencies: ["@radix-ui/react-slot", "class-variance-authority"],
    imports: ["import { Button } from '@/components/ui/button'"],
    tags: ["ui", "button", "action", "interactive"],
  },
  {
    id: "liquid-glass-navbar",
    name: "Liquid Glass Navbar",
    category: "navigation",
    type: "LiquidGlassNavbar",
    description:
      "Animated glassmorphic navbar with glowing and liquid effects.",
    defaultProps: {
      className: "relative",
      brand: "ArDacity",
      links: [
        { label: "Features", href: "#features" },
        { label: "Pricing", href: "#pricing" },
        { label: "About", href: "#about" },
        { label: "Contact", href: "#contact" },
      ],
      cta: { label: "Get Started", href: "#get-started" },
      scrollTargetId: "builder-canvas",
    },
    dependencies: ["framer-motion"],
    imports: [
      "import { LiquidGlassNavbar } from '@/components/navigation/liquid-glass-navbar'",
    ],
    tags: [
      "navigation",
      "navbar",
      "glassmorphism",
      "animated",
      "liquid",
      "glow",
      "modern",
      "sticky",
    ],
  },
  {
    id: "web3-landing-page",
    name: "Web3 Landing Page",
    category: "landing",
    type: "Web3LandingPage",
    description:
      "Modern, customizable Web3 landing page with hero, about, features, and pricing sections.",
    defaultProps: {
      contained: true,
      // logo: "⚡",
      // companyName: "ArDacity",
      heroTitle: "The Future of On-Chain Development",
      heroSubtitle:
        "Build exceptional decentralized applications with our comprehensive Web3 component library. Secure, scalable, and beautifully designed for the blockchain era.",
      heroButtonText: "Explore Components",
      heroSecondaryButtonText: "View Documentation",
      heroImage: "/ArDacitypfp.png?height=400&width=400",
      aboutTitle: "Empowering Web3 Innovation",
      aboutDescription:
        "ArDacity revolutionizes blockchain development with a comprehensive suite of battle-tested components. Our library combines cutting-edge security with elegant design, enabling developers to create stunning decentralized applications faster than ever before.",
      aboutImage: "/ArDacitypfp.png?height=500&width=600",
      aboutStats: [
        { label: "Active Components", value: "300+", icon: "🧩" },
        { label: "Developer Community", value: "25K+", icon: "👥" },
        { label: "dApps Powered", value: "8K+", icon: "🚀" },
        { label: "Blockchain Networks", value: "20+", icon: "🌐" },
      ],
      featuresTitle: "Built for the Decentralized Web",
      featuresSubtitle:
        "Comprehensive tools and components designed specifically for Web3 development",
      features: [
        {
          icon: "🔐",
          title: "Security Audited",
          description:
            "Every component undergoes rigorous security audits to ensure your users' assets remain protected.",
        },
        {
          icon: "⚡",
          title: "Gas Optimized",
          description:
            "Intelligent optimization reduces transaction costs while maintaining peak performance.",
        },
        {
          icon: "🎨",
          title: "Design System",
          description:
            "Cohesive design language that scales beautifully across all your decentralized applications.",
        },
        {
          icon: "🔗",
          title: "Multi-Chain Ready",
          description:
            "Seamless integration across Ethereum, Polygon, Arbitrum, and 17+ other networks.",
        },
        {
          icon: "📱",
          title: "Mobile First",
          description:
            "Responsive components optimized for mobile wallets and cross-platform compatibility.",
        },
        {
          icon: "🛠️",
          title: "Developer Tools",
          description:
            "Comprehensive CLI, testing suite, and debugging tools for streamlined development.",
        },
      ],
      pricingTitle: "Scale with Confidence",
      pricingSubtitle:
        "Choose the perfect plan for your Web3 development journey",
      pricingPlans: [
        {
          name: "Starter",
          price: "Free",
          period: "forever",
          buttonText: "Get Started",
          features: [
            "100+ core components",
            "Basic templates",
            "Community support",
            "MIT license",
            "Documentation access",
            "GitHub integration",
          ],
        },
        {
          name: "Professional",
          price: "$79",
          period: "per month",
          popular: true,
          buttonText: "Start Free Trial",
          features: [
            "300+ premium components",
            "Advanced templates",
            "Priority support",
            "Custom themes",
            "Team collaboration",
            "Advanced analytics",
            "API access",
            "White-label options",
          ],
        },
        {
          name: "Enterprise",
          price: "Custom",
          period: "contact us",
          buttonText: "Contact Sales",
          features: [
            "Unlimited components",
            "Custom development",
            "24/7 dedicated support",
            "On-premise deployment",
            "SLA guarantee",
            "Security compliance",
            "Training & onboarding",
            "Custom integrations",
          ],
        },
      ],
    },
    dependencies: ["react-icons"],
    imports: [
      "import  Web3LandingPage  from '@/components/landing/web3-landing-page'",
    ],
    tags: ["landing", "web3", "modern", "ui", "customizable"],
  },
  {
    id: "web3-landing-page-2",
    name: "Web3 Landing Page 2",
    category: "landing",
    type: "Web3LandingPage2",
    description:
      "Modern, animated Web3 landing page with hero, about, features, and pricing sections.",
    defaultProps: {
      contained: true,
      heroTitle: "Build Stunning On-Chain Components",
      heroSubtitle:
        "The ultimate component library for blockchain developers. Create beautiful, responsive, and secure decentralized applications with our comprehensive collection of Web3-ready components that seamlessly integrate with your dApps.",
      heroButtonText: "Start Building",
      heroImage: "/ArDacitypfp.png?height=500&width=700",
      aboutTitle: "Revolutionizing Web3 Development",
      aboutDescription:
        "ArDacity is the premier on-chain component library designed specifically for blockchain developers. We provide battle-tested, secure, and beautifully crafted components that seamlessly integrate with your decentralized applications, making Web3 development faster and more efficient than ever before.",
      aboutImage: "/ArDacitypfp.png?height=400&width=500",
      aboutStats: [
        { label: "Components", value: "200+" },
        { label: "Developers", value: "10K+" },
        { label: "dApps Built", value: "5K+" },
        { label: "Blockchains", value: "15+" },
      ],
      featuresTitle: "Powerful Web3 Components",
      featuresSubtitle:
        "Everything you need to build exceptional decentralized applications",
      features: [
        {
          icon: "🔗",
          title: "Blockchain Native",
          description:
            "Components built specifically for Web3 with native blockchain integration and smart contract compatibility.",
        },
        {
          icon: "🛡️",
          title: "Security First",
          description:
            "Audited components with built-in security best practices to protect your users and their assets.",
        },
        {
          icon: "⚡",
          title: "Lightning Fast",
          description:
            "Optimized for performance with minimal gas costs and instant UI updates for the best user experience.",
        },
        {
          icon: "🎨",
          title: "Customizable Design",
          description:
            "Fully themeable components that adapt to your brand while maintaining Web3 functionality.",
        },
        {
          icon: "🌐",
          title: "Multi-Chain Support",
          description:
            "Works seamlessly across Ethereum, Polygon, BSC, and 12+ other popular blockchain networks.",
        },
        {
          icon: "📱",
          title: "Mobile Optimized",
          description:
            "Responsive components that work perfectly on desktop, mobile, and Web3 wallet browsers.",
        },
      ],
      pricingTitle: "Choose Your Plan",
      pricingSubtitle:
        "Flexible pricing for developers and teams building the future of Web3",
      pricingPlans: [
        {
          name: "Developer",
          price: "$0",
          period: "forever",
          features: [
            "50 components",
            "Basic templates",
            "Community support",
            "MIT license",
            "Documentation access",
          ],
        },
        {
          name: "Pro",
          price: "$49",
          period: "per month",
          popular: true,
          features: [
            "200+ components",
            "Premium templates",
            "Priority support",
            "Advanced integrations",
            "Custom themes",
            "Team collaboration",
          ],
        },
        {
          name: "Enterprise",
          price: "$199",
          period: "per month",
          features: [
            "Unlimited components",
            "White-label solution",
            "24/7 dedicated support",
            "Custom development",
            "On-premise deployment",
            "SLA guarantee",
          ],
        },
      ],
    },
    dependencies: [],
    imports: [
      "import  Web3LandingPage2  from '@/components/landing/web3-landing-page-2'",
    ],
    tags: ["landing", "web3", "modern", "ui", "animated"],
  },
  {
    id: "product-landing-page",
    name: "Product Landing Page",
    category: "landing",
    type: "ProductLandingPage",
    description:
      "Modern, animated product landing page with hero, about, features, testimonials, and pricing sections.",
    defaultProps: {
      contained: true,
      // companyName: "ModernApp",
      heroTitle: "Build Something Amazing",
      heroSubtitle:
        "Transform your ideas into reality with our cutting-edge platform designed for creators and innovators.",
      ctaText: "Start Free Trial",
      aboutTitle: "About Our Vision",
      aboutDescription:
        "We're on a mission to democratize technology and make powerful tools accessible to everyone. Our platform combines cutting-edge technology with intuitive design to help you achieve more.",
      features: [
        {
          icon: "zap",
          title: "Lightning Fast",
          description:
            "Experience blazing fast performance with our optimized infrastructure",
          color: "from-yellow-400 to-orange-500",
        },
        {
          icon: "shield",
          title: "Secure & Reliable",
          description: "Enterprise-grade security with 99.9% uptime guarantee",
          color: "from-green-400 to-blue-500",
        },
        {
          icon: "users",
          title: "Team Collaboration",
          description: "Seamless collaboration tools for your entire team",
          color: "from-purple-400 to-pink-500",
        },
      ],
      pricing: [
        {
          name: "Starter",
          price: "$9",
          features: [
            "5 Projects",
            "10GB Storage",
            "Email Support",
            "Basic Analytics",
          ],
          popular: false,
        },
        {
          name: "Professional",
          price: "$29",
          features: [
            "Unlimited Projects",
            "100GB Storage",
            "Priority Support",
            "Advanced Analytics",
            "Team Collaboration",
          ],
          popular: true,
        },
        {
          name: "Enterprise",
          price: "$99",
          features: [
            "Everything in Pro",
            "Unlimited Storage",
            "24/7 Phone Support",
            "Custom Integrations",
            "SLA Guarantee",
          ],
          popular: false,
        },
      ],
      testimonials: [
        {
          name: "Sarah Johnson",
          role: "CEO, TechCorp",
          content:
            "This platform completely transformed how we work. The results speak for themselves.",
          rating: 5,
          avatar: "/ArDacitypfp.png",
        },
        {
          name: "Mike Chen",
          role: "CTO, StartupXYZ",
          content:
            "Incredible performance and ease of use. Our team productivity increased by 300%.",
          rating: 5,
          avatar: "/ArDacitypfp.png",
        },
        {
          name: "Emily Rodriguez",
          role: "Product Manager, InnovateCo",
          content:
            "The best investment we've made for our development workflow.",
          rating: 5,
          avatar: "/ArDacitypfp.png",
        },
      ],
      stats: [
        { value: "100K+", label: "Active Users" },
        { value: "99.9%", label: "Uptime" },
        { value: "50M+", label: "API Calls" },
        { value: "24/7", label: "Support" },
      ],
    },
    dependencies: ["lucide-react"],
    imports: [
      "import ProductLandingPage from '@/components/landing/product-landing-page'",
    ],
    tags: ["landing", "product", "modern", "ui", "animated"],
  },
];

export function getComponentByType(
  type: string
): ComponentDefinition | undefined {
  // First try to find by type (PascalCase)
  let component = componentRegistry.find((comp) => comp.type === type);
  if (component) {
    return component;
  }

  // If not found, try to find by id (kebab-case)
  component = componentRegistry.find((comp) => comp.id === type);
  if (component) {
    return component;
  }

  // If still not found, try converting kebab-case to PascalCase
  const pascalCase = type
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  component = componentRegistry.find((comp) => comp.type === pascalCase);
  if (component) {
    return component;
  }

  return component;
}

export function searchComponents(query: string): ComponentDefinition[] {
  if (!query.trim()) return componentRegistry;

  const lowercaseQuery = query.toLowerCase();
  return componentRegistry.filter(
    (comp) =>
      comp.name.toLowerCase().includes(lowercaseQuery) ||
      comp.description.toLowerCase().includes(lowercaseQuery) ||
      comp.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
  );
}
