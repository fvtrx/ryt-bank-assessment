import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import useAuthStore from "@/store/authStore";
import useTransferStore from "@/store/transferStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CircleCheck as CheckCircle } from "lucide-react-native";
import React from "react";
import { ScrollView, Share, StyleSheet, Text, View } from "react-native";

import * as Sharing from "expo-sharing";
import RNHTMLtoPDF from "react-native-html-to-pdf";

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

    try {
      const htmlContent = `
      <html>
      <body style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px; color: #333333; background-color: #f5f7fa;">
        <div style="background-color: white; border-radius: 12px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #2E7D32; font-size: 22px; margin-bottom: 8px;">RYT BANK TRANSFER RECEIPT</h1>
          <p style="color: #666666; font-size: 14px;">Ref: ${generateReferenceNumber()}</p>
        </div>
        
        <div style="border-top: 1px solid #E0E0E0; padding-top: 16px; margin-top: 16px;">
          <h2 style="font-size: 16px; color: #333333;">TRANSACTION DETAILS</h2>
          <p style="display: flex; justify-content: space-between;">
          <span>Date:</span> <span>${formatDateTime(
            transaction.timestamp
          )}</span>
          </p>
          <p style="display: flex; justify-content: space-between;">
          <span>Status:</span> <span style="color: #2E7D32; font-weight: bold;">${transaction.status.toUpperCase()}</span>
          </p>
          <p style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold;">
          <span>Amount:</span> <span style="color: #2E7D32;">${formatCurrency(
            transaction.amount
          )}</span>
          </p>
        </div>
        
        <div style="border-top: 1px solid #E0E0E0; padding-top: 16px; margin-top: 16px;">
          <h2 style="font-size: 16px; color: #333333;">FROM</h2>
          <p style="font-weight: bold;">${user?.name}</p>
          <p style="color: #666666;">Account: ${user?.accountNumber}</p>
        </div>
        
        <div style="border-top: 1px solid #E0E0E0; padding-top: 16px; margin-top: 16px;">
          <h2 style="font-size: 16px; color: #333333;">TO</h2>
          <p style="font-weight: bold;">${transaction.recipientName}</p>
          <p style="color: #666666;">Account: ${
            transaction.recipientAccountNumber
          }</p>
          <p style="color: #1565C0;">${transaction.bank}</p>
        </div>
        
        ${
          transaction.note
            ? `
        <div style="border-top: 1px solid #E0E0E0; padding-top: 16px; margin-top: 16px;">
          <h2 style="font-size: 16px; color: #333333;">NOTE</h2>
          <p style="font-style: italic;">${transaction.note}</p>
        </div>
        `
            : ""
        }
        
        <div style="border-top: 1px solid #E0E0E0; padding-top: 16px; margin-top: 16px; text-align: center;">
          <p style="color: #666666;">Thank you for banking with Ryt Bank!</p>
        </div>
        </div>
      </body>
      </html>
      `;

      // Generate the PDF
      const options = {
        html: htmlContent,
        fileName: `RytBank_Receipt_${transaction.id}`,
        directory: "Documents",
        base64: true,
      };

      const file = await RNHTMLtoPDF.convert(options);

      // Check if sharing is available
      if (await Sharing.isAvailableAsync()) {
        // Share the PDF file
        await Sharing.shareAsync(`file://${file.filePath}`);
      } else {
        // Fallback to basic Share API if Expo Sharing is not available
        await Share.share({
          title: "Transfer Receipt",
          message: "Please find attached your transfer receipt",
          url: `file://${file.filePath}`,
        });
      }
    } catch (error) {
      console.error("Error generating or sharing PDF receipt:", error);

      // Fallback to text sharing if PDF generation fails
      const plainTextReceipt = `
RYT BANK TRANSFER RECEIPT
Ref: ${generateReferenceNumber()}

TRANSACTION DETAILS
Date: ${formatDateTime(transaction.timestamp)}
Status: ${transaction.status.toUpperCase()}
Amount: ${formatCurrency(transaction.amount)}

FROM
${user?.name}
Account: ${user?.accountNumber}

TO
${transaction.recipientName}
Account: ${transaction.recipientAccountNumber}
Bank: ${transaction.bank}
${transaction.note ? `\nNOTE\n${transaction.note}` : ""}

Thank you for banking with Ryt Bank!
      `;

      await Share.share({
        message: plainTextReceipt,
        title: "Transfer Receipt",
      });
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
    <>
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
              <Text style={styles.accountName}>
                {transaction.recipientName}
              </Text>
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
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Done"
          onPress={handleDone}
          size="large"
          style={styles.doneButton}
        />
      </View>

      <View style={styles.bottomSpacing} />
    </>
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
  },
  footer: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  doneButton: {
    width: "100%",
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
