import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import useAuthStore from "@/store/authStore";
import useTransferStore from "@/store/transferStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CircleCheck as CheckCircle } from "lucide-react-native";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

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

    const referenceNumber = generateReferenceNumber();
    const formattedDate = formatDateTime(transaction.timestamp);
    const formattedAmount = formatCurrency(transaction.amount);

    // Generate HTML content for the PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Transfer Receipt</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 15px;
            background-color: #f5f5f5;
            color: #1a1a1a;
            line-height: 1.4;
          }
          .receipt-container {
            max-width: 400px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            box-shadow: 0 2px 16px rgba(0,0,0,0.08);
            overflow: hidden;
            border: 1px solid #e8e8e8;
          }
          .header {
            background: linear-gradient(135deg, #1e3ff0 0%, #0d2db8 100%);
            color: white;
            padding: 25px 20px;
            text-align: center;
            position: relative;
          }
          .bank-logo {
            width: 180px;
            height: auto;
            margin: 0 auto 15px;
            display: block;
          }
          .receipt-title {
            font-size: 20px;
            font-weight: 500;
            margin-bottom: 8px;
          }
          .receipt-subtitle {
            font-size: 14px;
            opacity: 0.8;
            font-weight: 300;
          }
          .content {
            padding: 20px;
          }
          .status-badge {
            display: inline-flex;
            align-items: center;
            padding: 6px 12px;
            border-radius: 16px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 20px;
          }
          .status-completed {
            background-color: #e8f5e8;
            color: #2e7d32;
          }
          .status-completed::before {
            content: "✓";
            margin-right: 4px;
            font-size: 12px;
          }
          .status-pending {
            background-color: #fff3e0;
            color: #f57c00;
          }
          .status-pending::before {
            content: "⏳";
            margin-right: 4px;
            font-size: 12px;
          }
          .status-failed {
            background-color: #ffebee;
            color: #d32f2f;
          }
          .status-failed::before {
            content: "✗";
            margin-right: 4px;
            font-size: 12px;
          }
          .reference-section {
            background: #f8f9fb;
            padding: 16px;
            border-radius: 12px;
            margin-bottom: 20px;
            border-left: 3px solid #1e3ff0;
          }
          .reference-number {
            font-size: 16px;
            font-weight: 600;
            color: #1e3ff0;
            margin-bottom: 4px;
          }
          .reference-date {
            font-size: 13px;
            color: #666;
          }
          .transaction-details {
            margin-bottom: 20px;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding: 10px 0;
            border-bottom: 1px solid #f0f0f0;
          }
          .detail-row:last-child {
            border-bottom: none;
          }
          .detail-label {
            font-weight: 500;
            color: #666;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.3px;
          }
          .detail-value {
            font-weight: 500;
            color: #1a1a1a;
            text-align: right;
            max-width: 60%;
            font-size: 14px;
          }
          .amount-section {
            background: linear-gradient(135deg, #1e3ff0 0%, #0d2db8 100%);
            padding: 20px;
            border-radius: 12px;
            margin: 20px 0;
            text-align: center;
            color: white;
          }
          .amount-label {
            font-size: 13px;
            opacity: 0.8;
            margin-bottom: 6px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .amount-value {
            font-size: 28px;
            font-weight: 700;
            letter-spacing: -0.5px;
          }
          .note-section {
            background: #f8f9fb;
            padding: 14px;
            border-radius: 8px;
            margin: 15px 0;
            border-left: 3px solid #1e3ff0;
          }
          .note-label {
            font-size: 11px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
            font-weight: 500;
          }
          .note-text {
            font-size: 13px;
            color: #333;
            line-height: 1.4;
          }
          .footer {
            text-align: center;
            padding: 20px;
            background: #f8f9fb;
            color: #666;
            font-size: 11px;
          }
          .footer-logo {
            font-size: 14px;
            font-weight: 600;
            color: #1e3ff0;
            margin-bottom: 4px;
          }
          .divider {
            height: 1px;
            background: #f0f0f0;
            margin: 15px 0;
          }
          .section-divider {
            height: 8px;
            background: linear-gradient(90deg, transparent, #f0f0f0, transparent);
            margin: 20px -20px;
          }
          @media print {
            body { background-color: white; }
            .receipt-container { box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="receipt-container">
          <div class="header">
            <div class="receipt-title">Transfer Receipt</div>
          </div>
          
          <div class="content">
            <div class="status-badge status-${transaction.status}">
              ${transaction.status.toUpperCase()}
            </div>
            
            <div class="reference-section">
              <div class="reference-number">${referenceNumber}</div>
              <div class="reference-date">${formattedDate}</div>
            </div>
            
            <div class="transaction-details">
              <div class="detail-row">
                <span class="detail-label">FROM</span>
                <span class="detail-value">${user?.name || "N/A"}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Account Number</span>
                <span class="detail-value">${
                  user?.accountNumber || "N/A"
                }</span>
              </div>
              <div class="divider"></div>
              <div class="detail-row">
                <span class="detail-label">TO</span>
                <span class="detail-value">${transaction.recipientName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Account Number</span>
                <span class="detail-value">${
                  transaction.recipientAccountNumber
                }</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Bank</span>
                <span class="detail-value">${transaction.bank}</span>
              </div>
            </div>
            
            <div class="amount-section">
              <div class="amount-label">Transfer Amount</div>
              <div class="amount-value">${formattedAmount}</div>
            </div>
            
            ${
              transaction.note
                ? `
            <div class="note-section">
              <div class="note-label">Note</div>
              <div class="note-text">${transaction.note}</div>
            </div>
            `
                : ""
            }
            
            <div class="footer">
              <div class="footer-logo">RYT BANK</div>
              <div>Thank you for using our services</div>
              <div style="margin-top: 10px; font-size: 10px; color: #999;">
                This is a system generated receipt. No signature required.
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      // Generate PDF
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
        margins: {
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
        },
      });

      // Create a new filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `RytBank_Receipt_${timestamp}.pdf`;
      const newUri = `${FileSystem.documentDirectory}${filename}`;

      // Move the file to a permanent location
      await FileSystem.moveAsync({
        from: uri,
        to: newUri,
      });

      // Share the PDF
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(newUri, {
          mimeType: "application/pdf",
          dialogTitle: "Share Transfer Receipt",
          UTI: "com.adobe.pdf",
        });
      } else {
        console.log("Sharing is not available on this device");
        // Fallback: you could show an alert or save to device storage
      }
    } catch (error) {
      console.error("Error generating PDF receipt:", error);
      // You might want to show an error alert to the user
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
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: getStatusColor(transaction.status) },
                  ]}
                />
                <Text
                  style={[
                    styles.statusText,
                    { color: getStatusColor(transaction.status) },
                  ]}
                >
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
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
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
