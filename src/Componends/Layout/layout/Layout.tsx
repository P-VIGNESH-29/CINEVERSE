import { Outlet, useLocation } from "react-router-dom";
import Header from "../header/Header";
import { useTheme } from "../../../context/ThemeContext";

export default function Layout() {
  const { theme } = useTheme();
  const location = useLocation();

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-350 ${
      theme === "dark" ? "bg-[#0f1013] text-white" : "bg-[#f3f4f6] text-gray-900"
    }`}>
      <Header />

      <main key={location.pathname} className="flex-grow animate-fade-in">
        <Outlet />
      </main>
    </div>
  );
}