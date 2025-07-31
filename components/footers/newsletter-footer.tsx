import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { 
  FaInstagram, 
  FaFacebook, 
  FaLinkedin, 
  FaYoutube, 
  FaGithub, 
  FaDiscord, 
  FaTiktok, 
  FaReddit, 
  FaPinterest 
} from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";

// Social Media Icons mapping using React Icons
const SocialIcons = {
  twitter: <FaXTwitter className="w-5 h-5" />,
  instagram: <FaInstagram className="w-5 h-5" />,
  facebook: <FaFacebook className="w-5 h-5" />,
  linkedin: <FaLinkedin className="w-5 h-5" />,
  youtube: <FaYoutube className="w-5 h-5" />,
  github: <FaGithub className="w-5 h-5" />,
  discord: <FaDiscord className="w-5 h-5" />,
  tiktok: <FaTiktok className="w-5 h-5" />,
  reddit: <FaReddit className="w-5 h-5" />,
  pinterest: <FaPinterest className="w-5 h-5" />,
}

export interface NewsletterFooterProps {
  onSubscribe?: (email: string) => void;
  title?: string;
  description?: string;
  socialIcons?: string[];
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
      className="inline-flex items-center justify-center text-white/70 hover:text-white transition-all duration-300 cursor-pointer text-2xl shadow-xl bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-3"
      style={{
        perspective: 400,
        transformStyle: 'preserve-3d',
      }}
      animate={isHover ? { scale: 1.1 } : { scale: 1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ scale: 1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      whileHover={{ 
        boxShadow: '0 8px 32px 0 rgba(255,255,255,0.15), 0 2px 8px 0 rgba(255,255,255,0.1)',
        borderColor: 'rgba(255,255,255,0.3)'
      }}
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
      className={`w-full bg-gradient-to-t from-black/60 via-black/40 to-transparent backdrop-blur-xl border-t border-white/10 text-white py-16 px-6 ${className || ''}`}
    >
      <div className="max-w-4xl mx-auto">
        {/* Main content with glassmorphic container */}
        <motion.div 
          className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left: Call to action */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-2xl font-black text-white mb-3 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                {title}
              </h2>
              {description && (
                <p className="text-white/80 leading-relaxed">
                  {description}
                </p>
              )}
            </motion.div>
            
            {/* Right: Input + Button */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter your email"
                  className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-300 placeholder:text-white/50"
                  disabled={loading}
                  aria-label="Email address"
                />
                <motion.button
                  type="button"
                  onClick={handleSubscribe}
                  disabled={loading}
                  className="px-6 py-3 rounded-xl bg-white text-gray-900 font-semibold hover:bg-white/90 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-2xl hover:shadow-white/25"
                  style={{ minWidth: 120 }}
                  whileHover={!loading ? { scale: 1.05 } : {}}
                  whileTap={!loading ? { scale: 0.98 } : {}}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  {loading ? 'Subscribing...' : 'Subscribe'}
                </motion.button>
              </div>
              {error && (
                <motion.div 
                  className="text-sm text-red-400 mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {error}
                </motion.div>
              )}
              {success && (
                <motion.div 
                  className="text-sm text-green-400 mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  Subscribed! Check your inbox.
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom section: Social icons and legal links */}
        {(!!socialIcons.length || !!legalLinks.length) && (
          <motion.div 
            className="flex flex-col items-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {socialIcons.length > 0 && (
              <div className="flex gap-4 justify-center">
                {socialIcons.map((iconName, idx) => {
                  // Make the lookup case-insensitive
                  const normalizedIconName = iconName.toLowerCase();
                  const IconComponent = SocialIcons[normalizedIconName as keyof typeof SocialIcons];
                  if (!IconComponent) return null;
                  
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.5 + idx * 0.1 }}
                    >
                      <MotionSocialIcon>
                        {IconComponent}
                      </MotionSocialIcon>
                    </motion.div>
                  );
                })}
              </div>
            )}
            {legalLinks.length > 0 && (
              <div className="flex gap-6 flex-wrap text-sm text-white/70 justify-center">
                {legalLinks.map((link, idx) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    className="hover:text-white transition-all duration-300 hover:scale-105"
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 + idx * 0.1 }}
                  >
                    {link.label}
                  </motion.a>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </footer>
  );
};