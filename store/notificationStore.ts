import { create } from "zustand";

interface Notification {
  id: string;
  type: "transaction" | "security" | "promotion" | "system" | "alert";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: "high" | "medium" | "low";
  actionLabel?: string;
  onAction?: () => void;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (
    notification: Omit<Notification, "id" | "timestamp" | "read">
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  removeNotification: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [
    {
      id: "1",
      type: "transaction",
      title: "Transfer Completed",
      message:
        "Your transfer of RM 250.00 to Sarah Lee has been completed successfully.",
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      read: false,
      priority: "medium",
      actionLabel: "View Receipt",
      onAction: () => console.log("View receipt"),
    },
    {
      id: "2",
      type: "security",
      title: "Login from New Device",
      message:
        "We detected a login from a new device. If this wasn't you, please secure your account immediately.",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      read: false,
      priority: "high",
      actionLabel: "Review Activity",
      onAction: () => console.log("Review activity"),
    },
    {
      id: "3",
      type: "promotion",
      title: "Special Offer: 0% Transfer Fees",
      message:
        "Enjoy zero transfer fees for the next 7 days! Transfer money to friends and family without any charges.",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      read: true,
      priority: "low",
      actionLabel: "Learn More",
      onAction: () => console.log("Learn more"),
    },
    {
      id: "4",
      type: "system",
      title: "Scheduled Maintenance",
      message:
        "Our services will be temporarily unavailable on Sunday, 2:00 AM - 4:00 AM for system maintenance.",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      read: true,
      priority: "medium",
    },
    {
      id: "5",
      type: "alert",
      title: "Low Balance Alert",
      message:
        "Your account balance is below RM 100.00. Consider topping up to avoid any transaction failures.",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      read: false,
      priority: "medium",
      actionLabel: "Top Up",
      onAction: () => console.log("Top up"),
    },
    {
      id: "6",
      type: "transaction",
      title: "Payment Received",
      message: "You received RM 500.00 from Ali Hassan for rent payment.",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      read: true,
      priority: "medium",
    },
  ],
  unreadCount: 3,

  addNotification: (notificationData) => {
    const notification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };

    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  markAsRead: (id) => {
    set((state) => {
      const notifications = state.notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      );

      const unreadCount = notifications.filter((n) => !n.read).length;

      return { notifications, unreadCount };
    });
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((notification) => ({
        ...notification,
        read: true,
      })),
      unreadCount: 0,
    }));
  },

  clearAll: () => {
    set({ notifications: [], unreadCount: 0 });
  },

  removeNotification: (id) => {
    set((state) => {
      const notifications = state.notifications.filter((n) => n.id !== id);
      const unreadCount = notifications.filter((n) => !n.read).length;
      return { notifications, unreadCount };
    });
  },
}));
