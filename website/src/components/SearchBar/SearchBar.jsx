import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { cn } from "../../utils/cn";

const SearchBar = ({ onSearch, searchQuery = "" }) => {
  const [inputValue, setInputValue] = useState(searchQuery);

  // Sync with external searchQuery changes
  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);
  return (
    <div className="w-full px-2 sm:px-0">
      <div className="relative group">
        {/* Glow background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyber-green/20 to-cyber-green/10 rounded-glass blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />

        {/* Input container */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search prompts, tags, or categories..."
            value={inputValue}
            onChange={(e) => {
              const value = e.target.value;
              setInputValue(value);
              onSearch(value);
            }}
            className={cn(
              "w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg",
              "rounded-glass border-2",
              "bg-glass backdrop-blur-md",
              "border-cyber-gray-700 text-cyber-white placeholder-cyber-gray-500",
              "focus:outline-none focus:border-cyber-green focus:shadow-glow-green",
              "transition-all duration-300",
              "font-body"
            )}
            aria-label="Search prompts"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-4 sm:pr-6 pointer-events-none">
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-cyber-green drop-shadow-lg"
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
      </div>
    </div>
  );
};

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
  searchQuery: PropTypes.string,
};

export default SearchBar;
