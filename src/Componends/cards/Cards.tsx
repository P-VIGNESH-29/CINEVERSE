import { useTheme } from "../../context/ThemeContext";

interface CardProps {
  title?: string;
  rating?: number | string;
  genres?: string[];
  imageUrl?: string;
  onClick?: () => void;
}

export default function Cards({
  title = "Severance",
  rating = "8.4",
  genres = ["DRAMA", "SCI-FI"],
  imageUrl,
  onClick,
}: CardProps) {
  const { theme } = useTheme();

  return (
    <div
      onClick={onClick}
      className={`group/card cine-card w-full max-w-[240px] h-[360px] rounded-2xl border flex flex-col shadow-md overflow-hidden cursor-pointer ${
        theme === "dark"
          ? "bg-[#1e1f24] border-white/5 shadow-black/40 hover:shadow-[0_20px_45px_rgba(0,0,0,0.35)]"
          : "bg-white border-gray-200 shadow-gray-250/40 hover:shadow-[0_20px_45px_rgba(124,58,237,0.15)]"
      }`}
    >
      {/* Poster Area */}
      <div className={`relative flex-1 flex items-center justify-center overflow-hidden ${
        theme === "dark" ? "bg-[#2b2c34]" : "bg-gray-200"
      }`}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover group-hover/card:scale-106 transition-transform duration-300 ease-in-out"
          />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <svg className="w-8 h-8 text-gray-400 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span className="text-gray-400 font-bold tracking-[0.2em] text-[10px]">NO POSTER</span>
          </div>
        )}

        {/* Hover Glassmorphic Overlay with Action Buttons */}
        <div className="cine-card-overlay absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent opacity-0 group-hover/card:opacity-100 flex flex-col items-center justify-end pb-6 px-4 gap-2.5 backdrop-blur-[1px]">
          {/* Animated Action Buttons (fade + slide-up, no flicker) */}
          <div className="cine-card-buttons w-full flex flex-col gap-2">
            <span className="flex items-center justify-center gap-1.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-[11px] font-bold py-2.5 px-3 rounded-xl shadow-lg transition-colors cursor-pointer w-full select-none">
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Watch Trailer
            </span>
            <span className="flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/15 text-[11px] font-bold py-2.5 px-3 rounded-xl backdrop-blur-sm shadow-md transition-colors cursor-pointer w-full select-none">
              <svg className="w-3 h-3 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              More Info
            </span>
          </div>
        </div>

        {/* Floating Rating Badge */}
        {rating && rating !== "N/A" && (
          <div className="absolute top-3 right-3 bg-[#7c3aed] text-white text-xs font-bold px-2 py-0.5 rounded-md shadow-md z-10 animate-fade-in">
            {rating}
          </div>
        )}
      </div>

      {/* Typography & Footer Area */}
      <div className={`cine-card-footer p-4 flex flex-col gap-1 border-t z-10 ${
        theme === "dark" ? "bg-[#121316] border-white/5" : "bg-gray-50 border-gray-150"
      }`}>
        <h3 className={`font-bold text-sm md:text-base truncate leading-snug group-hover/card:text-[#8b5cf6] transition-colors duration-300 ease-in-out ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`} title={title}>
          {title}
        </h3>
        <p className={`text-[10px] md:text-xs font-semibold tracking-wider uppercase truncate transform group-hover/card:translate-x-0.5 transition-transform duration-300 ease-in-out ${
          theme === "dark" ? "text-gray-400" : "text-gray-500"
        }`}>
          {genres.join("  •  ")}
        </p>
      </div>
    </div>
  );
}