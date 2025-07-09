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
        <footer className={`w-full bg-neutral-950 text-muted-foreground border-t border-neutral-800 shadow-lg pt-10 pb-4 px-6 md:px-10 ${className || ''}`}>
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
                    {success && <div className="text-xs text-green-500 mt-1">Subscribed! Check your inbox.`&quot;`</div>}
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
                <div className="text-xs">{copyright || `© ${new Date().getFullYear()} All rights reserved.`}</div>
            </div>
        </footer>
    );
};