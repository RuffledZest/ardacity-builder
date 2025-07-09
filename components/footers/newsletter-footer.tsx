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
      className={`w-full bg-neutral-900 text-muted-foreground py-10 px-6 ring-offset-background ${className || ''}`}
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
          {success && <div className="text-xs text-green-500 mt-1">Subscribed! Check your inbox.`&quot;`</div>}
        </div>
      </div>
      {/* Below: Social icons and legal links (centered) */}
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