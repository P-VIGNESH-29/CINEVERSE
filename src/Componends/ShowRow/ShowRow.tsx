import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import Cards from "../cards/Cards";
import { useTheme } from "../../context/ThemeContext";

interface ShowRowProps {
  title: string;
  shows: any[];
}

export default function ShowRow({ title, shows }: ShowRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleScroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.75;
      rowRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!shows || shows.length === 0) return null;

  return (
    <div className="relative group mb-10 px-6 md:px-8">
      {/* Row Title */}
      <h2 className={`text-lg md:text-xl font-bold mb-4 tracking-wide group-hover:text-[#8b5cf6] transition-colors duration-300 ${
        theme === "dark" ? "text-white" : "text-gray-900"
      }`}>
        {title}
      </h2>

      <div className="relative flex items-center">
        {/* Left Arrow */}
        <button
          onClick={() => handleScroll("left")}
          className="absolute left-0 z-30 bg-black/60 hover:bg-[#7c3aed] text-white p-2.5 rounded-full shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-115 focus:outline-none backdrop-blur-sm border border-white/5 cursor-pointer translate-x-[-50%]"
          aria-label="Scroll Left"
        >
          <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Scroll Container */}
        <div
          ref={rowRef}
          className="flex gap-6 overflow-x-auto py-3 px-1 w-full scroll-smooth overflow-y-hidden snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {shows.map((show) => (
            <div key={show.id} className="flex-shrink-0 snap-start">
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

        {/* Right Arrow */}
        <button
          onClick={() => handleScroll("right")}
          className="absolute right-0 z-30 bg-black/60 hover:bg-[#7c3aed] text-white p-2.5 rounded-full shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-115 focus:outline-none backdrop-blur-sm border border-white/5 cursor-pointer translate-x-[50%]"
          aria-label="Scroll Right"
        >
          <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
