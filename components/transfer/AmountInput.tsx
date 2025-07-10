import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { Minus, Plus } from "lucide-react-native";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
  const [displayAmount, setDisplayAmount] = useState(amount);

  const formatCurrency = (value: string) => {
    // Remove non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, "");

    // Ensure only one decimal point
    const parts = numericValue.split(".");
    if (parts.length > 2) {
      return parts[0] + "." + parts.slice(1).join("");
    }

    // Limit decimal places to 2
    if (parts[1] && parts[1].length > 2) {
      return parts[0] + "." + parts[1].substring(0, 2);
    }

    return numericValue;
  };

  const handleAmountChange = (value: string) => {
    const formattedValue = formatCurrency(value);
    setDisplayAmount(formattedValue);
    onAmountChange(formattedValue);
  };

  const quickAmounts = [50, 100, 500, 1000];

  const handleQuickAmount = (quickAmount: number) => {
    const newAmount = quickAmount.toString();
    setDisplayAmount(newAmount);
    onAmountChange(newAmount);
  };

  const adjustAmount = (increment: number) => {
    const currentAmount = parseFloat(amount) || 0;
    const newAmount = Math.max(0, currentAmount + increment);
    const formattedAmount = newAmount.toString();
    setDisplayAmount(formattedAmount);
    onAmountChange(formattedAmount);
  };

  return (
    <Card style={styles.container}>
      <Text style={styles.title}>Transfer Amount</Text>

      <View style={styles.amountInputContainer}>
        <View style={styles.currencyContainer}>
          <Text style={styles.currencySymbol}>RM</Text>
        </View>

        <Input
          placeholder="0.00"
          value={displayAmount}
          onChangeText={handleAmountChange}
          keyboardType="numeric"
          style={styles.amountInput}
          error={error}
        />

        <View style={styles.adjustButtons}>
          <TouchableOpacity
            style={styles.adjustButton}
            onPress={() => adjustAmount(-10)}
          >
            <Minus size={16} color="#666666" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.adjustButton}
            onPress={() => adjustAmount(10)}
          >
            <Plus size={16} color="#666666" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.quickAmountsContainer}>
        <Text style={styles.quickAmountsTitle}>Quick Amounts</Text>
        <View style={styles.quickAmountsRow}>
          {quickAmounts.map((quickAmount) => (
            <TouchableOpacity
              key={quickAmount}
              style={[
                styles.quickAmountButton,
                amount === quickAmount.toString() &&
                  styles.quickAmountButtonActive,
              ]}
              onPress={() => handleQuickAmount(quickAmount)}
            >
              <Text
                style={[
                  styles.quickAmountText,
                  amount === quickAmount.toString() &&
                    styles.quickAmountTextActive,
                ]}
              >
                RM {quickAmount}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: "Inter-Bold",
    color: "#333333",
    marginBottom: 16,
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  currencyContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  currencySymbol: {
    fontSize: 20,
    fontFamily: "Inter-Bold",
    color: "#0100E7",
    marginLeft: 4,
  },
  amountInput: {
    flex: 1,
    marginBottom: 0,
  },
  adjustButtons: {
    flexDirection: "column",
    marginLeft: 12,
    gap: 8,
  },
  adjustButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  quickAmountsContainer: {
    marginTop: 8,
  },
  quickAmountsTitle: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
    color: "#666666",
    marginBottom: 12,
  },
  quickAmountsRow: {
    flexDirection: "row",
    gap: 8,
  },
  quickAmountButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    alignItems: "center",
  },
  quickAmountButtonActive: {
    backgroundColor: "#E3F2FD",
    borderColor: "#1565C0",
  },
  quickAmountText: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
    color: "#666666",
  },
  quickAmountTextActive: {
    color: "#1565C0",
    fontFamily: "Inter-Bold",
  },
});
