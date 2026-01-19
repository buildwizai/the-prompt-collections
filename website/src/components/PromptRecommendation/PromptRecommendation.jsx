import PropTypes from "prop-types";
import { Sparkles, Target, ChevronRight } from "lucide-react";

/**
 * Component to display the top 3 recommended prompts with match scores
 */
const PromptRecommendation = ({ recommendations, onSelectPrompt, isLoading }) => {
  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto mb-6">
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-purple-100 dark:border-purple-800">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-purple-500 animate-pulse" />
            <span className="font-semibold text-purple-700 dark:text-purple-300">
              Finding best matches...
            </span>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 bg-white/50 dark:bg-gray-800/50 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30";
    if (score >= 60) return "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30";
    return "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30";
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return "Excellent Match";
    if (score >= 60) return "Good Match";
    return "Relevant";
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-6">
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-purple-100 dark:border-purple-800">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <span className="font-semibold text-purple-700 dark:text-purple-300">
            Top Recommendations for You
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
            ({recommendations.length} matches found)
          </span>
        </div>

        <div className="space-y-3">
          {recommendations.map((item, index) => (
            <button
              key={item.prompt.id || index}
              onClick={() => onSelectPrompt(item.prompt)}
              className="w-full text-left bg-white dark:bg-gray-800 rounded-lg p-4 hover:shadow-md transition-all duration-200 border border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-700 group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-medium text-gray-900 dark:text-white truncate">
                      #{index + 1}
                    </span>
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                      {item.prompt.category}
                    </span>
                  </div>
                  <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-1 line-clamp-1">
                    {item.prompt.summary || item.prompt.filename}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {item.prompt.usage || item.prompt.content?.slice(0, 150) + "..."}
                  </p>
                  {item.matchReasons && item.matchReasons.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.matchReasons.slice(0, 3).map((reason, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded"
                        >
                          <Target className="w-3 h-3" />
                          {reason}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(item.displayScore)}`}
                  >
                    {item.displayScore}%
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {getScoreLabel(item.displayScore)}
                  </span>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

PromptRecommendation.propTypes = {
  recommendations: PropTypes.arrayOf(
    PropTypes.shape({
      prompt: PropTypes.shape({
        id: PropTypes.string,
        category: PropTypes.string,
        summary: PropTypes.string,
        usage: PropTypes.string,
        content: PropTypes.string,
        filename: PropTypes.string,
        tags: PropTypes.arrayOf(PropTypes.string),
      }).isRequired,
      score: PropTypes.number.isRequired,
      displayScore: PropTypes.number.isRequired,
      matchReasons: PropTypes.arrayOf(PropTypes.string),
    })
  ),
  onSelectPrompt: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

PromptRecommendation.defaultProps = {
  recommendations: [],
  isLoading: false,
};

export default PromptRecommendation;
