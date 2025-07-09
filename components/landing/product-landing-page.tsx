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
                transform: `scale(${particle.size})`,
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
            style={{ width: `${scrollProgress}%` }}
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
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        activeSection === section ? "bg-white" : "bg-white/30"
                      }`}
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
                    style={{ animationDelay: `${index * 0.1}s` }}
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
                  className={`group p-8 rounded-2xl border border-white/10 hover:border-white/30 transition-all duration-500 transform hover:scale-105 relative overflow-hidden ${
                    currentFeature === index ? "bg-white/5" : "bg-transparent"
                  }`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
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
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      currentFeature === index ? "bg-white w-8" : "bg-white/30"
                    }`}
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
                Don`&apos;`t just take our word for it. Here`&apos;`s what real
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
                  `&quot;`{testimonials?.[currentTestimonial]?.content}`&quot;`
                </p>
              </div>

              <div className="flex justify-center space-x-2 mt-8">
                {testimonials?.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      currentTestimonial === index
                        ? "bg-white w-8"
                        : "bg-white/30"
                    }`}
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
                  className={`relative p-8 rounded-2xl border transition-all duration-500 transform hover:scale-105 ${
                    plan.popular
                      ? "border-white bg-white/5 shadow-2xl"
                      : "border-white/10 hover:border-white/30"
                  }`}
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
                    className={`w-full py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                      plan.popular
                        ? "bg-white text-black hover:bg-gray-200"
                        : "border border-white/30 hover:bg-white/10"
                    }`}
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