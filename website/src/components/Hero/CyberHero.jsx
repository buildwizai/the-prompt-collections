import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "../../utils/cn";

const CyberHero = ({ onSearchChange, searchQuery }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyber-black via-cyber-black to-cyber-black">
        {/* Animated green accent gradients */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyber-green/5 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyber-green/5 rounded-full blur-3xl animate-float-fast" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyber-green/3 rounded-full blur-3xl animate-float-medium" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 pt-20">
        <motion.div
          className="w-full max-w-4xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className={cn(
              "text-5xl md:text-6xl lg:text-7xl font-display font-bold",
              "text-cyber-white text-center mb-6",
              "tracking-tight"
            )}
          >
            Your Gateway to{" "}
            <span className="text-cyber-green drop-shadow-lg animate-text-glow">
              AI Conversations
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className={cn(
              "text-xl md:text-2xl text-cyber-gray-300 text-center mb-12",
              "max-w-3xl mx-auto"
            )}
          >
            Curated prompts for every AI interaction. Discover, explore, and master the art of
            prompt engineering.
          </motion.p>

          {/* Search Bar */}
          <motion.div variants={itemVariants} className="mb-16">
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-cyber-green/20 to-cyber-green/10 rounded-glass blur-lg opacity-75" />
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search prompts, tags, or categories..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className={cn(
                    "w-full px-6 py-4 md:py-5 rounded-glass",
                    "bg-cyber-black/80 backdrop-blur-xl border-2 border-cyber-green/50",
                    "text-cyber-white placeholder-cyber-gray-500",
                    "text-lg focus:outline-none focus:border-cyber-green focus:shadow-glow-green",
                    "transition-all duration-300",
                    "font-body"
                  )}
                  aria-label="Search prompts"
                />
                <svg
                  className={cn(
                    "absolute right-4 md:right-6 top-1/2 -translate-y-1/2",
                    "w-5 h-5 md:w-6 md:h-6 text-cyber-green pointer-events-none"
                  )}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <button
              className={cn(
                "px-8 py-3 md:py-4 rounded-glass font-display font-bold",
                "bg-cyber-green text-cyber-black",
                "transition-all duration-300 hover:shadow-glow-green-lg hover:scale-105",
                "text-base md:text-lg"
              )}
              aria-label="Explore prompts"
            >
              Explore Prompts
            </button>
            <button
              className={cn(
                "px-8 py-3 md:py-4 rounded-glass font-display font-bold",
                "border-2 border-cyber-green text-cyber-green",
                "transition-all duration-300 hover:shadow-glow-green hover:bg-cyber-green/10",
                "text-base md:text-lg"
              )}
              aria-label="Learn more"
            >
              Learn More
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="w-6 h-6 md:w-8 md:h-8 text-cyber-green drop-shadow-lg" />
      </motion.div>
    </div>
  );
};

CyberHero.propTypes = {
  onSearchChange: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
};

export default CyberHero;
