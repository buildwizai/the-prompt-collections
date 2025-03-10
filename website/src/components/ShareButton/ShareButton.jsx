import React, { useState } from 'react';
import { FiShare2, FiTwitter, FiFacebook, FiLinkedin, FiMail, FiLink, FiX } from 'react-icons/fi';

const ShareButton = ({ url, text = 'Share', content, title }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const generateShareContent = () => {
    const defaultContent = "Check out The Prompt Collection - A curated repository of AI prompts!";
    const shareContent = content || defaultContent;
    return encodeURIComponent(`${shareContent}\n\n${url}`);
  };

  const shareOptions = [
    {
      name: 'Twitter',
      icon: <FiTwitter />,
      url: `https://twitter.com/intent/tweet?text=${generateShareContent()}`,
      className: "hover:bg-sky-50 dark:hover:bg-sky-900/50 hover:text-[#1DA1F2] dark:hover:text-[#1DA1F2] group text-gray-700 dark:text-gray-300",
      iconClassName: "group-hover:text-[#1DA1F2]"
    },
    {
      name: 'Facebook',
      icon: <FiFacebook />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      className: "hover:bg-blue-50 dark:hover:bg-blue-900/50 hover:text-[#4267B2] dark:hover:text-[#4267B2] group text-gray-700 dark:text-gray-300",
      iconClassName: "group-hover:text-[#4267B2]"
    },
    {
      name: 'LinkedIn',
      icon: <FiLinkedin />,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      className: "hover:bg-blue-50 dark:hover:bg-blue-900/50 hover:text-[#0077b5] dark:hover:text-[#0077b5] group text-gray-700 dark:text-gray-300",
      iconClassName: "group-hover:text-[#0077b5]"
    },
    {
      name: 'Email',
      icon: <FiMail />,
      url: `mailto:?subject=${encodeURIComponent(title || 'Check out this prompt!')}&body=${generateShareContent()}`,
      className: "hover:bg-red-50 dark:hover:bg-red-900/50 hover:text-red-600 dark:hover:text-red-400 group text-gray-700 dark:text-gray-300",
      iconClassName: "group-hover:text-red-600 dark:group-hover:text-red-400"
    },
    {
      name: 'Copy Link',
      icon: <FiLink />,
      action: async () => {
        await navigator.clipboard.writeText(url);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
        setShowMenu(false);
      },
      className: "hover:bg-purple-50 dark:hover:bg-purple-900/50 hover:text-purple-600 dark:hover:text-purple-400 group text-gray-700 dark:text-gray-300",
      iconClassName: "group-hover:text-purple-600 dark:group-hover:text-purple-400"
    },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <FiShare2 className="w-4 h-4" />
        {text}
      </button>

      {/* Share Menu */}
      {showMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Share via</span>
            <button
              onClick={() => setShowMenu(false)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-500 dark:text-gray-400"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
          <div className="py-2">
            {shareOptions.map((option) => (
              <button
                key={option.name}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 text-sm transition-colors ${option.className}`}
                onClick={() => {
                  if (option.action) {
                    option.action();
                  } else {
                    window.open(option.url, '_blank');
                    setShowMenu(false);
                  }
                }}
              >
                {React.cloneElement(option.icon, {
                  className: `w-4 h-4 text-gray-500 dark:text-gray-400 ${option.iconClassName}`
                })}
                <span>{option.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm rounded-full shadow-lg">
          Link copied to clipboard! 🎉
        </div>
      )}
    </div>
  );
};

export default ShareButton;
