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
    <div className={contained ? "rounded-xl border bg-zinc-900 p-4 w-full mx-auto" : "min-h-screen bg-black text-white relative overflow-hidden"}>
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
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: "50px 50px",
              transform: `translateY(${scrollY * 0.1}px)`,
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
              className={`transform transition-all duration-1000 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
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
                  className={`relative group p-8 bg-white/5 backdrop-blur-sm rounded-3xl border transition-all duration-700 transform hover:-translate-y-4 ${
                    activeFeature === index
                      ? "border-white/50 bg-white/10 scale-105"
                      : "border-white/10 hover:border-white/30"
                  }`}
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
                  className={`relative group p-8 bg-white/5 backdrop-blur-sm rounded-3xl border transition-all duration-700 transform hover:-translate-y-6 ${
                    plan.popular ? "border-white/50 bg-white/10 scale-105" : "border-white/10 hover:border-white/30"
                  }`}
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
                      className={`w-full py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                        plan.popular
                          ? "bg-white text-black hover:bg-gray-100"
                          : "bg-white/10 text-white border border-white/30 hover:bg-white/20 hover:border-white/50"
                      }`}
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
                Start Building Tomorrow`&apos;`s Web
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
