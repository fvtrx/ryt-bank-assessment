import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { TransferRequest } from "@/types";
import Card from "../ui/Card";

interface TransactionSummaryProps {
  transferData: Partial<TransferRequest>;
}

export const TransactionSummary: React.FC<TransactionSummaryProps> = ({
  transferData,
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-MY", {
      style: "currency",
      currency: "MYR",
    }).format(value);
  };

  return (
    <Card style={styles.container}>
      <Text style={styles.title}>Transaction Summary</Text>

      <View style={styles.row}>
        <Text style={styles.label}>To</Text>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{transferData.recipientName}</Text>
          <Text style={styles.subValue}>
            {transferData.recipientAccountNumber} • {transferData.bank}
          </Text>
        </View>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Amount</Text>
        <Text style={styles.amount}>
          {formatCurrency(transferData.amount || 0)}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Transfer Type</Text>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>
            {transferData.transferType === "duitnow"
              ? "DuitNow Transfer"
              : "Interbank GIRO"}
          </Text>
          <Text style={styles.subValue}>
            {transferData.transferType === "duitnow"
              ? "Instant • Real-time processing"
              : "1-2 business days • Standard processing"}
          </Text>
        </View>
      </View>

      {transferData.note && (
        <View style={styles.row}>
          <Text style={styles.label}>Note</Text>
          <Text style={styles.value}>{transferData.note}</Text>
        </View>
      )}

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalAmount}>
          {formatCurrency(transferData.amount || 0)}
        </Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontFamily: "Inter-Bold",
    color: "#333333",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#666666",
    flex: 1,
  },
  valueContainer: {
    flex: 2,
    alignItems: "flex-end",
  },
  value: {
    fontSize: 16,
    fontFamily: "Inter-Medium",
    color: "#333333",
    textAlign: "right",
  },
  subValue: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#666666",
    marginTop: 2,
    textAlign: "right",
  },
  amount: {
    fontSize: 18,
    fontFamily: "Inter-Bold",
    color: "#0100E7",
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: "Inter-Bold",
    color: "#333333",
  },
  totalAmount: {
    fontSize: 20,
    fontFamily: "Inter-Bold",
    color: "#0100E7",
  },
});
