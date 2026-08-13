import { httpClient } from "./httpClient";
import type { AppNotification, NotificationCategory } from "../types/notification";

interface NotificationResponse {
  notificationId: string;
  userId: string;
  category: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

function toAppNotification(dto: NotificationResponse): AppNotification {
  return {
    id: dto.notificationId,
    category: dto.category.toLowerCase() as NotificationCategory,
    title: dto.title,
    message: dto.message,
    createdAt: dto.createdAt,
    read: dto.isRead,
  };
}

export const notificationService = {
  findMine: async (): Promise<AppNotification[]> => {
    const { data } = await httpClient.get<NotificationResponse[]>("/notification");
    return data.map(toAppNotification);
  },
  markAsRead: async (id: string): Promise<void> => {
    await httpClient.patch(`/notification/${id}/read`);
  },
  markAsUnread: async (id: string): Promise<void> => {
    await httpClient.patch(`/notification/${id}/unread`);
  },
  markAllAsRead: async (): Promise<void> => {
    await httpClient.patch("/notification/read-all");
  },
  remove: async (id: string): Promise<void> => {
    await httpClient.delete(`/notification/${id}`);
  },
};
