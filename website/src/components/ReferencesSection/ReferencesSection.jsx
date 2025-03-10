import React from 'react';
import { FaBook } from 'react-icons/fa';

const ReferencesSection = ({ referencesData }) => {
  if (!referencesData || referencesData.length === 0) return null;

  return (
    <section className="mt-8">
      <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <FaBook className="w-6 h-6" />
          References
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {referencesData.map((reference, index) => (
            <a
              key={index}
              href={reference.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{reference.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{reference.description}</p>
              <span className="text-xs text-blue-600 dark:text-blue-400">{reference.source}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReferencesSection;