// src/App.jsx
import { useState, useEffect, useCallback, useRef } from "react";
import Header from "./components/Header/Header";
import SearchBar from "./components/SearchBar/SearchBar";
import TagFilter from "./components/TagFilter/TagFilter";
import PromptList from "./components/PromptList/PromptList";
import SelectedPromptModal from "./components/SelectedPromptModal/SelectedPromptModal";
import Footer from "./components/Footer/Footer";
import BestPracticesSection from "./components/BestPracticesSection/BestPracticesSection";
import TestimonialsSection from "./components/TestimonialsSection/TestimonialsSection";
import ContactSection from "./components/ContactSection/ContactSection";
import prompts from "./data/prompts.json";
import debounce from "lodash.debounce";
import aiTools from "./data/ai-tools.json";
import TopPrompts from "./components/TopPrompts";
import PromptRecommendation from "./components/PromptRecommendation";
import { getRecommendations, isRecommendationQuery } from "./utils/recommendationEngine";
import {
  loadStoredState,
  saveDarkMode,
  saveCustomTools,
  savePromptUsageStats,
  saveToolUsageStats,
  saveFavoritePrompts,
  loadCustomTools,
} from "./utils/localStorage";

const PAGE_SIZE = 20; // Number of prompts to load at a time

const App = () => {
  const storedState = loadStoredState();
  const [isDarkMode, setIsDarkMode] = useState(storedState.darkMode);
  const [customTools, setCustomTools] = useState(storedState.customTools);
  const [usageStats, setUsageStats] = useState(storedState.promptUsageStats);
  const [, setToolUsageStats] = useState(storedState.toolUsageStats);
  const [favoritePrompts, setFavoritePrompts] = useState(storedState.favoritePrompts);
  const toolWindowsRef = useRef({});

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [visiblePrompts, setVisiblePrompts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showHero, setShowHero] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);

  // Load custom tools from localStorage on initial render
  useEffect(() => {
    const storedTools = loadCustomTools();
    setCustomTools(storedTools);
  }, []);

  // Save custom tools to localStorage whenever they change
  useEffect(() => {
    saveCustomTools(customTools);
  }, [customTools]);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    saveDarkMode(newMode);
  };

  // Extract all unique tags from prompts
  const allTags = [...new Set(prompts.flatMap((prompt) => prompt.tags || []))];

  // Calculate the number of prompts for each tag
  const tagCounts = allTags.reduce((acc, tag) => {
    acc[tag] = prompts.filter((prompt) => (prompt.tags || []).includes(tag)).length;
    return acc;
  }, {});

  // Sort tags by popularity (number of prompts)
  const sortedTags = allTags.sort((a, b) => tagCounts[b] - tagCounts[a]);

  // Number of tags to show initially
  const INITIAL_TAGS_TO_SHOW = 10;

  // Slice the sorted tags array based on whether "Show More" is clicked
  const visibleTags = showAllTags ? sortedTags : sortedTags.slice(0, INITIAL_TAGS_TO_SHOW);

  // Calculate the total number of prompts
  const totalPrompts = prompts.length;

  // Group prompts by category
  const groupedPrompts = prompts.reduce((acc, prompt) => {
    const category = prompt.category || "Uncategorized";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(prompt);
    return acc;
  }, {});

  // Filter prompts based on search query and selected tags
  const filterPrompts = useCallback(() => {
    return prompts.filter((prompt) => {
      const category = prompt.category || "";
      const subcategories = prompt.subcategories || [];
      const content = prompt.content || "";

      // Check if favorites filter is active
      if (selectedTags.includes("favorites") && !favoritePrompts.includes(prompt.filename)) {
        return false;
      }

      const matchesSearch =
        category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subcategories.some((subcategory) =>
          subcategory.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        content.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => tag === "favorites" || (prompt.tags || []).includes(tag));

      return matchesSearch && matchesTags;
    });
  }, [searchQuery, selectedTags, favoritePrompts]);

  // Load more prompts for infinite scroll
  const loadMorePrompts = () => {
    const filtered = selectedCategory ? groupedPrompts[selectedCategory] : filterPrompts();
    const nextPage = page + 1;
    const startIndex = (nextPage - 1) * PAGE_SIZE;
    const newPrompts = filtered.slice(startIndex, startIndex + PAGE_SIZE);

    setVisiblePrompts((prev) => [...prev, ...newPrompts]);
    setPage(nextPage);
    setHasMore(startIndex + PAGE_SIZE < filtered.length);
  };

  // Debounced search handler with recommendations
  const handleSearch = debounce((query) => {
    setSearchQuery(query);
    setPage(1);
    setVisiblePrompts([]);
    setHasMore(true);

    // Generate recommendations if query looks like a recommendation request
    if (query && query.trim().length >= 3 && isRecommendationQuery(query)) {
      setIsLoadingRecommendations(true);
      setShowRecommendations(true);
      // Use setTimeout to simulate async and avoid blocking UI
      setTimeout(() => {
        const results = getRecommendations(query, prompts, 3);
        setRecommendations(results);
        setIsLoadingRecommendations(false);
      }, 100);
    } else {
      setShowRecommendations(false);
      setRecommendations([]);
    }
  }, 300);

  // Reset visible prompts when search or tags change
  useEffect(() => {
    const filtered = filterPrompts();
    setVisiblePrompts(filtered.slice(0, PAGE_SIZE));
    setPage(1);
    setHasMore(filtered.length > PAGE_SIZE);
  }, [searchQuery, selectedTags, filterPrompts]);

  // Handle category selection
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setVisiblePrompts(groupedPrompts[category].slice(0, PAGE_SIZE));
    setPage(1);
    setHasMore(groupedPrompts[category].length > PAGE_SIZE);
  };

  // Handle back to category view
  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setVisiblePrompts(filterPrompts().slice(0, PAGE_SIZE));
    setPage(1);
    setHasMore(filterPrompts().length > PAGE_SIZE);
  };

  // Toggle a tag in the selected tags list
  const handleTagToggle = (tag) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]
    );
  };

  // Handle copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(selectedPrompt.content).then(() => {
      setIsCopied(true); // Set copied state to true
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    });
  };

  // Handle starting a conversation with a selected website
  const handleStartConversation = (website, promptContent) => {
    // Update AI tool usage stat
    setToolUsageStats((prevStats) => {
      const newStats = {
        ...prevStats,
        [website]: (prevStats[website] || 0) + 1,
      };
      saveToolUsageStats(newStats);
      return newStats;
    });

    // Copy the system prompt to the clipboard
    navigator.clipboard.writeText(promptContent).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });

    // Find the tool URL from either ai-tools.json or custom tools
    const predefinedTool = aiTools.tools.find((tool) => tool.name === website);
    const customTool = customTools.find((tool) => tool.name === website);

    let url = "";
    if (predefinedTool) {
      url = predefinedTool.url;
    } else if (customTool) {
      url = customTool.url;
    } else {
      return;
    }
    const existingWindow = toolWindowsRef.current[website];
    if (existingWindow && !existingWindow.closed) {
      existingWindow.focus();
      try {
        existingWindow.location.href = url;
      } catch {
        const newWindow = window.open(url, "_blank");
        if (newWindow) {
          toolWindowsRef.current[website] = newWindow;
        }
      }
    } else {
      const newWindow = window.open(url, "_blank");
      if (newWindow) {
        toolWindowsRef.current[website] = newWindow;
      }
    }
  };

  // Add new handler for quick action
  const handleQuickAction = (prompt) => {
    // Determine the top AI tool (from aiTools and customTools)
    const stats = JSON.parse(localStorage.getItem("toolUsageStats")) || {};
    const allTools = [...aiTools.tools, ...customTools];
    let maxUsage = -1;
    allTools.forEach((tool) => {
      const usage = stats[tool.name] || 0;
      if (usage > maxUsage) maxUsage = usage;
    });
    const candidates = allTools.filter((tool) => (stats[tool.name] || 0) === maxUsage);
    if (candidates.length === 0) return;
    const randomIndex = Math.floor(Math.random() * candidates.length);
    const topTool = candidates[randomIndex];

    // Update tool usage stat
    setToolUsageStats((prevStats) => {
      const newStats = { ...prevStats, [topTool.name]: (prevStats[topTool.name] || 0) + 1 };
      saveToolUsageStats(newStats);
      return newStats;
    });

    // Copy the prompt content to clipboard and then open the tool's URL
    navigator.clipboard.writeText(prompt.content).then(() => {
      const predefinedTool = aiTools.tools.find((tool) => tool.name === topTool.name);
      const customTool = customTools.find((tool) => tool.name === topTool.name);
      let url = "";
      if (predefinedTool) {
        url = predefinedTool.url;
      } else if (customTool) {
        url = customTool.url;
      }
      if (url) {
        window.open(url, "_blank");
      }
    });
  };

  // Handle adding a custom tool
  const handleAddCustomTool = (toolName, toolUrl) => {
    const newTool = { name: toolName, url: toolUrl };
    setCustomTools((prev) => [...prev, newTool]);
  };

  // Handle deleting a custom tool
  const handleDeleteCustomTool = (toolName) => {
    setCustomTools((prev) => prev.filter((tool) => tool.name !== toolName));
  };

  // Handle modifying a custom tool
  const handleModifyCustomTool = (oldName, newName, newUrl) => {
    setCustomTools((prev) =>
      prev.map((tool) => (tool.name === oldName ? { name: newName, url: newUrl } : tool))
    );
  };

  // Enhanced URL parameter handling
  useEffect(() => {
    const handleUrlParams = () => {
      const params = new URLSearchParams(window.location.search);
      const sharedPromptName = params.get("prompt");

      if (sharedPromptName) {
        const promptToShow = prompts.find(
          (p) => p.filename === decodeURIComponent(sharedPromptName)
        );
        if (promptToShow) {
          setSelectedPrompt(promptToShow);
        }
      }
    };

    // Handle initial load and browser back/forward
    handleUrlParams();
    window.addEventListener("popstate", handleUrlParams);

    return () => window.removeEventListener("popstate", handleUrlParams);
  }, []);

  // Update URL when modal opens/closes
  useEffect(() => {
    const url = new URL(window.location);

    if (selectedPrompt) {
      url.searchParams.set("prompt", encodeURIComponent(selectedPrompt.filename));
    } else {
      url.searchParams.delete("prompt");
    }

    // Only update if URL actually changed to avoid unnecessary history entries
    if (url.toString() !== window.location.href) {
      window.history.pushState({}, "", url);
    }
  }, [selectedPrompt]);

  // Handle modal close via browser back button
  useEffect(() => {
    const handlePopState = () => {
      if (!new URLSearchParams(window.location.search).has("prompt")) {
        setSelectedPrompt(null);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Update URL with selected filters - move outside component or memoize
  const updateUrlWithFilters = useCallback(() => {
    if (!window.history.pushState) return; // Guard against SSR

    const url = new URL(window.location);
    if (selectedTags.length > 0) {
      url.searchParams.set("tags", selectedTags.join(","));
    } else {
      url.searchParams.delete("tags");
    }

    // Only update if URL actually changed
    if (url.toString() !== window.location.href) {
      window.history.pushState({}, "", url);
    }
  }, [selectedTags]);

  // Separate effect for URL updates and hero visibility
  useEffect(() => {
    updateUrlWithFilters();
  }, [selectedTags, updateUrlWithFilters]);

  // Separate effect for hero visibility
  useEffect(() => {
    setShowHero(!selectedCategory && selectedTags.length === 0);
  }, [selectedCategory, selectedTags]);

  // Handle initial URL params - only run once on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get("category");
    const tagsParam = params.get("tags");

    if (categoryParam && groupedPrompts[categoryParam]) {
      setSelectedCategory(categoryParam);
      setVisiblePrompts(groupedPrompts[categoryParam].slice(0, PAGE_SIZE) || []);
    }

    if (tagsParam) {
      const tags = tagsParam.split(",");
      setSelectedTags(tags);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Determine whether to show the category list or filtered prompts
  const showCategoryList = !searchQuery && selectedTags.length === 0 && !selectedCategory;

  const getFilterShareContent = () => {
    if (selectedTags.length === 0) return "";
    return `Check out these prompts with tags: ${selectedTags.join(", ")} from The Prompt Collection`;
  };

  // Get total number of filtered prompts
  const getTotalFilteredPrompts = useCallback(() => {
    if (selectedCategory) {
      return groupedPrompts[selectedCategory]?.length || 0;
    }
    return filterPrompts().length;
  }, [selectedCategory, filterPrompts, groupedPrompts]);

  // Helper function that increments the count of a prompt and updates localStorage
  const handleSelectPrompt = (prompt) => {
    setUsageStats((prevStats) => {
      const newStats = {
        ...prevStats,
        [prompt.filename]: (prevStats[prompt.filename] || 0) + 1,
      };
      savePromptUsageStats(newStats);
      return newStats;
    });
    setSelectedPrompt(prompt);
  };

  // Compute top 5 frequently used prompts from usageStats
  const topPrompts = Object.entries(usageStats)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 5)
    .map(([filename, count]) => {
      const prompt = prompts.find((p) => p.filename === filename);
      return prompt ? { ...prompt, usageCount: count } : null;
    })
    .filter((prompt) => prompt);

  const handleToggleFavorite = (prompt) => {
    setFavoritePrompts((prev) => {
      const isFavorite = prev.includes(prompt.filename);
      const newFavorites = isFavorite
        ? prev.filter((filename) => filename !== prompt.filename)
        : [...prev, prompt.filename];
      saveFavoritePrompts(newFavorites);
      return newFavorites;
    });
  };

  // Get favorite prompts data - updated to sort by usage count
  const favoritesData = favoritePrompts
    .map((filename) => {
      const prompt = prompts.find((p) => p.filename === filename);
      return prompt ? { ...prompt, usageCount: usageStats[filename] || 0 } : null;
    })
    .filter((prompt) => prompt)
    .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0)) // Sort by usage count
    .slice(0, 5); // Take only top 5

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-4">
        <Header isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />

        {showHero && (
          <div className="flex flex-col items-center justify-center py-16 space-y-8">
            <div className="text-center space-y-6 max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white">
                Your Gateway to AI Conversations
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Discover and use curated prompts to enhance your AI interactions
              </p>
            </div>
          </div>
        )}

        {/* Search and Filters Section - Show search only when no filters are active */}
        <div
          className={`flex flex-col items-center justify-center ${showHero ? "" : "py-2"} ${selectedTags.length > 0 ? "space-y-2" : "space-y-4"}`}
        >
          {!selectedCategory && selectedTags.length === 0 && (
            <div className="w-full max-w-2xl mx-auto">
              <SearchBar onSearch={handleSearch} />
            </div>
          )}

          {/* Smart Recommendations Section */}
          {showRecommendations && !selectedCategory && selectedTags.length === 0 && (
            <PromptRecommendation
              recommendations={recommendations}
              onSelectPrompt={handleSelectPrompt}
              isLoading={isLoadingRecommendations}
            />
          )}

          <div className="w-full mx-auto space-y-0">
            {" "}
            {/* reduced spacing from space-y-1 to space-y-0 */}
            <TagFilter
              tags={visibleTags}
              selectedTags={selectedTags}
              onTagToggle={handleTagToggle}
              showAllTags={showAllTags}
              onToggleShowAllTags={() => setShowAllTags(!showAllTags)}
              tagCounts={tagCounts}
              showShareButton={!showHero}
              shareContent={getFilterShareContent()}
              shareTitle="Filtered Prompts - The Prompt Collection"
              favoritePrompts={favoritePrompts}
            />
            {/* Extracted Top Prompts Section remains unchanged */}
            {showHero && (
              <TopPrompts
                topPrompts={topPrompts}
                favoritePrompts={favoritesData}
                handleSelectPrompt={handleSelectPrompt}
                onRemoveFavorite={(prompt) => handleToggleFavorite(prompt)}
              />
            )}
          </div>
        </div>

        {/* Prompts List with full width */}
        <div
          className={`w-full ${!showHero && (selectedCategory || selectedTags.length > 0) ? "mt-1" : "mt-4"}`}
        >
          <PromptList
            prompts={visiblePrompts}
            loadMorePrompts={loadMorePrompts}
            hasMore={hasMore}
            onSelectPrompt={handleSelectPrompt}
            onQuickAction={handleQuickAction} // pass quick action handler
            selectedCategory={selectedCategory}
            onCategoryClick={handleCategoryClick}
            onBackToCategories={handleBackToCategories}
            groupedPrompts={groupedPrompts}
            showCategoryList={showCategoryList}
            totalPrompts={totalPrompts}
            totalFilteredPrompts={getTotalFilteredPrompts()}
            customTools={customTools} // Add this prop
          />
        </div>

        <BestPracticesSection />
        <TestimonialsSection />
        <ContactSection />
        {selectedPrompt && (
          <SelectedPromptModal
            selectedPrompt={selectedPrompt}
            onClose={() => setSelectedPrompt(null)}
            onCopy={handleCopy}
            isCopied={isCopied}
            onStartConversation={handleStartConversation}
            customTools={customTools}
            onAddCustomTool={handleAddCustomTool}
            onDeleteCustomTool={handleDeleteCustomTool}
            onModifyCustomTool={handleModifyCustomTool}
            isFavorite={favoritePrompts.includes(selectedPrompt.filename)}
            onToggleFavorite={() => handleToggleFavorite(selectedPrompt)}
          />
        )}
        <Footer />
      </div>
    </div>
  );
};

export default App;
