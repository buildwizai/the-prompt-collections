// src/components/Header/Header.jsx
import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

const Header = ({ isDarkMode, onToggleDarkMode }) => {
  return (
    <header className="flex justify-between items-center py-4 mb-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        The Prompt Collection
      </h1>

      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={isDarkMode}
          onChange={onToggleDarkMode}
          className="sr-only peer"
        />
        <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600">
        </div>
        <span className="absolute left-1.5 text-xs text-gray-800 dark:text-gray-300">
          <FaSun className="h-4 w-4" />
        </span>
        <span className="absolute right-1.5 text-xs text-gray-800 dark:text-gray-300">
          <FaMoon className="h-4 w-4" />
        </span>
      </label>
    </header>
  );
};

export default Header;