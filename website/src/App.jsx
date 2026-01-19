import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import CyberNavbar from "./components/Navigation/CyberNavbar";
import CyberHero from "./components/Hero/CyberHero";
import SearchBar from "./components/SearchBar/SearchBar";
import TagFilter from "./components/TagFilter/TagFilter";
import PromptList from "./components/PromptList/PromptList";
import SelectedPromptModal from "./components/SelectedPromptModal/SelectedPromptModal";
import Footer from "./components/Footer/Footer";
import prompts from "./data/prompts.json";
import debounce from "lodash.debounce";
import aiTools from "./data/ai-tools.json";
import TopPrompts from "./components/TopPrompts";
import PromptRecommendation from "./components/PromptRecommendation";
import { getRecommendations, isRecommendationQuery } from "./utils/recommendationEngine";
import {
  loadStoredState,
  saveCustomTools,
  savePromptUsageStats,
  saveToolUsageStats,
  saveFavoritePrompts,
  loadCustomTools,
} from "./utils/localStorage";

const PAGE_SIZE = 20; // Number of prompts to load at a time

const App = () => {
  const storedState = loadStoredState();
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

  // Derived variable to detect search mode
  const isSearchMode = searchQuery.trim().length > 0;

  // Load custom tools from localStorage on initial render
  useEffect(() => {
    const storedTools = loadCustomTools();
    setCustomTools(storedTools);
  }, []);

  // Save custom tools to localStorage whenever they change
  useEffect(() => {
    saveCustomTools(customTools);
  }, [customTools]);

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

  // Debounced search handler with recommendations (memoized to prevent unnecessary re-renders)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearch = useCallback(
    debounce((query) => {
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
    }, 300),
    []
  );

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
    setShowHero(!selectedCategory && selectedTags.length === 0 && !isSearchMode);
  }, [selectedCategory, selectedTags, isSearchMode]);

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

  const handleNavigation = (section) => {
    switch (section) {
      case "home":
        window.scrollTo({ top: 0, behavior: "smooth" });
        setSelectedCategory(null);
        setSelectedTags([]);
        break;
      case "browse": {
        const browseElement = document.getElementById("browse-section");
        if (browseElement) {
          browseElement.scrollIntoView({ behavior: "smooth" });
        } else {
          window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
        }
        break;
      }
      case "features":
        window.scrollTo({ top: window.innerHeight * 2, behavior: "smooth" });
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-cyber-black text-cyber-white">
      {/* Navigation */}
      <CyberNavbar activeSection="home" onNavigate={handleNavigation} />

      {/* Hero Section */}
      {showHero && <CyberHero onSearchChange={handleSearch} />}

      {/* Main Content Container */}
      <main className={`relative z-10 ${!showHero ? "pt-32" : ""}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Search and Filters Section */}
          <div className="flex flex-col items-center justify-center space-y-6 md:space-y-8">
            {/* Search Bar - visible during search mode */}
            {isSearchMode && (
              <div className="w-full max-w-2xl">
                <SearchBar onSearch={handleSearch} searchQuery={searchQuery} />
              </div>
            )}

            {/* Smart Recommendations */}
            {showRecommendations && !selectedCategory && selectedTags.length === 0 && (
              <PromptRecommendation
                recommendations={recommendations}
                onSelectPrompt={handleSelectPrompt}
                isLoading={isLoadingRecommendations}
              />
            )}

            {/* Tag Filter and Top Prompts - hidden during search mode */}
            {!isSearchMode && (
              <div className="w-full space-y-6 md:space-y-8">
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

                {/* Top Prompts - only show on hero */}
                {showHero && (
                  <TopPrompts
                    topPrompts={topPrompts}
                    favoritePrompts={favoritesData}
                    handleSelectPrompt={handleSelectPrompt}
                    onRemoveFavorite={(prompt) => handleToggleFavorite(prompt)}
                  />
                )}
              </div>
            )}
          </div>

          {/* Prompts List */}
          <section id="browse-section" className="mt-12 md:mt-16">
            <PromptList
              prompts={visiblePrompts}
              loadMorePrompts={loadMorePrompts}
              hasMore={hasMore}
              onSelectPrompt={handleSelectPrompt}
              onQuickAction={handleQuickAction}
              selectedCategory={selectedCategory}
              onCategoryClick={handleCategoryClick}
              onBackToCategories={handleBackToCategories}
              groupedPrompts={groupedPrompts}
              showCategoryList={showCategoryList}
              totalPrompts={totalPrompts}
              totalFilteredPrompts={getTotalFilteredPrompts()}
              customTools={customTools}
            />
          </section>
        </div>
      </main>

      {/* Modal with AnimatePresence */}
      <AnimatePresence>
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
      </AnimatePresence>

      {/* Footer - hidden during search mode */}
      {!isSearchMode && <Footer />}
    </div>
  );
};

export default App;
