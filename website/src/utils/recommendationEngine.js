/**
 * Recommendation Engine - Pure frontend text similarity scoring
 * Uses TF-IDF-like scoring to find the best matching prompts for user queries
 */

/**
 * Tokenize text into words, removing common stop words and normalizing
 * @param {string} text - Text to tokenize
 * @returns {string[]} Array of tokens
 */
const stopWords = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "but",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "have",
  "has",
  "had",
  "do",
  "does",
  "did",
  "will",
  "would",
  "could",
  "should",
  "may",
  "might",
  "must",
  "shall",
  "can",
  "need",
  "dare",
  "ought",
  "used",
  "to",
  "of",
  "in",
  "for",
  "on",
  "with",
  "at",
  "by",
  "from",
  "as",
  "into",
  "through",
  "during",
  "before",
  "after",
  "above",
  "below",
  "between",
  "under",
  "again",
  "further",
  "then",
  "once",
  "here",
  "there",
  "when",
  "where",
  "why",
  "how",
  "all",
  "each",
  "few",
  "more",
  "most",
  "other",
  "some",
  "such",
  "no",
  "nor",
  "not",
  "only",
  "own",
  "same",
  "so",
  "than",
  "too",
  "very",
  "just",
  "also",
  "now",
  "it",
  "its",
  "this",
  "that",
  "these",
  "those",
  "i",
  "me",
  "my",
  "myself",
  "we",
  "our",
  "ours",
  "you",
  "your",
  "yours",
  "he",
  "him",
  "his",
  "she",
  "her",
  "hers",
  "they",
  "them",
  "their",
  "what",
  "which",
  "who",
  "whom",
  "if",
  "because",
  "until",
  "while",
  "about",
  "against",
  "any",
  "both",
  "down",
  "up",
  "out",
  "off",
  "over",
  "am",
  "get",
  "got",
  "make",
]);

function tokenize(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, " ") // Keep hyphens for compound words
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.has(word));
}

/**
 * Calculate term frequency for a document
 * @param {string[]} tokens - Array of tokens
 * @returns {Map<string, number>} Map of term frequencies
 */
function calculateTF(tokens) {
  const tf = new Map();
  const totalTerms = tokens.length;
  if (totalTerms === 0) return tf;

  tokens.forEach((token) => {
    tf.set(token, (tf.get(token) || 0) + 1);
  });

  // Normalize by document length
  tf.forEach((count, term) => {
    tf.set(term, count / totalTerms);
  });

  return tf;
}

/**
 * Calculate IDF scores for all terms across documents
 * @param {Array<string[]>} allTokens - Array of token arrays for each document
 * @returns {Map<string, number>} Map of IDF scores
 */
function calculateIDF(allTokens) {
  const idf = new Map();
  const totalDocs = allTokens.length;
  const docFrequency = new Map();

  // Count document frequency for each term
  allTokens.forEach((tokens) => {
    const uniqueTokens = new Set(tokens);
    uniqueTokens.forEach((token) => {
      docFrequency.set(token, (docFrequency.get(token) || 0) + 1);
    });
  });

  // Calculate IDF
  docFrequency.forEach((df, term) => {
    idf.set(term, Math.log((totalDocs + 1) / (df + 1)) + 1); // Smoothed IDF
  });

  return idf;
}

/**
 * Calculate similarity score between query and a prompt
 * @param {string[]} queryTokens - Tokenized query
 * @param {string[]} promptTokens - Tokenized prompt content
 * @param {Map<string, number>} idf - IDF scores
 * @returns {number} Similarity score (0-100)
 */
function calculateSimilarity(queryTokens, promptTokens, idf) {
  if (queryTokens.length === 0 || promptTokens.length === 0) return 0;

  const queryTF = calculateTF(queryTokens);
  const promptTF = calculateTF(promptTokens);

  let score = 0;
  let queryMagnitude = 0;
  let promptMagnitude = 0;

  // Calculate weighted dot product and magnitudes
  queryTF.forEach((qtf, term) => {
    const termIdf = idf.get(term) || 1;
    const queryWeight = qtf * termIdf;
    queryMagnitude += queryWeight * queryWeight;

    if (promptTF.has(term)) {
      const promptWeight = promptTF.get(term) * termIdf;
      score += queryWeight * promptWeight;
    }
  });

  promptTF.forEach((ptf, term) => {
    const termIdf = idf.get(term) || 1;
    const promptWeight = ptf * termIdf;
    promptMagnitude += promptWeight * promptWeight;
  });

  // Cosine similarity
  if (queryMagnitude === 0 || promptMagnitude === 0) return 0;
  const cosineSim = score / (Math.sqrt(queryMagnitude) * Math.sqrt(promptMagnitude));

  return cosineSim;
}

/**
 * Calculate bonus score for exact phrase matches
 * @param {string} query - Original query string
 * @param {string} text - Text to search in
 * @returns {number} Bonus score (0-1)
 */
function calculatePhraseMatchBonus(query, text) {
  if (!query || !text) return 0;
  const lowerQuery = query.toLowerCase();
  const lowerText = text.toLowerCase();

  // Exact phrase match bonus
  if (lowerText.includes(lowerQuery)) return 0.3;

  // Check for word sequence matches (partial phrase)
  const queryWords = lowerQuery.split(/\s+/).filter((w) => w.length > 2);
  if (queryWords.length < 2) return 0;

  let sequenceBonus = 0;
  for (let i = 0; i < queryWords.length - 1; i++) {
    const bigram = queryWords[i] + " " + queryWords[i + 1];
    if (lowerText.includes(bigram)) {
      sequenceBonus += 0.05;
    }
  }

  return Math.min(sequenceBonus, 0.15);
}

/**
 * Calculate tag match bonus
 * @param {string[]} queryTokens - Query tokens
 * @param {string[]} tags - Prompt tags
 * @returns {number} Bonus score (0-1)
 */
function calculateTagMatchBonus(queryTokens, tags) {
  if (!queryTokens.length || !tags || !tags.length) return 0;

  const tagSet = new Set(tags.map((t) => t.toLowerCase()));
  let matchCount = 0;

  queryTokens.forEach((token) => {
    if (tagSet.has(token)) {
      matchCount++;
    }
    // Also check for partial tag matches
    tags.forEach((tag) => {
      if (tag.toLowerCase().includes(token) || token.includes(tag.toLowerCase())) {
        matchCount += 0.5;
      }
    });
  });

  return Math.min(matchCount * 0.1, 0.3);
}

/**
 * Calculate category match bonus
 * @param {string[]} queryTokens - Query tokens
 * @param {string} category - Prompt category
 * @returns {number} Bonus score (0-1)
 */
function calculateCategoryMatchBonus(queryTokens, category) {
  if (!queryTokens.length || !category) return 0;

  const categoryLower = category.toLowerCase();
  let bonus = 0;

  queryTokens.forEach((token) => {
    if (categoryLower === token) {
      bonus += 0.2;
    } else if (categoryLower.includes(token) || token.includes(categoryLower)) {
      bonus += 0.1;
    }
  });

  return Math.min(bonus, 0.25);
}

/**
 * Main recommendation function - finds best matching prompts for a user query
 * @param {string} query - User's natural language query
 * @param {Array} prompts - Array of prompt objects
 * @param {number} topN - Number of recommendations to return (default: 3)
 * @returns {Array<{prompt: Object, score: number, matchReasons: string[]}>} Top recommendations with scores
 */
export function getRecommendations(query, prompts, topN = 3) {
  if (!query || !query.trim() || !prompts || prompts.length === 0) {
    return [];
  }

  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) {
    return [];
  }

  // Create searchable text for each prompt
  const promptTexts = prompts.map((prompt) => {
    const parts = [
      prompt.category || "",
      prompt.summary || "",
      prompt.usage || "",
      prompt.content || "",
      (prompt.tags || []).join(" "),
      (prompt.subcategories || []).join(" "),
    ];
    return parts.join(" ");
  });

  // Tokenize all prompts
  const allPromptTokens = promptTexts.map((text) => tokenize(text));

  // Calculate IDF across all prompts
  const idf = calculateIDF([queryTokens, ...allPromptTokens]);

  // Score each prompt
  const scoredPrompts = prompts.map((prompt, index) => {
    const promptTokens = allPromptTokens[index];
    const promptText = promptTexts[index];

    // Base similarity score
    let similarity = calculateSimilarity(queryTokens, promptTokens, idf);

    // Add bonuses
    const phraseBonus = calculatePhraseMatchBonus(query, promptText);
    const tagBonus = calculateTagMatchBonus(queryTokens, prompt.tags);
    const categoryBonus = calculateCategoryMatchBonus(queryTokens, prompt.category);

    // Weight summary and usage matches higher
    const summaryTokens = tokenize(prompt.summary || "");
    const usageTokens = tokenize(prompt.usage || "");
    const summaryBonus = calculateSimilarity(queryTokens, summaryTokens, idf) * 0.15;
    const usageBonus = calculateSimilarity(queryTokens, usageTokens, idf) * 0.1;

    const totalScore =
      similarity + phraseBonus + tagBonus + categoryBonus + summaryBonus + usageBonus;

    // Generate match reasons
    const matchReasons = [];
    if (categoryBonus > 0.1) matchReasons.push(`Category: ${prompt.category}`);
    if (tagBonus > 0.05) {
      const matchedTags =
        prompt.tags?.filter((tag) =>
          queryTokens.some((qt) => tag.toLowerCase().includes(qt) || qt.includes(tag.toLowerCase()))
        ) || [];
      if (matchedTags.length > 0) matchReasons.push(`Tags: ${matchedTags.slice(0, 3).join(", ")}`);
    }
    if (phraseBonus > 0.1) matchReasons.push("Phrase match");
    if (summaryBonus > 0.02) matchReasons.push("Summary match");
    if (similarity > 0.1) matchReasons.push("Content relevance");

    return {
      prompt,
      score: totalScore,
      matchReasons,
    };
  });

  // Sort by score and return top N
  const topResults = scoredPrompts
    .filter((item) => item.score > 0.05) // Filter out very low scores
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);

  // Normalize scores to 0-100 range for display
  if (topResults.length > 0) {
    const maxScore = topResults[0].score;
    topResults.forEach((item) => {
      item.displayScore = Math.min(Math.round((item.score / maxScore) * 100), 99);
      // Ensure minimum score of 50 for top results to look reasonable
      if (item.displayScore < 50 && item === topResults[0]) {
        item.displayScore = Math.round(50 + item.score * 100);
      }
    });
  }

  return topResults;
}

/**
 * Quick check if query seems like a recommendation request
 * @param {string} query - User's query
 * @returns {boolean} True if query looks like a recommendation request
 */
export function isRecommendationQuery(query) {
  if (!query || query.trim().length < 5) return false;

  // If the query is descriptive (contains action words or has multiple words), it's likely a recommendation request
  const queryLower = query.toLowerCase();
  const recommendationIndicators = [
    "help",
    "want",
    "need",
    "looking",
    "find",
    "search",
    "create",
    "write",
    "generate",
    "make",
    "build",
    "improve",
    "assistant",
    "prompt",
    "for",
    "about",
    "with",
    "can",
    "how",
    "best",
    "good",
  ];

  const hasIndicator = recommendationIndicators.some((word) => queryLower.includes(word));
  const hasMultipleWords = query.trim().split(/\s+/).length >= 2;

  return hasIndicator || hasMultipleWords;
}

export default { getRecommendations, isRecommendationQuery };
