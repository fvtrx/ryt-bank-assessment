import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import useAuthStore from "@/store/authStore";
import useTransferStore from "@/store/transferStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CircleCheck as CheckCircle } from "lucide-react-native";
import React from "react";
import { ScrollView, Share, StyleSheet, Text, View } from "react-native";

export default function TransferSuccessScreen() {
  const router = useRouter();
  const { transactionId } = useLocalSearchParams<{ transactionId: string }>();
  const { recentTransactions } = useTransferStore();
  const { user } = useAuthStore();

  // Find the transaction by ID
  const transaction = recentTransactions.find((t) => t.id === transactionId);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-MY", {
      style: "currency",
      currency: "MYR",
    }).format(value);
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-MY", {
      year: "numeric",
      month: "long",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date);
  };

  const generateReferenceNumber = () => {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
    const timeStr = date.getTime().toString().slice(-6);
    return `TXN${dateStr}${timeStr}`;
  };

  const handleShareReceipt = async () => {
    if (!transaction) return;

    const receiptText = `
Ryt Bank Transfer Receipt

Reference: ${generateReferenceNumber()}
Date: ${formatDateTime(transaction.timestamp)}

FROM: ${user?.name}
Account: ${user?.accountNumber}

TO: ${transaction.recipientName}
Account: ${transaction.recipientAccountNumber}
Bank: ${transaction.bank}

Amount: ${formatCurrency(transaction.amount)}
${transaction.note ? `Note: ${transaction.note}` : ""}

Status: ${transaction.status.toUpperCase()}

Thank you for using Ryt Bank!
    `;

    try {
      await Share.share({
        message: receiptText,
        title: "Transfer Receipt",
      });
    } catch (error) {
      console.error("Error sharing receipt:", error);
    }
  };

  const handleDone = () => {
    // Navigate back to home and reset the navigation stack
    router.push("/(tabs)");
  };

  const handleNewTransfer = () => {
    router.push("/transfer");
  };

  if (!transaction) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Transaction not found</Text>
        <Button title="Go Home" onPress={handleDone} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.successIcon}>
          <CheckCircle size={64} color="#2E7D32" />
        </View>
        <Text style={styles.successTitle}>Transfer Successful!</Text>
        <Text style={styles.successSubtitle}>
          Your money has been sent successfully
        </Text>
      </View>

      <View style={styles.content}>
        <Card style={styles.receiptCard}>
          <View style={styles.receiptHeader}>
            <Text style={styles.receiptTitle}>Transaction Receipt</Text>
            <Text style={styles.referenceNumber}>
              Ref: {generateReferenceNumber()}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.receiptSection}>
            <Text style={styles.sectionTitle}>Transaction Details</Text>

            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Date & Time</Text>
              <Text style={styles.receiptValue}>
                {formatDateTime(transaction.timestamp)}
              </Text>
            </View>

            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Amount</Text>
              <Text style={styles.receiptAmount}>
                {formatCurrency(transaction.amount)}
              </Text>
            </View>

            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Status</Text>
              <View style={styles.statusContainer}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>
                  {transaction.status.charAt(0).toUpperCase() +
                    transaction.status.slice(1)}
                </Text>
              </View>
            </View>

            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Transfer Type</Text>
              <Text style={styles.receiptValue}>
                {transaction.transferType === "duitnow"
                  ? "DuitNow Transfer"
                  : "Interbank GIRO"}
              </Text>
            </View>

            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Processing Time</Text>
              <Text style={styles.receiptValue}>
                {transaction.transferType === "duitnow"
                  ? "Instant"
                  : "1-2 business days"}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.receiptSection}>
            <Text style={styles.sectionTitle}>From</Text>
            <Text style={styles.accountName}>{user?.name}</Text>
            <Text style={styles.accountNumber}>
              Account: {user?.accountNumber}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.receiptSection}>
            <Text style={styles.sectionTitle}>To</Text>
            <Text style={styles.accountName}>{transaction.recipientName}</Text>
            <Text style={styles.accountNumber}>
              Account: {transaction.recipientAccountNumber}
            </Text>
            <Text style={styles.bankName}>{transaction.bank}</Text>
          </View>

          {transaction.note && (
            <>
              <View style={styles.divider} />
              <View style={styles.receiptSection}>
                <Text style={styles.sectionTitle}>Note</Text>
                <Text style={styles.noteText}>{transaction.note}</Text>
              </View>
            </>
          )}
        </Card>

        <View style={styles.actionButtons}>
          <Button
            title="Share Receipt"
            variant="outline"
            onPress={handleShareReceipt}
            style={styles.actionButton}
          />
          <Button
            title="Save Receipt"
            variant="outline"
            onPress={() => {}} // Placeholder for save functionality
            style={styles.actionButton}
          />
        </View>

        <Card style={styles.newTransferCard}>
          <Text style={styles.newTransferTitle}>
            Need to make another transfer?
          </Text>
          <Text style={styles.newTransferSubtitle}>
            Start a new transfer to send money to someone else
          </Text>
          <Button
            title="New Transfer"
            onPress={handleNewTransfer}
            style={styles.newTransferButton}
          />
        </Card>
      </View>

      <View style={styles.footer}>
        <Button
          title="Done"
          onPress={handleDone}
          size="large"
          style={styles.doneButton}
        />
      </View>

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
    alignItems: "center",
    padding: 40,
    paddingTop: 80,
    backgroundColor: "#FFFFFF",
  },
  successIcon: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 28,
    fontFamily: "Inter-Bold",
    color: "#2E7D32",
    marginBottom: 8,
    textAlign: "center",
  },
  successSubtitle: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    color: "#666666",
    textAlign: "center",
  },
  content: {
    padding: 20,
  },
  receiptCard: {
    marginBottom: 24,
  },
  receiptHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  receiptTitle: {
    fontSize: 20,
    fontFamily: "Inter-Bold",
    color: "#333333",
    marginBottom: 8,
  },
  referenceNumber: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#666666",
    backgroundColor: "#F8F9FA",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 20,
  },
  receiptSection: {
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Inter-Bold",
    color: "#333333",
    marginBottom: 12,
  },
  receiptRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  receiptLabel: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#666666",
    flex: 1,
  },
  receiptValue: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
    color: "#333333",
    textAlign: "right",
  },
  receiptAmount: {
    fontSize: 18,
    fontFamily: "Inter-Bold",
    color: "#2E7D32",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2E7D32",
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
    color: "#2E7D32",
  },
  accountName: {
    fontSize: 16,
    fontFamily: "Inter-Bold",
    color: "#333333",
    marginBottom: 4,
  },
  accountNumber: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#666666",
    marginBottom: 2,
  },
  bankName: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
    color: "#1565C0",
  },
  noteText: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#333333",
    fontStyle: "italic",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    borderColor: "#0100E7",
  },
  newTransferCard: {
    alignItems: "center",
    marginBottom: 24,
    backgroundColor: "#F0F8FF",
    borderWidth: 1,
    borderColor: "#E3F2FD",
  },
  newTransferTitle: {
    fontSize: 18,
    fontFamily: "Inter-Bold",
    color: "#333333",
    marginBottom: 8,
    textAlign: "center",
  },
  newTransferSubtitle: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#666666",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 20,
  },
  newTransferButton: {
    minWidth: 150,
    backgroundColor: "#0100E7",
  },
  footer: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  doneButton: {
    width: "100%",
    backgroundColor: "#0100E7",
  },
  bottomSpacing: {
    height: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  errorText: {
    fontSize: 18,
    fontFamily: "Inter-Regular",
    color: "#D32F2F",
    marginBottom: 20,
  },
});
