import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLeaf,
  faSeedling,
  faChartLine,
  faTractor,
} from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { HamburgerMenu } from "../../components/common/HamburgerMenu";
import { AuthForm } from "../../components/auth/AuthForm";
import sideImg from "../../assets/auth-page-side-img.png";

export default function AuthPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`h-screen max-h-screen overflow-hidden flex w-full transition-colors duration-200 ${
        isDark ? "bg-zinc-950 text-white" : "bg-zinc-50 text-zinc-900"
      }`}
    >
      {/* LEFT SIDE - Hero & Branding (Fixed height 100vh, non-scrollable) */}
      <div className="hidden lg:flex lg:w-1/2 h-full overflow-hidden shrink-0 relative bg-zinc-900 text-white flex-col justify-between p-10 xl:p-12">
        {/* Background Image with Gradient Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center z-0 transition-transform duration-700 hover:scale-105"
          style={{ backgroundImage: `url(${sideImg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/80 to-zinc-900/40 z-10" />

        {/* Top Logo & Title */}
        <div className="relative z-20 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-teal-600 flex items-center justify-center shadow-lg shadow-teal-900/30">
            <FontAwesomeIcon icon={faLeaf} className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Agrify
              <span className="text-[10px] uppercase font-bold tracking-widest bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded-full">
                Enterprise
              </span>
            </h1>
            <p className="text-xs text-zinc-300 font-medium">
              Farm & Agriculture Management System
            </p>
          </div>
        </div>

        {/* Middle Feature Highlights */}
        <div className="relative z-20 space-y-6 my-auto max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-bold">
            <FontAwesomeIcon icon={faSeedling} className="w-3.5 h-3.5" />
            <span>Streamlined Agricultural Analytics</span>
          </div>

          <h2 className="text-3xl xl:text-4xl font-extrabold leading-tight tracking-tight text-white">
            Farm Management & Analytics
          </h2>

          <p className="text-xs xl:text-sm text-zinc-300 leading-relaxed">
            Manage employees, monitor crops, track equipment maintenance, oversee fertilizer applications, and visualize financial growth in real-time.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xs">
              <FontAwesomeIcon icon={faChartLine} className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white">Yield Optimization</h4>
                <p className="text-[11px] text-zinc-400">Track harvests & sales insights</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xs">
              <FontAwesomeIcon icon={faTractor} className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white">Asset & Equipment</h4>
                <p className="text-[11px] text-zinc-400">Usage logs & maintenance</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer info */}
        <div className="relative z-20 flex items-center justify-between text-xs text-zinc-400 pt-6 border-t border-zinc-800/60">
          <span>&copy; {new Date().getFullYear()} Agrify Systems Inc.</span>
          {/* <span className="flex items-center gap-1.5">
            <FontAwesomeIcon icon={faShieldHalved} className="w-3.5 h-3.5 text-teal-400" />
            Database Academic Project
          </span> */}
        </div>
      </div>

      {/* RIGHT SIDE - Form Container (Scrollable independent section) */}
      <div className="flex-1 h-full overflow-y-auto flex flex-col justify-between p-4 sm:p-8 md:p-12 relative hide-scrollbar">
        {/* Top bar with Hamburger menu */}
        <div className="flex items-center justify-between lg:justify-end w-full mb-6 shrink-0">
          {/* Mobile branding header */}
          <div className="flex lg:hidden items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center shadow-xs">
              <FontAwesomeIcon icon={faLeaf} className="w-5 h-5 text-white" />
            </div>
            <span className={`font-black text-xl tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>
              Agrify
            </span>
          </div>

          {/* Hamburger Menu (Componentized with Theme Toggle inside) */}
          <HamburgerMenu />
        </div>

        {/* Form Container */}
        <div className="my-auto py-6">
          <AuthForm />
        </div>

        {/* Footer info for mobile */}
        <div className="text-center text-xs text-zinc-500 pt-6 lg:hidden shrink-0">
          &copy; {new Date().getFullYear()} Agrify Farm Management. All rights reserved.
        </div>
      </div>
    </div>
  );
}
