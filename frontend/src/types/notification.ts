export type NotificationCategory =
  | "sale"
  | "harvest"
  | "disease"
  | "equipment"
  | "attendance"
  | "payment"
  | "system";

export interface AppNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}
