import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHourglassHalf, faUserSlash } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../../contexts/ThemeContext";
import type { AccountStatus } from "../../services/authService";

interface AccountPendingNoticeProps {
  status: Exclude<AccountStatus, "ACTIVE">;
}

/** Inline panel shown in place of the Dashboard's stats/charts for a non-ACTIVE account.
 * The rest of the app shell (sidebar, top bar) still renders as normal — sidebar links
 * are just disabled elsewhere — so this only needs to explain the restriction. */
export function AccountPendingNotice({ status }: AccountPendingNoticeProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const isSuspended = status === "SUSPENDED";
  const cardBg = isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200";
  const sectionTitle = isDark ? "text-zinc-100" : "text-zinc-900";
  const subText = isDark ? "text-zinc-500" : "text-zinc-500";

  return (
    <div className={`w-full rounded-2xl border p-10 text-center space-y-4 ${cardBg}`}>
      <div
        className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center ${
          isSuspended
            ? isDark
              ? "bg-red-500/10 text-red-400"
              : "bg-red-50 text-red-600"
            : isDark
            ? "bg-amber-500/10 text-amber-400"
            : "bg-amber-50 text-amber-600"
        }`}
      >
        <FontAwesomeIcon icon={isSuspended ? faUserSlash : faHourglassHalf} className="w-6 h-6" />
      </div>

      <div>
        <h2 className={`text-lg font-extrabold ${sectionTitle}`}>
          {isSuspended ? "Account Suspended" : "Account Pending Activation"}
        </h2>
        <p className={`text-xs mt-2 leading-relaxed max-w-sm mx-auto ${subText}`}>
          {isSuspended
            ? "Your account access has been suspended by an administrator. Please contact your farm admin if you believe this is a mistake."
            : "Your account has been created but hasn't been activated yet. An admin needs to review and activate it before you can start working. Please check back soon."}
        </p>
      </div>
    </div>
  );
}

export default AccountPendingNotice;
