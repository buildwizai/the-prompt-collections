// src/components/SearchBar/SearchBar.jsx
import PropTypes from "prop-types";

const SearchBar = ({ onSearch }) => {
  return (
    <div className="w-full px-2 sm:px-0">
      <div className="relative">
        <input
          type="text"
          placeholder="Search prompts..."
          onChange={(e) => onSearch(e.target.value)}
          className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg rounded-full border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200 shadow-sm"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-6 pointer-events-none">
          <svg
            className="w-6 h-6 text-gray-400"
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
  );
};

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default SearchBar;
