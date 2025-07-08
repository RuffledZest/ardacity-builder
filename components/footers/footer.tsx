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
    <footer className={`bg-zinc-900 text-white py-4 text-center ${className}`}>
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

export default Footer;
