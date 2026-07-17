import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store/store";
import { fetchEpisodeDetails, fetchShowDetails } from "../../redux/store/createSlice";
import EpisodeDetailSkeleton from "../../Componends/skeletons/EpisodeDetailSkeleton";
import { useTheme } from "../../context/ThemeContext";

const Edetails: React.FC = () => {
  const { episodeId } = useParams<{ episodeId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { theme } = useTheme();
  const [isStreaming, setIsStreaming] = useState(false);

  const handleWatchEpisode = () => {
    setIsStreaming(true);
    if (showDetailsState?.data) {
      const show = showDetailsState.data;
      const currentUser = localStorage.getItem("cineverse_logged_in_user") || "guest";
      const historyKey = `cineverse_watch_history_${currentUser}`;
      const savedHistory = localStorage.getItem(historyKey);
      let history = savedHistory ? JSON.parse(savedHistory) : [];
      history = history.filter((item: any) => item.id !== show.id);
      history.unshift({
        id: show.id,
        name: show.name,
        genres: show.genres,
        rating: show.rating,
        image: show.image,
        watchedAt: new Date().toISOString()
      });
      localStorage.setItem(historyKey, JSON.stringify(history.slice(0, 12)));
    }
  };

  const id = episodeId || "";

  // Get cache states from Redux
  const episodeState = useSelector((state: RootState) => state.show.singleEpisodes[id]);

  const showId = episodeState?.data?._links?.show?.href
    ? episodeState.data._links.show.href.split("/").pop()
    : null;

  const showDetailsState = useSelector((state: RootState) =>
    showId ? state.show.showDetails[showId] : null
  );

  useEffect(() => {
    if (id) {
      if (!episodeState?.data && !episodeState?.isloading) {
        dispatch(fetchEpisodeDetails(id));
      }
    }
  }, [dispatch, id, episodeState]);

  useEffect(() => {
    if (showId) {
      if (!showDetailsState?.data && !showDetailsState?.isloading) {
        dispatch(fetchShowDetails(showId));
      }
    }
  }, [dispatch, showId, showDetailsState]);

  // Graceful Empty State (Header click fallback)
  if (!id) {
    return (
      <div className={`min-h-[80vh] flex flex-col items-center justify-center p-6 text-center ${
        theme === "dark" ? "bg-[#0f1013] text-white" : "bg-[#f3f4f6] text-gray-900"
      }`}>
        <div className={`w-28 h-28 rounded-full flex items-center justify-center mb-6 border ${
          theme === "dark" ? "bg-[#1e1f24] border-white/5 text-gray-400" : "bg-white border-gray-200 text-gray-600"
        } shadow-lg`}>
          <svg className="w-14 h-14 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>
        <h2 className="text-2xl font-black tracking-tight mb-2">No Episode Selected</h2>
        <p className={`text-sm max-w-md mb-6 leading-relaxed ${
          theme === "dark" ? "text-gray-400" : "text-gray-600"
        }`}>
          Pick a show from Cineverse Home or Search pages, browse to a season, and click on an episode to view detailed information.
        </p>
        <button
          onClick={() => navigate("/layout")}
          className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer text-sm"
        >
          Browse Shows
        </button>
      </div>
    );
  }

  // Loading Skeletons
  if (episodeState?.isloading || !episodeState || (showId && (!showDetailsState || showDetailsState.isloading))) {
    return <EpisodeDetailSkeleton />;
  }

  // Error State
  if (episodeState?.error) {
    return (
      <div className={`min-h-[80vh] flex flex-col items-center justify-center p-6 text-center ${
        theme === "dark" ? "bg-[#0f1013] text-white" : "bg-[#f3f4f6] text-gray-900"
      }`}>
        <svg className="w-16 h-16 text-red-500 fill-none stroke-current stroke-2 mb-4" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <h2 className="text-xl font-bold mb-2">Failed to load episode details</h2>
        <p className={`text-sm mb-6 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          There was an error communicating with the TVMaze API. Please check your network and try again.
        </p>
        <button
          onClick={() => {
            dispatch(fetchEpisodeDetails(id));
            if (showId) dispatch(fetchShowDetails(showId));
          }}
          className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-6 py-2.5 rounded-xl font-bold shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer text-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  const episode = episodeState.data;
  const showName = showDetailsState?.data?.name || "Show";

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className={`min-h-screen p-6 md:p-8 pt-10 ${
      theme === "dark" ? "bg-[#0f1013] text-white" : "bg-[#f3f4f6] text-gray-900"
    }`}>
      <div className="max-w-4xl mx-auto">
        {/* Interactive Breadcrumb Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 text-xs md:text-sm font-semibold text-gray-400">
            <span onClick={() => navigate("/layout")} className="hover:text-[#8b5cf6] cursor-pointer">
              Home
            </span>
            <span>/</span>
            {showId && (
              <>
                <span onClick={() => navigate(`/layout/Showdetails/${showId}`)} className="hover:text-[#8b5cf6] cursor-pointer">
                  {showName}
                </span>
                <span>/</span>
                <span onClick={() => navigate(`/layout/Elist/${showId}/${episode.season}`)} className="hover:text-[#8b5cf6] cursor-pointer">
                  Season {episode.season}
                </span>
                <span>/</span>
              </>
            )}
            <span className={theme === "dark" ? "text-white" : "text-gray-900"}>
              Episode {episode.number}
            </span>
          </div>

          <button
            onClick={() => {
              if (showId) {
                navigate(`/layout/Elist/${showId}/${episode.season}`);
              } else {
                navigate(-1);
              }
            }}
            className="flex items-center gap-2 bg-black/60 hover:bg-[#7c3aed] text-white px-4 py-2 rounded-xl backdrop-blur-md border border-white/10 shadow-md transition-all duration-300 hover:scale-105 cursor-pointer text-xs"
          >
            <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Season Episodes
          </button>
        </div>

        {/* Large Aspect-Video Episode Poster */}
        <div className={`w-full aspect-video rounded-3xl overflow-hidden border shadow-2xl relative mb-8 flex items-center justify-center ${
          theme === "dark" ? "bg-[#1e1f24] border-white/5" : "bg-white border-gray-250"
        }`}>
          {episode.image?.original || episode.image?.medium ? (
            <img
              src={episode.image.original || episode.image.medium}
              alt={episode.name}
              className="w-full h-full object-cover"
            />
          ) : showDetailsState?.data?.image?.original ? (
            <img
              src={showDetailsState.data.image.original}
              alt={episode.name}
              className="w-full h-full object-cover filter brightness-[0.5] blur-[1px]"
            />
          ) : (
            <div className="flex flex-col items-center gap-3 text-gray-500">
              <svg className="w-16 h-16 stroke-current fill-none stroke-2 animate-pulse" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span className="font-bold tracking-widest text-sm">NO IMAGE AVAILABLE</span>
            </div>
          )}

          {/* Floating Episode Title Overlay on Poster (small design touch) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex flex-col justify-end p-6 md:p-8">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="bg-[#7c3aed] text-white text-[10px] md:text-xs font-black tracking-widest px-2.5 py-1 rounded-md uppercase shadow-md select-none">
                S{episode.season} • EP{episode.number}
              </span>
              <span className="bg-green-500/80 text-white text-[10px] md:text-xs font-black tracking-widest px-2.5 py-1 rounded-md uppercase shadow-md select-none">
                Available to Stream
              </span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
              <h1 className="text-xl md:text-3xl font-black text-white truncate drop-shadow-md flex-grow">
                {episode.name}
              </h1>
              
              {/* Watch Now Button inside Hero Poster Overlay */}
              <button
                onClick={handleWatchEpisode}
                className="relative overflow-hidden flex items-center justify-center gap-2 bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] hover:from-[#6d28d9] hover:to-[#7c3aed] text-white px-6 py-2.5 rounded-xl font-extrabold shadow-[0_10px_20px_rgba(124,58,237,0.25)] hover:shadow-[0_15px_30px_rgba(124,58,237,0.45)] transition-all duration-300 hover:scale-105 cursor-pointer text-xs md:text-sm group/watchEp flex-shrink-0"
              >
                <span className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover/watchEp:scale-x-100 transition-transform duration-500 origin-left" />
                <svg className="w-4.5 h-4.5 fill-current z-10" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span className="z-10 tracking-wider">Watch Now</span>
              </button>
            </div>
          </div>
        </div>

        {/* Episode Info Container */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-3.5">
            {/* Rating badge */}
            {episode.rating?.average ? (
              <div className="flex items-center gap-1.5 bg-yellow-400/10 border border-yellow-400/25 px-3 py-1 rounded-xl text-yellow-500 font-bold text-xs md:text-sm shadow-sm">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                <span>{episode.rating.average} Rating</span>
              </div>
            ) : null}

            {/* Runtime badge */}
            {episode.runtime ? (
              <span className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border font-semibold text-xs md:text-sm ${
                theme === "dark" ? "bg-white/5 border-white/10 text-gray-300" : "bg-black/5 border-black/10 text-gray-700"
              }`}>
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {episode.runtime} mins
              </span>
            ) : null}

            {/* Release date badge */}
            {episode.airdate ? (
              <span className={`px-3 py-1 rounded-xl border font-semibold text-xs md:text-sm ${
                theme === "dark" ? "bg-white/5 border-white/10 text-gray-300" : "bg-black/5 border-black/10 text-gray-700"
              }`}>
                Aired: {formatDate(episode.airdate)}
              </span>
            ) : null}
          </div>

          {/* Episode Summary Description */}
          <div className="leading-relaxed text-sm md:text-base">
            <h2 className={`text-lg md:text-xl font-bold mb-3 tracking-wide ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}>
              Episode Summary
            </h2>
            {episode.summary ? (
              <div 
                className={`rich-summary ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                dangerouslySetInnerHTML={{ __html: episode.summary }} 
              />
            ) : (
              <p className="italic text-gray-550">No summary description available for this episode.</p>
            )}
          </div>

          {/* Additional Episode Information Grid */}
          <div className="mt-4">
            <h3 className={`text-sm md:text-base font-bold mb-4 uppercase tracking-wider ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}>
              Episode Details Meta
            </h3>
            
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 p-4 md:p-6 rounded-2xl border ${
              theme === "dark" ? "bg-[#1e1f24]/50 border-white/5" : "bg-white border-gray-200"
            }`}>
              {/* Airtime */}
              <div className="flex flex-col gap-0.5">
                <span className={`text-[10px] md:text-xs font-bold uppercase tracking-wide ${
                  theme === "dark" ? "text-gray-500" : "text-gray-400"
                }`}>
                  Air Time
                </span>
                <span className={`text-xs md:text-sm font-bold ${
                  theme === "dark" ? "text-gray-200" : "text-gray-800"
                }`}>
                  {episode.airtime || "N/A"}
                </span>
              </div>

              {/* Episode Type */}
              <div className="flex flex-col gap-0.5">
                <span className={`text-[10px] md:text-xs font-bold uppercase tracking-wide ${
                  theme === "dark" ? "text-gray-500" : "text-gray-400"
                }`}>
                  Episode Type
                </span>
                <span className={`text-xs md:text-sm font-bold capitalize ${
                  theme === "dark" ? "text-gray-200" : "text-gray-800"
                }`}>
                  {episode.type || "Regular"}
                </span>
              </div>

              {/* Show Association */}
              <div className="flex flex-col gap-0.5">
                <span className={`text-[10px] md:text-xs font-bold uppercase tracking-wide ${
                  theme === "dark" ? "text-gray-500" : "text-gray-400"
                }`}>
                  Show Association
                </span>
                <span 
                  onClick={() => { if (showId) navigate(`/layout/Showdetails/${showId}`); }}
                  className="text-xs md:text-sm font-bold text-[#7c3aed] hover:underline cursor-pointer truncate"
                >
                  {showName}
                </span>
              </div>

              {/* TVMaze Source Link */}
              <div className="flex flex-col gap-0.5">
                <span className={`text-[10px] md:text-xs font-bold uppercase tracking-wide ${
                  theme === "dark" ? "text-gray-500" : "text-gray-400"
                }`}>
                  Source
                </span>
                <a
                  href={episode.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs md:text-sm font-bold text-[#7c3aed] hover:underline flex items-center gap-0.5"
                >
                  TVMaze Link
                  <svg className="w-3 h-3 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full-Screen Simulated Media Player */}
      {isStreaming && (
        <div className="fixed inset-0 z-50 bg-[#07080a] flex flex-col justify-between p-6 animate-fade-in text-white select-none">
          {/* Top Bar */}
          <div className="flex items-center justify-between z-10">
            <button
              onClick={() => setIsStreaming(false)}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl border border-white/10 transition-all cursor-pointer text-xs font-semibold backdrop-blur-md"
            >
              <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Exit Player
            </button>
            <div className="text-right">
              <span className="text-[10px] text-gray-450 block font-bold tracking-widest uppercase">Streaming Source</span>
              <span className="text-xs font-bold text-[#8b5cf6]">{showName}</span>
            </div>
          </div>

          {/* Video Canvas Simulation */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-tr from-[#120c1f] via-[#09070e] to-[#0a0815] overflow-hidden">
            {/* Dynamic breathing background lights */}
            <div className="absolute w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[120px] animate-pulse" />
            
            {/* Spinning Buffer Ring */}
            <div className="flex flex-col items-center gap-4 z-10">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <div className="absolute inset-0 border-4 border-violet-500/20 rounded-full" />
                <div className="absolute inset-0 border-4 border-t-violet-600 rounded-full animate-spin" />
                <svg className="w-6 h-6 text-violet-500 fill-current ml-0.5" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <div className="text-center">
                <h3 className="text-base md:text-lg font-black tracking-wide">
                  Now Playing S{episode.season} • EP{episode.number}
                </h3>
                <p className="text-xs text-gray-400 mt-1 font-semibold">
                  "{episode.name}"
                </p>
              </div>
            </div>
          </div>

          {/* Media Player Controls Bar */}
          <div className="w-full max-w-4xl mx-auto bg-black/60 border border-white/5 p-4 rounded-2xl backdrop-blur-xl z-10 flex flex-col gap-3 shadow-2xl">
            {/* Timeline Track */}
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-gray-450">00:00</span>
              <div className="flex-grow h-1.5 bg-white/20 rounded-full overflow-hidden relative cursor-pointer">
                <div className="absolute left-0 top-0 bottom-0 w-1/3 bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] rounded-full" />
                <div className="absolute left-[33%] top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-lg border border-[#7c3aed]" />
              </div>
              <span className="text-[10px] font-mono text-gray-450">
                {episode.runtime ? `${episode.runtime}:00` : "45:00"}
              </span>
            </div>

            {/* Lower Controls Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button className="p-1 hover:text-[#8b5cf6] transition-colors cursor-pointer">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                </button>
                <button className="p-1 hover:text-[#8b5cf6] transition-colors cursor-pointer">
                  <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <polygon points="11 19 2 12 11 5 11 19" />
                    <polygon points="22 19 13 12 22 5 22 19" />
                  </svg>
                </button>
                <button className="p-1 hover:text-[#8b5cf6] transition-colors cursor-pointer">
                  <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <polygon points="13 19 22 12 13 5 13 19" />
                    <polygon points="2 19 11 12 2 5 2 19" />
                  </svg>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-gray-400 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
                <div className="w-20 h-1 bg-white/20 rounded-full cursor-pointer relative">
                  <div className="absolute left-0 top-0 bottom-0 w-3/4 bg-[#7c3aed] rounded-full" />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="p-1 hover:text-[#8b5cf6] transition-colors cursor-pointer" title="Subtitles">
                  <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <line x1="7" y1="9" x2="17" y2="9" />
                    <line x1="7" y1="13" x2="15" y2="13" />
                  </svg>
                </button>
                <button className="p-1 hover:text-[#8b5cf6] transition-colors cursor-pointer" title="Fullscreen">
                  <svg className="w-4.5 h-4.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Edetails;