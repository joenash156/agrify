import { createContext, useContext, useState, type ReactNode } from "react";
import type { AppNotification } from "../types/notification";
import { MOCK_NOTIFICATIONS } from "../data/notificationsMockData";

interface NotificationsContextValue {
  notifications: AppNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAsUnread: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
}

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>(MOCK_NOTIFICATIONS);

  const markAsRead = (id: string) =>
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

  const markAsUnread = (id: string) =>
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: false } : n)));

  const markAllAsRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const deleteNotification = (id: string) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationsContext.Provider
      value={{ notifications, unreadCount, markAsRead, markAsUnread, markAllAsRead, deleteNotification }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useNotifications(): NotificationsContextValue {
  const context = useContext(NotificationsContext);
  if (!context) throw new Error("useNotifications must be used within a NotificationsProvider");
  return context;
}
