import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store/store";
import { fetchShowDetails, fetchSeasons, fetchEpisodes } from "../../redux/store/createSlice";
import DetailSkeleton from "../../Componends/skeletons/DetailSkeleton";
import { useTheme } from "../../context/ThemeContext";

const Showdetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { theme } = useTheme();

  const showId = id || "";

  // Get cache states from Redux
  const showDetailsState = useSelector((state: RootState) => state.show.showDetails[showId]);
  const seasonsState = useSelector((state: RootState) => state.show.seasons[showId]);
  const episodesState = useSelector((state: RootState) => state.show.episodes[showId]);

  useEffect(() => {
    if (showId) {
      if (!showDetailsState?.data && !showDetailsState?.isloading) {
        dispatch(fetchShowDetails(showId));
      }
      if (!seasonsState?.data && !seasonsState?.isloading) {
        dispatch(fetchSeasons(showId));
      }
      if (!episodesState?.data && !episodesState?.isloading) {
        dispatch(fetchEpisodes(showId));
      }
    }
  }, [dispatch, showId, showDetailsState, seasonsState, episodesState]);

  const showData = showDetailsState?.data;

  // Watchlist & watch history state & handlers
  const currentUser = localStorage.getItem("cineverse_logged_in_user") || "guest";
  const watchlistKey = `cineverse_watchlist_${currentUser}`;
  const historyKey = `cineverse_watch_history_${currentUser}`;
  
  const [isInWatchlist, setIsInWatchlist] = useState(() => {
    if (!showData) return false;
    const saved = localStorage.getItem(watchlistKey);
    const list = saved ? JSON.parse(saved) : [];
    return list.some((item: any) => item.id === showData.id);
  });

  // Re-run state check if show loads/changes
  useEffect(() => {
    if (showData) {
      const saved = localStorage.getItem(watchlistKey);
      const list = saved ? JSON.parse(saved) : [];
      setIsInWatchlist(list.some((item: any) => item.id === showData.id));
    }
  }, [showData, watchlistKey]);

  const toggleWatchlist = () => {
    if (!showData) return;
    const saved = localStorage.getItem(watchlistKey);
    let list = saved ? JSON.parse(saved) : [];
    
    if (isInWatchlist) {
      list = list.filter((item: any) => item.id !== showData.id);
      setIsInWatchlist(false);
    } else {
      list.push({
        id: showData.id,
        name: showData.name,
        genres: showData.genres,
        rating: showData.rating,
        image: showData.image
      });
      setIsInWatchlist(true);
    }
    localStorage.setItem(watchlistKey, JSON.stringify(list));
  };

  const handleWatchNowClick = () => {
    if (showData) {
      const savedHistory = localStorage.getItem(historyKey);
      let history = savedHistory ? JSON.parse(savedHistory) : [];
      history = history.filter((item: any) => item.id !== showData.id);
      history.unshift({
        id: showData.id,
        name: showData.name,
        genres: showData.genres,
        rating: showData.rating,
        image: showData.image,
        watchedAt: new Date().toISOString()
      });
      localStorage.setItem(historyKey, JSON.stringify(history.slice(0, 12)));
    }

    const episodes = episodesState?.data || [];
    if (episodes.length > 0) {
      const s1e1 = episodes.find((ep: any) => ep.season === 1 && ep.number === 1) || episodes[0];
      navigate(`/layout/Edetails/${s1e1.id}`);
    }
  };

  // Graceful Empty State (Header click fallback)
  if (!showId) {
    return (
      <div className={`min-h-[80vh] flex flex-col items-center justify-center p-6 text-center ${
        theme === "dark" ? "bg-[#0f1013] text-white" : "bg-[#f3f4f6] text-gray-900"
      }`}>
        <div className={`w-28 h-28 rounded-full flex items-center justify-center mb-6 border ${
          theme === "dark" ? "bg-[#1e1f24] border-white/5 text-gray-400" : "bg-white border-gray-200 text-gray-600"
        } shadow-lg`}>
          <svg className="w-14 h-14 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
            <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
            <line x1="7" y1="2" x2="7" y2="22" />
            <line x1="17" y1="2" x2="17" y2="22" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <line x1="2" y1="7" x2="7" y2="7" />
            <line x1="2" y1="17" x2="7" y2="17" />
            <line x1="17" y1="17" x2="22" y2="17" />
            <line x1="17" y1="7" x2="22" y2="7" />
          </svg>
        </div>
        <h2 className="text-2xl font-black tracking-tight mb-2">No Show Selected</h2>
        <p className={`text-sm max-w-md mb-6 leading-relaxed ${
          theme === "dark" ? "text-gray-400" : "text-gray-600"
        }`}>
          Explore our trending spotlight, genre rows, or use the Search page to pick a movie or TV show and view full details.
        </p>
        <button
          onClick={() => navigate("/layout")}
          className="bg-[#e0534c] hover:bg-[#c34540] text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer text-sm"
        >
          Browse Shows
        </button>
      </div>
    );
  }

  // Loading Skeletons
  if (showDetailsState?.isloading || seasonsState?.isloading || !showDetailsState || !seasonsState) {
    return <DetailSkeleton />;
  }

  // Error State
  if (showDetailsState?.error || seasonsState?.error) {
    return (
      <div className={`min-h-[80vh] flex flex-col items-center justify-center p-6 text-center ${
        theme === "dark" ? "bg-[#0f1013] text-white" : "bg-[#f3f4f6] text-gray-900"
      }`}>
        <svg className="w-16 h-16 text-red-500 fill-none stroke-current stroke-2 mb-4" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <h2 className="text-xl font-bold mb-2">Failed to load show details</h2>
        <p className={`text-sm mb-6 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          There was an error communicating with the TVMaze API. Please check your network and try again.
        </p>
        <button
          onClick={() => {
            dispatch(fetchShowDetails(showId));
            dispatch(fetchSeasons(showId));
          }}
          className="bg-[#e0534c] hover:bg-[#c34540] text-white px-6 py-2.5 rounded-xl font-bold shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer text-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  const show = showDetailsState.data;
  const seasons = seasonsState.data || [];
  const cast = show._embedded?.cast || [];

  const releaseYear = show.premiered ? new Date(show.premiered).getFullYear() : "";

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className={`min-h-screen pb-16 ${
      theme === "dark" ? "bg-[#0f1013] text-white" : "bg-[#f3f4f6] text-gray-900"
    }`}>
      {/* Premium Hero Backdrop */}
      <div className="relative w-full h-[45vw] max-h-[500px] min-h-[300px] overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 z-0">
          <img
            src={show.image?.original || show.image?.medium}
            alt={show.name}
            className="w-full h-full object-cover object-top filter brightness-[0.45] saturate-[1.1] blur-[1px]"
          />
          {/* Theme aware vignettes */}
          <div className={`absolute inset-0 bg-gradient-to-t via-black/40 to-transparent ${
            theme === "dark" ? "from-[#0f1013]" : "from-[#f3f4f6]"
          }`} />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
        </div>

        {/* Back Link inside Banner */}
        <div className="absolute top-6 left-6 md:left-8 z-20">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-black/60 hover:bg-[#e0534c] text-white px-4 py-2 rounded-xl backdrop-blur-md border border-white/10 shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer text-xs md:text-sm"
          >
            <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back
          </button>
        </div>
      </div>

      {/* Show Details Content Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 mt-[-100px] md:mt-[-160px] relative z-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Left: Poster Box */}
          <div className={`w-[220px] md:w-[260px] h-[330px] md:h-[390px] rounded-3xl overflow-hidden border flex-shrink-0 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-300 ${
            theme === "dark" ? "bg-[#1e1f24] border-white/10" : "bg-white border-gray-300"
          }`}>
            {show.image?.medium || show.image?.original ? (
              <img
                src={show.image.medium || show.image.original}
                alt={show.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-gray-500 bg-gray-250">
                <svg className="w-12 h-12 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <span className="font-bold tracking-wider text-xs">NO POSTER</span>
              </div>
            )}
          </div>

          {/* Right: Info Details Info Box */}
          <div className="flex-grow flex flex-col items-start gap-4 md:mt-20">
            <h1 className={`text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-none mb-3 md:mb-4 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}>
              {show.name}
            </h1>

            {/* Quick Metadata Row */}
            <div className="flex flex-wrap items-center gap-3.5 text-xs md:text-sm font-semibold text-gray-400">
              {show.rating?.average && (
                <div className="flex items-center gap-1 bg-yellow-400/10 border border-yellow-400/25 px-2.5 py-0.5 rounded-lg text-yellow-500">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  <span>{show.rating.average}</span>
                </div>
              )}
              {releaseYear && <span className={`px-2 py-0.5 rounded-lg border ${
                theme === "dark" ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"
              }`}>{releaseYear}</span>}
              {show.runtime && <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {show.runtime} min
              </span>}
              <span>•</span>
              <span className="uppercase tracking-wider">{show.language}</span>
              <span>•</span>
              <span className={`px-2 py-0.5 text-[10px] md:text-xs font-bold rounded-lg ${
                show.status === "Running" ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
              }`}>{show.status}</span>
            </div>

            {/* Genres Tag Cloud */}
            <div className="flex flex-wrap gap-2">
              {show.genres?.map((genre: string) => (
                <span
                  key={genre}
                  className={`text-[10px] md:text-xs font-black tracking-wider uppercase px-3 py-1 rounded-full ${
                    theme === "dark" ? "bg-[#1e1f24] text-gray-300 border border-white/5" : "bg-white text-gray-600 border border-gray-200"
                  }`}
                >
                  {genre}
                </span>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-2 text-sm md:text-base leading-relaxed max-w-3xl">
              {show.summary ? (
                <div 
                  className={`rich-summary ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                  dangerouslySetInnerHTML={{ __html: show.summary }} 
                />
              ) : (
                <p className="italic text-gray-500">No summary available for this show.</p>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 mt-3">
              {episodesState?.data && episodesState.data.length > 0 && (
                <button
                  onClick={handleWatchNowClick}
                  className="relative overflow-hidden flex items-center justify-center gap-2 bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] hover:from-[#6d28d9] hover:to-[#7c3aed] text-white px-6 py-2.5 rounded-xl font-extrabold shadow-[0_10px_20px_rgba(124,58,237,0.25)] hover:shadow-[0_15px_30px_rgba(124,58,237,0.45)] transition-all duration-300 hover:scale-105 cursor-pointer text-xs md:text-sm group/watchHero"
                >
                  <span className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover/watchHero:scale-x-100 transition-transform duration-500 origin-left" />
                  <svg className="w-4 h-4 fill-current z-10" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <span className="z-10 tracking-wider">Watch Now</span>
                </button>
              )}

              {show && (
                <button
                  onClick={toggleWatchlist}
                  className={`flex items-center gap-2 border px-5 py-2.5 rounded-xl font-bold shadow-md transition-all duration-300 hover:scale-105 cursor-pointer text-xs md:text-sm ${
                    isInWatchlist
                      ? "bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20"
                      : theme === "dark"
                      ? "bg-white/5 border-white/10 text-white hover:bg-white/10"
                      : "bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {isInWatchlist ? (
                    <>
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2z" />
                      </svg>
                      Remove from Watchlist
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      Add to Watchlist
                    </>
                  )}
                </button>
              )}

              {show.officialSite && (
                <a
                  href={show.officialSite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 border px-5 py-2.5 rounded-xl font-bold shadow-md transition-all duration-300 hover:scale-105 cursor-pointer text-xs md:text-sm ${
                    theme === "dark"
                      ? "bg-white/5 border-white/10 text-white hover:bg-white/10"
                      : "bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  Official Website
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Cast Section */}
        {cast.length > 0 && (
          <div className="mt-16">
            <h2 className={`text-xl md:text-2xl font-black mb-6 tracking-wide ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}>
              Starring Cast
            </h2>
            <div 
              className="flex gap-6 md:gap-8 overflow-x-auto py-3 px-1 scroll-smooth"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {cast.map((actor: any, index: number) => (
                <div key={`${actor.person.id}-${index}`} className="flex flex-col items-center text-center gap-2 flex-shrink-0 group/cast">
                  {/* Actor Image */}
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border border-white/15 shadow-md group-hover/cast:scale-105 transition-transform duration-300 bg-gray-600 flex-shrink-0">
                    {actor.person.image?.medium ? (
                      <img
                        src={actor.person.image.medium}
                        alt={actor.person.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-700 text-white">
                        <svg className="w-8 h-8 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Actor Info */}
                  <div className="max-w-[110px]">
                    <h4 className={`text-xs md:text-sm font-bold truncate ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`} title={actor.person.name}>
                      {actor.person.name}
                    </h4>
                    <p className={`text-[10px] md:text-xs truncate ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`} title={actor.character.name}>
                      as {actor.character.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Seasons Section */}
        <div className="mt-16">
          <h2 className={`text-xl md:text-2xl font-black mb-6 tracking-wide ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}>
            Seasons & Episodes
          </h2>

          {seasons.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {seasons.map((season: any) => {
                const epCount = season.episodeOrder || null;
                const premiereDate = formatDate(season.premiereDate);
                const endDate = formatDate(season.endDate);

                return (
                  <div
                    key={season.id}
                    onClick={() => navigate(`/layout/Elist/${showId}/${season.number}`)}
                    className={`group/card cine-card rounded-2xl overflow-hidden border flex flex-col shadow-md cursor-pointer ${
                      theme === "dark"
                        ? "bg-[#1e1f24] border-white/5 hover:shadow-[0_20px_45px_rgba(0,0,0,0.35)]"
                        : "bg-white border-gray-200 shadow-gray-250/40 hover:shadow-[0_20px_45px_rgba(124,58,237,0.15)]"
                    }`}
                  >
                    {/* Season Image Wrapper */}
                    <div className={`aspect-[2/3] w-full relative flex items-center justify-center overflow-hidden ${
                      theme === "dark" ? "bg-[#2b2c34]" : "bg-gray-200"
                    }`}>
                      {season.image?.medium ? (
                        <img
                          src={season.image.medium}
                          alt={`Season ${season.number}`}
                          className="w-full h-full object-cover group-hover/card:scale-106 transition-transform duration-300 ease-in-out"
                        />
                      ) : show.image?.medium ? (
                        <img
                          src={show.image.medium}
                          alt={`Season ${season.number}`}
                          className="w-full h-full object-cover group-hover/card:scale-106 transition-transform duration-300 ease-in-out filter brightness-[0.7]"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-gray-500">
                          <svg className="w-8 h-8 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                          </svg>
                          <span className="font-bold tracking-wider text-[10px]">NO IMAGE</span>
                        </div>
                      )}

                      {/* Hover Overlay with View Icon */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="bg-[#7c3aed] text-white p-2.5 rounded-full shadow-lg transform scale-75 group-hover/card:scale-100 transition-transform duration-300">
                          <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Season Text Card */}
                    <div className="p-4 flex flex-col justify-between flex-1 gap-2.5">
                      <div>
                        <h3 className={`font-bold text-base leading-snug group-hover/card:text-[#8b5cf6] transition-colors duration-200 ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}>
                          Season {season.number}
                        </h3>
                        <p className={`text-xs mt-1 font-medium ${
                          theme === "dark" ? "text-gray-450" : "text-gray-500"
                        }`}>
                          {premiereDate} {endDate !== "N/A" && ` - ${endDate}`}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-1 pt-2 border-t border-black/5 dark:border-white/5">
                        <span className={`text-xs font-bold ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}>
                          {epCount ? `${epCount} Episodes` : "View Episodes"}
                        </span>
                        {season.premiereDate && (
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                            new Date(season.premiereDate) > new Date()
                              ? "bg-blue-500/10 text-blue-500 border border-blue-500/15"
                              : "bg-green-500/10 text-green-500 border border-green-500/15"
                          }`}>
                            {new Date(season.premiereDate) > new Date() ? "Upcoming" : "Released"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={`p-8 rounded-2xl border text-center ${
              theme === "dark" ? "bg-[#1e1f24] border-white/5 text-gray-400" : "bg-white border-gray-250 text-gray-500"
            }`}>
              No seasons data available for this show.
            </div>
          )}

          {/* Final Call to Action Section */}
          {episodesState?.data && episodesState.data.length > 0 && (
            <div className="mt-20 border-t border-black/5 dark:border-white/5 pt-12 flex flex-col items-center text-center gap-4">
              <h3 className={`text-xl md:text-2xl font-black ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                Ready to dive in?
              </h3>
              <p className={`text-xs md:text-sm max-w-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                Start watching this series from the very beginning. Stream Season 1, Episode 1 instantly on Cineverse.
              </p>
              
              <button
                onClick={handleWatchNowClick}
                className="relative overflow-hidden flex items-center justify-center gap-2 bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] hover:from-[#6d28d9] hover:to-[#7c3aed] text-white px-10 py-3.5 rounded-2xl font-extrabold shadow-[0_10px_25px_rgba(124,58,237,0.3)] hover:shadow-[0_15px_30px_rgba(124,58,237,0.5)] transition-all duration-300 hover:scale-105 cursor-pointer text-xs md:text-sm group/watch"
              >
                <span className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover/watch:scale-x-100 transition-transform duration-500 origin-left" />
                <svg className="w-5 h-5 fill-current z-10" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span className="z-10 tracking-wider">WATCH NOW - S1:E1</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Showdetails;