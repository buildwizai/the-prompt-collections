import PropTypes from "prop-types";
import "../../styles/animations.css";
import ShareButton from "../ShareButton/ShareButton";
import { Heart } from "lucide-react";
import { cn } from "../../utils/cn";

const TagFilter = ({
  tags,
  selectedTags,
  onTagToggle,
  showAllTags,
  onToggleShowAllTags,
  tagCounts,
  showShareButton,
  favoritePrompts,
}) => {
  const baseTagClass = cn(
    "text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-full cursor-pointer",
    "transition-all duration-300 font-semibold",
    "border-2 border-cyber-gray-700"
  );

  const getTagClasses = (isSelected) => {
    return isSelected
      ? cn(baseTagClass, "bg-cyber-green/10 border-cyber-green text-cyber-green shadow-glow-green")
      : cn(
          baseTagClass,
          "bg-glass hover:border-cyber-green text-cyber-gray-300 hover:text-cyber-green"
        );
  };

  return (
    <div className={cn("space-y-4", selectedTags.length > 0 && "space-y-2")}>
      <div className="flex justify-end items-center">
        {showShareButton && <ShareButton url={window.location.href} text="Share Page" />}
      </div>

      <div
        className={cn(
          "relative overflow-hidden",
          selectedTags.length > 0 ? "min-h-[60px]" : "min-h-[120px]"
        )}
      >
        <div className="flex flex-wrap gap-2 sm:gap-3 justify-center items-center p-2">
          {/* Favorites tag */}
          <button
            onClick={() => onTagToggle("favorites")}
            className={cn(
              getTagClasses(selectedTags.includes("favorites")),
              "flex items-center gap-2 hover:scale-105 active:scale-95"
            )}
            aria-pressed={selectedTags.includes("favorites")}
            aria-label={`Toggle favorites filter. ${favoritePrompts.length} favorites`}
          >
            <Heart size={16} className={selectedTags.includes("favorites") ? "fill-current" : ""} />
            <span>
              Favorites
              <span className="text-xs ml-1">({favoritePrompts.length})</span>
            </span>
          </button>

          {/* Regular tags */}
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => onTagToggle(tag)}
              className={cn(
                getTagClasses(selectedTags.includes(tag)),
                "hover:scale-105 active:scale-95"
              )}
              aria-pressed={selectedTags.includes(tag)}
              aria-label={`Toggle ${tag} filter. ${tagCounts[tag] || 0} prompts`}
            >
              {tag}
              <span className="text-xs ml-1">({tagCounts[tag] || 0})</span>
            </button>
          ))}

          {/* Show more/less button */}
          <button
            onClick={onToggleShowAllTags}
            className={cn(
              "text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-full",
              "text-cyber-green hover:text-cyber-green-light",
              "transition-all duration-300 font-semibold",
              "hover:shadow-glow-green"
            )}
            aria-label={showAllTags ? "Show fewer tags" : "Show all tags"}
          >
            {showAllTags ? "Show Less" : "Show All"}
          </button>
        </div>
      </div>
    </div>
  );
};

TagFilter.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedTags: PropTypes.arrayOf(PropTypes.string).isRequired,
  onTagToggle: PropTypes.func.isRequired,
  showAllTags: PropTypes.bool.isRequired,
  onToggleShowAllTags: PropTypes.func.isRequired,
  tagCounts: PropTypes.objectOf(PropTypes.number).isRequired,
  showShareButton: PropTypes.bool,
  favoritePrompts: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default TagFilter;
