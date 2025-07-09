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
  // Generate landing page
  if (usedComponents.has("Web3LandingPage")) {
    files["components/landing/web3-landing-page.tsx"] = generateWeb3LandingPage()
  }
  if (usedComponents.has("Web3LandingPage2")) {
    files["components/landing/web3-landing-page-2.tsx"] = generateWeb3LandingPage2()
  }
  if (usedComponents.has("ProductLandingPage")) {
    files["components/landing/product-landing-page.tsx"] = generateProductLandingPage()
  }

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
  
  if (usedComponents.has("DarkHeader")) {
    files["components/headers/dark-theme-header.tsx"] = generateDarkHeader()
  }

  if (usedComponents.has("ArDacityClassicHero")) {
    files["components/headers/ardacity-classic-hero.tsx"] = generateArDacityClassicHero()
  }

  if (usedComponents.has("AppDownloadFooter")) {
    files["components/footers/app-download-footer.tsx"] = generateAppDownloadFooter()
  }

  if (usedComponents.has("NewsletterFooter")) {
    files["components/footers/newsletter-footer.tsx"] = generateNewsletterFooter()
  }

  if (usedComponents.has("ProductFooter")) {
    files["components/footers/product-footer.tsx"] = generateProductFooter()
  }

  if (usedComponents.has("LiquidGlassNavbar")) {
    files["components/navigation/liquid-glass-navbar.tsx"] = generateLiquidNavbar()
  }

  if (usedComponents.has("Footer")) {
    files["components/footer/footer.tsx"] = generateFooter()
  }

  if (usedComponents.has("FancyColumnFooter")) {
    files["components/footer/fancy-column-footer.tsx"] = generateFancyFooter()
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
  if (usedComponents.has("ChatRoom")) {
    files["components/arweave/chatroom-on-chain.tsx"] = generateArweaveChatroom()
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

function generateProductLandingPage(): string {
  return `
  import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Star,
  Check,
  ArrowRight,
  Zap,
  Shield,
  Users,
  Sparkles,
  Play,
  Pause,
  Code,
  Rocket,
  Award,
  TrendingUp,
  MessageCircle,
} from "lucide-react";
import { FiZap } from "react-icons/fi";

interface ProductLandingPageProps {
  contained?: boolean;
  // companyName?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  ctaText?: string;
  aboutTitle?: string;
  aboutDescription?: string;
  features?: Array<{
    icon: string;
    title: string;
    description: string;
    color: string;
  }>;
  pricing?: Array<{
    name: string;
    price: string;
    features: string[];
    popular?: boolean;
  }>;
  testimonials?: Array<{
    name: string;
    role: string;
    content: string;
    rating: number;
    avatar: string;
  }>;
  stats?: Array<{ value: string; label: string }>;
}

const defaultProps: ProductLandingPageProps = {
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
      description: "Experience blazing fast performance with our optimized infrastructure",
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
      avatar: "/place.jpg",
    },
    {
      name: "Mike Chen",
      role: "CTO, StartupXYZ",
      content:
        "Incredible performance and ease of use. Our team productivity increased by 300%.",
      rating: 5,
      avatar: "/place.jpg",
    },
    {
      name: "Emily Rodriguez",
      role: "Product Manager, InnovateCo",
      content: "The best investment we've made for our development workflow.",
      rating: 5,
      avatar: "/place.jpg",
    },
  ],
  stats: [
    { value: "100K+", label: "Active Users" },
    { value: "99.9%", label: "Uptime" },
    { value: "50M+", label: "API Calls" },
    { value: "24/7", label: "Support" },
  ],
};

const iconMap: Record<string, React.ReactNode> = {
  zap: <Zap className="w-8 h-8" />,
  shield: <Shield className="w-8 h-8" />,
  users: <Users className="w-8 h-8" />,
};

const ProductLandingPage = (props: ProductLandingPageProps = {}) => {
  const mergedProps = { ...defaultProps, ...props };
  const {
    contained,
    // companyName,
    heroTitle,
    heroSubtitle,
    ctaText,
    aboutTitle,
    aboutDescription,
    features,
    pricing,
    testimonials,
    stats,
  } = mergedProps;
  type SectionKeys = "about" | "features" | "testimonials" | "pricing" | "hero";
  const [isVisible, setIsVisible] = useState<
    Partial<Record<SectionKeys, boolean>>
  >({});
  const [currentFeature, setCurrentFeature] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  type Particle = {
    id: number;
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    opacity: number;
  };
  const [particles, setParticles] = useState<Particle[]>([]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("hero");
  const heroRef = useRef(null);
  // const canvasRef = useRef(null);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent): void => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Scroll progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);

      // Update active section
      const sections = ["hero", "about", "features", "testimonials", "pricing"];
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (currentSection) setActiveSection(currentSection);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll("[id]").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Auto-rotate features and testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % ((features ?? []).length || 1));
      setCurrentTestimonial((prev) => (prev + 1) % ((testimonials ?? []).length || 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [(features ?? []).length, (testimonials ?? []).length]);

  // Particle system
  useEffect(() => {
    const createParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.5 + 0.3,
        });
      }
      setParticles(newParticles);
    };

    createParticles();
    const interval = setInterval(() => {
      setParticles(
        particles.map((particle: Particle) => {
          let newX = particle.x + particle.speedX;
          let newY = particle.y + particle.speedY;
          if (newX > window.innerWidth) newX = 0;
          if (newX < 0) newX = window.innerWidth;
          if (newY > window.innerHeight) newY = 0;
          if (newY < 0) newY = window.innerHeight;
          return {
            ...particle,
            x: newX,
            y: newY,
          };
        })
      );
      setParticles((prevParticles: Particle[]) =>
        prevParticles.map((particle: Particle) => {
          let newX = particle.x + particle.speedX;
          let newY = particle.y + particle.speedY;
          if (newX > window.innerWidth) newX = 0;
          if (newX < 0) newX = window.innerWidth;
          if (newY > window.innerHeight) newY = 0;
          if (newY < 0) newY = window.innerHeight;
          return {
            ...particle,
            x: newX,
            y: newY,
          };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // AnimatedCounter component
  type AnimatedCounterProps = {
    value: string;
    duration?: number;
  };

  const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
    value,
    duration = 1200,
  }) => {
    const [count, setCount] = useState(0);
    const [isInView, setIsInView] = useState(false);
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true);
          }
        },
        { threshold: 0.1 }
      );

      if (ref.current) {
        observer.observe(ref.current);
      }

      return () => observer.disconnect();
    }, []);

    useEffect(() => {
      if (isInView) {
        const numValue = parseInt(value.replace(/[^0-9]/g, ""));
        let start = 0;
        const increment = numValue / (duration / 16);

        const timer = setInterval(() => {
          start += increment;
          if (start >= numValue) {
            setCount(numValue);
            clearInterval(timer);
          } else {
            setCount(Math.floor(start));
          }
        }, 16);

        return () => clearInterval(timer);
      }
    }, [isInView, value, duration]);

    // If value contains non-numeric characters (like % or +), append them after the count
    const suffix = value.replace(/[0-9,]/g, "");

    return (
      <span ref={ref}>
        {count.toLocaleString()}
        {suffix}
      </span>
    );
  };

  return (
    <div className={contained ? "rounded-xl border bg-zinc-900 p-4 w-full max-w-4xl mx-auto" : "bg-black text-white min-h-screen relative overflow-hidden"}>
      {/* Animated Background Particles */}
      {!contained && (
        <div className="fixed inset-0 pointer-events-none">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: particle.x,
                top: particle.y,
                opacity: particle.opacity,
                transform: \`scale(\${particle.size})\`,
              }}
            />
          ))}
        </div>
      )}
      {/* Scroll Progress Bar */}
      {!contained && (
        <div className="fixed top-0 left-0 w-full h-1 bg-white/10 z-50">
          <div
            className="h-full bg-gradient-to-r from-white to-gray-300 transition-all duration-300"
            style={{ width: \`\${scrollProgress}%\` }}
          />
        </div>
      )}
      {/* Mouse Follower */}
      {!contained && (
        <div
          className="fixed pointer-events-none z-40 mix-blend-difference"
          style={{
            left: mousePosition.x - 10,
            top: mousePosition.y - 10,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="w-5 h-5 bg-white rounded-full opacity-50" />
        </div>
      )}
      {/* Header */}
      {!contained && (
        <header className="fixed top-0 w-full bg-black/80 backdrop-blur-lg border-b border-white/10 z-50">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-black" />
                </div>
                <span className="text-xl font-bold">{mergedProps.companyName}</span>
              </div>
              {/* Navigation Dots */}
              <div className="hidden md:flex space-x-2">
                {["hero", "about", "features", "testimonials", "pricing"].map(
                  (section) => (
                    <button
                      key={section}
                      onClick={() =>
                        document
                          .getElementById(section)
                          ?.scrollIntoView({ behavior: "smooth" })
                      }
                      className={\`w-3 h-3 rounded-full transition-all duration-300 \${
                        activeSection === section ? "bg-white" : "bg-white/30"
                      }\`}
                    />
                  )
                )}
              </div>
              <button className="bg-white text-black px-6 py-2 rounded-full hover:bg-gray-200 transition-all duration-300 transform hover:scale-105">
                {ctaText}
              </button>
            </div>
          </div>
        </header>
      )}
      {/* Main Content */}
      <div className={contained ? "" : "z-10"}>
        {/* Hero Section */}
        <section
          id="hero"
          ref={heroRef}
          className={contained ? "pt-8 pb-8 flex items-center relative overflow-hidden" : "pt-32 pb-20 min-h-screen flex items-center relative overflow-hidden"}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>

          {/* Animated Geometric Shapes */}
          <div className="absolute inset-0">
            <div
              className="absolute top-20 right-20 w-32 h-32 border border-white/20 rounded-full animate-spin"
              style={{ animationDuration: "20s" }}
            />
            <div className="absolute bottom-20 left-20 w-24 h-24 border border-white/20 rotate-45 animate-pulse" />
            <div
              className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-lg animate-bounce"
              style={{ animationDelay: "1s" }}
            />
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="animate-pulse mb-8">
                <span className="inline-block px-4 py-2 bg-white/10 rounded-full text-sm border border-white/20">
                  🚀 Now Available
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                {(heroTitle ?? '').split(" ").map((word, index) => (
                  <span
                    key={index}
                    className="inline-block animate-fade-in"
                    style={{ animationDelay: \`\${index * 0.1}s\` }}
                  >
                    {word}&nbsp;
                  </span>
                ))}
              </h1>

              <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                {heroSubtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <button className="group bg-white text-black px-8 py-4 rounded-full font-semibold hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 flex items-center">
                  {ctaText}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="border border-white/30 px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-all duration-300 transform hover:scale-105 flex items-center"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 mr-2" />
                  ) : (
                    <Play className="w-5 h-5 mr-2" />
                  )}
                  {isPlaying ? "Pause Demo" : "Watch Demo"}
                </button>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
                {(stats ?? []).map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl md:text-3xl font-bold mb-2">
                      <AnimatedCounter value={stat.value} />
                    </div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        {/* About Section */}
        <section
          id="about"
          className={contained ? "py-8 transition-all duration-1000" : "py-20 transition-all duration-1000" + (isVisible.about ? " opacity-100 translate-y-0" : " opacity-0 translate-y-10")}
        >
          <div className="container mx-auto px-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  {(aboutTitle ?? '').split(" ").slice(0, 2).join(" ")}
                  <span className="block text-gray-400">
                    {(aboutTitle ?? '').split(" ").slice(2).join(" ")}
                  </span>
                </h2>
                <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                  {aboutDescription}
                </p>

                <div className="space-y-6">
                  {[
                    {
                      icon: <Award className="w-6 h-6" />,
                      text: "Founded by industry veterans",
                    },
                    {
                      icon: <Users className="w-6 h-6" />,
                      text: "Trusted by 100,000+ users worldwide",
                    },
                    {
                      icon: <TrendingUp className="w-6 h-6" />,
                      text: "Backed by leading investors",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 group"
                    >
                      <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
                        {item.icon}
                      </div>
                      <span className="text-gray-300 group-hover:text-white transition-colors">
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <Image
                  src="/ArDacitypfp.png"
                  alt="Team collaboration"
                  width={800}
                  height={384}
                  className="w-full h-96 object-cover filter grayscale hover:grayscale-0 transition-all duration-700"
                  style={{ width: "100%", height: "24rem", objectFit: "cover" }}
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                {/* Floating Elements */}
                <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm rounded-lg p-3 animate-pulse">
                  <Code className="w-6 h-6" />
                </div>
                <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-sm rounded-lg p-3 animate-bounce">
                  <Rocket className="w-6 h-6" />
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white rounded-full flex items-center justify-center animate-pulse">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-black">
                      <AnimatedCounter value="99.9%" />
                    </div>
                    <div className="text-xs text-gray-600">Uptime</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className={contained ? "py-8 transition-all duration-1000" : "py-20 transition-all duration-1000" + (isVisible.features ? " opacity-100 translate-y-0" : " opacity-0 translate-y-10")}
        >
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Powerful Features
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Everything you need to build, deploy, and scale your applications
                with confidence.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {(features ?? []).map((feature, index) => (
                <div
                  key={index}
                  className={\`group p-8 rounded-2xl border border-white/10 hover:border-white/30 transition-all duration-500 transform hover:scale-105 relative overflow-hidden \${
                    currentFeature === index ? "bg-white/5" : "bg-transparent"
                  }\`}
                >
                  <div
                    className={\`absolute inset-0 bg-gradient-to-br \${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500\`}
                  />

                  <div className="relative z-10">
                    <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                      <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
                        {iconMap[feature.icon] || feature.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 text-center">
              <div className="inline-flex space-x-2">
                {(features ?? []).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentFeature(index)}
                    className={\`w-3 h-3 rounded-full transition-all duration-300 \${
                      currentFeature === index ? "bg-white w-8" : "bg-white/30"
                    }\`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section
          id="testimonials"
          className={contained ? "py-8 transition-all duration-1000" : "py-20 transition-all duration-1000" + (isVisible.testimonials ? " opacity-100 translate-y-0" : " opacity-0 translate-y-10")}
        >
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                What Our Customers Say
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Don\`&apos;\`t just take our word for it. Here\`&apos;\`s what real
                customers think about our platform.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <Image
                    src={testimonials?.[currentTestimonial]?.avatar ?? '/placeholder.jpg'}
                    alt={testimonials?.[currentTestimonial]?.name ?? 'User'}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full object-cover"
                    style={{ width: "4rem", height: "4rem", objectFit: "cover" }}
                    priority
                  />
                  <div>
                    <h4 className="font-semibold text-lg">
                      {testimonials?.[currentTestimonial]?.name}
                    </h4>
                    <p className="text-gray-400">
                      {testimonials?.[currentTestimonial]?.role}
                    </p>
                  </div>
                </div>

                <div className="flex mb-4">
                  {[...(Array(testimonials?.[currentTestimonial]?.rating || 0))].map(
                    (_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current"
                      />
                    )
                  )}
                </div>

                <p className="text-xl text-gray-300 leading-relaxed">
                  \`&quot;\`{testimonials?.[currentTestimonial]?.content}\`&quot;\`
                </p>
              </div>

              <div className="flex justify-center space-x-2 mt-8">
                {testimonials?.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={\`w-3 h-3 rounded-full transition-all duration-300 \${
                      currentTestimonial === index
                        ? "bg-white w-8"
                        : "bg-white/30"
                    }\`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section
          id="pricing"
          className={contained ? "py-8 transition-all duration-1000" : "py-20 transition-all duration-1000" + (isVisible.pricing ? " opacity-100 translate-y-0" : " opacity-0 translate-y-10")}
        >
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Simple Pricing
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Choose the perfect plan for your needs. All plans include our core
                features.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {(pricing ?? []).map((plan, index) => (
                <div
                  key={index}
                  className={\`relative p-8 rounded-2xl border transition-all duration-500 transform hover:scale-105 \${
                    plan.popular
                      ? "border-white bg-white/5 shadow-2xl"
                      : "border-white/10 hover:border-white/30"
                  }\`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-white text-black px-4 py-2 rounded-full text-sm font-semibold animate-pulse">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <div className="flex items-baseline justify-center mb-4">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-gray-400 ml-2">/month</span>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center space-x-3"
                      >
                        <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={\`w-full py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 \${
                      plan.popular
                        ? "bg-white text-black hover:bg-gray-200"
                        : "border border-white/30 hover:bg-white/10"
                    }\`}
                  >
                    Get Started
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-16 text-center">
              <p className="text-gray-400 mb-4">
                Trusted by thousands of companies worldwide
              </p>
              <div className="flex justify-center items-center space-x-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
                <span className="ml-2 text-sm text-gray-300">
                  4.9/5 from 2,000+ reviews
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={contained ? "py-8 bg-white/5 border-t border-white/10" : "py-20 bg-white/5 border-t border-white/10"}>
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of companies already using our platform to transform
              their workflow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-black px-8 py-4 rounded-full font-semibold hover:bg-gray-200 transition-all duration-300 transform hover:scale-105">
                {ctaText}
              </button>
              <button className="border border-white/30 px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                Talk to Sales
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductLandingPage;
  `
}
function generateWeb3LandingPage2(): string {
  return `
  "use client"
  
  import { useState, useEffect } from "react"
  import Image from "next/image"
  
  interface Web3LandingPage2Props {
    // Header props
    // logo?: string
    // companyName?: string
    contained?: boolean
    heroTitle?: string
    heroSubtitle?: string
    heroButtonText?: string
    heroImage?: string
    // About props
    aboutTitle?: string
    aboutDescription?: string
    aboutImage?: string
    aboutStats?: Array<{ label: string; value: string }>
    // Features props
    featuresTitle?: string
    featuresSubtitle?: string
    features?: Array<{
      icon: string
      title: string
      description: string
    }>
    // Pricing props
    pricingTitle?: string
    pricingSubtitle?: string
    pricingPlans?: Array<{
      name: string
      price: string
      period: string
      features: string[]
      popular?: boolean
    }>
  }
  
  const defaultProps: Web3LandingPage2Props = {
    // logo: "⚡",
    // companyName: "ArDacity",
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
    featuresSubtitle: "Everything you need to build exceptional decentralized applications",
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
        description: "Audited components with built-in security best practices to protect your users and their assets.",
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
        description: "Fully themeable components that adapt to your brand while maintaining Web3 functionality.",
      },
      {
        icon: "🌐",
        title: "Multi-Chain Support",
        description: "Works seamlessly across Ethereum, Polygon, BSC, and 12+ other popular blockchain networks.",
      },
      {
        icon: "📱",
        title: "Mobile Optimized",
        description: "Responsive components that work perfectly on desktop, mobile, and Web3 wallet browsers.",
      },
    ],
    pricingTitle: "Choose Your Plan",
    pricingSubtitle: "Flexible pricing for developers and teams building the future of Web3",
    pricingPlans: [
      {
        name: "Developer",
        price: "$0",
        period: "forever",
        features: ["50 components", "Basic templates", "Community support", "MIT license", "Documentation access"],
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
  }
  
  export default function Web3LandingPage2(props: Web3LandingPage2Props & { contained?: boolean } = {}) {
    const { contained = false, ...rest } = props;
    const mergedProps = { ...defaultProps, ...rest }
    const [scrollY, setScrollY] = useState(0)
    const [activeSection, setActiveSection] = useState(0)
    const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
    useEffect(() => {
      const handleScroll = () => setScrollY(window.scrollY)
      const handleMouseMove = (e: MouseEvent) => {
        setMousePosition({ x: e.clientX, y: e.clientY })
      }
  
      window.addEventListener("scroll", handleScroll)
      window.addEventListener("mousemove", handleMouseMove)
  
      return () => {
        window.removeEventListener("scroll", handleScroll)
        window.removeEventListener("mousemove", handleMouseMove)
      }
    }, [])
  
    useEffect(() => {
      const interval = setInterval(() => {
        setActiveSection((prev) => (prev + 1) % 4)
      }, 4000)
      return () => clearInterval(interval)
    }, [])
  
    const scrollToSection = (sectionId: string) => {
      if (contained) return; // Disable scroll in contained mode
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" })
    }
  
    return (
      <div className={contained ? "rounded-xl border bg-zinc-900 p-4 w-full max-w-4xl mx-auto" : "min-h-screen bg-black text-white relative overflow-hidden"}>
        {/* Enhanced Geometric Background Pattern */}
        {!contained && (
          <div className="fixed inset-0 z-0">
            <div className="absolute inset-0 bg-black"></div>
            {/* Cursor following element */}
            <div
              className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl transition-all duration-300 ease-out pointer-events-none"
              style={{
                left: mousePosition.x - 192,
                top: mousePosition.y - 192,
              }}
            ></div>
            {/* Enhanced grid pattern */}
            <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.3" />
                </pattern>
                <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="10" cy="10" r="1" fill="white" opacity="0.3" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              <rect width="100%" height="100%" fill="url(#dots)" />
            </svg>
            {/* Additional floating elements */}
            <div
              className="absolute top-1/4 right-1/4 w-64 h-64 bg-white/5 rounded-full blur-2xl animate-pulse"
              style={{ transform: \`translate(${scrollY * 0.1}px, \${scrollY * 0.05}px)\` }}
            ></div>
            <div
              className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-white/3 rounded-full blur-3xl animate-pulse delay-1000"
              style={{ transform: \`translate(\${-scrollY * 0.08}px, \${-scrollY * 0.03}px)\` }}
            ></div>
            {/* Geometric shapes */}
            <div
              className="absolute top-20 left-20 w-4 h-4 bg-white/20 transform rotate-45 animate-spin"
              style={{ animationDuration: "20s" }}
            ></div>
            <div
              className="absolute top-40 right-40 w-6 h-6 border-2 border-white/20 transform rotate-12 animate-bounce"
              style={{ animationDelay: "2s" }}
            ></div>
            <div
              className="absolute bottom-40 left-40 w-3 h-3 bg-white/30 rounded-full animate-ping"
              style={{ animationDelay: "1s" }}
            ></div>
          </div>
        )}
  
        {/* Header */}
        {!contained && (
          <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-20">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-white flex items-center justify-center transform rotate-45 transition-transform duration-300 hover:rotate-90 hover:bg-gray-200">
                      <span className="text-black text-xl transform -rotate-45">{mergedProps.logo}</span>
                    </div>
                  </div>
                  <span className="text-2xl font-bold tracking-tight text-white">{mergedProps.companyName}</span>
                </div>
                <button
                  onClick={() => scrollToSection("pricing")}
                  className="relative bg-white text-black px-8 py-3 overflow-hidden group transition-all duration-300 hover:shadow-lg hover:shadow-white/20"
                >
                  <span className="relative z-10 font-medium">Get Started</span>
                  <div className="absolute inset-0 bg-gray-200 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </button>
              </div>
            </div>
          </header>
        )}
  
        {/* Main Content */}
        <div className={contained ? "" : "z-10"}>
          {/* Hero Section */}
          <section className={contained ? "relative flex flex-col items-center justify-center pt-8 pb-8 px-2" : "relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 z-10"}>
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-5 gap-16 items-center">
                <div className="lg:col-span-3 space-y-8">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <div className="w-4 h-4 bg-white rounded-full animate-pulse delay-100"></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-200"></div>
                      <span className="text-sm font-medium tracking-wide uppercase">Innovation Starts Here</span>
                    </div>
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
                      {mergedProps.heroTitle?.split(" ").map((word, index) => (
                        <span
                          key={index}
                          className="inline-block transform transition-all duration-500 hover:scale-105"
                          style={{ animationDelay: \`\${index * 100}ms\` }}
                        >
                          {word}&nbsp;
                        </span>
                      ))}
                    </h1>
                  </div>
                  <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">{mergedProps.heroSubtitle}</p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => scrollToSection("about")}
                      className="relative bg-white text-black px-8 py-4 text-lg font-medium overflow-hidden group transition-all duration-300 hover:shadow-xl"
                    >
                      <span className="relative z-10">{mergedProps.heroButtonText}</span>
                      <div className="absolute inset-0 bg-gray-200 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                    </button>
                    <button className="border-2 border-white text-white px-8 py-4 text-lg font-medium hover:bg-white hover:text-black transition-all duration-300">
                      Learn More
                    </button>
                  </div>
                </div>
                <div className="lg:col-span-2">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-white/5 transform rotate-3 group-hover:rotate-6 transition-transform duration-500"></div>
                    <div className="absolute inset-0 bg-white/3 transform -rotate-2 group-hover:-rotate-4 transition-transform duration-500 delay-75"></div>
                    <Image
                      src={mergedProps.heroImage! || "/placeholder.svg"}
                      alt="Hero"
                      width={700}
                      height={500}
                      className="relative z-10 w-full h-auto transform group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* About Section */}
          <section id="about" className={contained ? "relative py-8" : "relative py-24 z-10"}>
            <div className="absolute inset-0 bg-white/2"></div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-20 items-center">
                <div className="relative">
                  <div className="absolute -top-8 -left-8 w-16 h-16 border-4 border-white/20"></div>
                  <div className="absolute -bottom-8 -right-8 w-24 h-24 border-4 border-white/10"></div>
                  <Image
                    src={mergedProps.aboutImage! || "/placeholder.svg"}
                    alt="About"
                    width={500}
                    height={400}
                    className="w-full h-auto relative z-10"
                  />
                </div>
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="w-12 h-1 bg-white"></div>
                    <h2 className="text-4xl lg:text-5xl font-bold leading-tight">{mergedProps.aboutTitle}</h2>
                  </div>
                  <p className="text-lg text-gray-300 leading-relaxed">{mergedProps.aboutDescription}</p>
                  <div className="grid grid-cols-2 gap-8">
                    {mergedProps.aboutStats?.map((stat, index) => (
                      <div key={index} className="relative group">
                        <div className="absolute inset-0 bg-white/5 transform scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                        <div className="relative p-6 border-l-4 border-white/20 group-hover:border-white transition-colors duration-300">
                          <div className="text-3xl font-bold text-white">{stat.value}</div>
                          <div className="text-gray-300 mt-1 font-medium">{stat.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* Features Section */}
          <section id="features" className={contained ? "relative py-8" : "relative py-24 z-10"}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-20">
                <div className="inline-flex items-center space-x-2 mb-6">
                  <div className="w-8 h-1 bg-white"></div>
                  <span className="text-sm font-medium tracking-wide uppercase">Features</span>
                  <div className="w-8 h-1 bg-white"></div>
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold mb-6">{mergedProps.featuresTitle}</h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">{mergedProps.featuresSubtitle}</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {mergedProps.features?.map((feature, index) => (
                  <div
                    key={index}
                    className="relative group cursor-pointer"
                    onMouseEnter={() => setHoveredFeature(index)}
                    onMouseLeave={() => setHoveredFeature(null)}
                  >
                    
                    <div className="relative p-8 border border-white/10 group-hover:border-white transition-all duration-300 bg-black group-hover:text-black">
                      <div className="space-y-4">
                        <div className="text-4xl transform group-hover:scale-110 transition-transform duration-300">
                          {feature.icon}
                        </div>
                        <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                        <p className="text-gray-300 group-hover:text-gray-700 leading-relaxed transition-colors duration-300">
                          {feature.description}
                        </p>
                      </div>
                      <div className="absolute top-4 right-4 w-2 h-2 bg-white/20 group-hover:bg-black/50 transition-colors duration-300"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          {/* Pricing Section */}
          <section id="pricing" className={contained ? "relative py-8" : "relative py-24 z-10"}>
            <div className="absolute inset-0 bg-white/2"></div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-20">
                <div className="inline-flex items-center space-x-2 mb-6">
                  <div className="w-8 h-1 bg-white"></div>
                  <span className="text-sm font-medium tracking-wide uppercase">Pricing</span>
                  <div className="w-8 h-1 bg-white"></div>
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold mb-6">{mergedProps.pricingTitle}</h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">{mergedProps.pricingSubtitle}</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {mergedProps.pricingPlans?.map((plan, index) => (
                  <div key={index} className={\`relative group \${plan.popular ? "transform scale-105" : ""}\`}>
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                        <span className="bg-white text-black px-6 py-2 text-[0.5rem] font-medium">Most Popular</span>
                      </div>
                    )}
                    <div
                      className={\`relative p-8 border-2 bg-black transition-all duration-300 \${
                        plan.popular
                          ? "border-white shadow-lg"
                          : "border-white/10 group-hover:border-white group-hover:shadow-lg"
                      }\`}
                    >
                      <div className="space-y-6">
                        <div className="text-center">
                          <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                          <div className="flex items-baseline justify-center">
                            <span className="text-5xl font-bold">{plan.price}</span>
                            <span className="text-gray-300 ml-2">/{plan.period}</span>
                          </div>
                        </div>
                        <ul className="space-y-4">
                          {plan.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start">
                              <div className="w-5 h-5 bg-white flex items-center justify-center mr-3 mt-0.5">
                                <span className="text-black text-xs">✓</span>
                              </div>
                              <span className="text-gray-300">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <button
                          className={\`w-full py-4 font-medium transition-all duration-300 \${
                            plan.popular
                              ? "bg-white text-black hover:bg-gray-200"
                              : "border-2 border-white text-white hover:bg-white hover:text-black"
                          }\`}
                        >
                          Choose Plan
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          {/* CTA Section */}
          <section className={contained ? "relative py-8" : "relative py-24 z-10"}>
            <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="w-16 h-1 bg-white"></div>
                  </div>
                  <h2 className="text-4xl lg:text-5xl font-bold">Ready to Get Started?</h2>
                </div>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                  Join thousands of businesses already transforming their digital presence with our platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="bg-white text-black px-8 py-4 text-lg font-medium hover:bg-gray-200 transition-all duration-300">
                    Start Free Trial
                  </button>
                  <button className="border-2 border-white text-white px-8 py-4 text-lg font-medium hover:bg-white hover:text-black transition-all duration-300">
                    Contact Sales
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    )
  }
  `
}


function generateWeb3LandingPage(): string {
  return `
 "use client"
import { useState, useEffect } from "react"
import Image from "next/image"

interface Web3LandingPageProps {
  // Header props
  // logo?: string
  contained?: boolean
  // companyName?: string
  heroTitle?: string
  heroSubtitle?: string
  heroButtonText?: string
  heroSecondaryButtonText?: string
  heroImage?: string
  // About props
  aboutTitle?: string
  aboutDescription?: string
  aboutImage?: string
  aboutStats?: Array<{ label: string; value: string; icon: string }>
  // Features props
  featuresTitle?: string
  featuresSubtitle?: string
  features?: Array<{
    icon: string
    title: string
    description: string
  }>
  // Pricing props
  pricingTitle?: string
  pricingSubtitle?: string
  pricingPlans?: Array<{
    name: string
    price: string
    period: string
    features: string[]
    popular?: boolean
    buttonText?: string
  }>
}

const defaultProps: Web3LandingPageProps = {
  // logo: "⚡",
  contained: true,
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
  featuresSubtitle: "Comprehensive tools and components designed specifically for Web3 development",
  features: [
    {
      icon: "🔐",
      title: "Security Audited",
      description: "Every component undergoes rigorous security audits to ensure your users' assets remain protected.",
    },
    {
      icon: "⚡",
      title: "Gas Optimized",
      description: "Intelligent optimization reduces transaction costs while maintaining peak performance.",
    },
    {
      icon: "🎨",
      title: "Design System",
      description: "Cohesive design language that scales beautifully across all your decentralized applications.",
    },
    {
      icon: "🔗",
      title: "Multi-Chain Ready",
      description: "Seamless integration across Ethereum, Polygon, Arbitrum, and 17+ other networks.",
    },
    {
      icon: "📱",
      title: "Mobile First",
      description: "Responsive components optimized for mobile wallets and cross-platform compatibility.",
    },
    {
      icon: "🛠️",
      title: "Developer Tools",
      description: "Comprehensive CLI, testing suite, and debugging tools for streamlined development.",
    },
  ],
  pricingTitle: "Scale with Confidence",
  pricingSubtitle: "Choose the perfect plan for your Web3 development journey",
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
}

export default function Web3LandingPage(props: Web3LandingPageProps & { contained?: boolean } = {}) {
  const { contained = false, ...rest } = props;
  const mergedProps = { ...defaultProps, ...rest }
  const [isVisible, setIsVisible] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [activeFeature, setActiveFeature] = useState(0)

  useEffect(() => {
    setIsVisible(true)

    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)

    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % mergedProps.features!.length)
    }, 4000)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearInterval(interval)
    }
  }, [mergedProps.features])

  const scrollToSection = (sectionId: string) => {
    if (contained) return; // Disable scroll in contained mode
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className={contained ? "rounded-xl border bg-zinc-900 p-4 w-full max-w-4xl mx-auto" : "min-h-screen bg-black text-white relative overflow-hidden"}>
      {/* Animated Background Elements */}
      {!contained && (
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-black"></div>
          {/* Floating orbs */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-white/3 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-white/4 rounded-full blur-3xl animate-pulse delay-2000"></div>
          <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-white/3 rounded-full blur-2xl animate-pulse delay-500"></div>
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: \`radial-gradient(circle at 1px 1px, white 1px, transparent 0)\`,
              backgroundSize: "50px 50px",
              transform: \`translateY(\${scrollY * 0.1}px)\`,
            }}
          ></div>
        </div>
      )}

      {/* Header */}
      {!contained && (
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                    <span className="text-2xl">{mergedProps.logo}</span>
                  </div>
                  <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl animate-ping opacity-75"></div>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {mergedProps.companyName}
                </span>
              </div>
              <button
                onClick={() => scrollToSection("pricing")}
                className="relative bg-white text-black px-8 py-3 rounded-2xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 font-semibold group overflow-hidden"
              >
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <div className={contained ? "" : "z-10"}>
        {/* Hero Section */}
        <section className={contained ? "relative flex flex-col items-center justify-center pt-8 pb-8 px-2" : "relative min-h-screen flex items-center justify-center pt-20 pb-16 px-6 lg:px-8 z-10 mt-6"}>
          <div className="max-w-5xl mx-auto text-center">
            <div
              className={\`transform transition-all duration-1000 \${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }\`}
            >
              {/* Hero Badge */}
              <div className="inline-flex items-center px-6 py-3 bg-white/10 rounded-full border border-white/20 backdrop-blur-sm mb-8 group hover:bg-white/15 transition-all duration-300">
                <span className="text-sm font-medium mr-2">🚀</span>
                <span className="text-sm font-medium">Trusted by 25K+ Web3 developers</span>
              </div>

              {/* Main Title */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-8 bg-gradient-to-b from-white via-white to-gray-400 bg-clip-text text-transparent">
                {mergedProps.heroTitle}
              </h1>

              {/* Subtitle */}
              <p className="text-xl sm:text-2xl text-gray-300 leading-relaxed mb-12 max-w-4xl mx-auto">
                {mergedProps.heroSubtitle}
              </p>

              {/* Hero Image */}
              <div className="relative mb-12 group">
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-white/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
                <div className="relative w-80 h-80 mx-auto">
                  <Image
                    src={mergedProps.heroImage! || "/place.jpg"}
                    alt="Hero"
                    width={400}
                    height={400}
                    className="w-full h-full object-cover rounded-3xl border border-white/20 backdrop-blur-sm hover:border-white/40 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10 rounded-3xl"></div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button
                  onClick={() => scrollToSection("features")}
                  className="relative bg-white text-black px-10 py-4 rounded-2xl text-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 group overflow-hidden"
                >
                  <span className="relative z-10">{mergedProps.heroButtonText}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </button>
                <button
                  onClick={() => scrollToSection("about")}
                  className="border-2 border-white/30 text-white px-10 py-4 rounded-2xl text-lg font-semibold hover:bg-white/10 hover:border-white/50 transition-all duration-300 transform hover:scale-105"
                >
                  {mergedProps.heroSecondaryButtonText}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className={contained ? "relative py-8" : "relative py-24 z-10"}>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent"></div>
          <div className="relative max-w-6xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent leading-tight">
                  {mergedProps.aboutTitle}
                </h2>
                <p className="text-lg text-gray-300 leading-relaxed">{mergedProps.aboutDescription}</p>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-6">
                  {mergedProps.aboutStats?.map((stat, index) => (
                    <div
                      key={index}
                      className="relative group p-6 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 hover:border-white/30 transition-all duration-500 transform hover:-translate-y-2 hover:bg-white/10"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative text-center">
                        <div className="text-3xl mb-2">{stat.icon}</div>
                        <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                        <div className="text-gray-400 text-sm">{stat.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-3xl blur-3xl"></div>
                <Image
                  src={mergedProps.aboutImage! || "/placeholder.svg"}
                  alt="About"
                  width={600}
                  height={500}
                  className="relative rounded-3xl border border-white/20 w-full"
                />
                <div className="absolute -top-6 -right-6 w-20 h-20 bg-white text-black rounded-full flex items-center justify-center text-2xl animate-bounce">
                  ⚡
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className={contained ? "relative py-8" : "relative py-24 z-10"}>
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {mergedProps.featuresTitle}
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">{mergedProps.featuresSubtitle}</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mergedProps.features?.map((feature, index) => (
                <div
                  key={index}
                  className={\`relative group p-8 bg-white/5 backdrop-blur-sm rounded-3xl border transition-all duration-700 transform hover:-translate-y-4 \${
                    activeFeature === index
                      ? "border-white/50 bg-white/10 scale-105"
                      : "border-white/10 hover:border-white/30"
                  }\`}
                  onMouseEnter={() => setActiveFeature(index)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white/20 transition-all duration-300 transform group-hover:scale-110">
                      <span className="text-2xl">{feature.icon}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-white">{feature.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className={contained ? "relative py-8" : "relative py-24 z-10"}>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent"></div>
          <div className="relative max-w-6xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {mergedProps.pricingTitle}
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">{mergedProps.pricingSubtitle}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {mergedProps.pricingPlans?.map((plan, index) => (
                <div
                  key={index}
                  className={\`relative group p-8 bg-white/5 backdrop-blur-sm rounded-3xl border transition-all duration-700 transform hover:-translate-y-6 \${
                    plan.popular ? "border-white/50 bg-white/10 scale-105" : "border-white/10 hover:border-white/30"
                  }\`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-white text-black px-6 py-2 rounded-full text-[0.5rem] font-semibold animate-pulse">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="relative">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold mb-4 text-white">{plan.name}</h3>
                      <div className="text-4xl font-bold mb-2 text-white">{plan.price}</div>
                      <div className="text-gray-400">{plan.period}</div>
                    </div>

                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start text-gray-300">
                          <span className="text-green-400 mr-3 mt-1 flex-shrink-0">✓</span>
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      className={\`w-full py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 \${
                        plan.popular
                          ? "bg-white text-black hover:bg-gray-100"
                          : "bg-white/10 text-white border border-white/30 hover:bg-white/20 hover:border-white/50"
                      }\`}
                    >
                      {plan.buttonText || "Choose Plan"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className={contained ? "relative py-8" : "relative py-24 z-10"}>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900/50 to-black"></div>
          <div className="relative max-w-4xl mx-auto text-center px-6 lg:px-8">
            <div className="space-y-8">
              <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Start Building Tomorrow\`&apos;\`s Web
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Join the revolution of decentralized development. Build faster, more secure, and beautifully designed
                dApps with ArDacity.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button
                  onClick={() => scrollToSection("pricing")}
                  className="bg-white text-black px-10 py-4 rounded-2xl text-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                >
                  Get Started Free
                </button>
                <button className="border-2 border-white/30 text-white px-10 py-4 rounded-2xl text-lg font-semibold hover:bg-white/10 hover:border-white/50 transition-all duration-300 transform hover:scale-105">
                  Schedule Demo
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
`
}

function generateArDacityClassicNavbar(): string {
  return `"use client"

import { Button } from "@/components/ui/button"
import { Menu, Moon, Sun, Wallet } from "lucide-react"
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
      className={\`border-b border-zinc-800 bg-black  backdrop-blur  z-50 \${positionClass}\`}
    >
      <div className="flex h-14 items-center px-4 lg:px-8">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <div className="text-xl text-white font-bold ">{brand}</div>
            </div>
          </div>

          <nav className="hidden translate-x-12 md:flex items-center space-x-6">
            <Link href="/docs" className="text-sm text-white font-medium transition-colors hover:text-cyan-500">
              {nav1}
            </Link>
            <button
              onClick={() => scrollToSection("features")}
              className="text-sm font-medium transition-colors text-white hover:text-cyan-500"
            >
              {nav2}
            </button>
            <button
              onClick={() => scrollToSection("demo")}
              className="text-sm font-medium transition-colors text-white hover:text-cyan-500"
            >
              {nav3}
            </button>
          </nav>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="hidden md:flex items-center gap-2 bg-black text-white">
              <Wallet className="h-4 w-4 " />
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
                  className="h-3 w-3 text-black dark:text-white invert "
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
function generateDarkHeader(): string {
  return `
  "use client"

import { motion } from "framer-motion"
import Image from "next/image"
import React from "react"

interface DarkHeaderProps {
  title?: string
  subtitle?: string
  ctaText?: string
  onCtaClick?: () => void
  imageSrc?: string
  showImage?: boolean
  customClassName?: string
}

export const DarkHeader: React.FC<DarkHeaderProps> = ({
  title = "Precision in Motion",
  subtitle = "A balance of structure and creativity, brought to life.",
  ctaText = "Start Building",
  onCtaClick,
  imageSrc = "/header-image.png",
  showImage = true,
  customClassName = "",
}) => {
  return (
    <header
      className={\`relative overflow-hidden bg-zinc-950 text-white py-24 px-6 md:px-12 lg:px-20 flex flex-col lg:flex-row items-center justify-between gap-12 \${customClassName}\`}
    >
      {/* ✨ Geometric Background Pattern */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="w-full h-full relative">
          {[...Array(40)].map((_, i) => {
            const x = Math.random() * 100
            const y = Math.random() * 100
            const delay = Math.random() * 5
            const size = Math.random() * 20 + 10
            return (
              <motion.div
                key={i}
                className="absolute border border-fuchsia-700/30 bg-fuchsia-500/5 rotate-45"
                style={{
                  top: \`\${y}%\`,
                  left: \`\${x}%\`,
                  width: \`\${size}px\`,
                  height: \`\${size}px\`,
                }}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{
                  opacity: 0.4,
                  y: [0, -10, 0],
                  x: [0, 5, 0],
                  scale: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 6 + Math.random() * 4,
                  delay,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                }}
              />
            )
          })}
        </div>
      </div>

      {/* 🚀 Left Content */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="z-10 max-w-xl"
      >
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
          {title}
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-neutral-400 max-w-lg">{subtitle}</p>

        {ctaText && (
          <button
            onClick={onCtaClick}
            className="mt-8 inline-block px-6 py-3 text-base sm:text-lg font-semibold rounded-lg bg-gradient-to-r from-pink-600 to-orange-500 hover:from-pink-700 hover:to-orange-600 transition-all duration-300 shadow-lg"
          >
            {ctaText}
          </button>
        )}
      </motion.div>

      {/* 🎨 Right Image */}
      {showImage && (
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-full max-w-lg aspect-[4/3] z-10"
        >
          <Image
            src={imageSrc}
            alt="Hero Visual"
            fill
            className="object-contain drop-shadow-xl pointer-events-none"
          />
        </motion.div>
      )}
    </header>
  )
}
  `
}


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

function generateFancyFooter(): string {
  return `
import React, { useEffect } from "react";
import { FaTwitter, FaGithub, FaDiscord, FaBox, FaBuilding, FaBook, FaGavel } from "react-icons/fa";

// Icon lookup for string names
const iconMap: Record<string, React.ReactNode> = {
  twitter: <FaTwitter />,
  github: <FaGithub />,
  discord: <FaDiscord />,
  box: <FaBox />,
  company: <FaBuilding />,
  resources: <FaBook />,
  legal: <FaGavel />,
};

// Types for props
export type FancyFooterColumn = {
  title: string;
  icon?: string;
  links: Array<{
    label: string;
    url: string;
  }>;
};

export type FancyColumnFooterProps = {
  logo: { src: string; alt?: string };
  description?: string;
  columns: FancyFooterColumn[];
  backgroundStyle?: "gradient" | "custom" | "dark-abstract";
  customBackgroundClass?: string;
  bottomNote?: string;
  socialIcons?: string[];
  layout?: "center" | "left";
};

// Helper: Validate URL (basic)
const isValidUrl = (url: string) => {
  try {
    new URL(url, window.location.origin);
    return true;
  } catch {
    return false;
  }
};

export const FancyColumnFooter: React.FC<FancyColumnFooterProps> = ({
  logo,
  description,
  columns,
  backgroundStyle = "dark-abstract",
  customBackgroundClass = "",
  bottomNote,
  socialIcons,
  layout = "left",
}) => {
  useEffect(() => {
    if (columns.length > 5) {
      console.warn("[FancyColumnFooter] More than 5 columns provided. Only 5 will be displayed.");
    }
    columns.forEach((col, i) => {
      col.links.forEach((link) => {
        if (!isValidUrl(link.url)) {
          console.warn(\`[FancyColumnFooter] Invalid URL in column \${i + 1}: \${link.url}\`);
        }
      });
    });
    if (socialIcons && socialIcons.length > 0 && !bottomNote) {
      console.warn("[FancyColumnFooter] Social icons provided but no bottomNote. Social block may not render as expected.");
    }
  }, [columns, socialIcons, bottomNote]);

  let bgClass = "";
  let borderClass = "";
  if (backgroundStyle === "gradient") {
    bgClass = "bg-gradient-to-br from-pink-200 via-blue-200 to-purple-200 dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-800";
    borderClass = "";
  } else if (backgroundStyle === "custom") {
    bgClass = customBackgroundClass;
    borderClass = "";
  } else if (backgroundStyle === "dark-abstract") {
    bgClass = "bg-zinc-900";
    borderClass = "";
  }

  const colCount = Math.min(columns.length, 5);
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-4",
    5: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
  }[colCount];

  const alignClass = layout === "center" ? "items-center text-center" : "items-start text-left";
  console.log("Footer props", { logo, columns, socialIcons });

  let textClass = "";
  let iconClass = "";
  let linkClass = "";
  let linkHoverClass = "";
  let sectionBgClass = "";
  let abstractBg = null;

  if (backgroundStyle === "dark-abstract") {
    textClass = "text-zinc-100";
    iconClass = "text-primary invert";
    linkClass = "text-muted-foreground hover:text-cyan-400";
    linkHoverClass = "hover:text-cyan-400";
    sectionBgClass = "bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 relative overflow-hidden";
    abstractBg = (
      <>
        {/* Animated SVG lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" width="100%" height="100%" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,160 C360,320 1080,0 1440,160" stroke="#6366f1" strokeWidth="2" fill="none" opacity="0.08">
            <animate attributeName="d" dur="8s" repeatCount="indefinite"
              values="M0,160 C360,320 1080,0 1440,160;M0,120 C400,320 1040,40 1440,120;M0,160 C360,320 1080,0 1440,160" />
          </path>
          <path d="M0,240 Q720,80 1440,240" stroke="#f472b6" strokeWidth="2" fill="none" opacity="0.10">
            <animate attributeName="d" dur="10s" repeatCount="indefinite"
              values="M0,240 Q720,80 1440,240;M0,200 Q720,160 1440,200;M0,240 Q720,80 1440,240" />
          </path>
        </svg>
        {/* Animated geometric shapes */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-0 animate-pulse-slow">
          <div className="w-64 h-64 bg-gradient-to-tr from-purple-700/30 via-blue-500/20 to-pink-400/20 rounded-full blur-2xl animate-spin-slow" />
        </div>
        <div className="absolute bottom-0 right-0 z-0 animate-pulse-slow">
          <div className="w-40 h-40 bg-gradient-to-br from-blue-400/20 to-pink-400/20 rounded-full blur-2xl animate-spin-reverse-slower" />
        </div>
      </>
    );
  } else if (backgroundStyle === "gradient") {
    textClass = "text-zinc-900 dark:text-zinc-100";
    iconClass = "text-primary dark:text-primary";
    linkClass = "text-muted-foreground hover:text-primary dark:hover:text-cyan-400";
    linkHoverClass = "hover:text-primary dark:hover:text-cyan-400";
    sectionBgClass = "bg-background/80 dark:bg-background/80";
  } else if (backgroundStyle === "custom") {
    textClass = "text-foreground";
    iconClass = "text-primary";
    linkClass = "text-muted-foreground hover:text-primary";
    linkHoverClass = "hover:text-primary";
    sectionBgClass = customBackgroundClass;
  }

  return (
    <footer
      className={\`relative z-0 w-full px-4 py-10 \${bgClass} \${borderClass} transition-all duration-300 \${sectionBgClass}\`}
      role="contentinfo"
    >
      {backgroundStyle === "dark-abstract" && abstractBg}
      <div className={\`relative z-10 max-w-7xl mx-auto flex flex-col gap-8\`}>
        <div className={\`flex flex-col gap-2 \${alignClass}\`}>
          <div className="flex justify-center md:justify-start">
            <img src={logo.src} alt={logo.alt || "Logo"} className="h-10" />
          </div>
          {description && (
            <p className={\`text-sm max-w-md mx-auto md:mx-0 \${textClass} opacity-80\`}>{description}</p>
          )}
        </div>
        <div className={\`grid \${gridCols} gap-8 md:gap-12 transition-all duration-300\`}>
          {columns.slice(0, 5).map((col, idx) => (
            <div key={col.title + idx} className="flex flex-col gap-3">
              <div className="flex items-center gap-2 mb-1">
                {col.icon && iconMap[col.icon] && (
                  <span className={\`text-lg \${iconClass}\`}>{iconMap[col.icon]}</span>
                )}
                <span className={\`font-semibold tracking-wide \${textClass}\`}>{col.title}</span>
              </div>
              <ul className="space-y-2">
                {col.links.map((link, lidx) => (
                  <li key={link.label + lidx}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={\`inline-block relative group \${linkClass} transition-colors duration-200\`}
                    >
                      <span className={\`transition-transform duration-200 hover:translate-x-1 \${linkHoverClass}\`}>{link.label}</span>
                      <span className="block h-0.5 bg-gradient-to-r from-pink-400 via-blue-400 to-purple-400 rounded-full scale-x-0 hover:scale-x-100 transition-transform duration-300 origin-left mt-0.5" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {(socialIcons?.length || bottomNote) && (
          <div className="flex flex-col md:flex-row md:justify-between items-center gap-4 pt-8 border-t border-zinc-200 dark:border-zinc-700 mt-8">
            {bottomNote && (
              <span className={\`text-xs opacity-80 \${textClass}\`}>{bottomNote}</span>
            )}
            {socialIcons && socialIcons.length > 0 && (
              <div className="flex gap-3">
                {socialIcons.map((icon, i) => (
                  <span
                    key={i}
                    className={\`w-8 h-8 flex items-center justify-center rounded-full shadow hover:scale-110 transition-transform duration-200 border border-zinc-200 dark:border-zinc-700 bg-background/80 \${iconClass}\`}
                  >
                    {iconMap[icon] || null}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </footer>
  );
};
`;
}

function generateProductFooter(): string {
  return `
  import React, { useState } from 'react';
import { FaGithub, FaTwitter, FaLinkedin, FaFacebook } from 'react-icons/fa';

// Icon registry for builder-friendly string keys
const logoRegistry: Record<string, React.ReactNode> = {
    default: <img src="/logo.svg" alt="Brand Logo" className="h-9 w-auto" />,
    saas: <img src="/saas-logo.svg" alt="SaaS Logo" className="h-9 w-auto" />,
};
const socialIconRegistry: Record<string, React.ReactNode> = {
    github: <FaGithub />,
    twitter: <FaTwitter />,
    linkedin: <FaLinkedin />,
    facebook: <FaFacebook />,
};

export interface ProductFooterProps {
    logoUrl?: string;
    logoKey?: string;
    logo?: React.ReactNode;
    description?: string;
    socialIconKeys?: string[];
    socialIcons?: React.ReactNode[];
    quickLinks?: { label: string; href: string }[];
    legalLinks?: { label: string; href: string }[];
    onSubscribe?: (email: string) => void;
    newsletterTitle?: string;
    newsletterDescription?: string;
    copyright?: string;
    className?: string;
}

function validateEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const ProductFooter: React.FC<ProductFooterProps> = ({
    logoUrl,
    logoKey,
    logo,
    description,
    socialIconKeys,
    socialIcons,
    quickLinks = [],
    legalLinks = [],
    onSubscribe,
    newsletterTitle = 'Subscribe to our newsletter',
    newsletterDescription = 'Get product updates, company news, and more.',
    copyright,
    className,
}) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Logo resolution: logoUrl > logoKey > logo > default
    const resolvedLogo = logoUrl
        ? <img src={logoUrl} alt="Brand Logo" className="h-9 w-auto" />
        : logoKey
            ? logoRegistry[logoKey] || logoRegistry['default']
            : logo || logoRegistry['default'];
    const resolvedSocialIcons = socialIconKeys
        ? socialIconKeys.map(key => socialIconRegistry[key] || null).filter(Boolean)
        : socialIcons || [socialIconRegistry['github'], socialIconRegistry['twitter'], socialIconRegistry['linkedin']];

    const handleSubscribe = async () => {
        setError(null);
        setSuccess(false);
        if (!validateEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }
        setLoading(true);
        try {
            await onSubscribe?.(email);
            setSuccess(true);
            setEmail('');
        } catch {
            setError('Subscription failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleSubscribe();
    };

    return (
        <footer className={\`w-full bg-neutral-950 text-muted-foreground border-t border-neutral-800 shadow-lg pt-10 pb-4 px-6 md:px-10 \${className || ''}\`}>
            {/* Main grid */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 items-start">
                {/* Left: Logo, description, social */}
                <div className="flex flex-col gap-4 items-start">
                    <div className="flex items-center gap-3">{resolvedLogo}</div>
                    {description && <div className="text-sm text-white/80 max-w-xs">{description}</div>}
                    <div className="flex gap-3 mt-2">
                        {resolvedSocialIcons.map((icon, idx) => (
                            <span
                                key={idx}
                                className="text-xl transition-all text-muted-foreground hover:text-white ease-in-out duration-500 cursor-pointer rounded-lg bg-gradient-to-br from-[#39113D] to-white/10 shadow p-2 hover:scale-110 active:scale-95 focus:outline-none focus:text-white ease-in duration-100 focus:ring-2 focus:ring-fuchsia-500"
                                tabIndex={0}
                                style={{
                                    backdropFilter: 'blur(8px)',
                                    WebkitBackdropFilter: 'blur(8px)',
                                    transition: 'transform 0.18s cubic-bezier(.4,2,.6,1)',
                                }}
                            >
                                {icon}
                            </span>
                        ))}
                    </div>
                </div>
                {/* Center: Quick links */}
                <div className="flex flex-col gap-2 items-start md:items-center">
                    <div>
                        <div className="font-semibold text-white mb-2">Quick Links</div>
                        <div className="flex flex-col gap-1 md:gap-2">
                            {quickLinks.map(link => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className="hover:text-white text-white/70 transition-colors text-sm"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
                {/* Right: Newsletter */}
                <div className="flex flex-col gap-2 items-start md:items-end w-full">
                    <div className="font-semibold text-white mb-2">{newsletterTitle}</div>
                    <div className="text-xs text-white/60 mb-2">{newsletterDescription}</div>
                    <div className="flex flex-col sm:flex-row gap-2 w-fit max-w-xs">
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Enter your email"
                            className="flex-1 bg-neutral-900 border border-neutral-700 text-sm text-white rounded-md px-4 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 shadow-sm transition placeholder:text-neutral-500"
                            disabled={loading}
                            aria-label="Email address"
                        />
                        <button
                            type="button"
                            onClick={handleSubscribe}
                            disabled={loading}
                            className="h-10 px-5 rounded-md bg-fuchsia-600 hover:bg-fuchsia-700 text-white text-sm font-medium shadow-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
                            style={{ minWidth: 110 }}
                        >
                            {loading ? 'Subscribing...' : 'Subscribe'}
                        </button>
                    </div>
                    {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
                    {success && <div className="text-xs text-green-500 mt-1">Subscribed! Check your inbox.\`\&quot;\`</div>}
                </div>
            </div>
            {/* Bottom row: Legal links and copyright */}
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 border-t border-neutral-800 mt-8 pt-4 text-xs text-white/60">
                <div className="flex gap-4 flex-wrap mb-1 md:mb-0">
                    {legalLinks.map(link => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="hover:text-white/90 transition-all ease-in"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>
                <div className="text-xs">{copyright || \`© \${new Date().getFullYear()} All rights reserved.\`}</div>
            </div>
        </footer>
    );
};
  `
}

function generateNewsletterFooter(): string {
  return `
  import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

export interface NewsletterFooterProps {
  onSubscribe?: (email: string) => void;
  title?: string;
  description?: string;
  socialIcons?: React.ReactNode[];
  legalLinks?: { label: string; href: string }[];
  className?: string;
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Framer Motion 3D Social Icon
const MotionSocialIcon: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isHover, setIsHover] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [0, 1], [0, 10]);
  const rotateY = useTransform(x, [0, 1], [0, -10]);

  function handleMouseMove(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    x.set(px);
    y.set(py);
    setIsHover(true);
  }
  function handleMouseLeave() {
    setIsHover(false);
    x.set(0.5);
    y.set(0.5);
  }

  return (
    <motion.span
      className="inline-flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer text-3xl shadow-lg bg-gradient-to-br from-white/5 to-black/10 rounded-xl"
      style={{
        perspective: 400,
        boxShadow: isHover
          ? '0 8px 32px 0 rgba(0,0,0,0.25), 0 2px 8px 0 rgba(0,0,0,0.15)'
          : '0 2px 8px 0 rgba(0,0,0,0.10)',
        transformStyle: 'preserve-3d',
      }}
      animate={isHover ? { scale: 1.13 } : { scale: 1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ scale: 1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <motion.span
        style={{
          rotateX: isHover ? rotateX : 0,
          rotateY: isHover ? rotateY : 0,
          display: 'inline-flex',
        }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
};

export const NewsletterFooter: React.FC<NewsletterFooterProps> = ({
  onSubscribe,
  title = 'Stay in the loop',
  description,
  socialIcons = [],
  legalLinks = [],
  className,
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubscribe = async () => {
    setError(null);
    setSuccess(false);
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    try {
      await onSubscribe?.(email);
      setSuccess(true);
      setEmail('');
    } catch {
      setError('Subscription failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubscribe();
    }
  };

  return (
    <footer
      className={\`w-full bg-neutral-900 text-muted-foreground py-10 px-6 ring-offset-background \${className || ''}\`}
    >
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left: Call to action */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-2">{title}</h2>
          {description && <p className="text-sm text-white text-muted-foreground mb-2">{description}</p>}
        </div>
        {/* Right: Input + Button */}
        <div>
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter your email"
              className="flex-1 bg-neutral-950 border border-neutral-800 text-sm text-white rounded-md px-4 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 shadow-sm transition placeholder:text-neutral-500"
              disabled={loading}
              aria-label="Email address"
            />
            <motion.button
              type="button"
              onClick={handleSubscribe}
              disabled={loading}
              className="h-10 px-5 rounded-md bg-primary border-1 border-white/20 hover:border-white text-white text-sm font-medium shadow-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 hover:bg-primary/90"
              style={{ minWidth: 110 }}
              whileHover={!loading ? { scale: 1.07, boxShadow: '0 4px 24px 0 rgba(0,0,0,0.18)' } : {}}
              whileTap={!loading ? { scale: 0.97 } : {}}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {loading ? 'Subscribing...' : 'Subscribe'}
            </motion.button>
          </div>
          {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
          {success && <div className="text-xs text-green-500 mt-1">Subscribed! Check your inbox.\`\&quot;\`</div>}
        </div>
      </div>
      {(!!socialIcons.length || !!legalLinks.length) && (
        <div className="mt-8 flex flex-col items-center gap-4 border-t border-neutral-800 pt-6">
          {socialIcons.length > 0 && (
            <div className="flex gap-6 justify-center">
              {socialIcons.map((icon, idx) => (
                <MotionSocialIcon key={idx}>{icon}</MotionSocialIcon>
              ))}
            </div>
          )}
          {legalLinks.length > 0 && (
            <div className="flex gap-4 flex-wrap text-xs text-white text-muted-foreground justify-center">
              {legalLinks.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  className="hover:underline hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </footer>
  );
};
  `
}

function generateAppDownloadFooter(): string {
  return `
  import React from 'react';
import { FaGithub, FaTwitter, FaLinkedin, FaInstagram, FaFacebook, FaApple, FaGooglePlay } from 'react-icons/fa';

const logoRegistry: Record<string, React.ReactNode> = {
  default: <img src="/logo.svg" alt="Brand Logo" className="h-10 w-auto" />,
  ardacity: <img src="/ArDacitypfp.png" alt="ArDacity Logo" className="h-10 w-auto" />,
  apple: <FaApple className="h-10 w-auto text-white" />,
};
const socialIconRegistry: Record<string, React.ReactNode> = {
  github: <FaGithub />,
  twitter: <FaTwitter />,
  linkedin: <FaLinkedin />,
  instagram: <FaInstagram />,
  facebook: <FaFacebook />,
  googlePlay: <FaGooglePlay/>,
};

export interface AppDownloadFooterProps {
  logoKey?: string;
  socialIconKeys?: string[];
  logoUrl?: string;
  logo?: React.ReactNode;
  tagline?: string;
  appStoreLink?: string;
  playStoreLink?: string;
  quickLinks?: { label: string; href: string }[];
  socialIcons?: React.ReactNode[];
  darkTheme?: boolean;
  motionDecor?: boolean;
  className?: string;
}

const AppStoreBadge = () => (
  <svg viewBox="0 0 120 40" className="h-10 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="40" rx="8" fill="#111" />
    <text x="20" y="25" fill="#fff" fontSize="14" fontFamily="sans-serif">App Store</text>
  </svg>
);
const PlayStoreBadge = () => (
  <svg viewBox="0 0 120 40" className="h-10 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="40" rx="8" fill="#111" />
    <text x="16" y="25" fill="#fff" fontSize="14" fontFamily="sans-serif">Google Play</text>
  </svg>
);

export const AppDownloadFooter: React.FC<AppDownloadFooterProps> = ({
  logoKey,
  socialIconKeys,
  logoUrl,
  logo,
  tagline,
  appStoreLink,
  playStoreLink,
  quickLinks = [],
  socialIcons,
  darkTheme = true,
  motionDecor = false,
  className,
}) => {
  // Priority: logoUrl > logoKey > logo > default
  const resolvedLogo = logoUrl
    ? <img src={logoUrl} alt="Brand Logo" className="h-10 w-auto" />
    : logoKey
      ? logoRegistry[logoKey] || logoRegistry['default']
      : logo || logoRegistry['default'];
  const resolvedSocialIcons = socialIconKeys
    ? socialIconKeys.map(key => socialIconRegistry[key] || null).filter(Boolean)
    : socialIcons || [socialIconRegistry['github'], socialIconRegistry['twitter'], socialIconRegistry['facebook']];

  return (
    <footer
      className={\`relative w-full overflow-hidden py-10 px-6 md:px-10 border border-neutral-800 \${darkTheme ? 'bg-neutral-900 text-muted-foreground' : 'bg-white text-gray-700'} \${className || ''}\`}
    >
      {motionDecor && (
        <>
          <div className="pointer-events-none absolute -top-20 -left-20 w-72 h-72 bg-fuchsia-700/30 blur-3xl rounded-full animate-float-slow z-0" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 w-80 h-80 bg-cyan-600/20 blur-3xl rounded-full animate-float-slower z-0" />
        </>
      )}
      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="flex flex-col gap-4 items-start">
          <div className="flex items-center gap-3">{resolvedLogo}</div>
          {tagline && <div className="text-base md:text-lg font-medium text-white/90 mb-1">{tagline}</div>}
          <div className="flex gap-3 mt-2">
            {appStoreLink && (
              <a href={appStoreLink} target="_blank" rel="noopener noreferrer" className="hover:scale-105 active:scale-95 transition-transform">
                <AppStoreBadge />
              </a>
            )}
            {playStoreLink && (
              <a href={playStoreLink} target="_blank" rel="noopener noreferrer" className="hover:scale-105 active:scale-95 transition-transform">
                <PlayStoreBadge />
              </a>
            )}
          </div>
        </div>
        {/* Right Section */}
        <div className="flex flex-col md:items-end items-start gap-4 w-full">
          {quickLinks.length > 0 && (
            <div className="flex flex-wrap gap-4 text-sm font-medium">
              {quickLinks.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  className="hover:text-white text-white/70 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
          {resolvedSocialIcons.length > 0 && (
            <div
              className="flex gap-4 mt-2 py-2 rounded-xl shadow-xl"
              style={{
                boxShadow: '0 8px 32px 0 rgba(0,0,0,0.18)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
              }}
            >
              {resolvedSocialIcons.map((icon, idx) => (
                <span
                  key={idx}
                  className="text-2xl text-muted-foreground hover:text-white transition-all cursor-pointer rounded-lg bg-gradient-to-br from-[#39113D] to-white/10 shadow-md p-2 hover:scale-110 active:scale-95 focus:outline-none focus:text-white ease-in duration-100 focus:ring-2 focus:ring-fuchsia-500"
                  tabIndex={0}
                  style={{
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    transition: 'transform 0.18s cubic-bezier(.4,2,.6,1)',
                  }}
                >
                  {icon}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      <style>{\`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-16px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-slow { animation: float 12s ease-in-out infinite; }
        .animate-float-slower { animation: float 18s ease-in-out infinite; }
      \`}</style>
    </footer>
  );
};
  `
}

function generateFooter(): string {
  return `
  import React from "react"

interface FooterLink {
  label: string
  href: string
}

interface FooterProps {
  copyright?: string
  links?: FooterLink[]
  className?: string
}

const Footer: React.FC<FooterProps> = ({
  copyright = "© 2024 Your Company. All rights reserved.",
  links = [],
  className = ""
}) => {
  return (
    <footer className={\`bg-zinc-900 text-white py-4 text-center \${className}\`}>
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-2 px-4">
        <div className="text-zinc-400 text-sm">{copyright}</div>
        {links.length > 0 && (
          <nav className="flex flex-wrap gap-4 justify-center md:justify-end">
            {links.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                className="text-zinc-300 hover:text-white transition-colors text-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </footer>
  )
}

export default Footer
`
}

function generateLiquidNavbar(): string {
  return `
  "use client"

import type React from "react"
import { memo, useCallback, useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { animate } from "framer-motion"

interface LiquidGlassNavbarProps {
  brand: string
  links: Array<{ label: string; href: string }>
  cta?: { label: string; href: string }
  className?: string
  scrollTargetId?: string
}

const GlowingEffect = memo(
  ({
    blur = 0,
    inactiveZone = 0.01,
    proximity = 64,
    spread = 40,
    variant = "default",
    glow = true,
    className,
    disabled = false,
    movementDuration = 2,
    borderWidth = 1,
  }: {
    blur?: number
    inactiveZone?: number
    proximity?: number
    spread?: number
    variant?: "default" | "white"
    glow?: boolean
    className?: string
    disabled?: boolean
    movementDuration?: number
    borderWidth?: number
  }) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const lastPosition = useRef({ x: 0, y: 0 })
    const animationFrameRef = useRef<number>(0)

    const handleMove = useCallback(
      (e?: MouseEvent | { x: number; y: number }) => {
        if (!containerRef.current) return
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }
        animationFrameRef.current = requestAnimationFrame(() => {
          const element = containerRef.current
          if (!element) return
          const { left, top, width, height } = element.getBoundingClientRect()
          const mouseX = e?.x ?? lastPosition.current.x
          const mouseY = e?.y ?? lastPosition.current.y
          if (e) {
            lastPosition.current = { x: mouseX, y: mouseY }
          }
          const center = [left + width * 0.5, top + height * 0.5]
          const distanceFromCenter = Math.hypot(mouseX - center[0], mouseY - center[1])
          const inactiveRadius = 0.5 * Math.min(width, height) * inactiveZone
          if (distanceFromCenter < inactiveRadius) {
            element.style.setProperty("--active", "0")
            return
          }
          const isActive =
            mouseX > left - proximity &&
            mouseX < left + width + proximity &&
            mouseY > top - proximity &&
            mouseY < top + height + proximity
          element.style.setProperty("--active", isActive ? "1" : "0")
          if (!isActive) return
          const currentAngle = Number.parseFloat(element.style.getPropertyValue("--start")) || 0
          const targetAngle = (180 * Math.atan2(mouseY - center[1], mouseX - center[0])) / Math.PI + 90
          const angleDiff = ((targetAngle - currentAngle + 180) % 360) - 180
          const newAngle = currentAngle + angleDiff
          animate(currentAngle, newAngle, {
            duration: movementDuration,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (value) => {
              element.style.setProperty("--start", String(value))
            },
          })
        })
      },
      [inactiveZone, proximity, movementDuration],
    )

    useEffect(() => {
      if (disabled) return
      const handleScroll = () => handleMove()
      const handlePointerMove = (e: PointerEvent) => handleMove(e)
      window.addEventListener("scroll", handleScroll, { passive: true })
      document.body.addEventListener("pointermove", handlePointerMove, {
        passive: true,
      })
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }
        window.removeEventListener("scroll", handleScroll)
        document.body.removeEventListener("pointermove", handlePointerMove)
      }
    }, [handleMove, disabled])

    return (
      <>
        <div
          className={cn(
            "pointer-events-none absolute -inset-px hidden rounded-[inherit] border opacity-0 transition-opacity",
            glow && "opacity-100",
            variant === "white" && "border-white",
            disabled && "!block",
          )}
        />
        <div
          ref={containerRef}
          style={
            {
              "--blur": \`\${blur}px\`,
              "--spread": spread,
              "--start": "0",
              "--active": "0",
              "--glowingeffect-border-width": \`\${borderWidth}px\`,
              "--repeating-conic-gradient-times": "5",
              "--gradient":
                variant === "white"
                  ? \`repeating-conic-gradient(
                  from 236.84deg at 50% 50%,
                  var(--black),
                  var(--black) calc(25% / var(--repeating-conic-gradient-times))
                )\`
                  : \`radial-gradient(circle, #dd7bbb 10%, #dd7bbb00 20%),
                radial-gradient(circle at 40% 40%, #d79f1e 5%, #d79f1e00 15%),
                radial-gradient(circle at 60% 60%, #5a922c 10%, #5a922c00 20%),
                 radial-gradient(circle at 40% 60%, #4c7894 10%, #4c789400 20%),
                repeating-conic-gradient(
                  from 236.84deg at 50% 50%,
                  #dd7bbb 0%,
                  #d79f1e calc(25% / var(--repeating-conic-gradient-times)),
                  #5a922c calc(50% / var(--repeating-conic-gradient-times)),
                   #4c7894 calc(75% / var(--repeating-conic-gradient-times)),
                  #dd7bbb calc(100% / var(--repeating-conic-gradient-times))
                )\`,
            } as React.CSSProperties
          }
          className={cn(
            "pointer-events-none absolute inset-0 rounded-[inherit] opacity-100 transition-opacity",
            glow && "opacity-100",
            blur > 0 && "blur-[var(--blur)] ",
            className,
            disabled && "!hidden",
          )}
        >
          <div
            className={cn(
              "glow",
              "rounded-[inherit]",
              'after:content-[""] after:rounded-[inherit] after:absolute after:inset-[calc(-1*var(--glowingeffect-border-width))]',
              "after:[border:var(--glowingeffect-border-width)_solid_transparent]",
              "after:[background:var(--gradient)] after:[background-attachment:fixed]",
              "after:opacity-[var(--active)] after:transition-opacity after:duration-300",
              "after:[mask-clip:padding-box,border-box]",
              "after:[mask-composite:intersect]",
              "after:[mask-image:linear-gradient(#0000,#0000),conic-gradient(from_calc((var(--start)-var(--spread))*1deg),#00000000_0deg,#fff,#00000000_calc(var(--spread)*2deg))]",
            )}
          />
        </div>
      </>
    )
  },
)

GlowingEffect.displayName = "GlowingEffect"

export function LiquidGlassNavbar({ brand, links, cta, className, scrollTargetId }: LiquidGlassNavbarProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const scrollTarget = scrollTargetId ? document.getElementById(scrollTargetId) : window;
    const onScroll = () => {
      const scrollY = scrollTarget === window ? window.scrollY : (scrollTarget as HTMLElement).scrollTop;
      setScrolled(scrollY > 30);
    };
    if (scrollTarget) {
      scrollTarget.addEventListener("scroll", onScroll);
    }
    return () => {
      if (scrollTarget) {
        scrollTarget.removeEventListener("scroll", onScroll);
      }
    };
  }, [scrollTargetId]);
  return (
    <>
      <svg style={{ display: "none" }}>
        <filter id="glass-distortion-card" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox">
          <feTurbulence type="fractalNoise" baseFrequency="0.002 0.008" numOctaves="2" seed="17" result="turbulence" />
          <feComponentTransfer in="turbulence" result="mapped">
            <feFuncR type="gamma" amplitude="1.2" exponent="8" offset="0.4" />
            <feFuncG type="gamma" amplitude="0.1" exponent="1" offset="0.1" />
            <feFuncB type="gamma" amplitude="0.1" exponent="1" offset="0.6" />
          </feComponentTransfer>
          <feGaussianBlur in="turbulence" stdDeviation="4" result="softMap" />
          <feSpecularLighting
            in="softMap"
            surfaceScale="8"
            specularConstant="1.5"
            specularExponent="120"
            lightingColor="white"
            result="specLight"
          >
            <fePointLight x="-150" y="-150" z="400" />
          </feSpecularLighting>
          <feComposite in="specLight" operator="arithmetic" k1="0" k2="1.2" k3="1.2" k4="0" result="litImage" />
          <feDisplacementMap in="SourceGraphic" in2="softMap" scale="300" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <div className={cn("fixed top-0 left-0 transform mx-auto z-50 transition-all duration-500 ease-in-out", scrolled ? "w-[60%]" : "w-full", className)}>
        <div className={cn("liquidGlass-wrapper relative flex font-semibold overflow-hidden text-black cursor-pointer p-2 hover:p-[10px] hover:scale-[1] hover:shadow-[0_12px_24px_rgba(0,0,0,0.2)] transition-all duration-[400ms] ease-[cubic-bezier(0.175,0.885,0.32,2.2)]" ,scrolled ? "rounded-full" : "rounded-none")}>
          <div className={cn("liquidGlass-effect absolute z-0 inset-0 [backdrop-filter:blur(3px)] [filter:url(#glass-distortion-card)] overflow-hidden [isolation:isolate]" ,scrolled ? "rounded-full" : "rounded-none")} />
          <div className={cn("liquidGlass-tint z-[1] absolute inset-0 bg-white/[0.048]" ,scrolled ? "rounded-full" : "rounded-none")} />
          <div className={cn("liquidGlass-shine absolute inset-0 z-[2] overflow-hidden shadow-[inset_2px_2px_1px_0_rgba(255,255,255,0.5),inset_-1px_-1px_1px_1px_rgba(255,255,255,0.5)]" ,scrolled ? "rounded-full" : "rounded-none")} />

          <div className="relative z-[3] flex items-center justify-between w-full px-6 py-3">
            <div className="text-xl font-bold tracking-tight text-white dark:text-zinc-100 drop-shadow-md">
              {brand}
            </div>
            <nav className="hidden md:flex gap-6 text-sm font-medium text-zinc-700 dark:text-zinc-200">
              {links.map((link, i) => (
                <a key={i} href={link.href} text-white className="hover:text-purple-500 transition-all hover:scale-110 bg-white/10 hover:border-1 hover:border-white/70  px-3 py-1 rounded-full">
                  {link.label}
                </a>
              ))}
            </nav>
            {cta && (
              <div className="flex-shrink-0">
                <a
                  href={cta.href}
                  className="bg-primary text-black px-4 py-2 bg-white rounded-full text-sm shadow hover:scale-105 transition-transform duration-200"
                >
                  {cta.label}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
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
  return `
  "use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import React from "react"

interface NftThemeHeroProps {
  title?: string
  description?: string
  backgroundImage?: string
  gradientFrom?: string
  gradientVia?: string
  gradientTo?: string
  showButtons?: boolean
  primaryBtnText?: string
  // primaryBtnAction?: () => void
  secondaryBtnText?: string
  // secondaryBtnAction?: () => void
  secondaryBtnVariant?: "outline" | "ghost" | "default"
  animate?: boolean
  customClassName?: string
  children?: React.ReactNode
}

export function NftThemeHero({
  title = "NFT Collection",
  description = "Discover unique digital assets",
  backgroundImage = "/placeholder.svg?height=1080&width=1920",
  gradientFrom = "purple-900",
  gradientVia = "blue-900",
  gradientTo = "indigo-900",
  showButtons = true,
  primaryBtnText = "Explore Collection",
  // primaryBtnAction,
  secondaryBtnText = "Create NFT",
  // secondaryBtnAction,
  secondaryBtnVariant = "outline",
  animate = true,
  customClassName = "",
  children,
}: NftThemeHeroProps) {
  const Wrapper = animate ? motion.div : "div"

  return (
    <div
      className={\`relative min-h-screen bg-gradient-to-br from-\${gradientFrom} via-\${gradientVia} to-\${gradientTo} flex items-center justify-center overflow-hidden \${customClassName}\`}
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: \`url(\${backgroundImage})\` }}
      />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <Wrapper
          {...(animate && {
            initial: { opacity: 0, y: 50 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.8 },
          })}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
            {title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">{description}</p>

          {showButtons && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                // onClick={primaryBtnAction}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
              >
                {primaryBtnText}
              </Button>
              <Button
                size="lg"
                variant={secondaryBtnVariant}
                // onClick={secondaryBtnAction}
                className={
                  secondaryBtnVariant === "outline"
                    ? "border-white text-black hover:bg-white hover:text-black"
                    : ""
                }
              >
                {secondaryBtnText}
              </Button>
            </div>
          )}

          {children && <div className="mt-8">{children}</div>}
        </Wrapper>
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

function generateArweaveChatroom(): string {
  return `
   "use client"
   
   import type React from "react"
   
   import { useState, useEffect, useRef, useCallback } from "react"
  //  import io, { type Socket } from "socket.io-client"
   import io from "socket.io-client"
   import type { Socket } from "socket.io-client"
   import { Button } from "@/components/ui/button"
   import { Input } from "@/components/ui/input"
   import { Card } from "@/components/ui/card"
   import { ScrollArea } from "@/components/ui/scroll-area"
   import { Badge } from "@/components/ui/badge"
   import { Send, Smile } from "lucide-react"
   
   interface Message {
     id: string
     username: string
     text: string
     timestamp: string
     isSystem?: boolean
   }
   
   interface ChatRoomProps {
     serverUrl?: string
     className?: string
     quickMessages?: string[]
   }
   
   export function ChatRoom({
     serverUrl = "https://ardacity-backrooms.onrender.com",
     className = "",
     quickMessages = ["ggs", "nice play", "let's play again", "good luck", "well played"],
   }: ChatRoomProps) {
    //  const [socket, setSocket] = useState<Socket | null>(null)
     const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null)
     const [messages, setMessages] = useState<Message[]>([])
     const [currentMessage, setCurrentMessage] = useState("")
     const [username, setUsername] = useState("")
     const [currentUsername, setCurrentUsername] = useState("")
     const [isConnected, setIsConnected] = useState(false)
     const [hasJoined, setHasJoined] = useState(false)
     const [showEmojiPicker, setShowEmojiPicker] = useState(false)
   
     const messagesEndRef = useRef<HTMLDivElement>(null)
     const messageInputRef = useRef<HTMLInputElement>(null)
   
     const scrollToBottom = useCallback(() => {
       messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
     }, [])
   
     useEffect(() => {
       scrollToBottom()
     }, [messages, scrollToBottom])
   
     const addMessage = useCallback((message: Message) => {
       setMessages((prev) => {
         const newMessages = [...prev, message]
         // Keep only last 100 messages
         return newMessages.slice(-100)
       })
     }, [])
   
     const addSystemMessage = useCallback((text: string) => {
       addMessage({
         id: Date.now().toString(),
         username: "System",
         text,
         timestamp: new Date().toISOString(),
         isSystem: true,
       })
     }, [addMessage])
   
     useEffect(() => {
       const newSocket = io(serverUrl, {
         transports: ["websocket", "polling"],
       })
       setSocket(newSocket)
   
       newSocket.on("connect", () => {
         setIsConnected(true)
         if (hasJoined) {
           addSystemMessage("Connected to chat server")
         }
       })
   
       newSocket.on("disconnect", () => {
         setIsConnected(false)
         addSystemMessage("Disconnected from chat server")
       })
   
       newSocket.on("message", (message: Omit<Message, "id">) => {
         addMessage({
           ...message,
           id: Date.now().toString() + Math.random(),
         })
       })
   
       newSocket.on("connect_error", (error: unknown) => {
         console.error("Connection error:", error)
         setIsConnected(false)
       })
   
       return () => {
         newSocket.close()
       }
     }, [serverUrl, hasJoined, addSystemMessage, addMessage])
   
     const handleJoinChat = (e: React.FormEvent) => {
       e.preventDefault()
       if (username.trim() && socket) {
         setCurrentUsername(username.trim())
         socket.emit("register", username.trim())
         setHasJoined(true)
         addSystemMessage("Connected to ArDacity chat")
         messageInputRef.current?.focus()
       }
     }
   
     const handleSendMessage = (e: React.FormEvent) => {
       e.preventDefault()
       if (currentMessage.trim() && currentUsername && socket) {
         const messageData = {
           username: currentUsername,
           text: currentMessage.trim(),
           timestamp: new Date().toISOString(),
         }
   
         // Add message locally first
         addMessage({
           ...messageData,
           id: Date.now().toString(),
         })
   
         // Send to server
         socket.emit("message", messageData)
         setCurrentMessage("")
       }
     }
   
     const handleEmojiSelect = (emoji: string) => {
       setCurrentMessage((prev) => prev + emoji)
       setShowEmojiPicker(false)
       messageInputRef.current?.focus()
     }
   
     const handleQuickMessage = (message: string) => {
       if (currentUsername && socket) {
         const messageData = {
           username: currentUsername,
           text: message,
           timestamp: new Date().toISOString(),
         }
   
         addMessage({
           ...messageData,
           id: Date.now().toString(),
         })
   
         socket.emit("message", messageData)
       }
     }
   
     const formatTime = (timestamp: string) => {
       return new Date(timestamp).toLocaleTimeString([], {
         hour: "2-digit",
         minute: "2-digit",
       })
     }
   
     if (!hasJoined) {
       return (
         <Card
           className={\`w-full max-w-md mx-auto bg-black border-0 relative overflow-hidden \${className}\`}
           style={{}}
         >
           {/* Neon Gradient Border */}
           <div
             aria-hidden
             className="pointer-events-none absolute inset-0 z-0 rounded-2xl"
             style={{
           padding: 2,
           background: "linear-gradient(135deg, #00ffe7 0%, #ff00e0 100%)",
           WebkitMask:
             "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
           WebkitMaskComposite: "xor",
           maskComposite: "exclude",
             }}
           />
           <div className="relative z-10 p-6 text-center">
             <h2 className="text-2xl font-bold text-white mb-6">Join ArDacity Chat</h2>
             <form onSubmit={handleJoinChat} className="space-y-4">
           <Input
             type="text"
             placeholder="Enter your username"
             value={username}
             onChange={(e) => setUsername(e.target.value)}
             className="bg-zinc-900 border-zinc-700 text-white placeholder-zinc-400"
             maxLength={20}
             required
           />
           <Button
             type="submit"
             className="w-full bg-white text-black hover:bg-zinc-200"
             disabled={!username.trim() || !isConnected}
           >
             {isConnected ? "Join Chat" : "Connecting..."}
           </Button>
             </form>
             <div className="mt-4">
           <Badge variant={isConnected ? "default" : "destructive"} className="text-xs">
             {isConnected ? "Connected" : "Connecting..."}
           </Badge>
             </div>
           </div>
         </Card>
       )
     }
   
     return (
       <Card className={\`w-full max-w-4xl mx-auto bg-black border-4 border-white/50 \${className}\`}>
         
         {/* Header</Card> */}
         <div className="flex items-center justify-between p-4 border-b border-zinc-800">
           <div className="flex items-center gap-2">
             <h2 className="text-xl font-bold text-white">ArDacity Chat</h2>
             <Badge variant={isConnected ? "default" : "destructive"} className="text-xs">
               {isConnected ? "Connected" : "Disconnected"}
             </Badge>
           </div>
           <div className="text-zinc-400 text-sm">Welcome, {currentUsername}</div>
         </div>
   
         {/* Messages Area */}
         <ScrollArea className="h-96 p-4">
           <div className="space-y-4">
             {messages.map((message) => (
               <div
                 key={message.id}
                 className={\`flex \${
                   message.isSystem
                     ? "justify-center"
                     : message.username === currentUsername
                       ? "justify-end"
                       : "justify-start"
                 }\`}
               >
                 {message.isSystem ? (
                   <div className="text-center">
                     <Badge variant="secondary" className="bg-zinc-800 text-zinc-400 text-xs">
                       {message.text}
                     </Badge>
                   </div>
                 ) : (
                   <div
                     className={\`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl \${
                       message.username === currentUsername
                         ? "bg-white text-black rounded-br-sm"
                         : "bg-zinc-900 text-white rounded-bl-sm"
                     }\`}
                   >
                     {message.username !== currentUsername && (
                       <div className="text-xs text-zinc-400 mb-1 font-medium">{message.username}</div>
                     )}
                     <div className="break-words">{message.text}</div>
                     <div
                       className={\`text-xs mt-1 \${
                         message.username === currentUsername ? "text-zinc-600" : "text-zinc-500"
                       }\`}
                     >
                       {formatTime(message.timestamp)}
                     </div>
                   </div>
                 )}
               </div>
             ))}
   
             <div ref={messagesEndRef} />
           </div>
         </ScrollArea>
   
         {/* Quick Messages */}
         <div className="px-4 py-2 border-t border-zinc-800">
           <QuickMessages messages={quickMessages} onSelect={handleQuickMessage} />
         </div>
   
         {/* Message Input */}
         <div className="p-4 border-t border-zinc-800">
           <form onSubmit={handleSendMessage} className="flex gap-2">
             <div className="flex-1 relative">
               <Input
                 ref={messageInputRef}
                 type="text"
                 placeholder="Type a message..."
                 value={currentMessage}
                 onChange={(e) => setCurrentMessage(e.target.value)}
                 className="bg-zinc-900 border-zinc-700 text-white placeholder-zinc-400 pr-10"
                 maxLength={500}
                 disabled={!isConnected}
               />
               <Button
                 type="button"
                 variant="ghost"
                 size="sm"
                 className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-zinc-400 hover:text-white"
                 onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                 disabled={!isConnected}
               >
                 <Smile className="w-4 h-4" />
               </Button>
             </div>
             <Button
               type="submit"
               className="bg-white text-black hover:bg-zinc-200"
               disabled={!currentMessage.trim() || !isConnected}
             >
               <Send className="w-4 h-4" />
             </Button>
           </form>
   
           {/* Emoji Picker */}
           {showEmojiPicker && (
             <div className="absolute bottom-20 right-4 z-50">
               <EmojiPicker onSelect={handleEmojiSelect} onClose={() => setShowEmojiPicker(false)} />
             </div>
           )}
         </div>
       </Card>
     )
   }
   
   // Internal QuickMessages component
   interface QuickMessagesProps {
     messages: string[]
     onSelect: (message: string) => void
   }
   
   function QuickMessages({ messages, onSelect }: QuickMessagesProps) {
     return (
       <div className="flex flex-wrap gap-2">
         <span className="text-xs text-zinc-500 self-center">Quick:</span>
         {messages.map((message, index) => (
           <Badge
             key={index}
             variant="secondary"
             className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 cursor-pointer transition-colors text-xs px-2 py-1"
             onClick={() => onSelect(message)}
           >
             {message}
           </Badge>
         ))}
       </div>
     )
   }
   
   // Internal EmojiPicker component
   interface EmojiPickerProps {
     onSelect: (emoji: string) => void
     onClose: () => void
   }
   
   const EMOJI_CATEGORIES = {
     Smileys: [
       "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩", "🥳",
     ],
     Gestures: [
       "👍", "👎", "👌", "🤌", "🤏", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "🖕", "👇", "☝️", "👏", "🙌", "👐", "🤲", "🤝", "🙏",
     ],
     Gaming: [
       "🎮", "🕹️", "🎯", "🎲", "🃏", "🎰", "🎳", "⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱", "🏓", "🏸", "🏒", "🏑", "🥍", "🏏", "🥅", "⛳",
     ],
     Hearts: [
       "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟",
     ],
     Fire: [
       "🔥", "💥", "⭐", "🌟", "✨", "💫", "⚡", "💯", "🚀", "🎉", "🎊", "🏆", "🥇", "🥈", "🥉", "🏅", "🎖️", "👑", "💎", "💰",
     ],
   }
   
   function EmojiPicker({ onSelect, onClose }: EmojiPickerProps) {
     return (
       <Card className="bg-zinc-900 border-zinc-700 p-4 w-80 max-h-64 overflow-y-auto">
         <div className="space-y-3">
           {Object.entries(EMOJI_CATEGORIES).map(([category, emojis]) => (
             <div key={category}>
               <h4 className="text-xs font-medium text-zinc-400 mb-2">{category}</h4>
               <div className="grid grid-cols-8 gap-1">
                 {emojis.map((emoji) => (
                   <Button
                     key={emoji}
                     variant="ghost"
                     size="sm"
                     className="h-8 w-8 p-0 hover:bg-zinc-800 text-lg"
                     onClick={() => onSelect(emoji)}
                   >
                     {emoji}
                   </Button>
                 ))}
               </div>
             </div>
           ))}
         </div>
         <div className="mt-3 pt-3 border-t border-zinc-700">
           <Button variant="ghost" size="sm" onClick={onClose} className="w-full text-zinc-400 hover:text-white">
             Close
           </Button>
         </div>
       </Card>
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
