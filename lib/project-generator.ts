import type { ComponentInstance } from "@/components/builder/component-context"
import { getComponentByType } from "./component-registry"

export function generateProjectFiles(components: ComponentInstance[]): Record<string, string> {
  const files: Record<string, string> = {}

  // Generate package.json
  files["package.json"] = generatePackageJson(components)

  // Generate Next.js config files
  files["next.config.mjs"] = generateNextConfig()
  files["tailwind.config.ts"] = generateTailwindConfig()
  files["tsconfig.json"] = generateTsConfig()
  files["postcss.config.cjs"] = generatePostcssConfig()

  // Generate app files
  files["app/layout.tsx"] = generateLayout()
  files["app/page.tsx"] = generateMainPage(components)
  files["app/globals.css"] = generateGlobalStyles()

  // Generate component files
  generateComponentFiles(components, files)

  // Generate utility files
  files["lib/utils.ts"] = generateUtils()

  // Generate README
  files["README.md"] = generateReadme(components)

  // Generate environment example
  files[".env.example"] = generateEnvExample()

  // Add AO types
  files["types/ao.d.ts"] = generateAOTypes()

  return files
}

function generatePackageJson(components: ComponentInstance[]): string {
  const dependencies = new Set([
    "next",
    "react",
    "react-dom",
    "tailwindcss",
    "class-variance-authority",
    "clsx",
    "tailwind-merge",
    "lucide-react",
    "@radix-ui/react-dialog",
    "@radix-ui/react-dropdown-menu",
    "@radix-ui/react-label",
    "@radix-ui/react-scroll-area",
    "@radix-ui/react-select",
  ])

  // Add component-specific dependencies
  components.forEach((component) => {
    const definition = getComponentByType(component.type)
    if (definition) {
      definition.dependencies.forEach((dep) => {
        // Filter out invalid dependencies
        if (dep !== "next/font/google") {
          dependencies.add(dep)
        }
      })
    }
  })

  const packageJson = {
    name: "ardacity-project",
    version: "0.1.0",
    private: true,
    scripts: {
      dev: "next dev",
      build: "next build",
      start: "next start",
      lint: "next lint",
    },
    dependencies: Object.fromEntries(Array.from(dependencies).map((dep) => [dep, getPackageVersion(dep)])),
    devDependencies: {
      typescript: "^5",
      "@types/node": "^20",
      "@types/react": "^18",
      "@types/react-dom": "^18",
      autoprefixer: "^10.0.1",
      postcss: "^8",
      eslint: "^8",
      "eslint-config-next": "14.0.0",
    },
  }

  return JSON.stringify(packageJson, null, 2)
}

function getPackageVersion(packageName: string): string {
  const versions: Record<string, string> = {
    next: "^14.0.0",
    react: "^18",
    "react-dom": "^18",
    tailwindcss: "^3.3.0",
    "framer-motion": "^10.16.0",
    "next-themes": "^0.2.1",
    "react-icons": "^4.12.0",
    "@permaweb/aoconnect": "^0.0.85",
    "@ar-dacity/ardacity-wallet-btn": "^0.1.0",
    "class-variance-authority": "^0.7.0",
    clsx: "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "warp-arbundles": "^1.0.4",
    "lucide-react": "^0.294.0",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-scroll-area": "^1.0.5",
    "@radix-ui/react-select": "^2.0.0",
    jszip: "^3.10.1",
  }
  return versions[packageName] || "^1.0.0"
}

function generateNextConfig(): string {
  return `/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['arweave.net', 'images.unsplash.com', 'upload.wikimedia.org'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
`
}

function generateTailwindConfig(): string {
  return `import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
}
export default config
`
}

function generateTsConfig(): string {
  return `{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": false,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    },
    "typeRoots": ["./node_modules/@types", "./types"]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts", "types/**/*.ts"],
  "exclude": ["node_modules"]
}
`
}

function generatePostcssConfig(): string {
  return `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`
}

function generateLayout(): string {
  return `import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ArDacity Project',
  description: 'Built with ArDacity Builder',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
`
}

function generateMainPage(components: ComponentInstance[]): string {
  const imports = new Set<string>()

  // Add component imports
  components.forEach((component) => {
    const definition = getComponentByType(component.type)
    if (definition) {
      definition.imports.forEach((imp) => imports.add(imp))
    }
  })

  const componentJSX = components
    .map((component) => {
      const propsString = Object.entries(component.props)
        .map(([key, value]) => `${key}="${value}"`)
        .join(" ")

      return `      <${component.type} ${propsString} />`
    })
    .join("\n")

  return `"use client"

${Array.from(imports).join("\n")}

export default function Home() {
  return (
    <main className="min-h-screen">
${componentJSX}
    </main>
  )
}
`
}

function generateGlobalStyles(): string {
  return `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

/* Custom scrollbar styles */
.scrollbar-thin {
  scrollbar-width: thin;
  scrollbar-color: rgb(63 63 70) rgb(24 24 27);
}

.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: rgb(24 24 27);
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: rgb(63 63 70);
  border-radius: 3px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background-color: rgb(82 82 91);
}
`
}

function generateComponentFiles(components: ComponentInstance[], files: Record<string, string>) {
  const usedComponents = new Set<string>()

  components.forEach((component) => {
    usedComponents.add(component.type)
  })

  // Generate navigation components
  if (usedComponents.has("ArDacityClassicNavbar")) {
    files["components/navigation/ardacity-classic-navbar.tsx"] = generateArDacityClassicNavbar()
  }

  if (usedComponents.has("FloatingNavbar")) {
    files["components/navigation/floating-navbar.tsx"] = generateFloatingNavbar()
  }

  // Generate header components
  if (usedComponents.has("SmoothScrollHero")) {
    files["components/headers/smooth-scroll-hero.tsx"] = generateSmoothScrollHero()
  }

  if (usedComponents.has("ArDacityClassicHero")) {
    files["components/headers/ardacity-classic-hero.tsx"] = generateArDacityClassicHero()
  }

  if (usedComponents.has("NftThemeHero")) {
    files["components/headers/nft-theme-hero.tsx"] = generateNftThemeHero()
  }

  // Generate Arweave components
  if (usedComponents.has("AOMessageSigner")) {
    files["components/arweave/ao-message-signer.tsx"] = generateAOMessageSigner()
  }

  if (usedComponents.has("AOChatBot")) {
    files["components/arweave/ao-chatbot.tsx"] = generateAOChatBot()
  }

  if (usedComponents.has("ArweaveNFT")) {
    files["components/arweave/arweave-nft.tsx"] = generateArweaveNFT()
    files["components/arweave/lua-ide.tsx"] = generateLuaIDE()
  }

  // Generate UI components
  files["components/ui/button.tsx"] = generateButtonComponent()
  files["components/ui/input.tsx"] = generateInputComponent()
  files["components/ui/card.tsx"] = generateCardComponent()
  files["components/ui/dialog.tsx"] = generateDialogComponent()
  files["components/ui/select.tsx"] = generateSelectComponent()
  files["components/ui/label.tsx"] = generateLabelComponent()
  files["components/ui/scroll-area.tsx"] = generateScrollAreaComponent()
  files["components/ui/badge.tsx"] = generateBadgeComponent()

  files["types/ao.d.ts"] = generateAOTypes()
}

function generateArDacityClassicNavbar(): string {
  return `"use client"

import { Button } from "@/components/ui/button"
import { Menu, Moon, Sun, Wallet } from 'lucide-react'
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"

interface ArDacityClassicNavbarProps {
  brand?: string
  nav1?: string
  nav2?: string
  nav3?: string
  variant?: "default" | "outline" | "floating"
  position?: "sticky" | "fixed" | "relative"
}

export function ArDacityClassicNavbar({
  brand = "ArDacity",
  nav1 = "Docs",
  nav2 = "Features",
  nav3 = "Demo",
  variant = "default",
  position = "sticky",
}: ArDacityClassicNavbarProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  if (!mounted) {
    return null
  }

  const positionClass = {
    sticky: "sticky top-0",
    fixed: "fixed top-0 left-0 right-0",
    relative: "relative",
  }[position]

  return (
    <header
      className={\`border-zinc-800 bg-gradient-to-br from-purple-500/15 via-black/90 to-blue-500/15 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 \${positionClass}\`}
    >
      <div className="flex h-14 items-center px-4 lg:px-8">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <div className="text-xl font-bold">{brand}</div>
            </div>
          </div>

          <nav className="hidden translate-x-12 md:flex items-center space-x-6">
            <Link href="/docs" className="text-sm font-medium transition-colors hover:text-cyan-500">
              {nav1}
            </Link>
            <button
              onClick={() => scrollToSection("features")}
              className="text-sm font-medium transition-colors hover:text-cyan-500"
            >
              {nav2}
            </button>
            <button
              onClick={() => scrollToSection("demo")}
              className="text-sm font-medium transition-colors hover:text-cyan-500"
            >
              {nav3}
            </button>
          </nav>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="hidden md:flex items-center gap-2 bg-black text-white">
              <Wallet className="h-4 w-4" />
              Connect Wallet
            </Button>

            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <Button variant="ghost" size="icon" asChild>
              <a href="https://x.com/ArDacityUI" target="_blank" rel="noopener noreferrer">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/c/ce/X_logo_2023.svg"
                  alt="X Logo"
                  width={12}
                  height={12}
                  className="h-3 w-3 text-black dark:text-white dark:invert"
                />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
`
}

function generateUtils(): string {
  return `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`
}

function generateReadme(components: ComponentInstance[]): string {
  const componentList = components.map((comp) => `- ${comp.type}`).join("\n")

  return `# ArDacity Project

This project was generated using ArDacity Builder - a drag-and-drop interface builder for Arweave applications.

## Components Used

${componentList}

## Getting Started

First, install the dependencies:

\`\`\`bash
npm install
# or
yarn install
# or
pnpm install
\`\`\`

Then, run the development server:

\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Copy \`.env.example\` to \`.env.local\` and fill in your environment variables:

\`\`\`bash
cp .env.example .env.local
\`\`\`

## Learn More

- [ArDacity UI Documentation](https://ardacityui.ar.io)
- [Arweave Documentation](https://docs.arweave.org/)
- [AO Documentation](https://ao.arweave.dev/)

## Deploy

Deploy your application using Vercel, Netlify, or any other hosting platform that supports Next.js.

Built with ❤️ using ArDacity Builder
`
}

function generateEnvExample(): string {
  return `# Arweave Configuration
NEXT_PUBLIC_ARWEAVE_GATEWAY=https://arweave.net

# AO Configuration  
NEXT_PUBLIC_AO_GATEWAY=https://ao.arweave.dev

# Add your environment variables here
`
}

// UI Component generators (simplified versions)
function generateButtonComponent(): string {
  return `import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
`
}

function generateInputComponent(): string {
  return `import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
`
}

// Add other UI component generators...
function generateCardComponent(): string {
  return `import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
`
}

// Simplified generators for other components
function generateDialogComponent(): string {
  return `"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from 'lucide-react'
import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
`
}

// Add remaining component generators with similar patterns...
function generateSelectComponent(): string {
  return `"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root
const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
`
}

function generateLabelComponent(): string {
  return `"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
`
}

function generateScrollAreaComponent(): string {
  return `"use client"

import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"
import { cn } from "@/lib/utils"

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
))
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" &&
        "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }
`
}

function generateBadgeComponent(): string {
  return `import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
`
}

// Add remaining component generators for other components used
function generateFloatingNavbar(): string {
  return `"use client"

import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

interface FloatingNavbarProps {
  brand?: string
  links?: string[]
  variant?: "floating" | "default"
}

export function FloatingNavbar({
  brand = "ArDacity",
  links,
  variant = "floating",
}: FloatingNavbarProps) {
  const safeLinks = Array.isArray(links) ? links : ["Home", "About", "Contact"]

  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const controlNavbar = () => {
      if (window.scrollY > lastScrollY) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
      setLastScrollY(window.scrollY)
    }

    window.addEventListener("scroll", controlNavbar)
    return () => window.removeEventListener("scroll", controlNavbar)
  }, [lastScrollY])

  return (
    <nav
      className={\`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 \${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }\`}
    >
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 shadow-lg">
        <div className="flex items-center space-x-8">
          <div className="font-bold text-white">{brand}</div>

          <div className="flex items-center space-x-6">
            {safeLinks.map((link, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="text-white/80 hover:text-white hover:bg-white/10 rounded-full"
              >
                {link}
              </Button>
            ))}
          </div>

          <Button size="sm" className="bg-white text-black hover:bg-white/90 rounded-full">
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  )
}

`
}

// Add other component generators as needed...
function generateSmoothScrollHero(): string {
  return `"use client"

import { motion, useMotionTemplate, useScroll, useTransform } from "framer-motion"
import { FiMapPin } from "react-icons/fi"
import { useRef, useMemo } from "react"

interface SmoothScrollHeroProps {
  title?: string
  subtitle?: string
}

const getSectionHeight = () => {
  if (typeof window !== "undefined") {
    return window.innerHeight * 2
  }
  return 1500
}

export function SmoothScrollHero({ title = "ArDacity NFT", subtitle = "Browse NFTs" }: SmoothScrollHeroProps) {
  const sectionHeight = useMemo(() => getSectionHeight(), [])

  return (
    <div className="bg-zinc-950">
      <Hero title={title} sectionHeight={sectionHeight} />
      <Schedule subtitle={subtitle} />
    </div>
  )
}

interface HeroProps {
  title: string
  sectionHeight: number
}

const Hero: React.FC<HeroProps> = ({ title, sectionHeight }) => {
  return (
    <div style={{ height: \`calc(\${sectionHeight}px + 100vh)\` }} className="relative w-full">
      <h1 className="absolute top-0 left-0 right-0 z-10 mx-auto max-w-5xl px-4 pt-[200px] text-center text-8xl font-black uppercase text-zinc-50">
        {title}
      </h1>
      <CenterImage sectionHeight={sectionHeight} />
      <ParallaxImages sectionHeight={sectionHeight} />
      <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-b from-zinc-950/0 to-zinc-950" />
    </div>
  )
}

interface CenterImageProps {
  sectionHeight: number
}

const CenterImage: React.FC<CenterImageProps> = ({ sectionHeight }) => {
  const { scrollY } = useScroll()

  const clip1 = useTransform(scrollY, [0, sectionHeight], [25, 0])
  const clip2 = useTransform(scrollY, [0, sectionHeight], [75, 100])

  const clipPath = useMotionTemplate\`polygon(\${clip1}% \${clip1}%, \${clip2}% \${clip1}%, \${clip2}% \${clip2}%, \${clip1}% \${clip2}%)\`

  const backgroundSize = useTransform(scrollY, [0, sectionHeight + 500], ["170%", "100%"])
  const opacity = useTransform(scrollY, [sectionHeight, sectionHeight + 500], [1, 0])

  return (
    <motion.div
      className="sticky top-0 h-screen w-full"
      style={{
        clipPath,
        backgroundSize,
        opacity,
        backgroundImage: \`url(https://images.unsplash.com/photo-1460186136353-977e9d6085a1?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)\`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    />
  )
}

interface ParallaxImagesProps {
  sectionHeight: number
}

const ParallaxImages: React.FC<ParallaxImagesProps> = ({ sectionHeight }) => {
  const images = [
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
  ]

  return (
    <div className="mx-auto max-w-5xl px-4 pt-[200px]">
      {images.map((image, index) => (
        <ParallaxImg key={index} {...image} sectionHeight={sectionHeight} />
      ))}
    </div>
  )
}

interface ParallaxImgProps {
  src: string
  alt: string
  start: number
  end: number
  className: string
  sectionHeight: number
}

const ParallaxImg: React.FC<ParallaxImgProps> = ({ className, alt, src, start, end }) => {
  const ref = useRef(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [\`\${start}px end\`, \`end \${end * -1}px\`],
  })

  const opacity = useTransform(scrollYProgress, [0.75, 1], [1, 0])
  const scale = useTransform(scrollYProgress, [0.75, 1], [1, 0.85])
  const y = useTransform(scrollYProgress, [0, 1], [start, end])
  const transform = useMotionTemplate\`translateY(\${y}px) scale(\${scale})\`

  return (
    <motion.img src={src} alt={alt} className={className} ref={ref} style={{ transform, opacity }} loading="lazy" />
  )
}

interface ScheduleProps {
  subtitle: string
}

const Schedule: React.FC<ScheduleProps> = ({ subtitle }) => {
  const scheduleItems = [
    { title: "Cosmic Collection", date: "Dec 9th", location: "Arweave" },
    { title: "Digital Art", date: "Dec 20th", location: "Arweave" },
    { title: "NFT Gallery", date: "Jan 13th", location: "Arweave" },
  ]

  return (
    <section className="mx-auto max-w-5xl px-4 py-48 text-white">
      <motion.h1
        initial={{ y: 48, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ ease: "easeInOut", duration: 0.75 }}
        className="mb-20 text-4xl font-black uppercase text-zinc-50"
      >
        {subtitle}
      </motion.h1>
      {scheduleItems.map((item, index) => (
        <ScheduleItem key={index} {...item} />
      ))}
    </section>
  )
}

interface ScheduleItemProps {
  title: string
  date: string
  location: string
}

const ScheduleItem: React.FC<ScheduleItemProps> = ({ title, date, location }) => {
  return (
    <motion.div
      initial={{ y: 48, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ ease: "easeInOut", duration: 0.75 }}
      className="mb-9 flex items-center justify-between border-b border-zinc-800 px-3 pb-9"
    >
      <div>
        <p className="mb-1.5 text-xl text-zinc-50">{title}</p>
        <p className="text-sm uppercase text-zinc-500">{date}</p>
      </div>
      <div className="flex items-center gap-1.5 text-end text-sm uppercase text-zinc-500">
        <p>{location}</p>
        <FiMapPin />
      </div>
    </motion.div>
  )
}
`
}

function generateArDacityClassicHero(): string {
  return `"use client"

import { motion } from "framer-motion"
import { Pacifico } from 'next/font/google'
import { cn } from "@/lib/utils"

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pacifico",
})

interface ArDacityClassicHeroProps {
  badge?: string
  title1?: string
  title2?: string
}

export function ArDacityClassicHero({
  badge = "Ardacity UI",
  title1 = "ArDacity",
  title2 = "Find Your Design",
}: ArDacityClassicHeroProps) {
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.5 + i * 0.2,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#030303]">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl" />

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] mb-8 md:mb-12"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-rose-500 rounded-full" />
            <span className="text-sm text-white/60 tracking-wide">{badge}</span>
          </motion.div>

          <motion.div custom={1} variants={fadeUpVariants} initial="hidden" animate="visible">
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-6 md:mb-8 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">{title1}</span>
              <br />
              <span
                className={cn(
                  "bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300",
                  pacifico.className,
                )}
              >
                {title2}
              </span>
            </h1>
          </motion.div>

          <motion.div custom={2} variants={fadeUpVariants} initial="hidden" animate="visible">
            <p className="text-base sm:text-lg md:text-xl text-white/40 mb-8 leading-relaxed font-light tracking-wide max-w-xl mx-auto px-4">
              Crafting exceptional digital experiences through innovative design and cutting-edge technology.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
`
}

function generateNftThemeHero(): string {
  return `"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface NftThemeHeroProps {
  title?: string
  description?: string
}

export function NftThemeHero({
  title = "NFT Collection",
  description = "Discover unique digital assets",
}: NftThemeHeroProps) {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-10" />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
            {title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">{description}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
            >
              Explore Collection
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black">
              Create NFT
            </Button>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent" />
    </div>
  )
}
`
}

function generateAOMessageSigner(): string {
  return `"use client"
  
  import type React from "react"
  import { useState, useEffect } from "react"
  
  export interface AOMessageSignerProps {
    processId?: string
    className?: string
    style?: React.CSSProperties
    theme?: "light" | "dark"
    title?: string
    description?: string
  }
  
  declare global {
    interface Window {
      arweaveWallet: any
    }
  }
  
  export const AOMessageSigner: React.FC<AOMessageSignerProps> = ({
    processId = "wTIAdGied4B7wXk1zikACl0Qn-wNdIlDOCkY81YiPBc",
    className = "",
    style = {},
    theme = "dark",
    title = "AO Message Signer",
    description = "Sign messages using AO wallet",
  }) => {
    const [messageContent, setMessageContent] = useState("")
    const [responseText, setResponseText] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
  
    useEffect(() => {
      if (typeof window !== "undefined" && !window.arweaveWallet) {
        setError("ArConnect wallet not detected. Please install ArConnect to use this feature.")
      }
    }, [])
  
    const sendMessageToAO = async () => {
      setLoading(true)
      setResponseText(null)
      setError(null)
  
      try {
        if (typeof window === "undefined" || !window.arweaveWallet) {
          throw new Error("ArConnect wallet not available")
        }
  
        // Dynamic import to avoid build issues
        const { message, createDataItemSigner } = await import("@permaweb/aoconnect")
  
        const signer = createDataItemSigner(window.arweaveWallet)
  
        const result = await message({
          process: processId,
          tags: [{ name: "Action", value: "Sign" }],
          signer,
          data: messageContent || "Random generated message",
        })
  
        setResponseText(JSON.stringify(result, null, 2))
      } catch (err) {
        console.error("Error sending message:", err)
        setError("Failed to send message. Please check your wallet connection and try again.")
      } finally {
        setLoading(false)
      }
    }
  
    return (
      <div className="p-8 bg-black">
        <div
          className={\`max-w-md mx-auto rounded-lg shadow-lg transition-all duration-200 bg-zinc-800/50 border border-zinc-700 \${className}\`}
          style={{ padding: "1.5rem", ...style }}
        >
          <h2 className="text-xl font-bold mb-2 pb-2 border-b border-zinc-700 text-white">{title}</h2>
          <p className="text-zinc-400 text-sm mb-4">{description}</p>
  
          {error && <div className="mt-4 p-4 rounded-md bg-red-900/30 border border-red-800 text-red-100">{error}</div>}
  
          <input
            className="w-full px-4 py-2 mb-4 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 bg-zinc-700 border-zinc-600 focus:ring-white/10 text-white placeholder:text-zinc-400"
            type="text"
            value={messageContent}
            placeholder="Enter message to sign"
            onChange={(e) => setMessageContent(e.target.value)}
            disabled={loading}
          />
  
          <button
            className={\`w-full px-4 py-2 rounded-md font-medium transition-all duration-200 \${
              loading ? "bg-zinc-800 cursor-not-allowed" : "bg-cyan-900 hover:bg-cyan-900 text-white"
            }\`}
            onClick={sendMessageToAO}
            disabled={loading || !messageContent.trim()}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Signing...
              </div>
            ) : (
              "Send to AO"
            )}
          </button>
  
          {responseText && (
            <div className="mt-4 p-4 rounded-md overflow-auto bg-zinc-700 border border-zinc-600">
              <div className="font-semibold mb-2 text-white">Response:</div>
              <pre className="whitespace-pre-wrap break-words text-sm text-zinc-300">{responseText}</pre>
            </div>
          )}
        </div>
      </div>
    )
  }
  
`
}

function generateAOChatBot(): string {
  return `"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Send } from "lucide-react"

interface AOChatBotProps {
  processId?: string
  theme?: "light" | "dark"
  title?: string
}

interface Message {
  role: "user" | "assistant" | "system"
  content: string
  timestamp: string
}

declare global {
  interface Window {
    arweaveWallet: any
  }
}

export function AOChatBot({
  processId = "lf9KuIzsIogdOPXc5hdBZNbZ3_CaeM0IrX9maSteWcY",
  theme = "dark",
  title = "AO ChatBot",
}: AOChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AO ChatBot. How can I help you today?",
      timestamp: new Date().toISOString(),
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && !window.arweaveWallet) {
      setError("ArConnect wallet not detected. Please install ArConnect to use this feature.")
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)
    setError(null)

    try {
      if (typeof window === "undefined" || !window.arweaveWallet) {
        throw new Error("ArConnect wallet not available")
      }

      // Dynamic import to avoid build issues
      const { message, createDataItemSigner, result } = await import("@permaweb/aoconnect")

      const signer = createDataItemSigner(window.arweaveWallet)

      const msgResult = await message({
        process: processId,
        tags: [{ name: "Action", value: "Ask" }],
        signer,
        data: input,
      })

      await new Promise((resolve) => setTimeout(resolve, 2000))

      const response = await result({
        process: processId,
        message: msgResult,
      })

      const botResponse = response?.Messages?.[0]?.Data || "No response received from the bot"

      const botMessage: Message = {
        role: "assistant",
        content: botResponse,
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (err) {
      console.error("Error sending message:", err)
      setError("Failed to send message. Please check your wallet connection and try again.")

      const errorMessage: Message = {
        role: "system",
        content: "Sorry, I encountered an error processing your request.",
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 bg-black">
      <div className="max-w-2xl mx-auto bg-gradient-to-br from-purple-500/15 via-black/90 to-blue-500/15 border border-zinc-700 rounded-xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r 
from-purple-500/15 via-black/90
to-blue-500/15 text-white
         border-b border-zinc-800 p-4">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          {error && (
            <div className="mt-2 text-sm text-red-400 bg-red-900/30 border border-red-800 rounded p-2">{error}</div>
          )}
        </div>

        <div className="h-96 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-track-zinc-900 scrollbar-thumb-zinc-900">
          {messages.map((msg, index) => (
            <div key={index} className={\`flex \${msg.role === "user" ? "justify-end" : "justify-start"}\`}>
              <div
                className={\`max-w-[80%] p-3 rounded-lg \${
                  msg.role === "user"
                    ? "bg-[#094655b7] backdrop-blur-3xl  text-white"
                    : msg.role === "system"
                      ? "bg-red-900/30 border border-red-800 text-red-100"
                      : "bg-black border border-zinc-800 text-zinc-100"
                }\`}
              >
                <div className="text-sm">{msg.content}</div>
                <div className="text-xs opacity-70 mt-1">{new Date(msg.timestamp).toLocaleTimeString()}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t border-zinc-800">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-3 bg-black border border-zinc-800 rounded-lg text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || (typeof window !== "undefined" && !window.arweaveWallet)}
            />
            <button
              type="submit"
              className={\`px-4 py-3 rounded-lg font-medium transition-all \${
                loading || !input.trim() || (typeof window !== "undefined" && !window.arweaveWallet)
                  ? "bg-zinc-900 border border-zinc-800 cursor-not-allowed"
                  : "bg-cyan-900 hover:bg-cyan-700 text-white"
              }\`}
              disabled={loading || !input.trim() || (typeof window !== "undefined" && !window.arweaveWallet)}
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

`
}

function generateArweaveNFT(): string {
  return `"use client"

import type React from "react"

import { useState } from "react"
import LuaIDE from "./lua-ide"

export interface ArweaveNFTProps {
  title?: string
  description?: string
  imageUrl?: string
  tokenId?: string
  owner?: string
  initialLuaCode?: string
  onTransfer?: (data: {
    to: string
    tokenId: string
    luaCode: string
  }) => void
  className?: string
  style?: React.CSSProperties
}

export const ArweaveNFT: React.FC<ArweaveNFTProps> = ({
  title = "Arweave NFT",
  description = "View and interact with your Arweave NFT",
  imageUrl = "/ArweaveNFT.png",
  tokenId = "your-token-id",
  owner = "your-wallet-address",
  initialLuaCode = \`-- NFT transfer handler
function transferNFT(to, tokenId)
  -- Get the current owner
  local currentOwner = ao.getActiveAddress()
  
  -- Check if the sender is the owner
  if currentOwner ~= owner then
    return {
      success = false,
      error = "Only the owner can transfer this NFT"
    }
  end
  
  -- Transfer the NFT
  local result = ao.transferNFT(to, tokenId)
  
  -- Return the result
  return {
    success = true,
    transactionId = result.id
  }
end

-- Example usage:
-- local result = transferNFT("recipient-address", "token-id")
-- print("Transfer result:", result)\`,
  onTransfer,
  className = "",
  style = {},
}) => {
  const [luaCode, setLuaCode] = useState(initialLuaCode)
  const [recipient, setRecipient] = useState("")
  const [isTransferring, setIsTransferring] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isTransferring || !recipient.trim()) return

    setIsTransferring(true)
    setError(null)
    setSuccess(null)

    try {
      const result = {
        to: recipient,
        tokenId,
        luaCode,
      }

      if (onTransfer) {
        await onTransfer(result)
      }
      setSuccess("NFT transferred successfully!")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to transfer NFT")
    } finally {
      setIsTransferring(false)
    }
  }

  return (
    <div
      className={\`bg-black shadow-xl p-8 border border-zinc-700  \${className}\`}
      style={style}
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-3">{title}</h2>
        <p className="text-zinc-400 text-lg">{description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* NFT Display */}
        <div className="bg-blac max-w-7xl rounded-lg p-6 shadow-md transition-all hover:border-zinc-600">
          <div className="aspect-square w-full overflow-hidden  mb-6">
            <img src={imageUrl || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Token ID</h3>
              <p className="font-mono text-sm text-zinc-300 break-all bg-zinc-800 p-3 rounded-md border border-zinc-700">
                {tokenId}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Owner</h3>
              <p className="font-mono text-sm text-zinc-300 break-all bg-zinc-800 p-3 rounded-md border border-zinc-700">
                {owner}
              </p>
            </div>
          </div>
        </div>

        {/* Transfer Form */}
        <div className="bg-zinc-800/30 rounded-lg p-6 shadow-md border border-zinc-700">
          <form onSubmit={handleTransfer} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-3">Recipient Address</label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Enter recipient's Arweave address"
                className="w-full p-3 bg-zinc-800 border border-zinc-600 rounded-md text-white placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              />
            </div>

            {/* Lua Code Editor */}
            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-3">Transfer Handler Code</label>
              <div className="border border-zinc-600 rounded-lg overflow-hidden">
                <LuaIDE
                  cellId="nft-transfer-lua"
                  initialCode={luaCode}
                  onCodeChange={setLuaCode}
                  onProcessId={(pid) => console.log("Process ID:", pid)}
                  onNewMessage={(msgs) => console.log("New messages:", msgs)}
                  onInbox={(inbox) => console.log("Inbox:", inbox)}
                />
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-4 bg-red-900/30 border border-red-700 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-red-300 font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Success Display */}
            {success && (
              <div className="p-4 bg-green-900/30 border border-green-700 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-green-300 font-medium">{success}</p>
                </div>
              </div>
            )}

            {/* Transfer Button */}
            <button
              type="submit"
              disabled={isTransferring || !recipient.trim()}
              className={\`w-full py-3 px-6 rounded-lg text-white font-semibold text-lg transition-all transform hover:scale-[1.02] \${
                isTransferring || !recipient.trim()
                  ? "bg-zinc-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl"
              }\`}
            >
              {isTransferring ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Transferring...
                </div>
              ) : (
                "Transfer NFT"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

`
}

function generateLuaIDE(): string {
  return `"use client"

import { useState, forwardRef } from "react"
import { Play } from 'lucide-react'

interface LuaIDEProps {
  cellId: string
  initialCode: string
  onProcessId?: (pid: string) => void
  onNewMessage?: (msgs: any[]) => void
  onInbox?: (inbox: any[]) => void
  onCodeChange?: (code: string) => void
}

const LuaIDE = forwardRef<HTMLTextAreaElement, LuaIDEProps>(
  ({ cellId, initialCode, onProcessId, onNewMessage, onInbox, onCodeChange }, ref) => {
    const [code, setCode] = useState(initialCode)
    const [output, setOutput] = useState<string>("")
    const [isRunning, setIsRunning] = useState(false)

    const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCode(e.target.value)
      if (onCodeChange) {
        onCodeChange(e.target.value)
      }
    }

    const handleRun = async () => {
      setIsRunning(true)
      setOutput("Running Lua code...")

      try {
        // Simulate code execution
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        console.log("Running Lua code:", code)
        setOutput("Code executed successfully!\\n\\nOutput:\\n" + code.split('\\n').slice(0, 3).join('\\n') + "...")

        if (onProcessId) {
          onProcessId(\`process-\${Date.now()}\`)
        }

        if (onNewMessage) {
          onNewMessage([{ type: "info", message: "Code executed successfully" }])
        }

        if (onInbox) {
          onInbox([{ type: "system", message: "Process started" }])
        }
      } catch (err) {
        setOutput(\`Error: \${err instanceof Error ? err.message : "An error occurred"}\`)
      } finally {
        setIsRunning(false)
      }
    }

    return (
      <div className="flex flex-col h-[400px] border border-zinc-700 rounded-lg overflow-hidden bg-zinc-900">
        <div className="flex items-center justify-between bg-zinc-800 border-b border-zinc-700 p-2">
          <span className="text-sm text-zinc-300 font-medium">Lua IDE</span>
          <button
            onClick={handleRun}
            disabled={isRunning}
            className={\`flex items-center gap-2 px-3 py-1 text-sm font-medium rounded transition-all \${
              isRunning 
                ? 'bg-zinc-600 cursor-not-allowed text-zinc-400'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }\`}
          >
            <Play className="h-3 w-3" />
            {isRunning ? 'Running...' : 'Run'}
          </button>
        </div>
        
        <div className="flex-1 flex">
          <div className="flex-1 p-3">
            <textarea
              ref={ref}
              value={code}
              onChange={handleCodeChange}
              className="w-full h-full p-2 font-mono text-sm bg-transparent border-0 rounded text-white placeholder:text-zinc-500 focus:outline-none resize-none"
              placeholder="-- Enter your Lua code here..."
              style={{ 
                color: "white",
                fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace'
              }}
            />
          </div>
          
          {output && (
            <div className="w-1/2 border-l border-zinc-700 p-3">
              <div className="text-xs text-zinc-400 mb-2">Output:</div>
              <pre className="text-sm text-zinc-300 font-mono whitespace-pre-wrap">
                {output}
              </pre>
            </div>
          )}
        </div>
      </div>
    )
  },
)

LuaIDE.displayName = "LuaIDE"

export default LuaIDE
`
}

function generateAOTypes(): string {
  return `declare module '@permaweb/aoconnect' {
  export function message(params: {
    process: string
    tags: Array<{ name: string; value: string }>
    signer: any
    data: string
  }): Promise<any>

  export function result(params: {
    process: string
    message: string
  }): Promise<any>

  export function createDataItemSigner(wallet: any): any

  export function connect(params?: any): any
}

declare global {
  interface Window {
    arweaveWallet: {
      connect(): Promise<void>
      disconnect(): Promise<void>
      getActiveAddress(): Promise<string>
      sign(transaction: any): Promise<any>
      dispatch(transaction: any): Promise<any>
    }
  }
}

export {}
`
}
