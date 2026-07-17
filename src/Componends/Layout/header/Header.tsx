import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "../../../context/ThemeContext";
import { setSearchQuery } from "../../../redux/store/createSlice";
import type { RootState } from "../../../redux/store/store";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { theme, toggleTheme } = useTheme();
  
  const searchQuery = useSelector((state: RootState) => state.show.searchQuery);
  const showstate = useSelector((state: RootState) => state.show);

  // States for expandable search component
  const [isDesktopSearchExpanded, setIsDesktopSearchExpanded] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isDropdownFocused, setIsDropdownFocused] = useState(false);

  // User session state
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

  useEffect(() => {
    setCurrentUserEmail(localStorage.getItem("cineverse_logged_in_user"));
  }, [location.pathname]);

  // Recent Searches state cached in LocalStorage
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem("recentSearches");
    return saved ? JSON.parse(saved) : ["Sherlock", "Arrow", "Dexter"];
  });

  const searchRefDesktop = useRef<HTMLDivElement>(null);
  const searchRefMobile = useRef<HTMLDivElement>(null);
  const desktopInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  // Add search term to recents list
  const addRecentSearch = (term: string) => {
    if (!term.trim()) return;
    const clean = term.trim();
    const filtered = recentSearches.filter((s) => s.toLowerCase() !== clean.toLowerCase());
    const updated = [clean, ...filtered].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  // Close suggestions dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRefDesktop.current &&
        !searchRefDesktop.current.contains(event.target as Node)
      ) {
        setIsDropdownFocused(false);
        if (searchQuery.trim() === "") {
          setIsDesktopSearchExpanded(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchQuery]);

  const handleSearchChange = (val: string) => {
    dispatch(setSearchQuery(val));
    const isHome = location.pathname === "/layout" || location.pathname === "/layout/Home";
    if (!isHome && val.trim() !== "") {
      navigate("/layout");
    }
  };

  const handleSuggestionClick = (term: string, isActualShow = false, showId?: number) => {
    if (isActualShow && showId) {
      navigate(`/layout/Showdetails/${showId}`);
      setIsDropdownFocused(false);
      setIsMobileSearchOpen(false);
    } else {
      dispatch(setSearchQuery(term));
      addRecentSearch(term);
      setIsDropdownFocused(false);
      setIsMobileSearchOpen(false);
      const isHome = location.pathname === "/layout" || location.pathname === "/layout/Home";
      if (!isHome) {
        navigate("/layout");
      }
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      addRecentSearch(searchQuery);
      setIsDropdownFocused(false);
      setIsMobileSearchOpen(false);
    }
  };

  const handleLogoClick = () => {
    dispatch(setSearchQuery(""));
    setIsDesktopSearchExpanded(false);
    setIsMobileSearchOpen(false);
    navigate("/layout");
  };

  // Filter shows based on query for suggestions
  const matchingShows = searchQuery.trim() && showstate.data
    ? showstate.data.filter((show: any) =>
        show.name?.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const trendingSearches = ["Action", "Drama", "Comedy", "Science-Fiction", "Thriller"];

  const renderSuggestionsDropdown = () => {
    const hasQuery = searchQuery.trim() !== "";
    
    return (
      <div className={`w-full md:w-[360px] rounded-2xl border shadow-2xl p-4 overflow-hidden animate-fade-in ${
        theme === "dark"
          ? "bg-[#16171a] border-white/5 text-gray-300 shadow-black/80"
          : "bg-white border-gray-200 text-gray-700 shadow-gray-300/40"
      }`}>
        {!hasQuery ? (
          <div className="flex flex-col gap-4">
            {recentSearches.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-[10px] font-black uppercase tracking-wider ${
                    theme === "dark" ? "text-gray-500" : "text-gray-400"
                  }`}>
                    Recent Searches
                  </span>
                  <button 
                    onClick={clearRecentSearches}
                    className="text-[10px] font-bold text-[#7c3aed] hover:underline cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {recentSearches.map((term, idx) => (
                    <span
                      key={idx}
                      onClick={() => handleSuggestionClick(term)}
                      className={`text-xs px-2.5 py-1 rounded-lg border font-semibold cursor-pointer transition-all duration-200 ${
                        theme === "dark"
                          ? "bg-white/5 border-white/10 text-gray-300 hover:bg-[#7c3aed] hover:text-white hover:border-[#7c3aed]"
                          : "bg-gray-100 border-gray-200 text-gray-650 hover:bg-[#7c3aed] hover:text-white hover:border-[#7c3aed]"
                      }`}
                    >
                      {term}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <span className={`text-[10px] font-black uppercase tracking-wider block mb-2 ${
                theme === "dark" ? "text-gray-500" : "text-gray-400"
              }`}>
                Trending Genres
              </span>
              <div className="flex flex-wrap gap-1.5">
                {trendingSearches.map((term, idx) => (
                  <span
                    key={idx}
                    onClick={() => handleSuggestionClick(term)}
                    className={`text-xs px-2.5 py-1 rounded-lg border font-semibold cursor-pointer transition-all duration-200 ${
                      theme === "dark"
                        ? "bg-white/5 border-white/10 text-gray-300 hover:bg-[#7c3aed] hover:text-white hover:border-[#7c3aed]"
                        : "bg-gray-100 border-gray-200 text-gray-650 hover:bg-[#7c3aed] hover:text-white hover:border-[#7c3aed]"
                    }`}
                  >
                    {term}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <span className={`text-[10px] font-black uppercase tracking-wider block mb-2.5 ${
              theme === "dark" ? "text-gray-500" : "text-gray-400"
            }`}>
              Matching Titles
            </span>
            {matchingShows.length > 0 ? (
              <div className="flex flex-col gap-1.5">
                {matchingShows.map((show: any) => (
                  <div
                    key={show.id}
                    onClick={() => handleSuggestionClick(show.name, true, show.id)}
                    className={`flex items-center gap-3 p-1.5 rounded-xl cursor-pointer transition-colors duration-205 ${
                      theme === "dark" ? "hover:bg-white/5" : "hover:bg-gray-100"
                    }`}
                  >
                    {show.image?.medium ? (
                      <img 
                        src={show.image.medium} 
                        alt={show.name} 
                        className="w-9 h-12 rounded-lg object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className={`w-9 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        theme === "dark" ? "bg-[#2b2c34]" : "bg-gray-200"
                      }`}>
                        <svg className="w-4 h-4 text-gray-400 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        </svg>
                      </div>
                    )}
                    <div className="overflow-hidden flex-grow">
                      <div className={`text-xs md:text-sm font-bold truncate ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}>
                        {show.name}
                      </div>
                      <div className="text-[10px] text-gray-450 font-semibold truncate flex items-center gap-1.5 mt-0.5">
                        {show.rating?.average && (
                          <span className="text-yellow-500 flex items-center gap-0.5">
                            ★ {show.rating.average}
                          </span>
                        )}
                        <span>•</span>
                        <span>{show.genres?.slice(0, 2).join(", ")}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`text-xs text-center py-4 ${
                theme === "dark" ? "text-gray-500" : "text-gray-400"
              }`}>
                No matches found
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`sticky top-0 z-50 backdrop-blur-md border-b py-3.5 px-4 md:px-8 flex items-center justify-between transition-all duration-300 ${
      theme === "dark"
        ? "bg-[#0f1013]/85 border-white/5 text-gray-300 shadow-md"
        : "bg-white/85 border-gray-200 text-gray-700 shadow-sm"
    }`}>
      
      {/* Brand Name / Logo */}
      <div
        onClick={handleLogoClick}
        className="text-[#7c3aed] font-black tracking-[0.2em] text-base md:text-xl cursor-pointer hover:scale-105 transition-transform select-none flex-shrink-0"
      >
        CINEVERSE
      </div>

      {/* Actions (Desktop Search, Mobile Search, Theme toggle) */}
      <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
        
        {/* Desktop Expandable Search */}
        <div ref={searchRefDesktop} className="relative hidden md:flex items-center">
          <form onSubmit={handleSearchSubmit} className="flex items-center">
            <div className={`relative flex items-center border rounded-full px-3 py-1.5 transition-all duration-350 ease-in-out ${
              isDesktopSearchExpanded 
                ? "w-64 border-[#7c3aed] bg-white dark:bg-white/10" 
                : "w-10 border-transparent bg-transparent cursor-pointer"
            }`}>
              <button
                type="button"
                onClick={() => {
                  if (!isDesktopSearchExpanded) {
                    setIsDesktopSearchExpanded(true);
                    setTimeout(() => desktopInputRef.current?.focus(), 150);
                  } else if (searchQuery.trim() === "") {
                    setIsDesktopSearchExpanded(false);
                  } else {
                    addRecentSearch(searchQuery);
                    setIsDropdownFocused(false);
                  }
                }}
                className={`p-0 cursor-pointer flex items-center justify-center outline-none ${
                  theme === "dark" ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"
                }`}
                aria-label="Search"
              >
                <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>

              <input
                ref={desktopInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => setIsDropdownFocused(true)}
                placeholder="Titles, genres..."
                className={`bg-transparent border-0 outline-none text-xs md:text-sm font-semibold focus:ring-0 p-0 ml-2 transition-all duration-300 ${
                  isDesktopSearchExpanded ? "w-48 opacity-100" : "w-0 opacity-0 pointer-events-none"
                } ${
                  theme === "dark" ? "text-white placeholder-gray-500" : "text-gray-900 placeholder-gray-400"
                }`}
              />

              {isDesktopSearchExpanded && searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    dispatch(setSearchQuery(""));
                    desktopInputRef.current?.focus();
                  }}
                  className={`p-0.5 rounded-full cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 ml-1 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
          </form>

          {/* Suggestion Dropdown Float for Desktop */}
          {isDesktopSearchExpanded && isDropdownFocused && (
            <div className="absolute right-0 top-full mt-2.5 z-55">
              {renderSuggestionsDropdown()}
            </div>
          )}
        </div>

        {/* Mobile Search Toggle Icon */}
        <button
          onClick={() => {
            setIsMobileSearchOpen(true);
            setTimeout(() => mobileInputRef.current?.focus(), 150);
          }}
          className={`md:hidden p-2 rounded-lg cursor-pointer ${
            theme === "dark" ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"
          }`}
          aria-label="Open Search"
        >
          <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-lg border transition-all duration-300 cursor-pointer flex items-center justify-center ${
            theme === "dark"
              ? "bg-white/5 border-white/10 text-yellow-400 hover:bg-white/10 hover:text-yellow-300"
              : "bg-gray-100 border-gray-200 text-[#7c3aed] hover:bg-gray-200 hover:text-indigo-700"
          }`}
          aria-label="Toggle Theme"
        >
          {theme === "dark" ? (
            <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        {/* Profile Button */}
        <button
          onClick={() => navigate("/layout/profile")}
          className={`p-1 rounded-full border transition-all duration-300 cursor-pointer flex items-center justify-center ${
            location.pathname === "/layout/profile"
              ? "border-[#7c3aed] bg-[#7c3aed]/10 text-[#7c3aed]"
              : theme === "dark"
              ? "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white"
              : "bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200 hover:text-[#7c3aed]"
          }`}
          aria-label="User Profile"
          title="User Profile"
        >
          {currentUserEmail ? (
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#7c3aed] to-[#a78bfa] text-white flex items-center justify-center text-xs font-black select-none shadow-md">
              {currentUserEmail.substring(0, 1).toUpperCase()}
            </div>
          ) : (
            <div className="w-7 h-7 flex items-center justify-center">
              <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
          )}
        </button>
      </div>

      {/* Mobile Search Overlay */}
      {isMobileSearchOpen && (
        <div className={`fixed inset-0 h-screen z-55 flex flex-col transition-colors duration-300 ${
          theme === "dark" ? "bg-[#0f1013]" : "bg-[#f3f4f6]"
        }`}>
          <div ref={searchRefMobile} className={`flex items-center gap-3 px-4 py-3 border-b animate-slide-down ${
            theme === "dark" ? "bg-[#16171a] border-white/5" : "bg-white border-gray-200"
          }`}>
            <button
              onClick={() => {
                setIsMobileSearchOpen(false);
                dispatch(setSearchQuery(""));
              }}
              className={`p-1.5 rounded-lg cursor-pointer ${
                theme === "dark" ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"
              }`}
              aria-label="Back"
            >
              <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </button>

            <form onSubmit={handleSearchSubmit} className="flex-grow flex items-center relative">
              <input
                ref={mobileInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search movies, genres..."
                className={`w-full bg-transparent border-0 outline-none text-sm font-semibold focus:ring-0 p-0 ${
                  theme === "dark" ? "text-white placeholder-gray-500" : "text-gray-900 placeholder-gray-400"
                }`}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    dispatch(setSearchQuery(""));
                    mobileInputRef.current?.focus();
                  }}
                  className={`p-0.5 rounded-full cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 absolute right-0 ${
                    theme === "dark" ? "text-gray-450" : "text-gray-500"
                  }`}
                >
                  <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </form>
          </div>

          <div className="flex-grow overflow-y-auto p-4 flex justify-center">
            {renderSuggestionsDropdown()}
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;