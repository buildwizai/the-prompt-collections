// src/components/CustomToolsSection/CustomToolsSection.jsx
import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const CustomToolsSection = ({ customTools, onAdd, onDelete, onModify }) => {
  const [toolName, setToolName] = useState("");
  const [toolUrl, setToolUrl] = useState("");
  const [editingTool, setEditingTool] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTool) {
      onModify(editingTool.name, toolName, toolUrl);
    } else {
      onAdd(toolName, toolUrl);
    }
    setToolName("");
    setToolUrl("");
    setEditingTool(null);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Tool Name"
            className="p-2 border border-gray-300 rounded flex-1 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
            value={toolName}
            onChange={(e) => setToolName(e.target.value)}
            required
          />
          <input
            type="url"
            placeholder="Tool URL"
            className="p-2 border border-gray-300 rounded flex-1 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
            value={toolUrl}
            onChange={(e) => setToolUrl(e.target.value)}
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            {editingTool ? "Update" : "Add"}
          </button>
        </div>
      </form>
      <ul className="space-y-2 mt-4">
        {customTools.map((tool, index) => (
          <li
            key={index}
            className="flex justify-between items-center p-2 border border-gray-200 rounded bg-white dark:bg-gray-800 dark:border-gray-700"
          >
            <span className="text-gray-900 dark:text-gray-100">{tool.name}</span>
            <div className="flex gap-2">
              <button
                className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700"
                onClick={() => {
                  setEditingTool(tool);
                  setToolName(tool.name);
                  setToolUrl(tool.url);
                }}
              >
                <FaEdit />
              </button>
              <button
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                onClick={() => onDelete(tool.name)}
              >
                <FaTrash />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomToolsSection;
