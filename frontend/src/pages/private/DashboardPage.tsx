import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeaf, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { HamburgerMenu } from "../../components/common/HamburgerMenu";

export default function DashboardPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("agrify_auth_token");
    navigate("/auth");
  };

  return (
    <div className={`min-h-screen p-6 sm:p-10 ${isDark ? "bg-zinc-950 text-white" : "bg-zinc-50 text-zinc-900"}`}>
      {/* Dashboard Top Header */}
      <header className="flex items-center justify-between pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white">
            <FontAwesomeIcon icon={faLeaf} className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Agrify Dashboard</h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Farm & Management Overview</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/60 transition-colors"
          >
            <FontAwesomeIcon icon={faRightFromBracket} className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
          <HamburgerMenu />
        </div>
      </header>

      {/* Content preview */}
      <main className="mt-8">
        <div className={`p-8 rounded-2xl border ${isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200 shadow-xs"}`}>
          <h2 className="text-lg font-bold text-teal-600 mb-2">Welcome to Agrify Management Portal</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            You are successfully authenticated. Full dashboard modules (Farms, Crops, Inventory, Sales, Attendance) will be integrated here step-by-step.
          </p>
        </div>
      </main>
    </div>
  );
}
