import PropTypes from "prop-types";
import { Zap, Flame } from "lucide-react";
import aiTools from "../../data/ai-tools.json";
import { getMostFrequentTool } from "../../utils/localStorage";
import { cn } from "../../utils/cn";

const PromptItem = ({ prompt, onSelectPrompt, onQuickAction, customTools = [] }) => {
  const mostFrequentTool = getMostFrequentTool([...aiTools.tools, ...customTools]);
  const usageCount = prompt.usageCount !== undefined ? prompt.usageCount : 0;

  return (
    <div
      onClick={() => onSelectPrompt(prompt)}
      className={cn(
        "glass-card p-5 md:p-6 cursor-pointer flex flex-col gap-4 h-full",
        "hover-lift group",
        "transition-all duration-300"
      )}
    >
      {/* Header with usage stats and quick action */}
      <div className="flex justify-between items-start gap-3">
        <div className="flex items-center gap-2">
          <span className="text-cyber-gray-400 text-sm font-semibold">{usageCount} uses</span>
          {usageCount > 0 ? (
            <Flame size={16} className="text-cyber-green drop-shadow-lg" />
          ) : (
            <span className="text-cyber-gray-500 text-sm">New</span>
          )}
        </div>
        {onQuickAction && mostFrequentTool && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickAction(prompt);
            }}
            className={cn(
              "px-3 py-1.5 text-xs font-semibold rounded-full",
              "bg-cyber-green/20 border border-cyber-green text-cyber-green",
              "transition-all duration-300",
              "hover:shadow-glow-green hover:bg-cyber-green/30",
              "flex items-center gap-1"
            )}
            title={`Quick open with ${mostFrequentTool.name}`}
            aria-label={`Quick action: ${mostFrequentTool.name}`}
          >
            <Zap size={14} />
            {mostFrequentTool.name}
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 space-y-2">
        <h3 className="text-lg font-display font-bold text-cyber-white line-clamp-2 group-hover:text-cyber-green-light transition-colors">
          {prompt.summary || prompt.title || prompt.filename || "Untitled Prompt"}
        </h3>
        <p className="text-cyber-gray-400 line-clamp-3 text-sm leading-relaxed">
          {prompt.usage || "Usage details coming soon."}
        </p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mt-2">
        {prompt.tags &&
          prompt.tags.length > 0 &&
          prompt.tags.slice(0, 3).map((tag, i) => {
            const isSystem = tag === "system";
            const isCategory = tag === prompt.category;

            return (
              <span
                key={i}
                className={cn(
                  "px-2.5 py-1 rounded-full text-xs font-semibold",
                  "transition-all duration-300",
                  isSystem
                    ? "bg-cyber-green/20 border border-cyber-green text-cyber-green"
                    : isCategory
                      ? "bg-cyber-green/10 border border-cyber-green/60 text-cyber-green/80"
                      : "bg-cyber-gray-700/50 border border-cyber-gray-600 text-cyber-gray-300"
                )}
              >
                {tag}
              </span>
            );
          })}
      </div>
    </div>
  );
};

PromptItem.propTypes = {
  prompt: PropTypes.shape({
    filename: PropTypes.string,
    summary: PropTypes.string,
    title: PropTypes.string,
    usage: PropTypes.string,
    content: PropTypes.string,
    category: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    usageCount: PropTypes.number,
  }).isRequired,
  onSelectPrompt: PropTypes.func.isRequired,
  onQuickAction: PropTypes.func,
  customTools: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })
  ),
};

export default PromptItem;
