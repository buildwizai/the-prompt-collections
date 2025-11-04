// src/components/SelectedPromptModal/SelectedPromptModal.jsx
import React, { useState, useEffect } from "react";
import { disableScroll, enableScroll } from "../../utils/scrollLock";
import {
  X,
  Copy,
  Check,
  Edit,
  Trash2,
  Plus,
  Save,
  Zap,
  Heart,
  ArrowRight,
} from "lucide-react";
import ShareButton from "../ShareButton/ShareButton";
import "../../styles/animations.css";
import aiTools from "../../data/ai-tools.json";
import {
  getMostFrequentTool,
  getModalUsageCount,
  incrementModalUsageCount,
} from "../../utils/localStorage";

const SelectedPromptModal = ({
  selectedPrompt,
  onClose,
  onCopy,
  isCopied,
  onStartConversation,
  customTools,
  onAddCustomTool,
  onDeleteCustomTool,
  onModifyCustomTool,
  isFavorite,
  onToggleFavorite,
}) => {
  const [toolName, setToolName] = useState("");
  const [toolUrl, setToolUrl] = useState("");
  const [showCustomToolForm, setShowCustomToolForm] = useState(false);
  const [editingTool, setEditingTool] = useState(null);
  const [selectedAITool, setSelectedAITool] = useState(null);
  const [shouldShowGuide] = useState(() => getModalUsageCount() < 3);

  useEffect(() => {
    incrementModalUsageCount();
    disableScroll();
    return () => {
      enableScroll();
    };
  }, []);

  const handleAddOrUpdateTool = (e) => {
    e.preventDefault();
    if (toolName && toolUrl) {
      if (editingTool) {
        onModifyCustomTool(editingTool.name, toolName, toolUrl);
      } else {
        onAddCustomTool(toolName, toolUrl);
      }
      setToolName("");
      setToolUrl("");
      setShowCustomToolForm(false);
      setEditingTool(null);
    }
  };

  // Generate the full sharing URL with prompt parameter
  const getShareUrl = () => {
    const url = new URL(window.location.origin);
    url.searchParams.set("prompt", encodeURIComponent(selectedPrompt.filename));
    return url.toString();
  };

  const displayName =
    selectedPrompt.summary ||
    selectedPrompt.title ||
    selectedPrompt.filename ||
    "Untitled Prompt";

  const shareContent = `Check out this prompt "${displayName}" from The Prompt Collection`;

  const handleSelectChange = (e) => {
    const selectedWebsite = e.target.value;
    if (selectedWebsite === "add-custom-tool") {
      setShowCustomToolForm(true);
      // Check if Open WebUI already exists in customTools
      const hasOpenWebUI = customTools.some(
        (tool) => tool.name.toLowerCase() === "openwebui"
      );
      if (!hasOpenWebUI) {
        setToolName("OpenWebUI");
        setToolUrl("http://localhost:3000");
      }
      setSelectedAITool(null);
    } else if (selectedWebsite && selectedPrompt) {
      const tool =
        aiTools.tools.find((t) => t.name === selectedWebsite) ||
        customTools.find((t) => t.name === selectedWebsite);
      setSelectedAITool(tool);
      onStartConversation(selectedWebsite, selectedPrompt.content);
    } else {
      setSelectedAITool(null);
    }
  };

  const handleFrequentTool = () => {
    const tool = getMostFrequentTool([...aiTools.tools, ...customTools]);
    if (tool) {
      onStartConversation(tool.name, selectedPrompt.content);
    }
  };

  const renderOption = (name, url) => (
    <option
      key={name}
      value={name}
      title={url} // Add title attribute for native tooltip
      className="hover:bg-gray-100 dark:hover:bg-gray-700 p-2" // Add hover styles
    >
      {name}
    </option>
  );

  return (
    <div className="fixed inset-0 z-50" aria-modal="true">
      <div className="fixed inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm transition-opacity" />
      <div className="flex min-h-screen items-start sm:items-center justify-center p-2 sm:p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-xl w-full max-w-3xl p-3 sm:p-6 overflow-hidden shadow-2xl animate-modal-entry">
          {/* Mobile buttons positioned absolutely */}
          <div className="absolute right-2 top-2 flex items-center gap-1 sm:hidden">
            <button
              onClick={onToggleFavorite}
              className={`p-1.5 rounded-full transition-colors duration-200 ${
                isFavorite
                  ? "text-red-500 hover:bg-red-100"
                  : "text-gray-400 hover:bg-gray-100"
              }`}
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart
                className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`}
              />
            </button>
            <div className="scale-75 origin-right">
              <ShareButton
                url={getShareUrl()}
                text="Share"
                content={shareContent}
                title={displayName}
              />
            </div>
            <button
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
              onClick={onClose}
            >
              <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Mobile header */}
          <div className="sm:hidden pr-16 pt-2">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {displayName}
            </h2>
            {selectedPrompt.tags && selectedPrompt.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {selectedPrompt.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 text-xs rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 whitespace-nowrap"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Desktop header */}
          <div className="hidden sm:flex flex-row justify-between items-center border-b dark:border-gray-700 pb-1">
            <div className="pr-8">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {displayName}
              </h2>
              {selectedPrompt.tags && selectedPrompt.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {selectedPrompt.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 text-xs rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 whitespace-nowrap"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={onToggleFavorite}
                className={`p-2 rounded-full transition-colors duration-200 ${
                  isFavorite
                    ? "text-red-500 hover:bg-red-100"
                    : "text-gray-400 hover:bg-gray-100"
                }`}
                title={
                  isFavorite ? "Remove from favorites" : "Add to favorites"
                }
              >
                <Heart
                  className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`}
                />
              </button>
              <ShareButton
                url={getShareUrl()}
                text="Share"
                content={shareContent}
                title={displayName}
              />
              <button
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
                onClick={onClose}
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto sm:pt-10">
            {selectedPrompt.usage && (
              <div className="mt-2 mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900 dark:border-blue-700 dark:bg-blue-900/40 dark:text-blue-100">
                <span className="block text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-200">
                  Suggested usage
                </span>
                <p className="mt-1 leading-snug">
                  {selectedPrompt.usage}
                </p>
              </div>
            )}

            <p className="hidden sm:block text-sm text-gray-600 dark:text-gray-400 mb-2">
              {shouldShowGuide && "You can modify this prompt before using it:"}
            </p>
            <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/40">
              <div className="border-b border-gray-200 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:border-gray-700 dark:text-gray-300">
                Prompt content
              </div>
              <textarea
                className="w-full border-0 bg-transparent p-3 pt-0 text-sm leading-snug dark:text-gray-100 focus:outline-none focus:ring-0"
                defaultValue={selectedPrompt.content}
                rows={window.innerWidth < 640 ? 10 : 15}
              />
            </div>
          </div>

          <div className="mt-2 sm:mt-6 border-t dark:border-gray-700 pt-2 sm:pt-4">
            {/* Grid container */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* Left column - Title */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Use this Prompt
                </h3>
              </div>

              {/* Right column - Controls */}
              <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2 sm:justify-end">
                <select
                  className="w-full sm:w-fit px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                  onChange={handleSelectChange}
                  value={selectedAITool?.name || ""}
                >
                  <option value="">Select an AI</option>
                  {aiTools.tools.map((tool) => renderOption(tool.name, tool.url))}
                  {customTools.map((tool) => renderOption(tool.name, tool.url))}
                  <option value="add-custom-tool">Add New AI</option>
                </select>

                <div className="grid grid-cols-2 sm:flex w-full sm:w-auto gap-2">
                  <button
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base ${
                      isCopied ? "bg-green-500" : "bg-blue-500"
                    } text-white rounded hover:bg-blue-600 flex items-center justify-center gap-2 dark:bg-blue-600 dark:hover:bg-blue-700`}
                    onClick={onCopy}
                  >
                    {isCopied ? <Check size={16} /> : <Copy size={16} />}
                    {isCopied ? "Copied!" : "Copy"}
                  </button>

                  <button
                    className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base bg-purple-500 text-white rounded hover:bg-purple-600 flex items-center justify-center gap-2"
                    onClick={handleFrequentTool}
                  >
                    <Zap size={16} />
                    {getMostFrequentTool([...aiTools.tools, ...customTools])?.name || ""}
                  </button>
                </div>
              </div>

              {/* Guide text in full width row below */}
              {shouldShowGuide && (
                <div className="col-span-full">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    <span className="hidden sm:inline">
                      The prompt will be copied automatically, and a new chat window will open.
                    </span>
                    <span className="sm:hidden inline-flex items-center gap-1">
                      Select AI <ArrowRight size={14} /> paste prompt <ArrowRight size={14} /> start chat
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
          {showCustomToolForm && (
            <div className="mt-6 border-t dark:border-gray-700 pt-4">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Add Custom AI Tool
                </h3>
                {shouldShowGuide && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Define your own AI tool or local setup. When selected, the
                    prompt will be copied and the specified URL will be opened.
                  </p>
                )}
              </div>
              <form onSubmit={handleAddOrUpdateTool} className="mt-4">
                <div className="flex flex-col sm:flex-row gap-2">
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
                    className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 flex items-center gap-2"
                  >
                    {editingTool ? <Save size={18} /> : <Plus size={18} />}
                    {editingTool ? "Update" : "Add"}
                  </button>
                </div>
              </form>
            </div>
          )}
          {customTools.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-bold text-black dark:text-gray-100 mb-2">
                Custom AI Tools
              </h3>
              {shouldShowGuide && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Your saved AI tools and local setups
                </p>
              )}
              <ul className="space-y-1">
                {customTools.map((tool, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center py-1.5 px-3 border border-gray-200 rounded bg-white dark:bg-gray-800 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900 dark:text-gray-100 font-medium">
                        {tool.name}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        • {tool.url}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded"
                        onClick={() => {
                          setEditingTool(tool);
                          setToolName(tool.name);
                          setToolUrl(tool.url);
                          setShowCustomToolForm(true);
                        }}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                        onClick={() => onDeleteCustomTool(tool.name)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectedPromptModal;
