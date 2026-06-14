import { useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "../features/search/SearchBar.jsx";
import ResultCard from "../features/search/ResultCard.jsx";
import Button from "../components/ui/Button.jsx";
import { Loading, ErrorState, EmptyState, CardSkeleton } from "../components/feedback/States.jsx";
import { useApi } from "../hooks/useApi.js";
import { useRecentSearches } from "../hooks/useRecentSearches.js";
import { searchOpportunities } from "../api/client.js";
import { MAX_RESULTS, SEARCH_EXAMPLES } from "../lib/constants.js";

export default function SearchResults() {
  const [params] = useSearchParams();
  const keyword = params.get("q") || "";
  const { addSearch } = useRecentSearches();

  // Retrieval via the central API client (backend when available, mock fallback).
  const { data, loading, error, retry } = useApi(() => searchOpportunities(keyword), [keyword]);

  // Record the search in localStorage once results resolve (once per keyword).
  const recordedRef = useRef("");
  useEffect(() => {
    if (!loading && !error && keyword && recordedRef.current !== keyword) {
      recordedRef.current = keyword;
      addSearch(keyword, data?.length || 0);
    }
  }, [loading, error, keyword, data, addSearch]);

  const heading = useMemo(
    () => (keyword ? `Results for “${keyword}”` : "All active opportunities"),
    [keyword]
  );

  return (
    <div className="stack" style={{ gap: "var(--s-5)" }}>
      <SearchBar initialValue={keyword} />

      <div className="spread">
        <h2 style={{ margin: 0 }}>{heading}</h2>
        {!loading && !error && data && (
          <span className="faint">
            {data.length} of max {MAX_RESULTS}
          </span>
        )}
      </div>

      {loading && (
        <>
          <Loading label="Searching active opportunities…" />
          <div className="stack">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </>
      )}

      {!loading && error && <ErrorState message={error} onRetry={retry} />}

      {!loading && !error && data && data.length === 0 && (
        <EmptyState
          icon="📭"
          title="No matching opportunities"
          message={`We couldn't find active tenders for “${keyword}”. Try a broader keyword.`}
          action={
            <div className="row-wrap" style={{ justifyContent: "center" }}>
              {SEARCH_EXAMPLES.map((ex) => (
                <Button key={ex} to={`/search?q=${encodeURIComponent(ex)}`} variant="secondary">
                  {ex}
                </Button>
              ))}
            </div>
          }
        />
      )}

      {!loading && !error && data && data.length > 0 && (
        <div className="stack">
          {data.map((t) => (
            <ResultCard key={t.id} tender={t} />
          ))}
        </div>
      )}
    </div>
  );
}
