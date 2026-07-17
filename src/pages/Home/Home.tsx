import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../../redux/store/store";
import { tvshow, setSearchQuery } from "../../redux/store/createSlice";
import ShowRow from "../../Componends/ShowRow/ShowRow";
import HeroSkeleton from "../../Componends/skeletons/HeroSkeleton";
import CardSkeleton from "../../Componends/skeletons/CardSkeleton";
import { useTheme } from "../../context/ThemeContext";
import Cards from "../../Componends/cards/Cards";

function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const showstate = useSelector((state: RootState) => state.show);
  const searchQuery = useSelector((state: RootState) => state.show.searchQuery);
  const { theme } = useTheme();

  // Load TV shows if not already loaded in Redux to prevent unnecessary refetching
  useEffect(() => {
    if (!showstate.data || showstate.data.length === 0) {
      dispatch(tvshow());
    }
  }, [dispatch, showstate.data]);

  // Group shows by genres
  const getShowsByGenre = (genre: string) => {
    if (!showstate.data) return [];
    return showstate.data.filter((show: any) =>
      show.genres?.some((g: string) => g.toLowerCase() === genre.toLowerCase())
    );
  };

  // Trending row (sorted by rating)
  const trendingShows = showstate.data
    ? [...showstate.data].sort(
        (a: any, b: any) => (b.rating?.average ?? 0) - (a.rating?.average ?? 0)
      )
    : [];

  const dramaShows = getShowsByGenre("Drama");
  const comedyShows = getShowsByGenre("Comedy");
  const actionShows = getShowsByGenre("Action");
  const scifiShows = getShowsByGenre("Science-Fiction");
  const thrillerShows = getShowsByGenre("Thriller");
  const romanceShows = getShowsByGenre("Romance");

  // Top 5 unique shows for Spotlight
  const spotlightShows = showstate.data
    ? [...showstate.data]
        .filter((show: any) => show.image?.original && show.summary)
        .sort((a: any, b: any) => (b.rating?.average ?? 0) - (a.rating?.average ?? 0))
        .slice(0, 5)
    : [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Preload Spotlight Background Images
  useEffect(() => {
    if (spotlightShows.length > 0) {
      spotlightShows.forEach((show: any) => {
        if (show.image?.original) {
          const img = new Image();
          img.src = show.image.original;
        }
      });
    }
  }, [spotlightShows]);

  // Auto transition spotlight every 5 seconds
  useEffect(() => {
    if (isPaused || spotlightShows.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % spotlightShows.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, spotlightShows.length]);

  // Filter shows based on query for inline search results
  const filteredShows = showstate.data
    ? showstate.data.filter((show: any) => {
        const titleMatch = show.name?.toLowerCase().includes(searchQuery.toLowerCase());
        const genreMatch = show.genres?.some((g: string) =>
          g.toLowerCase().includes(searchQuery.toLowerCase())
        );
        const summaryMatch = show.summary?.toLowerCase().includes(searchQuery.toLowerCase());
        return titleMatch || genreMatch || summaryMatch;
      })
    : [];

  if (showstate.isloading) {
    return (
      <div className={`min-h-screen pb-12 ${
        theme === "dark" ? "bg-[#0f1013] text-white" : "bg-[#f3f4f6] text-gray-900"
      }`}>
        <HeroSkeleton />
        <div className="mt-8 px-6 md:px-8">
          <div className={`h-6 rounded w-48 mb-6 animate-pulse ${
            theme === "dark" ? "bg-white/10" : "bg-black/10"
          }`} />
          <div className="flex gap-6 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (showstate.error) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center gap-4 ${
        theme === "dark" ? "bg-[#0f1013] text-white" : "bg-[#f3f4f6] text-gray-900"
      }`}>
        <svg className="w-16 h-16 text-red-500 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <h2 className="text-xl font-bold">Failed to load shows</h2>
        <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-650"}`}>
          Please check your internet connection and try again.
        </p>
        <button
          onClick={() => dispatch(tvshow())}
          className="mt-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg transition-colors cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Render Inline Search Results directly on Home
  if (searchQuery.trim() !== "") {
    return (
      <div className={`min-h-screen p-6 md:p-8 pt-10 transition-colors duration-300 ${
        theme === "dark" ? "bg-[#0f1013] text-white" : "bg-[#f3f4f6] text-gray-900"
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex justify-between items-center border-b border-black/5 dark:border-white/5 pb-4">
            <h2 className={`text-xl md:text-3xl font-black ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Search Results for <span className="text-[#8b5cf6]">"{searchQuery}"</span>
            </h2>
            <button
              onClick={() => dispatch(setSearchQuery(""))}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all duration-300 cursor-pointer hover:scale-105 ${
                theme === "dark"
                  ? "bg-white/5 border-white/10 text-white hover:bg-white/10"
                  : "bg-gray-100 border-gray-250 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Clear Search
            </button>
          </div>

          {filteredShows.length > 0 ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6 justify-items-center animate-fade-in">
              {filteredShows.map((show: any) => (
                <div key={show.id}>
                  <Cards
                    title={show.name}
                    rating={show.rating?.average ?? "N/A"}
                    genres={show.genres}
                    imageUrl={show.image?.medium}
                    onClick={() => navigate(`/layout/Showdetails/${show.id}`)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
              <div className={`w-20 h-20 mb-6 rounded-full flex items-center justify-center border animate-bounce ${
                theme === "dark"
                  ? "text-gray-500 bg-[#1e1f24] border-white/5"
                  : "text-gray-400 bg-white border-gray-200"
              }`}>
                <svg className="w-10 h-10 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </div>
              <h3 className={`text-lg md:text-xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                No matches found
              </h3>
              <p className={`text-xs max-w-sm ${theme === "dark" ? "text-gray-400" : "text-gray-650"}`}>
                We couldn't find any TV shows matching "{searchQuery}". Check the name spelling or type genre keywords like Action or Drama.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-4 overflow-x-hidden ${
      theme === "dark" ? "bg-[#0f1013] text-white" : "bg-[#f3f4f6] text-gray-900"
    }`}>
      
      {/* Fixed Trending Spotlight Carousel */}
      {spotlightShows.length > 0 && (
        <div 
          className="relative w-full h-[56.25vw] max-h-[550px] min-h-[380px] border-b border-white/5 overflow-hidden group/hero"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Spotlight Slides */}
          <div className="relative w-full h-full">
            {spotlightShows.map((show: any, index: number) => {
              const cleanSummary = show.summary
                ? show.summary.replace(/<[^>]*>/g, "")
                : "";
              const truncatedSummary =
                cleanSummary.length > 220 ? cleanSummary.substring(0, 220) + "..." : cleanSummary;
              const releaseYear = show.premiered
                ? new Date(show.premiered).getFullYear()
                : "";
              const isActive = index === currentIndex;

              return (
                <div 
                  key={show.id} 
                  className={`absolute inset-0 w-full h-full transition-all duration-[800ms] ease-in-out flex items-center ${
                    isActive 
                      ? "opacity-100 translate-x-0 z-10" 
                      : "opacity-0 translate-x-12 -z-10"
                  }`}
                >
                  {/* Background Image */}
                  <div className="absolute inset-0 z-0 overflow-hidden">
                    <img
                      src={show.image?.original}
                      alt={show.name}
                      className={`w-full h-full object-cover object-top filter brightness-[0.55] saturate-[1.1] transition-transform duration-[10000ms] ease-out ${
                        isActive ? "scale-105" : "scale-100"
                      }`}
                    />
                    {/* Smooth dark overlay vignettes */}
                    <div className={`absolute inset-0 bg-gradient-to-t via-[#0f1013]/60 to-transparent ${
                      theme === "dark" ? "from-[#0f1013]" : "from-[#f3f4f6] via-transparent"
                    }`} />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent" />
                  </div>

                  {/* Hero Content */}
                  <div className={`relative max-w-7xl mx-auto w-full px-6 md:px-8 z-10 flex flex-col items-start gap-2.5 mt-8 md:mt-12 transition-all duration-700 transform ${
                    isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                  }`}>
                    <span className="bg-[#7c3aed] text-white text-[10px] md:text-xs font-black tracking-[0.25em] px-2.5 py-1 rounded-md uppercase shadow-md animate-pulse">
                      Trending Spotlight
                    </span>

                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-white mb-1 drop-shadow-lg leading-none max-w-2xl">
                      {show.name}
                    </h1>

                    {/* Meta Tags */}
                    <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-gray-300 font-medium">
                      {show.rating?.average && (
                        <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm border border-white/10 px-2.5 py-0.5 rounded-md text-yellow-400">
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                          <span>{show.rating.average}</span>
                        </div>
                      )}
                      {releaseYear && <span className="bg-white/10 px-2 py-0.5 rounded-md text-xs">{releaseYear}</span>}
                      <span className="text-gray-400">•</span>
                      <span className="uppercase tracking-wider text-gray-450 text-xs font-bold">
                        {show.genres?.join(" / ")}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs md:text-sm text-gray-300 max-w-xl leading-relaxed drop-shadow-md mb-2 font-normal">
                      {truncatedSummary}
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex items-center gap-4 mt-2">
                      <button 
                        onClick={() => navigate(`/layout/Showdetails/${show.id}`)}
                        className="flex items-center gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-5 py-2.5 md:px-6 md:py-3 rounded-xl font-bold shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer text-xs md:text-sm"
                      >
                        <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        Watch Now
                      </button>
                      <button 
                        onClick={() => navigate(`/layout/Showdetails/${show.id}`)}
                        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/15 px-5 py-2.5 md:px-6 md:py-3 rounded-xl font-bold backdrop-blur-md shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer text-xs md:text-sm"
                      >
                        <svg className="w-4.5 h-4.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="16" x2="12" y2="12" />
                          <line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                        More Info
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Left/Right Arrow Controls */}
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + spotlightShows.length) % spotlightShows.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-[#7c3aed] text-white p-2 md:p-3 rounded-full opacity-0 group-hover/hero:opacity-100 transition-all duration-300 hover:scale-110 cursor-pointer backdrop-blur-sm border border-white/10"
            aria-label="Previous Spotlight"
          >
            <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % spotlightShows.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-[#7c3aed] text-white p-2 md:p-3 rounded-full opacity-0 group-hover/hero:opacity-100 transition-all duration-300 hover:scale-110 cursor-pointer backdrop-blur-sm border border-white/10"
            aria-label="Next Spotlight"
          >
            <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {/* Navigation Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {spotlightShows.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-1.5 md:h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  index === currentIndex ? "w-6 bg-[#7c3aed]" : "w-1.5 md:w-2 bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Genre Categories Staggered Entry Rows */}
      <div className="mt-8 relative z-20">
        {[
          { title: "Trending Now", shows: trendingShows.slice(0, 15) },
          { title: "High-Octane Action", shows: actionShows },
          { title: "Riveting Drama", shows: dramaShows },
          { title: "Sci-Fi & Fantasy", shows: scifiShows },
          { title: "Hilarious Comedy", shows: comedyShows },
          { title: "Psychological Thriller", shows: thrillerShows },
          { title: "Romantic Tales", shows: romanceShows }
        ].map((row, index) => (
          <div
            key={row.title}
            className="animate-fade-in"
            style={{ 
              animationDelay: `${index * 150}ms`, 
              opacity: 0,
              animationFillMode: "forwards"
            }}
          >
            <ShowRow title={row.title} shows={row.shows} />
          </div>
        ))}
      </div>

      {/* Professional Footer */}
      <footer className={`mt-16 border-t transition-all duration-300 ${
        theme === "dark" 
          ? "bg-[#090a0c] border-white/5 text-gray-400" 
          : "bg-white border-gray-200 text-gray-600 shadow-inner"
      }`}>
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Info Column */}
            <div className="flex flex-col gap-3">
              <div 
                onClick={() => {
                  dispatch(setSearchQuery(""));
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="text-[#7c3aed] font-black tracking-[0.2em] text-xl cursor-pointer hover:opacity-85 select-none"
              >
                CINEVERSE
              </div>
              <p className="text-xs leading-relaxed max-w-sm">
                Your premier entertainment resource for viewing show timelines, cast details, seasons, and episodes. Discover high-quality streaming metadata.
              </p>
              <span className="text-[10px] uppercase font-bold tracking-wider">
                Powered by <a href="https://www.tvmaze.com/api" target="_blank" rel="noopener noreferrer" className="text-[#7c3aed] hover:underline">TVMaze API</a>
              </span>
            </div>

            {/* Quick Links */}
            <div className="flex flex-col gap-3">
              <h3 className={`text-xs font-black uppercase tracking-wider ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                Quick Navigation
              </h3>
              <div className="flex flex-col gap-2 text-xs font-semibold">
                <span 
                  onClick={() => {
                    dispatch(setSearchQuery(""));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }} 
                  className="hover:text-[#8b5cf6] cursor-pointer transition-colors duration-0.3s"
                >
                  Browse Home
                </span>
                <span 
                  onClick={() => {
                    dispatch(setSearchQuery("Sherlock"));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }} 
                  className="hover:text-[#8b5cf6] cursor-pointer transition-colors"
                >
                  Spotlight Series
                </span>
                <span 
                  onClick={() => {
                    dispatch(setSearchQuery("Arrow"));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }} 
                  className="hover:text-[#8b5cf6] cursor-pointer transition-colors"
                >
                  Action Highlights
                </span>
              </div>
            </div>

            {/* Popular Genres */}
            <div className="flex flex-col gap-3">
              <h3 className={`text-xs font-black uppercase tracking-wider ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                Top Genres
              </h3>
              <div className="flex flex-col gap-2 text-xs font-semibold">
                {["Action", "Drama", "Comedy", "Science-Fiction", "Thriller"].map((g) => (
                  <span
                    key={g}
                    onClick={() => {
                      dispatch(setSearchQuery(g));
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="hover:text-[#8b5cf6] cursor-pointer transition-colors"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>

            {/* Social Connect & Back to Top */}
            <div className="flex flex-col gap-3">
              <h3 className={`text-xs font-black uppercase tracking-wider ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                Connect with Us
              </h3>
              <div className="flex gap-3 mt-1 text-gray-500">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#8b5cf6] transition-colors">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#8b5cf6] transition-colors">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#8b5cf6] transition-colors">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all duration-300 hover:scale-105 cursor-pointer ${
                    theme === "dark"
                      ? "bg-white/5 border-white/10 text-white hover:bg-white/10"
                      : "bg-gray-100 border-gray-200 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2 animate-bounce" viewBox="0 0 24 24">
                    <polyline points="18 15 12 9 6 15" />
                  </svg>
                  Back to Top
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-black/5 dark:border-white/5 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
            <span>&copy; {new Date().getFullYear()} Cineverse. All rights reserved.</span>
            <div className="flex gap-4">
              <span className="hover:underline cursor-pointer">Terms of Use</span>
              <span className="hover:underline cursor-pointer">Privacy Policy</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;