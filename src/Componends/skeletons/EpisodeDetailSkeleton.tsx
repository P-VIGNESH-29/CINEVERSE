import React from "react";
import { useTheme } from "../../context/ThemeContext";

const EpisodeDetailSkeleton: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen p-6 md:p-8 pt-12 animate-pulse ${
      theme === "dark" ? "bg-[#0f1013]" : "bg-[#f3f4f6]"
    }`}>
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb Skeleton */}
        <div className={`h-4 rounded w-64 mb-6 ${theme === "dark" ? "bg-white/5" : "bg-black/5"}`} />

        {/* Large Media Banner */}
        <div className={`w-full aspect-video rounded-2xl mb-8 shadow-lg ${
          theme === "dark" ? "bg-[#1e1f24]" : "bg-gray-300"
        }`} />

        {/* Title & Info */}
        <div className="flex flex-col gap-4 mb-8">
          <div className={`h-8 rounded w-2/3 ${theme === "dark" ? "bg-white/10" : "bg-black/10"}`} />
          <div className="flex gap-4">
            <div className={`h-5 rounded w-24 ${theme === "dark" ? "bg-white/5" : "bg-black/5"}`} />
            <div className={`h-5 rounded w-16 ${theme === "dark" ? "bg-white/5" : "bg-black/5"}`} />
            <div className={`h-5 rounded w-20 ${theme === "dark" ? "bg-white/5" : "bg-black/5"}`} />
          </div>
        </div>

        {/* Summary text lines */}
        <div className="flex flex-col gap-2.5 mb-8">
          <div className={`h-4 rounded w-full ${theme === "dark" ? "bg-white/5" : "bg-black/5"}`} />
          <div className={`h-4 rounded w-11/12 ${theme === "dark" ? "bg-white/5" : "bg-black/5"}`} />
          <div className={`h-4 rounded w-4/5 ${theme === "dark" ? "bg-white/5" : "bg-black/5"}`} />
        </div>

        {/* Metadata Grid */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl ${
          theme === "dark" ? "bg-[#1e1f24]" : "bg-white border border-gray-250"
        }`}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <div className={`h-3 rounded w-16 ${theme === "dark" ? "bg-white/5" : "bg-black/5"}`} />
              <div className={`h-4 rounded w-20 ${theme === "dark" ? "bg-white/10" : "bg-black/10"}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EpisodeDetailSkeleton;
