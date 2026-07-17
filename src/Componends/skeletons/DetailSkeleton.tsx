import React from "react";
import { useTheme } from "../../context/ThemeContext";

const DetailSkeleton: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen pb-12 animate-pulse ${
      theme === "dark" ? "bg-[#0f1013]" : "bg-[#f3f4f6]"
    }`}>
      {/* Banner Area */}
      <div className={`w-full h-[45vw] max-h-[480px] min-h-[300px] relative ${
        theme === "dark" ? "bg-[#1e1f24]" : "bg-gray-200"
      }`}>
        <div className={`absolute inset-0 bg-gradient-to-t via-transparent to-transparent ${
          theme === "dark" ? "from-[#0f1013]" : "from-[#f3f4f6]"
        }`} />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 mt-[-80px] md:mt-[-120px] relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster Box */}
          <div className={`w-[200px] h-[300px] rounded-2xl flex-shrink-0 shadow-2xl ${
            theme === "dark" ? "bg-[#1e1f24]" : "bg-gray-300"
          }`} />

          {/* Info Details */}
          <div className="flex-grow flex flex-col gap-4 mt-12 md:mt-24">
            <div className={`h-8 rounded w-2/3 ${
              theme === "dark" ? "bg-white/10" : "bg-black/10"
            }`} />
            <div className="flex flex-wrap gap-3">
              <div className={`h-5 rounded w-16 ${theme === "dark" ? "bg-white/5" : "bg-black/5"}`} />
              <div className={`h-5 rounded w-24 ${theme === "dark" ? "bg-white/5" : "bg-black/5"}`} />
              <div className={`h-5 rounded w-20 ${theme === "dark" ? "bg-white/5" : "bg-black/5"}`} />
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <div className={`h-4 rounded w-full ${theme === "dark" ? "bg-white/5" : "bg-black/5"}`} />
              <div className={`h-4 rounded w-5/6 ${theme === "dark" ? "bg-white/5" : "bg-black/5"}`} />
              <div className={`h-4 rounded w-3/4 ${theme === "dark" ? "bg-white/5" : "bg-black/5"}`} />
            </div>
          </div>
        </div>

        {/* Cast Section Skeleton */}
        <div className="mt-12">
          <div className={`h-6 rounded w-36 mb-6 ${
            theme === "dark" ? "bg-white/10" : "bg-black/10"
          }`} />
          <div className="flex gap-6 overflow-x-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-3 flex-shrink-0">
                <div className={`w-20 h-20 rounded-full ${
                  theme === "dark" ? "bg-[#1e1f24]" : "bg-gray-300"
                }`} />
                <div className={`h-3 rounded w-16 ${theme === "dark" ? "bg-white/5" : "bg-black/5"}`} />
                <div className={`h-2.5 rounded w-12 ${theme === "dark" ? "bg-white/5" : "bg-black/5"}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Seasons Section Skeleton */}
        <div className="mt-12">
          <div className={`h-6 rounded w-36 mb-6 ${
            theme === "dark" ? "bg-white/10" : "bg-black/10"
          }`} />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={`h-[240px] rounded-2xl ${
                theme === "dark" ? "bg-[#1e1f24]" : "bg-gray-300"
              }`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailSkeleton;
