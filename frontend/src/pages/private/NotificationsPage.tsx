import { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faReceipt,
  faWheatAwn,
  faBug,
  faWrench,
  faClipboardUser,
  faCreditCard,
  faCircleInfo,
  faEnvelopeOpen,
  faEnvelope,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { useTheme } from "../../contexts/ThemeContext";
import { useNotifications } from "../../contexts/NotificationsContext";
import { PageHeader } from "../../components/common/PageHeader";
import { ListToolbar } from "../../components/common/ListToolbar";
import { EmptyState } from "../../components/common/EmptyState";
import { formatRelativeTime } from "../../utils/formatDate";
import type { NotificationCategory } from "../../types/notification";

const FILTERS = ["ALL", "UNREAD"] as const;

const CATEGORY_ICON: Record<NotificationCategory, IconDefinition> = {
  sale: faReceipt,
  harvest: faWheatAwn,
  disease: faBug,
  equipment: faWrench,
  attendance: faClipboardUser,
  payment: faCreditCard,
  system: faCircleInfo,
};

const CATEGORY_COLOR: Record<NotificationCategory, { light: string; dark: string }> = {
  sale: { light: "bg-teal-50 text-teal-600", dark: "bg-teal-500/10 text-teal-400" },
  harvest: { light: "bg-orange-50 text-orange-600", dark: "bg-orange-500/10 text-orange-400" },
  disease: { light: "bg-rose-50 text-rose-600", dark: "bg-rose-500/10 text-rose-400" },
  equipment: { light: "bg-amber-50 text-amber-600", dark: "bg-amber-500/10 text-amber-400" },
  attendance: { light: "bg-blue-50 text-blue-600", dark: "bg-blue-500/10 text-blue-400" },
  payment: { light: "bg-purple-50 text-purple-600", dark: "bg-purple-500/10 text-purple-400" },
  system: { light: "bg-zinc-100 text-zinc-600", dark: "bg-zinc-800 text-zinc-400" },
};

export default function NotificationsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { notifications, unreadCount, markAsRead, markAsUnread, markAllAsRead, deleteNotification } =
    useNotifications();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("ALL");

  const cardBg = isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200";
  const sectionTitle = isDark ? "text-zinc-100" : "text-zinc-900";
  const subText = isDark ? "text-zinc-500" : "text-zinc-500";
  const iconBtn = isDark
    ? "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
    : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900";

  const filtered = useMemo(() => {
    return notifications
      .filter((n) => {
        const matchesSearch =
          n.title.toLowerCase().includes(search.toLowerCase()) ||
          n.message.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === "ALL" || !n.read;
        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [notifications, search, filter]);

  return (
    <>
      <PageHeader
        title="Notifications"
        subtitle={
          unreadCount > 0
            ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}.`
            : "You're all caught up."
        }
        actionLabel="Mark all as read"
        showAction={unreadCount > 0}
        onAction={markAllAsRead}
      />

      <ListToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search notifications..."
        filters={FILTERS}
        activeFilter={filter}
        onFilterChange={setFilter}
        formatLabel={(f) => (f === "ALL" ? "All" : "Unread")}
      />

      <div className="space-y-2.5">
        {filtered.map((n) => {
          const iconColor = isDark ? CATEGORY_COLOR[n.category].dark : CATEGORY_COLOR[n.category].light;
          return (
            <div
              key={n.id}
              className={`flex items-start gap-3 rounded-2xl border p-4 transition-colors ${cardBg} ${
                !n.read ? (isDark ? "border-teal-500/30" : "border-teal-500/25") : ""
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconColor}`}>
                <FontAwesomeIcon icon={CATEGORY_ICON[n.category]} className="w-4 h-4" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />}
                    <p className={`text-xs font-bold truncate ${sectionTitle}`}>{n.title}</p>
                  </div>
                  <span className={`text-[11px] shrink-0 ${subText}`}>{formatRelativeTime(n.createdAt)}</span>
                </div>
                <p className={`text-xs mt-1 ${subText}`}>{n.message}</p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => (n.read ? markAsUnread(n.id) : markAsRead(n.id))}
                  title={n.read ? "Mark as unread" : "Mark as read"}
                  aria-label={n.read ? "Mark as unread" : "Mark as read"}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${iconBtn}`}
                >
                  <FontAwesomeIcon icon={n.read ? faEnvelope : faEnvelopeOpen} className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Delete this notification?")) deleteNotification(n.id);
                  }}
                  title="Delete"
                  aria-label="Delete notification"
                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                    isDark ? "text-zinc-400 hover:bg-red-950/40 hover:text-red-400" : "text-zinc-500 hover:bg-red-50 hover:text-red-600"
                  }`}
                >
                  <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className={`rounded-2xl border ${cardBg}`}>
            <EmptyState
              title={filter === "UNREAD" ? "No unread notifications" : "No notifications found"}
              subtitle={filter === "UNREAD" ? "You're all caught up." : "Try adjusting your search."}
            />
          </div>
        )}
      </div>
    </>
  );
}
