import React, { useState } from 'react';
import { FaGithub, FaTwitter, FaLinkedin, FaFacebook } from 'react-icons/fa';

// Icon registry for builder-friendly string keys
const logoRegistry: Record<string, React.ReactNode> = {
    default: <img src="/logo.svg" alt="Brand Logo" className="h-10 w-auto" />,
    saas: <img src="/saas-logo.svg" alt="SaaS Logo" className="h-10 w-auto" />,
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
    newsletterTitle = 'Stay Updated',
    newsletterDescription = 'Get the latest product updates and company news.',
    copyright,
    className,
}) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Logo resolution: logoUrl > logoKey > logo > default
    const resolvedLogo = logoUrl
        ? <img src={logoUrl} alt="Brand Logo" className="h-10 w-auto" />
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
        <footer className={`relative w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-300 border-t border-slate-800/50 ${className || ''}`}>
            {/* Professional Grid Background */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
            </div>

            {/* Subtle Accent Lines */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-600/30 to-transparent" />
            </div>

            <div className="relative">
                {/* Main Footer Content */}
                <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-8">
                        
                        {/* Brand Section - Enhanced */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex items-center gap-3">
                                {resolvedLogo}
                            </div>
                            
                            {description && (
                                <p className="text-slate-400 max-w-md leading-relaxed text-sm">
                                    {description}
                                </p>
                            )}

                            {/* Professional Social Icons */}
                            <div className="flex gap-4">
                                {resolvedSocialIcons.map((icon, idx) => (
                                    <button
                                        key={idx}
                                        className="group relative p-3 bg-slate-800/30 hover:bg-slate-700/50 border border-slate-700/50 hover:border-slate-600/50 rounded-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-slate-500/50"
                                    >
                                        <span className="relative z-10 text-slate-400 group-hover:text-white transition-colors duration-300 text-lg">
                                            {icon}
                                        </span>
                                        {/* Subtle glow effect */}
                                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </button>
                                ))}
                            </div>

                            {/* Trust Badge */}
                            <div className="inline-flex items-center px-4 py-2 bg-slate-800/30 border border-slate-700/50 rounded-lg">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3 animate-pulse" />
                                <span className="text-xs text-slate-400 font-medium">SOC 2 Compliant</span>
                            </div>
                        </div>

                        {/* Quick Links - Professional Layout */}
                        <div className="space-y-6">
                            <h3 className="text-white font-semibold text-lg">Quick Links</h3>
                            <div className="space-y-3">
                                {quickLinks.map(link => (
                                    <a
                                        key={link.href}
                                        href={link.href}
                                        className="block text-slate-400 hover:text-white transition-all duration-200 text-sm hover:translate-x-1 transform"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {link.label}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Newsletter Section - Enhanced */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <h3 className="text-white font-semibold text-lg">{newsletterTitle}</h3>
                                <p className="text-slate-400 text-sm">{newsletterDescription}</p>
                            </div>
                            
                            {/* Professional Newsletter Form */}
                            <div className="space-y-3">
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Enter your email"
                                        className="w-full bg-slate-800/30 border border-slate-700/50 focus:border-slate-600/50 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/50 transition-all duration-300 placeholder:text-slate-500"
                                        disabled={loading}
                                        aria-label="Email address"
                                    />
                                </div>
                                
                                <button
                                    type="button"
                                    onClick={handleSubscribe}
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-slate-500/50 hover:scale-[1.02] transform"
                                >
                                    {loading ? 'Subscribing...' : 'Subscribe'}
                                </button>
                            </div>

                            {/* Status Messages */}
                            {error && (
                                <div className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg p-2">
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className="text-emerald-400 text-xs bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2">
                                    Subscribed! Check your inbox.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Section - Professional */}
                <div className="border-t border-slate-800/50 bg-slate-950/50">
                    <div className="max-w-7xl mx-auto px-6 md:px-12 py-6">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            
                            {/* Legal Links */}
                            <div className="flex flex-wrap gap-6 text-xs text-slate-500">
                                {legalLinks.map(link => (
                                    <a
                                        key={link.href}
                                        href={link.href}
                                        className="hover:text-slate-300 transition-colors duration-200"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {link.label}
                                    </a>
                                ))}
                            </div>

                            {/* Copyright with Professional Styling */}
                            <div className="flex items-center gap-4 text-xs text-slate-500">
                                <span>{copyright || `© ${new Date().getFullYear()} All rights reserved.`}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};