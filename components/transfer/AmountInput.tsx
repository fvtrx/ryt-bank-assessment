import React from "react";
import { StyleSheet, Text, View } from "react-native";

import useAuthStore from "@/store/authStore";
import Card from "../ui/Card";
import Input from "../ui/Input";

interface AmountInputProps {
  amount: string;
  onAmountChange: (amount: string) => void;
  error?: string;
}

export const AmountInput: React.FC<AmountInputProps> = ({
  amount,
  onAmountChange,
  error,
}) => {
  const { user } = useAuthStore();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-MY", {
      style: "currency",
      currency: "MYR",
    }).format(value);
  };

  const handleAmountChange = (text: string) => {
    // Remove any non-numeric characters except decimal point
    const cleanText = text.replace(/[^0-9.]/g, "");

    // Ensure only one decimal point
    const parts = cleanText.split(".");
    if (parts.length > 2) {
      return;
    }

    // Limit decimal places to 2
    if (parts[1] && parts[1].length > 2) {
      return;
    }

    onAmountChange(cleanText);
  };

  return (
    <Card style={styles.container}>
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balanceAmount}>
          {formatCurrency(user?.balance || 0)}
        </Text>
      </View>

      <View style={styles.divider} />

      <Input
        label="Transfer Amount"
        placeholder="0.00"
        value={amount}
        onChangeText={handleAmountChange}
        keyboardType="numeric"
        error={error}
        style={styles.amountInput}
      />

      {amount && !error && (
        <Text style={styles.amountPreview}>
          {formatCurrency(parseFloat(amount) || 0)}
        </Text>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  balanceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#666666",
  },
  balanceAmount: {
    fontSize: 18,
    fontFamily: "Inter-Bold",
    color: "#2E7D32",
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginBottom: 16,
  },
  amountInput: {
    marginBottom: 8,
  },
  amountPreview: {
    fontSize: 24,
    fontFamily: "Inter-Bold",
    color: "#1565C0",
    textAlign: "center",
    marginTop: 8,
  },
});
