import PropTypes from "prop-types";
import { Trash2, Zap, Heart } from "lucide-react";
import { cn } from "../utils/cn";

const PromptList = ({ prompts, handleSelectPrompt, title, onRemoveFavorite, icon: Icon }) => {
  if (!prompts || prompts.length === 0) return null;
  return (
    <div className="glass-card p-6 space-y-4">
      <h2
        className={cn("text-xl font-display font-bold flex items-center gap-2", "text-cyber-white")}
      >
        {Icon && <Icon className="w-6 h-6 text-cyber-green drop-shadow-lg" />}
        {title}
      </h2>
      <ul className="divide-y divide-cyber-green/20 space-y-2">
        {prompts.map((prompt) => (
          <li
            key={prompt.id || prompt.filename}
            className={cn(
              "py-3 px-2 rounded-glass cursor-pointer",
              "transition-all duration-300",
              "hover:bg-cyber-green/10 hover:border-cyber-green",
              "border border-transparent"
            )}
          >
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="flex-1 text-cyber-white hover:text-cyber-green transition-colors font-semibold"
                onClick={() => handleSelectPrompt(prompt)}
              >
                {prompt.summary || prompt.title || prompt.filename || "Untitled Prompt"}
              </span>
              <span
                className={cn(
                  "px-2 py-1 rounded-full text-xs font-bold",
                  "bg-cyber-green/20 text-cyber-green border border-cyber-green/50"
                )}
              >
                {prompt.usageCount !== undefined ? prompt.usageCount : 0}{" "}
                {prompt.usageCount === 0 ? "📦" : "🔥"}
              </span>
              {onRemoveFavorite && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFavorite(prompt);
                  }}
                  className={cn(
                    "p-1.5 text-cyber-gray-400 rounded-full",
                    "transition-all duration-300",
                    "hover:text-cyber-green hover:bg-cyber-green/10"
                  )}
                  title="Remove from favorites"
                  aria-label="Remove from favorites"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

PromptList.propTypes = {
  prompts: PropTypes.arrayOf(PropTypes.object),
  handleSelectPrompt: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  onRemoveFavorite: PropTypes.func,
  icon: PropTypes.elementType,
};

const TopPrompts = ({ topPrompts, favoritePrompts, handleSelectPrompt, onRemoveFavorite }) => {
  return (
    <section className="mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PromptList
          prompts={topPrompts}
          handleSelectPrompt={handleSelectPrompt}
          title="Top 5 Frequent Prompts"
          icon={Zap}
        />
        <PromptList
          prompts={favoritePrompts}
          handleSelectPrompt={handleSelectPrompt}
          title={`Favorite Prompts (${favoritePrompts?.length || 0})`}
          onRemoveFavorite={onRemoveFavorite}
          icon={Heart}
        />
      </div>
    </section>
  );
};

TopPrompts.propTypes = {
  topPrompts: PropTypes.arrayOf(PropTypes.object),
  favoritePrompts: PropTypes.arrayOf(PropTypes.object),
  handleSelectPrompt: PropTypes.func.isRequired,
  onRemoveFavorite: PropTypes.func,
};

export default TopPrompts;
