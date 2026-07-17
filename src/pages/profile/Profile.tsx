import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTheme } from "../../context/ThemeContext";
import { setSearchQuery } from "../../redux/store/createSlice";
import Cards from "../../Componends/cards/Cards";

interface SavedShow {
  id: number;
  name: string;
  genres: string[];
  rating?: {
    average?: number;
  };
  image?: {
    medium?: string;
    original?: string;
  };
  watchedAt?: string;
}

interface User {
  email: string;
  password?: string;
  joinedDate?: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme } = useTheme();

  // User session
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [userMetadata, setUserMetadata] = useState<User | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteError, setDeleteError] = useState("");

  // Lists
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [watchlist, setWatchlist] = useState<SavedShow[]>([]);
  const [watchHistory, setWatchHistory] = useState<SavedShow[]>([]);

  useEffect(() => {
    const loggedIn = localStorage.getItem("cineverse_logged_in_user");
    setCurrentUserEmail(loggedIn);

    // Fetch user metadata for joinedDate
    if (loggedIn) {
      const storedUsersRaw = localStorage.getItem("cineverse_users");
      const users: User[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
      const found = users.find((u) => u.email.toLowerCase() === loggedIn.toLowerCase());
      if (found) {
        setUserMetadata(found);
      } else {
        // Fallback for default test account
        setUserMetadata({
          email: loggedIn,
          joinedDate: "July 16, 2026",
        });
      }
    } else {
      setUserMetadata(null);
    }

    const namespace = loggedIn || "guest";
    
    // Load recent searches
    const savedSearches = localStorage.getItem("recentSearches");
    setRecentSearches(savedSearches ? JSON.parse(savedSearches) : []);

    // Load watchlist
    const savedWatchlist = localStorage.getItem(`cineverse_watchlist_${namespace}`);
    setWatchlist(savedWatchlist ? JSON.parse(savedWatchlist) : []);

    // Load watch history
    const savedHistory = localStorage.getItem(`cineverse_watch_history_${namespace}`);
    setWatchHistory(savedHistory ? JSON.parse(savedHistory) : []);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("cineverse_logged_in_user");
    navigate("/");
  };

  const handleDeleteAccount = () => {
    if (!currentUserEmail) return;

    if (deleteConfirmText.toLowerCase() !== "delete") {
      setDeleteError("Please type 'delete' to confirm account deletion.");
      return;
    }

    const storedUsersRaw = localStorage.getItem("cineverse_users");
    let users: User[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
    
    // Filter out the current user
    users = users.filter((u) => u.email.toLowerCase() !== currentUserEmail.toLowerCase());
    localStorage.setItem("cineverse_users", JSON.stringify(users));

    // Clear user data namespace
    localStorage.removeItem(`cineverse_watchlist_${currentUserEmail}`);
    localStorage.removeItem(`cineverse_watch_history_${currentUserEmail}`);
    localStorage.removeItem("cineverse_logged_in_user");

    // Close modal and redirect
    setIsDeleteModalOpen(false);
    navigate("/");
  };

  // Recent searches actions
  const removeSearchKeyword = (keyword: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter((s) => s.toLowerCase() !== keyword.toLowerCase());
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const clearAllRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  const handleKeywordClick = (keyword: string) => {
    dispatch(setSearchQuery(keyword));
    navigate("/layout");
  };

  // Derive initials
  const userInitials = currentUserEmail
    ? currentUserEmail.substring(0, 2).toUpperCase()
    : "GU";

  // Account ID hash representation
  const accountId = currentUserEmail
    ? `CV-${Math.abs(currentUserEmail.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) * 179) % 1000000}`
    : "CV-GUEST";

  return (
    <div className={`w-full min-h-screen px-4 md:px-8 py-8 flex flex-col gap-10 select-none animate-fade-in ${
      theme === "dark" ? "bg-[#0f1013] text-white" : "bg-[#f3f4f6] text-gray-900"
    }`}>
      
      {/* Profile Banner Card */}
      <section className={`w-full rounded-3xl border p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden backdrop-blur-2xl shadow-xl ${
        theme === "dark"
          ? "bg-[#16171a]/80 border-white/5 shadow-black/30"
          : "bg-white/80 border-gray-250/30 shadow-gray-300/20"
      }`}>
        
        {/* Decorative background glow */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#7c3aed]/10 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#a78bfa]/10 rounded-full filter blur-3xl pointer-events-none" />

        {/* User Identity */}
        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10 w-full md:w-auto">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#7c3aed] to-[#d946ef] text-white flex items-center justify-center text-3xl font-black select-none shadow-[0_10px_25px_rgba(124,58,237,0.3)]">
            {userInitials}
          </div>
          
          <div className="text-center md:text-left flex flex-col gap-1">
            <h2 className="text-xl md:text-2xl font-black tracking-tight truncate max-w-sm md:max-w-md">
              {currentUserEmail || "Guest User"}
            </h2>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-1.5">
              <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md ${
                currentUserEmail
                  ? "bg-[#7c3aed]/15 text-[#a78bfa] border border-[#7c3aed]/20"
                  : "bg-gray-500/10 text-gray-400 border border-white/5"
              }`}>
                {currentUserEmail ? "Premium Access" : "Guest View Only"}
              </span>

              <span className={`text-xs font-semibold ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                ID: <span className="font-bold">{accountId}</span>
              </span>
            </div>
            
            {userMetadata?.joinedDate && (
              <p className={`text-xs mt-1.5 font-medium ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
                Member Since {userMetadata.joinedDate}
              </p>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4 relative z-10 w-full md:w-auto md:self-end">
          {currentUserEmail ? (
            <>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-6 py-3 rounded-2xl font-bold shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer text-sm"
              >
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Sign Out
              </button>

              <button
                onClick={() => {
                  setDeleteError("");
                  setDeleteConfirmText("");
                  setIsDeleteModalOpen(true);
                }}
                className="flex items-center gap-2 border border-red-500/20 bg-red-500/5 hover:bg-red-500/15 text-red-400 hover:text-red-300 px-6 py-3 rounded-2xl font-bold transition-all duration-300 hover:scale-105 cursor-pointer text-sm"
              >
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
                Delete Account
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] hover:from-[#6d28d9] hover:to-[#7c3aed] text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer text-sm"
            >
              Sign In / Register
            </button>
          )}
        </div>
      </section>

      {/* Recent Searches Section */}
      <section className="w-full flex flex-col gap-4">
        <div className="flex items-center justify-between border-b pb-2.5 border-white/5">
          <h3 className="text-lg md:text-xl font-black tracking-wide flex items-center gap-2">
            <svg className="w-5 h-5 text-[#8b5cf6] fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            Recent Searches
          </h3>
          
          {recentSearches.length > 0 && (
            <button
              onClick={clearAllRecentSearches}
              className="text-xs font-bold text-[#8b5cf6] hover:underline cursor-pointer bg-transparent border-none p-0 outline-none"
            >
              Clear Search History
            </button>
          )}
        </div>

        {recentSearches.length > 0 ? (
          <div className="flex flex-wrap gap-2.5">
            {recentSearches.map((term, index) => (
              <div
                key={index}
                onClick={() => handleKeywordClick(term)}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl border text-xs font-bold cursor-pointer transition-all duration-300 hover:scale-105 shadow-sm group/searchKeyword ${
                  theme === "dark"
                    ? "bg-[#16171a] border-white/10 text-gray-300 hover:bg-[#7c3aed] hover:text-white hover:border-[#7c3aed]"
                    : "bg-white border-gray-250/50 text-gray-700 hover:bg-[#7c3aed] hover:text-white hover:border-[#7c3aed]"
                }`}
              >
                <span>{term}</span>
                <button
                  type="button"
                  onClick={(e) => removeSearchKeyword(term, e)}
                  className="p-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-gray-500 group-hover/searchKeyword:text-white transition-colors duration-250 border-none outline-none"
                  title="Remove search"
                >
                  <svg className="w-3 h-3 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className={`text-sm py-4 italic font-medium ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
            No recent search history found. Try searching for movie genres or titles from the header!
          </div>
        )}
      </section>

      {/* Watchlist Section */}
      <section className="w-full flex flex-col gap-4">
        <div className="border-b pb-2.5 border-white/5">
          <h3 className="text-lg md:text-xl font-black tracking-wide flex items-center gap-2">
            <svg className="w-5 h-5 text-[#8b5cf6] fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            My Watchlist
          </h3>
        </div>

        {watchlist.length > 0 ? (
          <div className="w-full overflow-x-auto scrollbar-none pb-4">
            <div className="flex gap-6 w-max">
              {watchlist.map((show) => (
                <div key={show.id} className="w-[200px] flex-shrink-0">
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
          </div>
        ) : (
          <div className={`w-full rounded-2xl border p-8 text-center flex flex-col items-center justify-center gap-4 ${
            theme === "dark" ? "bg-[#16171a]/30 border-white/5" : "bg-white border-gray-200"
          }`}>
            <p className={`text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-650"}`}>
              Your watchlist is empty. Bookmarked movies and TV shows will appear here!
            </p>
            <button
              onClick={() => navigate("/layout")}
              className="bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] hover:from-[#6d28d9] hover:to-[#7c3aed] text-white px-5 py-2.5 rounded-xl font-bold shadow-md transition-all duration-300 hover:scale-105 cursor-pointer text-xs uppercase tracking-wider"
            >
              Browse Shows
            </button>
          </div>
        )}
      </section>

      {/* Recently Watched Section */}
      <section className="w-full flex flex-col gap-4">
        <div className="border-b pb-2.5 border-white/5">
          <h3 className="text-lg md:text-xl font-black tracking-wide flex items-center gap-2">
            <svg className="w-5 h-5 text-[#8b5cf6] fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Recently Watched
          </h3>
        </div>

        {watchHistory.length > 0 ? (
          <div className="w-full overflow-x-auto scrollbar-none pb-4">
            <div className="flex gap-6 w-max">
              {watchHistory.map((show) => (
                <div key={show.id} className="w-[200px] flex-shrink-0">
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
          </div>
        ) : (
          <div className={`w-full rounded-2xl border p-8 text-center flex flex-col items-center justify-center gap-4 ${
            theme === "dark" ? "bg-[#16171a]/30 border-white/5" : "bg-white border-gray-200"
          }`}>
            <p className={`text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-650"}`}>
              You haven't streamed any shows yet. Movies and episodes you stream will be recorded here!
            </p>
            <button
              onClick={() => navigate("/layout")}
              className="bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] hover:from-[#6d28d9] hover:to-[#7c3aed] text-white px-5 py-2.5 rounded-xl font-bold shadow-md transition-all duration-300 hover:scale-105 cursor-pointer text-xs uppercase tracking-wider"
            >
              Stream Now
            </button>
          </div>
        )}
      </section>

      {/* Custom Delete Account Glassmorphic Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className={`w-full max-w-[420px] rounded-3xl border p-6 md:p-8 flex flex-col gap-6 shadow-2xl relative overflow-hidden ${
            theme === "dark" ? "bg-[#16171a]/95 border-white/10 shadow-black/80" : "bg-white border-gray-200 shadow-gray-450/40"
          }`}>
            
            {/* Warning indicator */}
            <div className="flex items-center gap-3 text-red-500 border-b border-red-500/10 pb-3">
              <div className="p-2 rounded-xl bg-red-500/10">
                <svg className="w-6 h-6 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <h4 className="text-lg font-black tracking-wide">Delete Account</h4>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-xs md:text-sm font-semibold leading-relaxed">
                Are you absolutely sure you want to delete your account? This action is <span className="text-red-500 font-extrabold uppercase">permanent</span> and will erase all data.
              </p>
              <p className="text-xs text-gray-500">
                To confirm, please type <span className="font-extrabold text-red-400 select-all">delete</span> in the field below:
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type 'delete'"
                className="w-full bg-[#18191d]/60 dark:bg-black/20 border border-white/10 focus:border-red-500 rounded-xl px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-red-500/25 transition-all text-center font-bold"
              />
              {deleteError && (
                <div className="text-[11px] font-semibold text-red-400 text-center bg-red-500/5 py-1.5 px-2 rounded-lg border border-red-500/10">
                  {deleteError}
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className={`flex-1 py-3 rounded-xl font-bold transition-all text-xs uppercase tracking-wider cursor-pointer border ${
                  theme === "dark"
                    ? "bg-white/5 border-white/10 hover:bg-white/10 text-white"
                    : "bg-gray-100 border-gray-200 hover:bg-gray-200 text-gray-700"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold shadow-lg transition-all text-xs uppercase tracking-wider cursor-pointer hover:shadow-red-650/20"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
