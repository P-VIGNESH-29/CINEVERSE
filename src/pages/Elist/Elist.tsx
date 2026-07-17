import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store/store";
import { fetchEpisodes, fetchShowDetails } from "../../redux/store/createSlice";
import EpisodeListSkeleton from "../../Componends/skeletons/EpisodeListSkeleton";
import { useTheme } from "../../context/ThemeContext";

const Elist: React.FC = () => {
  const { showId, seasonNumber } = useParams<{ showId: string; seasonNumber: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { theme } = useTheme();

  const id = showId || "";
  const seasonNum = parseInt(seasonNumber || "", 10);

  // Get cache states from Redux
  const episodesState = useSelector((state: RootState) => state.show.episodes[id]);
  const showDetailsState = useSelector((state: RootState) => state.show.showDetails[id]);

  useEffect(() => {
    if (id) {
      if (!episodesState?.data && !episodesState?.isloading) {
        dispatch(fetchEpisodes(id));
      }
      if (!showDetailsState?.data && !showDetailsState?.isloading) {
        dispatch(fetchShowDetails(id));
      }
    }
  }, [dispatch, id, episodesState, showDetailsState]);

  // Graceful Empty State (Header click fallback)
  if (!id || !seasonNumber) {
    return (
      <div className={`min-h-[80vh] flex flex-col items-center justify-center p-6 text-center ${
        theme === "dark" ? "bg-[#0f1013] text-white" : "bg-[#f3f4f6] text-gray-900"
      }`}>
        <div className={`w-28 h-28 rounded-full flex items-center justify-center mb-6 border ${
          theme === "dark" ? "bg-[#1e1f24] border-white/5 text-gray-400" : "bg-white border-gray-200 text-gray-600"
        } shadow-lg`}>
          <svg className="w-14 h-14 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
            <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
            <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
          </svg>
        </div>
        <h2 className="text-2xl font-black tracking-tight mb-2">No Season Selected</h2>
        <p className={`text-sm max-w-md mb-6 leading-relaxed ${
          theme === "dark" ? "text-gray-400" : "text-gray-600"
        }`}>
          Pick a show from Cineverse Home or Search pages, then click on any of its season cards to view the episode list.
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
  if (episodesState?.isloading || showDetailsState?.isloading || !episodesState || !showDetailsState) {
    return <EpisodeListSkeleton />;
  }

  // Error State
  if (episodesState?.error || showDetailsState?.error) {
    return (
      <div className={`min-h-[80vh] flex flex-col items-center justify-center p-6 text-center ${
        theme === "dark" ? "bg-[#0f1013] text-white" : "bg-[#f3f4f6] text-gray-900"
      }`}>
        <svg className="w-16 h-16 text-red-500 fill-none stroke-current stroke-2 mb-4" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <h2 className="text-xl font-bold mb-2">Failed to load episodes</h2>
        <p className={`text-sm mb-6 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          There was an error communicating with the TVMaze API. Please check your network and try again.
        </p>
        <button
          onClick={() => {
            dispatch(fetchEpisodes(id));
            dispatch(fetchShowDetails(id));
          }}
          className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-6 py-2.5 rounded-xl font-bold shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer text-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  const show = showDetailsState.data;
  const rawEpisodes = episodesState.data || [];
  const filteredEpisodes = rawEpisodes.filter((ep: any) => ep.season === seasonNum);

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
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation & Back Link */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm font-semibold text-gray-400">
            <span onClick={() => navigate("/layout")} className="hover:text-[#8b5cf6] cursor-pointer">
              Home
            </span>
            <span>/</span>
            <span onClick={() => navigate(`/layout/Showdetails/${id}`)} className="hover:text-[#8b5cf6] cursor-pointer">
              {show.name}
            </span>
            <span>/</span>
            <span className={theme === "dark" ? "text-white" : "text-gray-900"}>
              Season {seasonNumber}
            </span>
          </div>

          <button
            onClick={() => navigate(`/layout/Showdetails/${id}`)}
            className="flex items-center gap-2 bg-black/60 hover:bg-[#7c3aed] text-white px-4 py-2 rounded-xl backdrop-blur-md border border-white/10 shadow-md transition-all duration-300 hover:scale-105 cursor-pointer text-xs"
          >
            <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Show Details
          </button>
        </div>

        {/* Season Header */}
        <div className="mb-8 border-b border-black/5 dark:border-white/5 pb-6">
          <h1 className={`text-2xl md:text-4xl font-black tracking-tight ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}>
            {show.name}
          </h1>
          <p className="text-sm md:text-base text-gray-400 mt-1 font-semibold">
            Season {seasonNumber} Episode Guide • {filteredEpisodes.length} Episodes
          </p>
        </div>        {/* Episodes Grid layout */}
        {filteredEpisodes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEpisodes.map((episode: any) => {
              const cleanSummary = episode.summary
                ? episode.summary.replace(/<[^>]*>/g, "")
                : "";
              const truncatedSummary =
                cleanSummary.length > 120 ? cleanSummary.substring(0, 120) + "..." : cleanSummary;
              const airDate = formatDate(episode.airdate);

              return (
                <div
                  key={episode.id}
                  onClick={() => navigate(`/layout/Edetails/${episode.id}`)}
                  className={`group/card cine-card rounded-2xl overflow-hidden border flex flex-col h-full shadow-md cursor-pointer ${
                    theme === "dark"
                      ? "bg-[#1e1f24] border-white/5 hover:shadow-[0_20px_45px_rgba(0,0,0,0.35)]"
                      : "bg-white border-gray-200 shadow-gray-250/40 hover:shadow-[0_20px_45px_rgba(124,58,237,0.15)]"
                  }`}
                >
                  {/* Episode Thumbnail 16:9 */}
                  <div className={`aspect-video w-full relative flex items-center justify-center overflow-hidden ${
                    theme === "dark" ? "bg-[#2b2c34]" : "bg-gray-200"
                  }`}>
                    {episode.image?.medium ? (
                      <img
                        src={episode.image.medium}
                        alt={episode.name}
                        className="w-full h-full object-cover group-hover/card:scale-106 transition-transform duration-300 ease-in-out"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-gray-500">
                        <svg className="w-8 h-8 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                        <span className="font-bold tracking-wider text-[10px]">NO THUMBNAIL</span>
                      </div>
                    )}

                    {/* Floating Rating Tag */}
                    {episode.rating?.average && (
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm border border-white/10 text-yellow-400 text-xs font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-md">
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        <span>{episode.rating.average}</span>
                      </div>
                    )}

                    {/* Episode Number floating tag on left */}
                    <div className="absolute bottom-3 left-3 bg-[#7c3aed] text-white text-[10px] font-black tracking-wider px-2 py-0.5 rounded-md shadow-md uppercase">
                      EP {episode.number}
                    </div>
                  </div>

                  {/* Episode Info */}
                  <div className="p-4 flex flex-col justify-between flex-1 gap-2.5">
                    <div className="flex flex-col gap-1">
                      <h3 className={`font-bold text-sm md:text-base leading-snug group-hover/card:text-[#8b5cf6] transition-colors duration-200 truncate ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`} title={episode.name}>
                        {episode.name}
                      </h3>
                      <p className={`text-[11px] font-semibold ${
                        theme === "dark" ? "text-gray-450" : "text-gray-500"
                      }`}>
                        Aired: {airDate}
                      </p>
                    </div>

                    <p className={`text-xs leading-relaxed line-clamp-2 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}>
                      {truncatedSummary || "No episode summary available."}
                    </p>

                    <div className="flex items-center justify-between mt-1 pt-2 border-t border-black/5 dark:border-white/5">
                      <span className={`text-[11px] font-bold ${
                        theme === "dark" ? "text-gray-450" : "text-gray-500"
                      } flex items-center gap-1`}>
                        <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        {episode.runtime ? `${episode.runtime} min` : "N/A"}
                      </span>
                      
                      <span className="text-[11px] font-bold text-[#7c3aed] group-hover/card:underline flex items-center gap-0.5">
                        Details
                        <svg className="w-3 h-3 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State for no episodes */
          <div className={`p-16 rounded-2xl border text-center ${
            theme === "dark" ? "bg-[#1e1f24] border-white/5 text-gray-400" : "bg-white border-gray-250 text-gray-500"
          }`}>
            <h3 className="text-lg font-bold mb-2">No episodes listed</h3>
            <p className="text-sm max-w-sm mx-auto">
              We couldn't find any episodes registered under Season {seasonNumber} of this show.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Elist;