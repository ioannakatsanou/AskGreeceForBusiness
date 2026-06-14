import { useLocalStorage } from "./useLocalStorage.js";
import { STORAGE_KEYS, MAX_RECENT_SEARCHES } from "../lib/constants.js";

// Manages the recent-searches list in localStorage (most-recent first, de-duped).
export function useRecentSearches() {
  const [recent, setRecent] = useLocalStorage(STORAGE_KEYS.recentSearches, []);

  const addSearch = (keyword, resultCount = 0) => {
    const term = (keyword || "").trim();
    if (!term) return;
    setRecent((prev) => {
      const without = prev.filter((r) => r.keyword.toLowerCase() !== term.toLowerCase());
      return [{ keyword: term, timestamp: new Date().toISOString(), resultCount }, ...without].slice(
        0,
        MAX_RECENT_SEARCHES
      );
    });
  };

  const clearSearches = () => setRecent([]);

  return { recent, addSearch, clearSearches };
}
