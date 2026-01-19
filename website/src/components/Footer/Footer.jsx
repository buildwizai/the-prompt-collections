import { useEffect, useState } from "react";
import logoUrl from "../../assets/logo-mark.svg";
import { FaGithub, FaTwitter, FaStar, FaCodeBranch } from "react-icons/fa";
import { cn } from "../../utils/cn";
import { fetchRepoData } from "../../utils/github";

const Footer = () => {
  const [repoData, setRepoData] = useState(null);

  useEffect(() => {
    const getRepoData = async () => {
      try {
        const data = await fetchRepoData();
        setRepoData(data);
      } catch (error) {
        console.error("Error fetching GitHub repository data:", error);
      }
    };

    getRepoData();
  }, []);

  return (
    <footer className="py-12 md:py-16 mt-16 md:mt-20 border-t border-cyber-green/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand Section */}
        <div className="flex items-center justify-between border-b border-cyber-green/20 pb-8 mb-12">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "inline-flex items-center justify-center rounded-glass p-2",
                "bg-cyber-green/10 border border-cyber-green/50"
              )}
            >
              <img
                src={logoUrl}
                alt="TPC logo"
                className="h-6 w-6 select-none drop-shadow-lg"
                draggable="false"
              />
            </div>
            <span className="text-lg font-display font-bold text-cyber-white">
              The Prompt Collection
            </span>
          </div>
          <div className="text-sm text-cyber-gray-400">Built with ❤️ and AI</div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* GitHub Project Info */}
          <div className="space-y-3">
            <h3 className="text-sm font-display font-bold uppercase tracking-wider text-cyber-green">
              📦 Project
            </h3>
            {repoData && (
              <div className="space-y-3">
                <a
                  href={repoData.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "inline-flex items-center gap-2",
                    "text-cyber-gray-300 hover:text-cyber-green",
                    "transition-colors duration-300"
                  )}
                >
                  <FaGithub size={16} />
                  GitHub Repository
                </a>
                <div className="flex items-center space-x-4 text-cyber-gray-300">
                  <span className="flex items-center gap-1 hover:text-cyber-green transition-colors">
                    <FaStar size={14} className="text-cyber-green" />
                    {repoData.stargazers_count} stars
                  </span>
                  <span className="flex items-center gap-1 hover:text-cyber-green transition-colors">
                    <FaCodeBranch size={14} className="text-cyber-green" />
                    {repoData.forks_count} forks
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Social Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-display font-bold uppercase tracking-wider text-cyber-green">
              🌐 Social
            </h3>
            <div className="space-y-2">
              <a
                href="https://x.com/buildwizai"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex items-center gap-2",
                  "text-cyber-gray-300 hover:text-cyber-green",
                  "transition-colors duration-300"
                )}
              >
                <FaTwitter size={16} />
                Follow on X
              </a>
            </div>
          </div>

          {/* License */}
          <div className="space-y-3">
            <h3 className="text-sm font-display font-bold uppercase tracking-wider text-cyber-green">
              ⚖️ License
            </h3>
            <p className="text-cyber-gray-300 text-sm leading-relaxed">
              MIT License - Free for personal and commercial use.
              <a
                href="https://opensource.org/licenses/MIT"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyber-green hover:underline ml-1"
              >
                Learn more →
              </a>
            </p>
          </div>
        </div>

        {/* Bottom Divider and Attribution */}
        <div
          className={cn(
            "border-t border-cyber-green/10 pt-8",
            "text-center text-xs text-cyber-gray-500"
          )}
        >
          <p>© 2024 The Prompt Collection. All rights reserved. | Powered by AI</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
