import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";
import PromptItem from "./PromptItem";
import { FolderOpen, ArrowLeft } from "lucide-react";
import { cn } from "../../utils/cn";

const PromptList = ({
  prompts,
  loadMorePrompts,
  hasMore,
  onSelectPrompt,
  onQuickAction,
  selectedCategory,
  onCategoryClick,
  onBackToCategories,
  groupedPrompts,
  showCategoryList,
  totalPrompts,
  totalFilteredPrompts,
  customTools,
}) => {
  if (showCategoryList) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-cyber-white flex items-center justify-center gap-3">
            <FolderOpen className="w-8 h-8 text-cyber-green drop-shadow-lg" />
            Browse by Category
          </h2>
          <p className="text-lg text-cyber-gray-300">
            Browse through our collection of{" "}
            <span className="font-semibold text-cyber-green drop-shadow-lg">{totalPrompts}</span>{" "}
            carefully curated prompts
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {Object.entries(groupedPrompts).map(([category, categoryPrompts]) => (
            <button
              key={category}
              onClick={() => onCategoryClick(category)}
              className={cn(
                "glass-card p-6 text-left",
                "hover-lift group",
                "transition-all duration-300"
              )}
            >
              <h3 className="text-xl font-display font-bold text-cyber-white mb-2 group-hover:text-cyber-green transition-colors">
                {category}
              </h3>
              <p className="text-sm text-cyber-gray-400">
                {categoryPrompts.length} {categoryPrompts.length === 1 ? "prompt" : "prompts"}
              </p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with category and counts */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {selectedCategory && (
          <button
            onClick={onBackToCategories}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-glass",
              "text-cyber-green font-semibold",
              "border border-cyber-green/50",
              "transition-all duration-300 hover:border-cyber-green hover:shadow-glow-green"
            )}
            aria-label="Back to categories"
          >
            <ArrowLeft size={18} />
            Back to Categories
          </button>
        )}
        <div className="text-sm text-cyber-gray-400 font-semibold">
          <span className="text-cyber-green">{totalFilteredPrompts}</span> prompts found
          {prompts.length < totalFilteredPrompts && ` (showing ${prompts.length})`}
        </div>
      </div>

      {/* Prompts Grid with Infinite Scroll */}
      <InfiniteScroll
        dataLength={prompts.length}
        next={loadMorePrompts}
        hasMore={hasMore}
        loader={
          <div className="col-span-full flex justify-center py-8">
            <div className="animate-conic-spin">
              <div className="w-8 h-8 rounded-full border-2 border-cyber-gray-700 border-t-cyber-green" />
            </div>
          </div>
        }
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
      >
        {prompts.map((prompt, index) => (
          <PromptItem
            key={index}
            prompt={prompt}
            onSelectPrompt={onSelectPrompt}
            onQuickAction={onQuickAction}
            customTools={customTools}
          />
        ))}
      </InfiniteScroll>
    </div>
  );
};

PromptList.propTypes = {
  prompts: PropTypes.arrayOf(PropTypes.object).isRequired,
  loadMorePrompts: PropTypes.func.isRequired,
  hasMore: PropTypes.bool.isRequired,
  onSelectPrompt: PropTypes.func.isRequired,
  onQuickAction: PropTypes.func,
  selectedCategory: PropTypes.string,
  onCategoryClick: PropTypes.func.isRequired,
  onBackToCategories: PropTypes.func.isRequired,
  groupedPrompts: PropTypes.objectOf(PropTypes.array).isRequired,
  showCategoryList: PropTypes.bool.isRequired,
  totalPrompts: PropTypes.number.isRequired,
  totalFilteredPrompts: PropTypes.number.isRequired,
  customTools: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })
  ),
};

export default PromptList;
