import Card from "@/components/ui/Card";
import useAuthStore from "@/store/authStore";
import useTransferStore from "@/store/transferStore";
import { Transaction } from "@/types";
import { useRouter } from "expo-router";
import { ArrowDownLeft, ArrowUpRight, Eye, EyeOff } from "lucide-react-native";
import React, { useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { recentTransactions } = useTransferStore();
  const [accountDetailsVisible, setAccountDetailsVisible] = useState(true);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-MY", {
      style: "currency",
      currency: "MYR",
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-MY", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getTransactionIcon = (transaction: Transaction) => {
    if (transaction.type === "transfer") {
      return <ArrowUpRight size={20} color="#D32F2F" />;
    }
    return <ArrowDownLeft size={20} color="#2E7D32" />;
  };

  const getTransactionAmount = (transaction: Transaction) => {
    const amount =
      transaction.type === "transfer"
        ? -transaction.amount
        : transaction.amount;
    return formatCurrency(amount);
  };

  const getTransactionColor = (transaction: Transaction) => {
    return transaction.type === "transfer" ? "#D32F2F" : "#2E7D32";
  };

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <TouchableOpacity style={styles.transactionItem}>
      <View style={styles.transactionIcon}>{getTransactionIcon(item)}</View>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionTitle}>
          {item.type === "transfer"
            ? `To ${item.recipientName}`
            : `From ${item.recipientName}`}
        </Text>
        <Text style={styles.transactionDate}>{formatDate(item.timestamp)}</Text>
      </View>
      <Text
        style={[styles.transactionAmount, { color: getTransactionColor(item) }]}
      >
        {getTransactionAmount(item)}
      </Text>
    </TouchableOpacity>
  );

  const quickActions = [
    {
      id: "transfer",
      title: "Transfer",
      icon: <ArrowUpRight size={24} color="#1565C0" />,
      onPress: () => router.push("/transfer"),
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning,</Text>
          <Text style={styles.userName}>{user?.name}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.notificationIcon}>
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>
      </View>

      <Card style={styles.balanceCard}>
        <View style={styles.balanceHeader}>
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <TouchableOpacity
            style={styles.visibilityToggle}
            onPress={() => setAccountDetailsVisible(!accountDetailsVisible)}
          >
            {accountDetailsVisible ? (
              <EyeOff size={20} color="#ffffff" />
            ) : (
              <Eye size={20} color="#ffffff" />
            )}
          </TouchableOpacity>
        </View>
        <Text style={styles.balanceAmount}>
          {accountDetailsVisible
            ? formatCurrency(user?.balance || 0)
            : "******"}
        </Text>
        <Text style={styles.accountNumber}>
          Account: {accountDetailsVisible ? user?.accountNumber : `**********`}
        </Text>
      </Card>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsRow}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.actionButton}
              onPress={action.onPress}
            >
              <View style={styles.actionIcon}>{action.icon}</View>
              <Text style={styles.actionTitle}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Card style={styles.transactionsCard}>
        <View style={styles.transactionsHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity onPress={() => router.push("/history")}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {recentTransactions.length > 0 ? (
          <FlatList
            data={recentTransactions.slice(0, 3)}
            renderItem={renderTransaction}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => (
              <View style={styles.transactionSeparator} />
            )}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No recent transactions</Text>
          </View>
        )}
      </Card>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
  },
  greeting: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    color: "#666666",
  },
  userName: {
    fontSize: 24,
    fontFamily: "Inter-Bold",
    color: "#333333",
    marginTop: 4,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  notificationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF6B6B",
    position: "absolute",
    top: 8,
    right: 8,
  },
  balanceCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: "#1565C0",
  },
  balanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#E3F2FD",
  },
  visibilityToggle: {
    padding: 4,
  },
  balanceAmount: {
    fontSize: 32,
    fontFamily: "Inter-Bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  accountNumber: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#E3F2FD",
  },
  quickActions: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Inter-Bold",
    color: "#333333",
    marginBottom: 16,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },
  actionButton: {
    flex: 1,
    alignItems: "center",
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionTitle: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
    color: "#333333",
  },
  transactionsCard: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  transactionsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
    color: "#1565C0",
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontFamily: "Inter-Medium",
    color: "#333333",
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    color: "#666666",
  },
  transactionAmount: {
    fontSize: 16,
    fontFamily: "Inter-Bold",
  },
  transactionSeparator: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 8,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    color: "#666666",
  },
  bottomSpacing: {
    height: 100,
  },
});
