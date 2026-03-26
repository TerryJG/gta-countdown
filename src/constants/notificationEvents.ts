import dayjs from "@/utils/dayjs";
import type { ToastOptions } from "@/stores/toastStore";

export type NotificationEvent = {
  id: string;
  message: string;
  condition: () => boolean;
  duration?: number;
  options?: ToastOptions;
};

export const notificationEvents: NotificationEvent[] = [
  {
    id: "test",
    message: "Test Notification Test NotificationTest NotificationTest NotificationTest NotificationTest Notification",
    condition: () => dayjs().isBetween("2026-03-26", "2026-03-27", "day", "[]"),
    duration: 5000,
  },
];
