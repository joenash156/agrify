import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faPhone,
  faLock,
  faIdBadge,
  faShieldHalved,
  faTractor,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { PageHeader } from "../../components/common/PageHeader";
import { AuthInput } from "../../components/common/AuthInput";
import { EyeToggle } from "../../components/common/EyeToggle";
import { Switch } from "../../components/common/Switch";
import { StatusBadge } from "../../components/common/StatusBadge";
import { ThemeSwitcher } from "../../components/common/ThemeSwitcher";
import { MOCK_USER, MOCK_USER_ACCOUNT } from "../../data/dashboardMockData";
import { getNavGroups } from "../../data/dashboardNav";

const TABS = [
  { id: "profile", label: "Profile" },
  { id: "security", label: "Account & Security" },
  { id: "access", label: "Role & Access" },
  { id: "preferences", label: "Preferences" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function SettingsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeTab, setActiveTab] = useState<TabId>("profile");

  const [profile, setProfile] = useState({
    firstName: MOCK_USER.firstName,
    lastName: MOCK_USER.lastName,
    email: MOCK_USER.email,
    phone: MOCK_USER.phone ?? "",
  });

  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);

  const [preferences, setPreferences] = useState({ emailNotifications: true, smsNotifications: false });

  const cardBg = isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200";
  const sectionTitle = isDark ? "text-zinc-100" : "text-zinc-900";
  const subText = isDark ? "text-zinc-500" : "text-zinc-500";
  const labelCls = `block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? "text-zinc-300" : "text-zinc-800"}`;

  const fullName = `${profile.firstName} ${profile.lastName}`;
  const initials = `${profile.firstName[0] ?? ""}${profile.lastName[0] ?? ""}`.toUpperCase();
  const pwMismatch = passwords.confirm.length > 0 && passwords.confirm !== passwords.next;

  const navGroups = getNavGroups(MOCK_USER.role);

  return (
    <>
      <PageHeader title="Profile & Settings" subtitle="Manage your personal information, account, and preferences." />

      {/* Tabs */}
      <div className={`flex gap-1 border-b overflow-x-auto hide-scrollbar ${isDark ? "border-zinc-800" : "border-zinc-200"}`}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-teal-600 text-teal-600 dark:text-teal-400"
                : isDark
                ? "border-transparent text-zinc-500 hover:text-zinc-300"
                : "border-transparent text-zinc-500 hover:text-zinc-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={`rounded-2xl border p-5 sm:p-6 ${cardBg}`}>
        {/* ── Profile tab ── */}
        {activeTab === "profile" && (
          <div className="space-y-6 max-w-xl">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-teal-600 flex items-center justify-center text-white text-lg font-black shrink-0">
                {initials}
              </div>
              <div>
                <p className={`text-sm font-bold ${sectionTitle}`}>{fullName}</p>
                <p className={`text-xs ${subText}`}>{profile.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>First Name</label>
                <AuthInput
                  icon={faUser}
                  name="firstName"
                  placeholder="First name"
                  value={profile.firstName}
                  onChange={(e) => setProfile((p) => ({ ...p, firstName: e.target.value }))}
                  isDark={isDark}
                  required
                />
              </div>
              <div>
                <label className={labelCls}>Last Name</label>
                <AuthInput
                  icon={faUser}
                  name="lastName"
                  placeholder="Last name"
                  value={profile.lastName}
                  onChange={(e) => setProfile((p) => ({ ...p, lastName: e.target.value }))}
                  isDark={isDark}
                  required
                />
              </div>
            </div>

            <div>
              <label className={labelCls}>Email Address</label>
              <AuthInput
                icon={faEnvelope}
                type="email"
                name="email"
                placeholder="name@farm.com"
                value={profile.email}
                onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                isDark={isDark}
                required
              />
            </div>

            <div>
              <label className={labelCls}>Phone Number</label>
              <AuthInput
                icon={faPhone}
                type="tel"
                name="phone"
                placeholder="+233 20 000 0000"
                value={profile.phone}
                onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                isDark={isDark}
              />
            </div>

            <button
              type="button"
              onClick={() => alert("Profile updates will be available once the backend is connected.")}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 active:scale-[0.98] transition-all shadow-sm"
            >
              Save Changes
            </button>
          </div>
        )}

        {/* ── Account & Security tab ── */}
        {activeTab === "security" && (
          <div className="space-y-6 max-w-xl">
            <div className={`flex items-center justify-between p-4 rounded-xl border ${isDark ? "border-zinc-800 bg-zinc-800/40" : "border-zinc-200 bg-zinc-50"}`}>
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isDark ? "bg-teal-500/10 text-teal-400" : "bg-teal-50 text-teal-600"}`}>
                  <FontAwesomeIcon icon={faIdBadge} className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className={`text-xs font-bold truncate ${sectionTitle}`}>@{MOCK_USER_ACCOUNT.username}</p>
                  <p className={`text-[11px] ${subText}`}>Username</p>
                </div>
              </div>
              <StatusBadge status={MOCK_USER_ACCOUNT.accountStatus} variant="employment" />
            </div>

            <div className={`h-px ${isDark ? "bg-zinc-800" : "bg-zinc-200"}`} />

            <div>
              <p className={`text-xs font-extrabold uppercase tracking-widest mb-3 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                Change Password
              </p>
              <div className="space-y-3.5">
                <div>
                  <label className={labelCls}>Current Password</label>
                  <AuthInput
                    icon={faLock}
                    type={showCurrent ? "text" : "password"}
                    name="current"
                    placeholder="••••••••"
                    value={passwords.current}
                    onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
                    isDark={isDark}
                    autoComplete="current-password"
                    right={<EyeToggle show={showCurrent} onToggle={() => setShowCurrent((v) => !v)} isDark={isDark} />}
                  />
                </div>
                <div>
                  <label className={labelCls}>New Password</label>
                  <AuthInput
                    icon={faLock}
                    type={showNext ? "text" : "password"}
                    name="next"
                    placeholder="Min. 6 characters"
                    value={passwords.next}
                    onChange={(e) => setPasswords((p) => ({ ...p, next: e.target.value }))}
                    isDark={isDark}
                    autoComplete="new-password"
                    right={<EyeToggle show={showNext} onToggle={() => setShowNext((v) => !v)} isDark={isDark} />}
                  />
                </div>
                <div>
                  <label className={labelCls}>Confirm New Password</label>
                  <AuthInput
                    icon={faLock}
                    type="password"
                    name="confirm"
                    placeholder="Re-enter new password"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                    isDark={isDark}
                    autoComplete="new-password"
                  />
                  {pwMismatch && <p className="text-[11px] text-red-500 font-semibold mt-1 px-0.5">Passwords do not match</p>}
                </div>
              </div>
              <button
                type="button"
                disabled={!passwords.current || !passwords.next || passwords.next !== passwords.confirm}
                onClick={() => alert("Password updates will be available once the backend is connected.")}
                className="mt-4 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 active:scale-[0.98] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update Password
              </button>
            </div>
          </div>
        )}

        {/* ── Role & Access tab ── */}
        {activeTab === "access" && (
          <div className="space-y-6 max-w-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className={`p-4 rounded-xl border flex items-center gap-3 ${isDark ? "border-zinc-800 bg-zinc-800/40" : "border-zinc-200 bg-zinc-50"}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isDark ? "bg-teal-500/10 text-teal-400" : "bg-teal-50 text-teal-600"}`}>
                  <FontAwesomeIcon icon={faShieldHalved} className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className={`text-[11px] ${subText}`}>Platform Role</p>
                  <p className={`text-xs font-bold truncate ${sectionTitle}`}>{MOCK_USER.role.replace(/_/g, " ")}</p>
                </div>
              </div>
              <div className={`p-4 rounded-xl border flex items-center gap-3 ${isDark ? "border-zinc-800 bg-zinc-800/40" : "border-zinc-200 bg-zinc-50"}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isDark ? "bg-teal-500/10 text-teal-400" : "bg-teal-50 text-teal-600"}`}>
                  <FontAwesomeIcon icon={faTractor} className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className={`text-[11px] ${subText}`}>Assigned Farm</p>
                  <p className={`text-xs font-bold truncate ${sectionTitle}`}>{MOCK_USER.farmName ?? "—"}</p>
                </div>
              </div>
            </div>

            <div>
              <p className={`text-xs font-extrabold uppercase tracking-widest mb-3 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                What You Can Access
              </p>
              <div className="space-y-4">
                {navGroups.map((group) => (
                  <div key={group.label}>
                    <p className={`text-[11px] font-bold uppercase tracking-wide mb-2 ${subText}`}>{group.label}</p>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <span
                          key={item.href}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                            isDark ? "bg-zinc-800 text-zinc-300" : "bg-zinc-100 text-zinc-700"
                          }`}
                        >
                          <FontAwesomeIcon icon={faCircleCheck} className="w-2.5 h-2.5 text-teal-500" />
                          {item.label}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Preferences tab ── */}
        {activeTab === "preferences" && (
          <div className="space-y-6 max-w-xl">
            <div>
              <p className={`text-xs font-extrabold uppercase tracking-widest mb-3 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                Appearance
              </p>
              <ThemeSwitcher />
            </div>

            <div className={`h-px ${isDark ? "bg-zinc-800" : "bg-zinc-200"}`} />

            <div>
              <p className={`text-xs font-extrabold uppercase tracking-widest mb-1 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                Notification Preferences
              </p>
              <div className={`divide-y ${isDark ? "divide-zinc-800" : "divide-zinc-100"}`}>
                <Switch
                  checked={preferences.emailNotifications}
                  onChange={(v) => setPreferences((p) => ({ ...p, emailNotifications: v }))}
                  label="Email Notifications"
                  description="Receive updates about sales, harvests, and alerts via email."
                />
                <Switch
                  checked={preferences.smsNotifications}
                  onChange={(v) => setPreferences((p) => ({ ...p, smsNotifications: v }))}
                  label="SMS Notifications"
                  description="Receive critical alerts (e.g. disease outbreaks) via SMS."
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => alert("Preference changes will be available once the backend is connected.")}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 active:scale-[0.98] transition-all shadow-sm"
            >
              Save Preferences
            </button>
          </div>
        )}
      </div>
    </>
  );
}
