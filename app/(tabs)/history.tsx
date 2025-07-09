import { ArrowDownLeft, ArrowUpRight, Calendar } from "lucide-react-native";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import useTransferStore from "@/store/transferStore";
import { Transaction } from "@/types";

export default function HistoryScreen() {
  const { recentTransactions } = useTransferStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "transfer" | "receive">(
    "all"
  );

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
      year: "numeric",
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-MY", {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#2E7D32";
      case "pending":
        return "#FF9800";
      case "failed":
        return "#D32F2F";
      default:
        return "#666666";
    }
  };

  const filteredTransactions = recentTransactions.filter((transaction) => {
    const matchesSearch =
      transaction.recipientName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      transaction.recipientAccountNumber.includes(searchQuery);
    const matchesFilter =
      filterType === "all" || transaction.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const groupTransactionsByDate = (transactions: Transaction[]) => {
    const groups: { [key: string]: Transaction[] } = {};

    transactions.forEach((transaction) => {
      const dateKey = formatDate(transaction.timestamp);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(transaction);
    });

    return Object.entries(groups).sort(
      ([a], [b]) => new Date(b).getTime() - new Date(a).getTime()
    );
  };

  const groupedTransactions = groupTransactionsByDate(filteredTransactions);

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <TouchableOpacity style={styles.transactionItem}>
      <View style={styles.transactionIcon}>{getTransactionIcon(item)}</View>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionTitle}>
          {item.type === "transfer"
            ? `To ${item.recipientName}`
            : `From ${item.recipientName}`}
        </Text>
        <Text style={styles.transactionDetails}>
          {item.recipientAccountNumber} • {item.bank}
        </Text>
        <Text style={styles.transactionTime}>{formatTime(item.timestamp)}</Text>
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: getStatusColor(item.status) },
            ]}
          />
          <Text
            style={[styles.statusText, { color: getStatusColor(item.status) }]}
          >
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>
      <View style={styles.amountContainer}>
        <Text
          style={[
            styles.transactionAmount,
            { color: getTransactionColor(item) },
          ]}
        >
          {getTransactionAmount(item)}
        </Text>
        {item.note && (
          <Text style={styles.transactionNote} numberOfLines={1}>
            {item.note}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderFilterButton = (type: typeof filterType, label: string) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        filterType === type && styles.filterButtonActive,
      ]}
      onPress={() => setFilterType(type)}
    >
      <Text
        style={[
          styles.filterButtonText,
          filterType === type && styles.filterButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Transaction History</Text>
        <Text style={styles.subtitle}>
          {recentTransactions.length} transaction
          {recentTransactions.length !== 1 ? "s" : ""}
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <Input
          placeholder="Search transactions..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />

        <View style={styles.filterContainer}>
          {renderFilterButton("all", "All")}
          {renderFilterButton("transfer", "Sent")}
          {renderFilterButton("receive", "Received")}
        </View>
      </View>

      <FlatList
        style={styles.transactionsList}
        data={groupedTransactions}
        keyExtractor={([date]) => date}
        showsVerticalScrollIndicator={false}
        renderItem={({ item: [date, transactions] }) => (
          <View style={styles.dateGroup}>
            <Text style={styles.dateHeader}>{date}</Text>
            <Card style={styles.transactionsCard}>
              <FlatList
                data={transactions}
                renderItem={renderTransaction}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                ItemSeparatorComponent={() => (
                  <View style={styles.transactionSeparator} />
                )}
              />
            </Card>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Calendar size={64} color="#CCCCCC" />
            <Text style={styles.emptyStateTitle}>No Transactions Found</Text>
            <Text style={styles.emptyStateSubtitle}>
              {searchQuery || filterType !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Your transaction history will appear here"}
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  title: {
    fontSize: 24,
    fontFamily: "Inter-Bold",
    color: "#333333",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    color: "#666666",
  },
  searchContainer: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  searchInput: {
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: "row",
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  filterButtonActive: {
    backgroundColor: "#1565C0",
    borderColor: "#1565C0",
  },
  filterButtonText: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
    color: "#666666",
  },
  filterButtonTextActive: {
    color: "#FFFFFF",
  },
  transactionsList: {
    flex: 1,
  },
  listContent: {
    padding: 20,
  },
  dateGroup: {
    marginBottom: 24,
  },
  dateHeader: {
    fontSize: 16,
    fontFamily: "Inter-Bold",
    color: "#333333",
    marginBottom: 8,
  },
  transactionsCard: {
    padding: 16,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
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
    marginRight: 12,
  },
  transactionTitle: {
    fontSize: 16,
    fontFamily: "Inter-Medium",
    color: "#333333",
    marginBottom: 2,
  },
  transactionDetails: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    color: "#666666",
    marginBottom: 2,
  },
  transactionTime: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    color: "#999999",
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontFamily: "Inter-Medium",
  },
  amountContainer: {
    alignItems: "flex-end",
  },
  transactionAmount: {
    fontSize: 16,
    fontFamily: "Inter-Bold",
    marginBottom: 2,
  },
  transactionNote: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    color: "#666666",
    fontStyle: "italic",
    maxWidth: 100,
    textAlign: "right",
  },
  transactionSeparator: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 8,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontFamily: "Inter-Bold",
    color: "#333333",
    marginTop: 16,
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
