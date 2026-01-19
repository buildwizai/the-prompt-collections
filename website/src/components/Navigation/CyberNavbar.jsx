import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "../../utils/cn";

const CyberNavbar = ({ activeSection, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const sections = [
    { id: "home", label: "Home" },
    { id: "browse", label: "Browse" },
    { id: "features", label: "Features" },
  ];

  const isActive = (sectionId) => activeSection === sectionId;

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
        scrolled
          ? "glass-card backdrop-blur-xl bg-cyber-black/90 border border-cyber-gray-700 shadow-glass"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <button
              onClick={() => onNavigate("home")}
              className={cn(
                "font-display font-bold text-xl md:text-2xl transition-all duration-300",
                "text-cyber-green hover:text-cyber-green-light",
                "hover:drop-shadow-lg"
              )}
              aria-label="The Prompt Collection"
            >
              The Prompt Collection
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => onNavigate(section.id)}
                className={cn(
                  "font-display font-semibold transition-all duration-300 pb-1",
                  "relative",
                  isActive(section.id)
                    ? "text-cyber-green after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-cyber-green after:animate-glow-pulse"
                    : "text-cyber-white hover:text-cyber-green-light"
                )}
                aria-current={isActive(section.id) ? "page" : undefined}
              >
                {section.label}
              </button>
            ))}
          </div>

          {/* Desktop CTA Button */}
          <div className="hidden md:flex">
            <button
              onClick={() => onNavigate("browse")}
              className={cn(
                "px-6 py-2 rounded-glass font-display font-semibold",
                "border-2 border-cyber-green text-cyber-green",
                "transition-all duration-300",
                "hover:shadow-glow-green hover:bg-cyber-green/5"
              )}
              aria-label="Get Started"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-cyber-green hover:text-cyber-green-light transition-colors"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div
            className={cn(
              "md:hidden pb-4 space-y-3 animate-fade-slide-up",
              "border-t border-cyber-gray-700"
            )}
          >
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  onNavigate(section.id);
                  setIsMenuOpen(false);
                }}
                className={cn(
                  "block w-full text-left px-3 py-2 rounded-glass font-display font-semibold",
                  "transition-all duration-300",
                  isActive(section.id)
                    ? "bg-cyber-green/10 text-cyber-green border border-cyber-green"
                    : "text-cyber-white hover:bg-cyber-gray-700/50"
                )}
                aria-current={isActive(section.id) ? "page" : undefined}
              >
                {section.label}
              </button>
            ))}
            <button
              onClick={() => {
                onNavigate("browse");
                setIsMenuOpen(false);
              }}
              className={cn(
                "w-full px-6 py-2 rounded-glass font-display font-semibold",
                "border-2 border-cyber-green text-cyber-green mt-4",
                "transition-all duration-300",
                "hover:shadow-glow-green hover:bg-cyber-green/5"
              )}
              aria-label="Get Started"
            >
              Get Started
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

CyberNavbar.propTypes = {
  activeSection: PropTypes.string.isRequired,
  onNavigate: PropTypes.func.isRequired,
};

export default CyberNavbar;
