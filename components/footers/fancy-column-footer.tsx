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
  icon?: string; // icon name
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
  socialIcons?: string[]; // icon names
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
  // Validation: Warn if more than 5 columns
  useEffect(() => {
    if (columns.length > 5) {
      console.warn(
        "[FancyColumnFooter] More than 5 columns provided. Only 5 will be displayed."
      );
    }
    columns.forEach((col, i) => {
      col.links.forEach((link) => {
        if (!isValidUrl(link.url)) {
          console.warn(
            `[FancyColumnFooter] Invalid URL in column ${i + 1}: ${link.url}`
          );
        }
      });
    });
    if (socialIcons && socialIcons.length > 0 && !bottomNote) {
      console.warn(
        "[FancyColumnFooter] Social icons provided but no bottomNote. Social block may not render as expected."
      );
    }
  }, [columns, socialIcons, bottomNote]);

  // Background classes
  let bgClass = "";
  let borderClass = "";
  if (backgroundStyle === "gradient") {
    bgClass =
      "bg-gradient-to-br from-pink-200 via-blue-200 to-purple-200 " +
      "dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-800";
    borderClass = ""; // optional: no border needed for clean gradient look
  } else if (backgroundStyle === "custom") {
    bgClass = customBackgroundClass;
    borderClass = ""; // or let the user set it dynamically
  }
  

  // Responsive grid columns
  const colCount = Math.min(columns.length, 5);
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-4",
    5: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
  }[colCount];

  // Layout alignment
  const alignClass = layout === "center" ? "items-center text-center" : "items-start text-left";
  console.log('Footer props', { logo, columns, socialIcons });

  // Color classes based on backgroundStyle
  let textClass = "";
  let iconClass = "";
  let linkClass = "";
  let linkHoverClass = "";
  let sectionBgClass = "";
  let abstractBg = null;

  if (backgroundStyle === "dark-abstract") {
    // Shadcn dark theme, abstract SVG lines, animated shapes
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
      className={`relative w-full px-4 py-10 ${bgClass} ${borderClass} transition-all duration-300 ${sectionBgClass}`}
      role="contentinfo"
    >
      {/* Abstract background for dark-abstract mode */}
      {backgroundStyle === "dark-abstract" && abstractBg}
      <div className={`relative z-10 max-w-7xl mx-auto flex flex-col gap-8`}>
        {/* Top: Logo & Description */}
        <div className={`flex flex-col gap-2 ${alignClass}`}>
          <div className="flex justify-center md:justify-start">
            <img src={logo.src} alt={logo.alt || "Logo"} className="h-10" />
          </div>
          {description && (
            <p className={`text-sm max-w-md mx-auto md:mx-0 ${textClass} opacity-80`}>{description}</p>
          )}
        </div>
        {/* Columns */}
        <div
          className={`grid ${gridCols} gap-8 md:gap-12 transition-all duration-300`}
        >
          {columns.slice(0, 5).map((col, idx) => (
            <div key={col.title + idx} className="flex flex-col gap-3">
              <div className="flex items-center gap-2 mb-1">
                {col.icon && iconMap[col.icon] && (
                  <span className={`text-lg ${iconClass}`}>{iconMap[col.icon]}</span>
                )}
                <span className={`font-semibold tracking-wide ${textClass}`}>{col.title}</span>
              </div>
              <ul className="space-y-2">
                {col.links.map((link, lidx) => (
                  <li key={link.label + lidx}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-block relative group ${linkClass} transition-colors duration-200`}
                    >
                      <span className={`transition-transform duration-200 hover:translate-x-1 ${linkHoverClass}`}>{link.label}</span>
                      {/* Animated underline */}
                      <span className="block h-0.5 bg-gradient-to-r from-pink-400 via-blue-400 to-purple-400 rounded-full scale-x-0 hover:scale-x-100 transition-transform duration-300 origin-left mt-0.5" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {/* Bottom: Social icons & note */}
        {(socialIcons?.length || bottomNote) && (
          <div
            className={`flex flex-col md:flex-row md:justify-between items-center gap-4 pt-8 border-t border-zinc-200 dark:border-zinc-700 mt-8`}
          >
            {bottomNote && (
              <span className={`text-xs opacity-80 ${textClass}`}>{bottomNote}</span>
            )}
            {socialIcons && socialIcons.length > 0 && (
              <div className="flex gap-3">
                {socialIcons.map((icon, i) => (
                  <span
                    key={i}
                    className={`w-8 h-8 flex items-center justify-center rounded-full shadow hover:scale-110 transition-transform duration-200 border border-zinc-200 dark:border-zinc-700 bg-background/80 ${iconClass}`}
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