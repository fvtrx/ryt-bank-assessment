import {
  CircleAlert as AlertCircle,
  Bell,
  CircleCheck as CheckCircle,
  CreditCard,
  Gift,
  Shield,
  X,
} from "lucide-react-native";
import React, { FC } from "react";
import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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

interface NotificationModalProps {
  visible: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
}

const { height: screenHeight } = Dimensions.get("window");

export const NotificationModal: FC<NotificationModalProps> = ({
  visible,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
}) => {
  const getNotificationIcon = (type: string, priority: string) => {
    const iconColor =
      priority === "high"
        ? "#D32F2F"
        : priority === "medium"
        ? "#FF9800"
        : "#1565C0";
    const iconSize = 20;

    switch (type) {
      case "transaction":
        return <CreditCard size={iconSize} color={iconColor} />;
      case "security":
        return <Shield size={iconSize} color={iconColor} />;
      case "promotion":
        return <Gift size={iconSize} color={iconColor} />;
      case "alert":
        return <AlertCircle size={iconSize} color={iconColor} />;
      case "system":
        return <Bell size={iconSize} color={iconColor} />;
      default:
        return <Bell size={iconSize} color={iconColor} />;
    }
  };

  const getNotificationBadgeColor = (type: string) => {
    switch (type) {
      case "transaction":
        return "#E3F2FD";
      case "security":
        return "#F1F8E9";
      case "promotion":
        return "#FFF3E0";
      case "alert":
        return "#FFEBEE";
      case "system":
        return "#F3E5F5";
      default:
        return "#F8F9FA";
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString("en-MY", { day: "2-digit", month: "short" });
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const sortedNotifications = [...notifications].sort((a, b) => {
    // Sort by read status first (unread first), then by timestamp (newest first)
    if (a.read !== b.read) return a.read ? 1 : -1;
    return b.timestamp.getTime() - a.timestamp.getTime();
  });

  const renderNotification = (notification: Notification) => (
    <TouchableOpacity
      key={notification.id}
      style={[
        styles.notificationItem,
        !notification.read && styles.unreadNotification,
      ]}
      onPress={() => onMarkAsRead(notification.id)}
      activeOpacity={0.7}
    >
      <View style={styles.notificationContent}>
        <View
          style={[
            styles.notificationIcon,
            { backgroundColor: getNotificationBadgeColor(notification.type) },
          ]}
        >
          {getNotificationIcon(notification.type, notification.priority)}
        </View>

        <View style={styles.notificationText}>
          <View style={styles.notificationHeader}>
            <Text
              style={[
                styles.notificationTitle,
                !notification.read && styles.unreadTitle,
              ]}
            >
              {notification.title}
            </Text>
            <Text style={styles.notificationTime}>
              {formatTimestamp(notification.timestamp)}
            </Text>
          </View>

          <Text style={styles.notificationMessage} numberOfLines={2}>
            {notification.message}
          </Text>

          {notification.actionLabel && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={notification.onAction}
            >
              <Text style={styles.actionButtonText}>
                {notification.actionLabel}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {!notification.read && <View style={styles.unreadDot} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Bell size={24} color="#333333" />
            <Text style={styles.headerTitle}>Notifications</Text>
            {unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color="#666666" />
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        {notifications.length > 0 && (
          <View style={styles.actionBar}>
            {unreadCount > 0 && (
              <TouchableOpacity
                style={styles.actionBarButton}
                onPress={onMarkAllAsRead}
              >
                <CheckCircle size={16} color="#1565C0" />
                <Text style={styles.actionBarButtonText}>Mark all read</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.actionBarButton}
              onPress={onClearAll}
            >
              <X size={16} color="#D32F2F" />
              <Text style={[styles.actionBarButtonText, { color: "#D32F2F" }]}>
                Clear all
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Notifications List */}
        <ScrollView
          style={styles.notificationsList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.notificationsContent}
        >
          {notifications.length > 0 ? (
            sortedNotifications.map(renderNotification)
          ) : (
            <View style={styles.emptyState}>
              <Bell size={64} color="#CCCCCC" />
              <Text style={styles.emptyStateTitle}>No Notifications</Text>
              <Text style={styles.emptyStateSubtitle}>
                You're all caught up! New notifications will appear here.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "Inter-Bold",
    color: "#333333",
    marginLeft: 12,
  },
  unreadBadge: {
    backgroundColor: "#FF6B6B",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
    minWidth: 20,
    alignItems: "center",
  },
  unreadBadgeText: {
    fontSize: 12,
    fontFamily: "Inter-Bold",
    color: "#FFFFFF",
  },
  closeButton: {
    padding: 8,
  },
  actionBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    gap: 16,
  },
  actionBarButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#F8F9FA",
  },
  actionBarButtonText: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
    color: "#1565C0",
    marginLeft: 6,
  },
  notificationsList: {
    flex: 1,
  },
  notificationsContent: {
    padding: 20,
  },
  notificationItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: "#1565C0",
  },
  notificationContent: {
    flexDirection: "row",
    padding: 16,
    alignItems: "flex-start",
    position: "relative",
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  notificationText: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontFamily: "Inter-Medium",
    color: "#333333",
    flex: 1,
    marginRight: 8,
  },
  unreadTitle: {
    fontFamily: "Inter-Bold",
  },
  notificationTime: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    color: "#999999",
  },
  notificationMessage: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#666666",
    lineHeight: 20,
    marginBottom: 8,
  },
  actionButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#E3F2FD",
    borderRadius: 8,
    marginTop: 4,
  },
  actionButtonText: {
    fontSize: 12,
    fontFamily: "Inter-Medium",
    color: "#1565C0",
  },
  unreadDot: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#1565C0",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 80,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontFamily: "Inter-Bold",
    color: "#333333",
    marginTop: 24,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    color: "#666666",
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 280,
  },
});
