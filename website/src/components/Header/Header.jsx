// src/components/Header/Header.jsx
import React from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import logoUrl from "../../assets/logo-mark.svg";

const Header = ({ isDarkMode, onToggleDarkMode }) => {
  return (
    <header className="flex justify-between items-center py-4 mb-4">
      <a href="/" className="flex items-center gap-3 group" aria-label="The Prompt Collection home">
        <span className="inline-flex items-center justify-center rounded-md p-1.5 bg-cyan-500/10 ring-1 ring-cyan-300/40 backdrop-blur-[1px]">
          <img
            src={logoUrl}
            alt="TPC logo"
            className="h-10 w-10 select-none filter drop-shadow-[0_0_8px_rgba(43,212,255,0.85)]"
            draggable="false"
          />
        </span>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:opacity-90">
          The Prompt Collection
        </h1>
      </a>

      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={isDarkMode}
          onChange={onToggleDarkMode}
          className="sr-only peer"
        />
        <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
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
