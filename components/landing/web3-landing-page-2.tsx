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
    <div className={contained ? "rounded-xl border bg-zinc-900 p-4 w-full mx-auto" : "min-h-screen bg-black text-white relative overflow-hidden"}>
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
            style={{ transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.05}px)` }}
          ></div>
          <div
            className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-white/3 rounded-full blur-3xl animate-pulse delay-1000"
            style={{ transform: `translate(${-scrollY * 0.08}px, ${-scrollY * 0.03}px)` }}
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
                        style={{ animationDelay: `${index * 100}ms` }}
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
                  {/* <div className="absolute inset-0 bg-white transform scale-0 group-hover:scale-100 transition-transform duration-300 origin-bottom-left"></div> */}
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
                <div key={index} className={`relative group ${plan.popular ? "transform scale-105" : ""}`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <span className="bg-white text-black px-6 py-2 text-[0.5rem] font-medium">Most Popular</span>
                    </div>
                  )}
                  <div
                    className={`relative p-8 border-2 bg-black transition-all duration-300 ${
                      plan.popular
                        ? "border-white shadow-lg"
                        : "border-white/10 group-hover:border-white group-hover:shadow-lg"
                    }`}
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
                        className={`w-full py-4 font-medium transition-all duration-300 ${
                          plan.popular
                            ? "bg-white text-black hover:bg-gray-200"
                            : "border-2 border-white text-white hover:bg-white hover:text-black"
                        }`}
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