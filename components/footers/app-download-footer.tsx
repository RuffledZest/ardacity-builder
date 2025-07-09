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
      className={`relative w-full overflow-hidden py-10 px-6 md:px-10 border border-neutral-800 ${darkTheme ? 'bg-neutral-900 text-muted-foreground' : 'bg-white text-gray-700'} ${className || ''}`}
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
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-16px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-slow { animation: float 12s ease-in-out infinite; }
        .animate-float-slower { animation: float 18s ease-in-out infinite; }
      `}</style>
    </footer>
  );
};