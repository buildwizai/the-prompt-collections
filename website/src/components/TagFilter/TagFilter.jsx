import PropTypes from "prop-types";
import "../../styles/animations.css";
import ShareButton from "../ShareButton/ShareButton";
import { Heart } from "lucide-react";

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
  const baseClass = "text-sm px-3 py-1 rounded-full cursor-pointer";

  return (
    <div className={`space-y-${selectedTags.length > 0 ? "2" : "6"}`}>
      <div className="flex justify-end items-center">
        {showShareButton && <ShareButton url={window.location.href} text="Share Page" />}
      </div>

      <div
        className={`relative ${selectedTags.length > 0 ? "min-h-[50px]" : "min-h-[100px]"} overflow-hidden`}
      >
        <div className="flex flex-wrap gap-2 justify-center items-center p-2">
          {/* Favorites tag */}
          <span
            onClick={() => onTagToggle("favorites")}
            className={`${baseClass} ${
              selectedTags.includes("favorites")
                ? "bg-red-500 text-white font-bold"
                : "bg-gray-200 text-gray-800"
            } flex items-center gap-1`}
          >
            <Heart size={14} className={selectedTags.includes("favorites") ? "fill-current" : ""} />
            Favorites ({favoritePrompts.length})
          </span>
          {/* Regular tags */}
          {tags.map((tag) => {
            const extraClasses = selectedTags.includes(tag)
              ? "bg-blue-500 text-white font-bold"
              : "bg-gray-200 text-gray-800";
            return (
              <span
                key={tag}
                onClick={() => onTagToggle(tag)}
                className={`${baseClass} ${extraClasses}`}
              >
                {tag} ({tagCounts[tag] || 0})
              </span>
            );
          })}
          <button
            onClick={onToggleShowAllTags}
            className="text-sm px-3 py-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            {showAllTags ? "Show Less" : "Show All Tags"}
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
