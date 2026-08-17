import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faUser,
  faPhone,
  faArrowRight,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { AuthInput } from "../common/AuthInput";
import { EyeToggle } from "../common/EyeToggle";
import { PasswordStrengthMeter } from "./PasswordStrengthMeter";
import type { AuthMode, LoginFormData, RegisterFormData } from "../../types/auth";
import { extractErrorMessage } from "../../utils/errors";
import { consumePrefillUsername } from "../../services/authService";

export function AuthForm() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [mode, setMode] = useState<AuthMode>("login");

  // Login form state — the username is seeded from a one-time value left behind by a
  // forced logout (e.g. right after changing password), so the user doesn't have to
  // retype it. A lazy initializer keeps this a single synchronous read on first render.
  const [loginData, setLoginData] = useState<LoginFormData>(() => ({
    username: consumePrefillUsername() ?? "",
    password: "",
    rememberMe: false,
  }));
  const [showLoginPw, setShowLoginPw] = useState(false);
  const [loginSubmitting, setLoginSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register form state
  const [registerData, setRegisterData] = useState<RegisterFormData>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [showRegisterPw, setShowRegisterPw] = useState(false);
  const [registerSubmitting, setRegisterSubmitting] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.username || !loginData.password || loginSubmitting) return;

    setLoginSubmitting(true);
    setLoginError(null);

    try {
      await login(loginData.username, loginData.password);
      navigate("/dashboard");
    } catch (err) {
      setLoginError(extractErrorMessage(err, "Invalid username or password. Please try again."));
    } finally {
      setLoginSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canRegister || registerSubmitting) return;

    setRegisterSubmitting(true);
    setRegisterError(null);

    try {
      await register({
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        email: registerData.email,
        phoneNumber: registerData.phone,
        username: registerData.username,
        password: registerData.password,
      });
      setRegisterSuccess(true);
      setTimeout(() => {
        setLoginData({
          username: registerData.username,
          password: "",
          rememberMe: false,
        });
        setMode("login");
        setRegisterSuccess(false);
      }, 1500);
    } catch (err) {
      setRegisterError(extractErrorMessage(err, "Failed to create account. Please try again."));
    } finally {
      setRegisterSubmitting(false);
    }
  };

  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const pwMismatch =
    registerData.confirmPassword.length > 0 &&
    registerData.confirmPassword !== registerData.password;

  const canRegister =
    registerData.firstName.trim().length > 0 &&
    registerData.lastName.trim().length > 0 &&
    isValidEmail(registerData.email) &&
    registerData.username.trim().length > 0 &&
    registerData.password.length >= 6 &&
    registerData.confirmPassword === registerData.password;

  // Style tokens - enforcing dark zinc for light mode, white/light zinc for dark mode
  const tabWrap = isDark ? "bg-zinc-800/80 p-1 border border-zinc-700/60" : "bg-zinc-100 p-1 border border-zinc-200";
  const tabActive = isDark ? "bg-gray-700/50 text-white shadow-xs font-semibold" : "bg-gray-600/70 text-white shadow-xs font-semibold";
  const tabInactive = isDark
    ? "text-zinc-400 hover:text-zinc-200"
    : "text-zinc-700 hover:text-zinc-900";

  const textColor = isDark ? "text-white" : "text-zinc-900";
  const subTextColor = isDark ? "text-zinc-400" : "text-zinc-700";

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className={`font-playwrite text-2xl sm:text-3xl font-extrabold tracking-tight ${textColor}`}>
          {mode === "login" ? "Welcome back" : "Create an account"}
        </h2>
        <p className={`text-xs sm:text-sm mt-1.5 font-medium ${subTextColor}`}>
          {mode === "login"
            ? "Sign in to access your farm management portal"
            : "Register your details to get started with Agrify"}
        </p>
      </div>

      {/* Tab Switcher */}
      <div className={`flex rounded-full mb-6 ${tabWrap}`}>
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`flex-1 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
            mode === "login" ? tabActive : tabInactive
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => setMode("register")}
          className={`flex-1 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
            mode === "register" ? tabActive : tabInactive
          }`}
        >
          Register
        </button>
      </div>

      {/* LOGIN FORM */}
      {mode === "login" && (
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div className="space-y-3.5">
            <div>
              <label
                className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${
                  isDark ? "text-zinc-300" : "text-zinc-800"
                }`}
              >
                Username
              </label>
              <AuthInput
                icon={faUser}
                type="text"
                name="username"
                placeholder="e.g. myusername"
                value={loginData.username}
                onChange={handleLoginChange}
                isDark={isDark}
                autoComplete="username"
                required
              />
            </div>

            <div>
              <label
                className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${
                  isDark ? "text-zinc-300" : "text-zinc-800"
                }`}
              >
                Password
              </label>
              <AuthInput
                icon={faLock}
                type={showLoginPw ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={loginData.password}
                onChange={handleLoginChange}
                isDark={isDark}
                autoComplete="current-password"
                required
                right={
                  <EyeToggle
                    show={showLoginPw}
                    onToggle={() => setShowLoginPw((prev) => !prev)}
                    isDark={isDark}
                  />
                }
              />
            </div>
          </div>

          {loginError && (
            <div
              className={`px-3 py-1 rounded-xl text-center border text-xs font-semibold ${
                isDark
                  ? "bg-red-950/40 border-red-800 text-red-400"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              {loginError}
            </div>
          )}

          {/* Remember me & Forgot password */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                name="rememberMe"
                checked={loginData.rememberMe}
                onChange={(e) =>
                  setLoginData((prev) => ({
                    ...prev,
                    rememberMe: e.target.checked,
                  }))
                }
                className="w-4 h-4 rounded text-teal-600 border-zinc-300 focus:ring-teal-500 accent-teal-600 cursor-pointer"
              />
              <span className={`text-xs font-semibold ${subTextColor}`}>
                Remember me
              </span>
            </label>

            <button
              type="button"
              onClick={() => alert("Password reset functionality will be available when backend API is linked.")}
              className="text-xs font-bold text-teal-600 hover:text-teal-700 transition-colors"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!loginData.username || !loginData.password || loginSubmitting}
            className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 active:scale-[0.98] transition-all duration-150 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2 mt-2"
          >
            {loginSubmitting ? (
              <span>Signing in...</span>
            ) : (
              <>
                <span>Sign In</span>
                <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" />
              </>
            )}
          </button>

          <p className={`text-center text-xs mt-4 font-medium ${subTextColor}`}>
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={() => setMode("register")}
              className="font-bold text-teal-600 hover:text-teal-700 underline"
            >
              Register here
            </button>
          </p>
        </form>
      )}

      {/* REGISTER FORM */}
      {mode === "register" && (
        <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
          {registerSuccess && (
            <div
              className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
                isDark
                  ? "bg-teal-950/50 border-teal-800 text-teal-300"
                  : "bg-teal-50 border-teal-200 text-teal-900"
              }`}
            >
              <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-teal-600" />
              <span>Account created! Redirecting to sign in...</span>
            </div>
          )}

          {/* Name Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                  isDark ? "text-zinc-300" : "text-zinc-800"
                }`}
              >
                First Name
              </label>
              <AuthInput
                icon={faUser}
                name="firstName"
                placeholder="John"
                value={registerData.firstName}
                onChange={handleRegisterChange}
                isDark={isDark}
                autoComplete="given-name"
                required
              />
            </div>

            <div>
              <label
                className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                  isDark ? "text-zinc-300" : "text-zinc-800"
                }`}
              >
                Last Name
              </label>
              <AuthInput
                icon={faUser}
                name="lastName"
                placeholder="Doe"
                value={registerData.lastName}
                onChange={handleRegisterChange}
                isDark={isDark}
                autoComplete="family-name"
                required
              />
            </div>
          </div>

          {/* Username */}
          <div>
            <label
              className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                isDark ? "text-zinc-300" : "text-zinc-800"
              }`}
            >
              Username
            </label>
            <AuthInput
              icon={faUser}
              name="username"
              placeholder="e.g. john.doe"
              value={registerData.username}
              onChange={handleRegisterChange}
              isDark={isDark}
              autoComplete="username"
              required
            />
          </div>

          {/* Phone Number */}
          <div>
            <label
              className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                isDark ? "text-zinc-300" : "text-zinc-800"
              }`}
            >
              Phone Number
            </label>
            <AuthInput
              icon={faPhone}
              type="tel"
              name="phone"
              placeholder="+1 (555) 000-0000"
              value={registerData.phone}
              onChange={handleRegisterChange}
              isDark={isDark}
              autoComplete="tel"
            />
          </div>

          {/* Email */}
          <div>
            <label
              className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                isDark ? "text-zinc-300" : "text-zinc-800"
              }`}
            >
              Email Address
            </label>
            <AuthInput
              icon={faEnvelope}
              type="email"
              name="email"
              placeholder="john@farm.com"
              value={registerData.email}
              onChange={handleRegisterChange}
              isDark={isDark}
              autoComplete="email"
              required
            />
          </div>

          {/* Password & Strength */}
          <div>
            <label
              className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                isDark ? "text-zinc-300" : "text-zinc-800"
              }`}
            >
              Password
            </label>
            <AuthInput
              icon={faLock}
              type={showRegisterPw ? "text" : "password"}
              name="password"
              placeholder="Min. 6 characters"
              value={registerData.password}
              onChange={handleRegisterChange}
              isDark={isDark}
              autoComplete="new-password"
              required
              right={
                <EyeToggle
                  show={showRegisterPw}
                  onToggle={() => setShowRegisterPw((prev) => !prev)}
                  isDark={isDark}
                />
              }
            />
            <PasswordStrengthMeter
              password={registerData.password}
              isDark={isDark}
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label
              className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                isDark ? "text-zinc-300" : "text-zinc-800"
              }`}
            >
              Confirm Password
            </label>
            <AuthInput
              icon={faLock}
              type="password"
              name="confirmPassword"
              placeholder="Re-enter password"
              value={registerData.confirmPassword}
              onChange={handleRegisterChange}
              isDark={isDark}
              autoComplete="new-password"
              required
            />
            {pwMismatch && (
              <p className="text-[11px] text-red-500 font-semibold mt-1 px-0.5">
                Passwords do not match
              </p>
            )}
          </div>

          {registerError && (
            <div
              className={`px-3 py-1 text-center rounded-xl border text-xs font-semibold ${
                isDark
                  ? "bg-red-950/40 border-red-800 text-red-400"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              {registerError}
            </div>
          )}

          {/* Terms Note */}
          <p className={`text-[11px] text-center font-medium ${subTextColor}`}>
            By registering, you agree to Agrify&apos;s{" "}
            <Link to="#" className="underline font-bold text-teal-600 hover:text-teal-700">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="#" className="underline font-bold text-teal-600 hover:text-teal-700">
              Privacy Policy
            </Link>
            .
          </p>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!canRegister || registerSubmitting}
            className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 active:scale-[0.98] transition-all duration-150 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2 mt-2"
          >
            {registerSubmitting ? (
              <span>Creating Account...</span>
            ) : (
              <>
                <span>Create Account</span>
                <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" />
              </>
            )}
          </button>

          <p className={`text-center text-xs mt-3 font-medium ${subTextColor}`}>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => setMode("login")}
              className="font-bold text-teal-600 hover:text-teal-700 underline"
            >
              Sign In
            </button>
          </p>
        </form>
      )}
    </div>
  );
}
