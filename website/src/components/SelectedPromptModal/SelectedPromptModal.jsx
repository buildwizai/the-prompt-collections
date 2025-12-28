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
  ChevronDown,
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
  const [isCustomToolsExpanded, setIsCustomToolsExpanded] = useState(false);

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

  const frequentTool = getMostFrequentTool([...aiTools.tools, ...customTools]);

  return (
    <div className="fixed inset-0 z-50" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-[var(--modal-border)] bg-[var(--modal-surface)] shadow-xl shadow-black/5 dark:shadow-black/20 animate-modal-entry"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Action Buttons */}
          <div className="absolute right-4 top-4 flex items-center gap-1 z-10">
            <button
              onClick={onToggleFavorite}
              className={`p-2 rounded-full transition-all duration-200 hover:scale-105 ${
                isFavorite
                  ? "text-red-500 bg-red-50 dark:bg-red-500/10"
                  : "text-[var(--text-muted)] hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
            </button>
            <ShareButton
              url={getShareUrl()}
              text="Share"
              content={shareContent}
              title={displayName}
            />
            <button
              className="p-2 rounded-full text-[var(--text-muted)] hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-105"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8">
            {/* Header Section */}
            <div className="pr-28 animate-fade-slide-up">
              <h2 className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
                {displayName}
              </h2>
            </div>

            {/* Divider */}
            <div className="my-4 h-px bg-gradient-to-r from-gray-200 via-gray-200 to-transparent dark:from-gray-700 dark:via-gray-700 animate-fade-slide-up animate-delay-50" />

            {/* Tags */}
            {selectedPrompt.tags && selectedPrompt.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6 animate-fade-slide-up animate-delay-100">
                {selectedPrompt.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 text-xs font-medium rounded-full bg-[var(--tag-bg)] text-[var(--tag-text)] transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Usage Hint */}
            {selectedPrompt.usage && (
              <div className="mb-6 rounded-lg border-l-2 border-[var(--accent)] bg-[var(--accent-soft)] p-4 animate-fade-slide-up animate-delay-150">
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-[var(--accent)] mb-1">
                  Suggested usage
                </span>
                <p className="font-body text-sm text-[var(--text-secondary)] leading-relaxed">
                  {selectedPrompt.usage}
                </p>
              </div>
            )}

            {/* Prompt Content */}
            <div className="animate-fade-slide-up animate-delay-200">
              <div className="rounded-xl border border-[var(--modal-border)] bg-[var(--modal-bg)] overflow-hidden">
                <div className="px-4 py-2.5 border-b border-[var(--modal-border)]">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    Prompt Content
                  </span>
                </div>
                <textarea
                  className="w-full bg-transparent p-4 font-body text-sm leading-relaxed text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-0 resize-none"
                  defaultValue={selectedPrompt.content}
                  rows={12}
                  placeholder="Prompt content..."
                />
              </div>
              {shouldShowGuide && (
                <p className="mt-2 text-xs text-[var(--text-muted)]">
                  You can edit this prompt before using it
                </p>
              )}
            </div>

            {/* Actions Section */}
            <div className="mt-6 pt-6 border-t border-[var(--modal-border)] animate-fade-slide-up animate-delay-250">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h3 className="font-display text-sm font-semibold text-[var(--text-primary)]">
                  Use This Prompt
                </h3>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  {/* AI Selector */}
                  <select
                    className="px-3 py-2.5 text-sm rounded-lg border border-[var(--modal-border)] bg-[var(--modal-surface)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all cursor-pointer"
                    onChange={handleSelectChange}
                    value={selectedAITool?.name || ""}
                  >
                    <option value="">Select an AI</option>
                    {aiTools.tools.map((tool) => (
                      <option key={tool.name} value={tool.name}>{tool.name}</option>
                    ))}
                    {customTools.map((tool) => (
                      <option key={tool.name} value={tool.name}>{tool.name}</option>
                    ))}
                    <option value="add-custom-tool">+ Add New AI</option>
                  </select>

                  {/* Button Group */}
                  <div className="flex gap-2">
                    {/* Copy Button */}
                    <button
                      className={`flex-1 sm:flex-none px-4 py-2.5 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] ${
                        isCopied
                          ? "bg-[var(--success)] text-white"
                          : "bg-[var(--accent)] text-white hover:opacity-90"
                      }`}
                      onClick={onCopy}
                    >
                      {isCopied ? <Check size={16} /> : <Copy size={16} />}
                      <span>{isCopied ? "Copied!" : "Copy"}</span>
                    </button>

                    {/* Quick Action Button */}
                    {frequentTool && (
                      <button
                        className="flex-1 sm:flex-none px-4 py-2.5 text-sm font-medium rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/25"
                        onClick={handleFrequentTool}
                        title={`Quick start with ${frequentTool.name}`}
                      >
                        <Zap size={16} />
                        <span className="hidden sm:inline">{frequentTool.name}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {shouldShowGuide && (
                <p className="mt-3 text-xs text-[var(--text-muted)]">
                  Select an AI to copy the prompt and open a new chat window automatically
                </p>
              )}
            </div>

            {/* Custom Tool Form */}
            {showCustomToolForm && (
              <div className="mt-6 pt-6 border-t border-[var(--modal-border)] animate-fade-slide-up">
                <h3 className="font-display text-sm font-semibold text-[var(--text-primary)] mb-3">
                  {editingTool ? "Edit Custom AI" : "Add Custom AI"}
                </h3>
                {shouldShowGuide && (
                  <p className="text-xs text-[var(--text-muted)] mb-4">
                    Add your own AI tool or local setup. The prompt will be copied and the URL opened.
                  </p>
                )}
                <form onSubmit={handleAddOrUpdateTool} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Tool name"
                    className="flex-1 px-3 py-2.5 text-sm rounded-lg border border-[var(--modal-border)] bg-[var(--modal-surface)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all"
                    value={toolName}
                    onChange={(e) => setToolName(e.target.value)}
                    required
                  />
                  <input
                    type="url"
                    placeholder="https://..."
                    className="flex-1 px-3 py-2.5 text-sm rounded-lg border border-[var(--modal-border)] bg-[var(--modal-surface)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all"
                    value={toolUrl}
                    onChange={(e) => setToolUrl(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 text-sm font-medium rounded-lg bg-[var(--accent)] text-white flex items-center justify-center gap-2 transition-all duration-200 hover:opacity-90 hover:scale-[1.02]"
                  >
                    {editingTool ? <Save size={16} /> : <Plus size={16} />}
                    <span>{editingTool ? "Update" : "Add"}</span>
                  </button>
                </form>
              </div>
            )}

            {/* Custom Tools List (Collapsible) */}
            {customTools.length > 0 && (
              <div className="mt-6 pt-6 border-t border-[var(--modal-border)] animate-fade-slide-up animate-delay-300">
                <button
                  onClick={() => setIsCustomToolsExpanded(!isCustomToolsExpanded)}
                  className="w-full flex items-center justify-between py-1 text-left group"
                >
                  <h3 className="font-display text-sm font-semibold text-[var(--text-primary)]">
                    Custom AI Tools
                    <span className="ml-2 text-xs font-normal text-[var(--text-muted)]">
                      ({customTools.length})
                    </span>
                  </h3>
                  <ChevronDown
                    className={`w-4 h-4 text-[var(--text-muted)] transition-transform duration-200 ${
                      isCustomToolsExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isCustomToolsExpanded && (
                  <div className="mt-3 space-y-1">
                    {customTools.map((tool, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-[var(--modal-bg)] transition-colors group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="font-medium text-sm text-[var(--text-primary)] truncate">
                            {tool.name}
                          </span>
                          <span className="text-xs text-[var(--text-muted)] truncate hidden sm:block">
                            {tool.url}
                          </span>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            className="p-1.5 rounded-md text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors"
                            onClick={() => {
                              setEditingTool(tool);
                              setToolName(tool.name);
                              setToolUrl(tool.url);
                              setShowCustomToolForm(true);
                            }}
                            title="Edit"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            className="p-1.5 rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                            onClick={() => onDeleteCustomTool(tool.name)}
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectedPromptModal;
