import { useEffect, useState } from "react";
import logoUrl from "../../assets/logo-mark.svg";
import { FaGithub, FaTwitter, FaStar, FaCodeBranch, FaRocket } from "react-icons/fa";
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
    <footer className="py-6 mt-8 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Brand */}
        <div className="flex items-center justify-between border-b border-gray-200/60 dark:border-gray-700/60 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center rounded-md p-1 bg-cyan-500/10 ring-1 ring-cyan-300/40">
              <img src={logoUrl} alt="TPC logo" className="h-8 w-8 select-none" draggable="false" />
            </span>
            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              The Prompt Collection
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* GitHub Project Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Project</h3>
            {repoData && (
              <div className="space-y-2">
                <a
                  href={repoData.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-700 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400"
                >
                  <FaGithub className="mr-2" />
                  GitHub
                </a>
                <div className="flex items-center space-x-4 text-gray-700 dark:text-gray-300">
                  <span className="flex items-center">
                    <FaStar className="mr-1" />
                    {repoData.stargazers_count}
                  </span>
                  <span className="flex items-center">
                    <FaCodeBranch className="mr-1" />
                    {repoData.forks_count}
                  </span>
                  {repoData && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <FaRocket className="text-gray-700 dark:text-gray-300" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {repoData.deployJobUrl && (
                            <a
                              href={repoData.deployJobUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-sm text-blue-500 hover:underline dark:text-blue-400"
                            >
                              Version: {repoData.lastCommitHash.substring(0, 7)}
                            </a>
                          )}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Social</h3>
            <div className="space-y-2">
              <a
                href="https://x.com/buildwizai"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-700 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400"
              >
                <FaTwitter className="mr-2" />
                Twitter
              </a>
            </div>
          </div>

          {/* License and Version */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">License</h3>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              This project is licensed under the{" "}
              <a
                href="https://opensource.org/licenses/MIT"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline dark:text-blue-400"
              >
                MIT License
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
