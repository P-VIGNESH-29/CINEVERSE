import React from "react";
import { useTheme } from "../../context/ThemeContext";

const EpisodeListSkeleton: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen p-6 md:p-8 pt-12 animate-pulse ${
      theme === "dark" ? "bg-[#0f1013]" : "bg-[#f3f4f6]"
    }`}>
      <div className="max-w-7xl mx-auto">
        {/* Header Breadcrumbs & Title */}
        <div className="flex flex-col gap-3 mb-10">
          <div className={`h-4 rounded w-48 ${theme === "dark" ? "bg-white/5" : "bg-black/5"}`} />
          <div className={`h-8 rounded w-80 ${theme === "dark" ? "bg-white/10" : "bg-black/10"}`} />
        </div>

        {/* Episodes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div 
              key={i} 
              className={`rounded-2xl overflow-hidden border flex flex-col h-[320px] ${
                theme === "dark" 
                  ? "bg-[#1e1f24] border-white/5" 
                  : "bg-white border-gray-200"
              }`}
            >
              {/* Aspect-video Thumbnail */}
              <div className={`aspect-video w-full ${
                theme === "dark" ? "bg-white/5" : "bg-gray-300"
              }`} />
              
              {/* Text Info */}
              <div className="p-4 flex flex-col gap-3 flex-1 justify-between">
                <div className="flex flex-col gap-2">
                  <div className={`h-4 rounded w-3/4 ${theme === "dark" ? "bg-white/10" : "bg-black/10"}`} />
                  <div className={`h-3 rounded w-1/2 ${theme === "dark" ? "bg-white/5" : "bg-black/5"}`} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className={`h-2.5 rounded w-full ${theme === "dark" ? "bg-white/5" : "bg-black/5"}`} />
                  <div className={`h-2.5 rounded w-5/6 ${theme === "dark" ? "bg-white/5" : "bg-black/5"}`} />
                </div>
                <div className={`h-3 rounded w-16 ${theme === "dark" ? "bg-white/5" : "bg-black/5"}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EpisodeListSkeleton;
