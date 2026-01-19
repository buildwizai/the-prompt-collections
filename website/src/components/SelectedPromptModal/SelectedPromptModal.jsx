// src/components/SelectedPromptModal/SelectedPromptModal.jsx
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { disableScroll, enableScroll } from "../../utils/scrollLock";
import { X, Copy, Check, Edit, Trash2, Plus, Save, Zap, Heart, ChevronDown } from "lucide-react";
import ShareButton from "../ShareButton/ShareButton";
import "../../styles/animations.css";
import aiTools from "../../data/ai-tools.json";
import { cn } from "../../utils/cn";
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
    selectedPrompt.summary || selectedPrompt.title || selectedPrompt.filename || "Untitled Prompt";

  const shareContent = `Check out this prompt "${displayName}" from The Prompt Collection`;

  const handleSelectChange = (e) => {
    const selectedWebsite = e.target.value;
    if (selectedWebsite === "add-custom-tool") {
      setShowCustomToolForm(true);
      const hasOpenWebUI = customTools.some((tool) => tool.name.toLowerCase() === "openwebui");
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
      {/* Cyberpunk Backdrop */}
      <div
        className="fixed inset-0 bg-cyber-black/60 backdrop-blur-xl transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className={cn(
            "relative w-full max-w-4xl max-h-[90vh] overflow-y-auto",
            "glass-card rounded-glass border-2 border-cyber-green/50",
            "shadow-glow-green animate-modal-entry"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Action Buttons */}
          <div className="absolute right-4 top-4 flex items-center gap-2 z-10">
            <button
              onClick={onToggleFavorite}
              className={cn(
                "p-2.5 rounded-full transition-all duration-300 hover:scale-110",
                isFavorite
                  ? "bg-cyber-green/20 text-cyber-green shadow-glow-green"
                  : "text-cyber-gray-400 hover:text-cyber-green hover:bg-cyber-green/10"
              )}
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart className={cn("w-5 h-5", isFavorite && "fill-current")} />
            </button>
            <ShareButton
              url={getShareUrl()}
              text="Share"
              content={shareContent}
              title={displayName}
            />
            <button
              className={cn(
                "p-2.5 rounded-full text-cyber-gray-400",
                "transition-all duration-300 hover:scale-110",
                "hover:text-cyber-green hover:bg-cyber-green/10"
              )}
              onClick={onClose}
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8">
            {/* Header Section */}
            <div className="pr-24 sm:pr-28 animate-fade-slide-up space-y-2">
              <h2
                className={cn(
                  "font-display text-2xl sm:text-3xl font-bold",
                  "text-cyber-white tracking-tight",
                  "break-words"
                )}
              >
                {displayName}
              </h2>
              <div className="h-0.5 w-24 bg-cyber-green drop-shadow-lg" />
            </div>

            {/* Tags */}
            {selectedPrompt.tags && selectedPrompt.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6 mb-6 animate-fade-slide-up animate-delay-50">
                {selectedPrompt.tags.map((tag) => (
                  <span
                    key={tag}
                    className={cn(
                      "px-3 py-1.5 text-xs font-semibold rounded-full",
                      "bg-cyber-green/10 border border-cyber-green/50 text-cyber-green",
                      "transition-all duration-300 hover:border-cyber-green hover:shadow-glow-green"
                    )}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Usage Hint */}
            {selectedPrompt.usage && (
              <div
                className={cn(
                  "mb-6 rounded-glass border-l-2 border-cyber-green",
                  "bg-cyber-green/5 p-4 animate-fade-slide-up animate-delay-100"
                )}
              >
                <span className="block text-xs font-bold uppercase tracking-wider text-cyber-green mb-2">
                  💡 Suggested Usage
                </span>
                <p className="font-body text-sm text-cyber-gray-300 leading-relaxed">
                  {selectedPrompt.usage}
                </p>
              </div>
            )}

            {/* Prompt Content */}
            <div className="animate-fade-slide-up animate-delay-150">
              <div
                className={cn(
                  "rounded-glass border border-cyber-green/30 overflow-hidden",
                  "bg-cyber-black/60 backdrop-blur-sm"
                )}
              >
                <div className="px-4 py-3 border-b border-cyber-green/20 bg-cyber-green/5">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyber-green">
                    📝 Prompt Content
                  </span>
                </div>
                <textarea
                  className={cn(
                    "w-full bg-transparent p-4 font-mono text-sm leading-relaxed",
                    "text-cyber-white placeholder-cyber-gray-600",
                    "focus:outline-none focus:ring-2 focus:ring-cyber-green/50",
                    "resize-none"
                  )}
                  defaultValue={selectedPrompt.content}
                  rows={12}
                  placeholder="Prompt content..."
                />
              </div>
              {shouldShowGuide && (
                <p className="mt-2 text-xs text-cyber-gray-500">
                  ✏️ You can edit this prompt before using it
                </p>
              )}
            </div>

            {/* Actions Section */}
            <div
              className={cn(
                "mt-8 pt-8 border-t border-cyber-green/20",
                "animate-fade-slide-up animate-delay-200"
              )}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h3
                  className={cn(
                    "font-display text-sm font-bold uppercase tracking-wider",
                    "text-cyber-green"
                  )}
                >
                  🚀 Use This Prompt
                </h3>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {/* AI Selector */}
                  <select
                    className={cn(
                      "px-4 py-2.5 text-sm rounded-glass",
                      "border border-cyber-green/30",
                      "bg-cyber-black/60 text-cyber-white",
                      "focus:outline-none focus:ring-2 focus:ring-cyber-green/50 focus:border-cyber-green",
                      "transition-all cursor-pointer",
                      "font-semibold"
                    )}
                    onChange={handleSelectChange}
                    value={selectedAITool?.name || ""}
                  >
                    <option value="">Select an AI...</option>
                    {aiTools.tools.map((tool) => (
                      <option key={tool.name} value={tool.name}>
                        {tool.name}
                      </option>
                    ))}
                    {customTools.map((tool) => (
                      <option key={tool.name} value={tool.name}>
                        {tool.name} (Custom)
                      </option>
                    ))}
                    <option value="add-custom-tool">➕ Add New AI</option>
                  </select>

                  {/* Button Group */}
                  <div className="flex gap-2">
                    {/* Copy Button */}
                    <button
                      className={cn(
                        "flex-1 sm:flex-none px-4 py-2.5 text-sm font-semibold rounded-glass",
                        "flex items-center justify-center gap-2",
                        "transition-all duration-300 hover:scale-105",
                        isCopied
                          ? "bg-cyber-green/20 text-cyber-green border border-cyber-green shadow-glow-green"
                          : "bg-cyber-green text-cyber-black border border-cyber-green hover:shadow-glow-green-lg"
                      )}
                      onClick={onCopy}
                      aria-label="Copy prompt to clipboard"
                    >
                      {isCopied ? (
                        <>
                          <Check size={16} />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={16} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    {/* Quick Action Button */}
                    {frequentTool && (
                      <button
                        className={cn(
                          "flex-1 sm:flex-none px-4 py-2.5 text-sm font-semibold rounded-glass",
                          "bg-cyber-green/20 text-cyber-green border border-cyber-green",
                          "flex items-center justify-center gap-2",
                          "transition-all duration-300 hover:scale-105 hover:shadow-glow-green"
                        )}
                        onClick={handleFrequentTool}
                        title={`Quick start with ${frequentTool.name}`}
                        aria-label={`Quick start with ${frequentTool.name}`}
                      >
                        <Zap size={16} />
                        <span className="hidden sm:inline">{frequentTool.name}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {shouldShowGuide && (
                <p className="mt-4 text-xs text-cyber-gray-500">
                  💡 Select an AI to copy the prompt and open a new chat window automatically
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
                    Add your own AI tool or local setup. The prompt will be copied and the URL
                    opened.
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

SelectedPromptModal.propTypes = {
  selectedPrompt: PropTypes.shape({
    filename: PropTypes.string,
    summary: PropTypes.string,
    title: PropTypes.string,
    usage: PropTypes.string,
    content: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onCopy: PropTypes.func.isRequired,
  isCopied: PropTypes.bool.isRequired,
  onStartConversation: PropTypes.func.isRequired,
  customTools: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })
  ).isRequired,
  onAddCustomTool: PropTypes.func.isRequired,
  onDeleteCustomTool: PropTypes.func.isRequired,
  onModifyCustomTool: PropTypes.func.isRequired,
  isFavorite: PropTypes.bool.isRequired,
  onToggleFavorite: PropTypes.func.isRequired,
};

export default SelectedPromptModal;
