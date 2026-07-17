import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../../redux/store/store";
import { tvshow } from "../../redux/store/createSlice";
import Cards from "../../Componends/cards/Cards";
import CardSkeleton from "../../Componends/skeletons/CardSkeleton";
import { useTheme } from "../../context/ThemeContext";

const TRENDING_SUGGESTIONS = [
  "Action",
  "Drama",
  "Comedy",
  "Science-Fiction",
  "Thriller",
  "Romance",
  "Sherlock",
  "Arrow",
  "Dexter",
  "Gotham",
];

export default function Searchshow() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const showstate = useSelector((state: RootState) => state.show);
  const { theme } = useTheme();

  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load TV shows if not already loaded in Redux
  useEffect(() => {
    if (!showstate.data || showstate.data.length === 0) {
      dispatch(tvshow());
    }
  }, [dispatch, showstate.data]);

  // Load recent searches from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("recent_searches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Save a search term to LocalStorage
  const saveSearchTerm = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 6);
      localStorage.setItem("recent_searches", JSON.stringify(updated));
      return updated;
    });
  };

  // Clear all recent searches
  const clearAllRecent = () => {
    localStorage.removeItem("recent_searches");
    setRecentSearches([]);
  };

  // Remove a single recent search term
  const removeRecentTerm = (termToRemove: string) => {
    setRecentSearches((prev) => {
      const updated = prev.filter((t) => t !== termToRemove);
      localStorage.setItem("recent_searches", JSON.stringify(updated));
      return updated;
    });
  };

  // Handle live search input key events (like Enter to commit)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      saveSearchTerm(query);
    }
  };

  // Filter shows based on query
  const filteredShows = showstate.data
    ? showstate.data.filter((show: any) => {
        const titleMatch = show.name?.toLowerCase().includes(query.toLowerCase());
        const genreMatch = show.genres?.some((g: string) =>
          g.toLowerCase().includes(query.toLowerCase())
        );
        const summaryMatch = show.summary?.toLowerCase().includes(query.toLowerCase());
        return titleMatch || genreMatch || summaryMatch;
      })
    : [];

  return (
    <div className={`min-h-screen p-6 md:p-8 pt-12 ${
      theme === "dark" ? "bg-[#0f1013] text-white" : "bg-[#f3f4f6] text-gray-900"
    }`}>
      <div className="max-w-7xl mx-auto">
        
        {/* Search Input Container */}
        <div className="w-full max-w-2xl mx-auto mb-10">
          <div className={`relative flex items-center border rounded-2xl p-1 focus-within:border-[#e0534c] focus-within:shadow-[0_0_20px_rgba(224,83,76,0.15)] transition-all duration-300 ${
            theme === "dark"
              ? "bg-[#1e1f24] border-white/5"
              : "bg-white border-gray-300"
          }`}>
            {/* Search Icon */}
            <div className={`pl-4 pr-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
              <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>

            {/* Input */}
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search by title, genre, or keywords..."
              className={`w-full bg-transparent border-0 outline-none py-3 pr-4 text-sm md:text-base font-medium focus:ring-0 ${
                theme === "dark" ? "text-white placeholder-gray-500" : "text-gray-900 placeholder-gray-400"
              }`}
            />

            {/* Clear Button */}
            {query && (
              <button
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                className={`p-2 mr-2 rounded-full transition-colors cursor-pointer ${
                  theme === "dark" ? "text-gray-400 hover:text-white hover:bg-white/5" : "text-gray-500 hover:text-gray-900 hover:bg-black/5"
                }`}
              >
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* History and Suggestions (when query is empty) */}
        {!query && (
          <div className="max-w-2xl mx-auto flex flex-col gap-8">
            
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h3 className={`text-xs md:text-sm font-bold tracking-wider uppercase ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}>
                    Recent Searches
                  </h3>
                  <button
                    onClick={clearAllRecent}
                    className="text-xs text-[#e0534c] hover:underline font-semibold cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {recentSearches.map((term, index) => (
                    <div
                      key={index}
                      className={`group flex items-center border rounded-xl px-3 py-1.5 transition-all duration-200 cursor-pointer shadow-md ${
                        theme === "dark"
                          ? "bg-[#1e1f24] hover:bg-[#2b2c34] border-white/5 text-gray-300"
                          : "bg-white hover:bg-gray-100 border-gray-200 text-gray-700"
                      }`}
                      onClick={() => setQuery(term)}
                    >
                      <span className="text-xs font-semibold">{term}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeRecentTerm(term);
                        }}
                        className={`ml-2 focus:outline-none ${
                          theme === "dark" ? "text-gray-500 hover:text-red-400" : "text-gray-400 hover:text-red-500"
                        }`}
                      >
                        <svg className="w-3 h-3 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trending/Suggested Searches */}
            <div className="flex flex-col gap-3">
              <h3 className={`text-xs md:text-sm font-bold tracking-wider uppercase ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}>
                Trending Searches
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {TRENDING_SUGGESTIONS.map((term, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setQuery(term);
                      saveSearchTerm(term);
                    }}
                    className={`border rounded-xl px-4 py-2 text-xs font-semibold shadow-md transition-all duration-300 hover:scale-105 cursor-pointer ${
                      theme === "dark"
                        ? "bg-[#1e1f24] hover:bg-[#e0534c] hover:text-white border-white/5 text-gray-300"
                        : "bg-white border-gray-200 hover:bg-[#e0534c] hover:text-white hover:border-[#e0534c] text-gray-700"
                    }`}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Loading Skeletons */}
        {query && showstate.isloading && (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6 justify-items-center">
            {Array.from({ length: 8 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Search Results Display */}
        {query && !showstate.isloading && (
          <div>
            <h2 className={`text-base md:text-lg font-bold mb-6 tracking-wide ${
              theme === "dark" ? "text-gray-450" : "text-gray-500"
            }`}>
              Search Results for <span className={theme === "dark" ? "text-white" : "text-gray-900"}>"{query}"</span>
            </h2>

            {filteredShows.length > 0 ? (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6 justify-items-center">
                {filteredShows.map((show: any) => (
                  <div
                    key={show.id}
                    onClick={() => {
                      saveSearchTerm(query);
                      navigate(`/layout/Showdetails/${show.id}`);
                    }}
                  >
                    <Cards
                      title={show.name}
                      rating={show.rating?.average ?? "N/A"}
                      genres={show.genres}
                      imageUrl={show.image?.medium}
                    />
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State Page */
              <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
                <div className={`w-24 h-24 mb-6 rounded-full flex items-center justify-center border animate-bounce ${
                  theme === "dark"
                    ? "text-gray-650 bg-[#1e1f24] border-white/5"
                    : "text-gray-400 bg-white border-gray-200"
                }`}>
                  <svg className="w-12 h-12 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                </div>
                <h3 className={`text-lg md:text-xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  No shows found
                </h3>
                <p className={`text-sm max-w-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  We couldn't find any results matching "{query}". Try checking the spelling or using different keywords.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}