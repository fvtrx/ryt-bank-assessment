import { AmountInput } from "@/components/transfer/AmountInput";
import { RecipientSelector } from "@/components/transfer/RecipientSelector";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { PinModal } from "@/components/ui/PinModal";
import useAuthStore from "@/store/authStore";
import useTransferStore from "@/store/transferStore";
import { TransferRequest } from "@/types";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

interface Recipient {
  name: string;
  accountNumber: string;
  bank: string;
}

export default function TransferScreen() {
  const router = useRouter();
  const { user, hasValidatedPin, setHasValidatedPin } = useAuthStore();
  const { setTransferData, clearTransfer } = useTransferStore();

  const [showPinModal, setShowPinModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [recipient, setRecipient] = useState<Recipient | null>(null);
  const [errors, setErrors] = useState<{
    amount?: string;
    recipient?: string;
    general?: string;
  }>({});

  // Check PIN validation when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (!hasValidatedPin) {
        setShowPinModal(true);
      }
    }, [hasValidatedPin])
  );

  useEffect(() => {
    // Clear any previous transfer data when entering the screen
    clearTransfer();
  }, [clearTransfer]);

  const handlePinSuccess = () => {
    setShowPinModal(false);
    setHasValidatedPin(true);
  };

  const handlePinCancel = () => {
    setShowPinModal(false);
    router.back(); // Navigate back to previous screen (Home)
  };

  useEffect(() => {
    // Clear any previous transfer data when entering the screen
    clearTransfer();
  }, [clearTransfer]);

  const validateTransfer = (): boolean => {
    const newErrors: typeof errors = {};

    // Validate amount
    if (!amount || amount === "0") {
      newErrors.amount = "Please enter a valid amount";
    } else {
      const numAmount = parseFloat(amount);
      if (numAmount <= 0) {
        newErrors.amount = "Amount must be greater than 0";
      } else if (numAmount > (user?.balance || 0)) {
        newErrors.amount = "Insufficient funds";
      } else if (numAmount > 50000) {
        newErrors.amount = "Transfer limit exceeded (RM 50,000)";
      } else if (numAmount < 1) {
        newErrors.amount = "Minimum transfer amount is RM 1.00";
      }
    }

    // Validate recipient
    if (!recipient) {
      newErrors.recipient = "Please select a recipient";
    } else if (recipient.accountNumber === user?.accountNumber) {
      newErrors.recipient = "Cannot transfer to your own account";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (!validateTransfer() || !recipient) return;

    const transferData: TransferRequest = {
      recipientId: recipient.accountNumber,
      recipientName: recipient.name,
      recipientAccountNumber: recipient.accountNumber,
      amount: parseFloat(amount),
      note: note.trim() || undefined,
      bank: recipient.bank,
    };

    setTransferData(transferData);
    router.push("/transfer/confirm");
  };

  const handleAmountChange = (newAmount: string) => {
    setAmount(newAmount);
    // Clear amount error when user starts typing
    if (errors.amount) {
      setErrors((prev) => ({ ...prev, amount: undefined }));
    }
  };

  const handleRecipientSelect = (selectedRecipient: Recipient) => {
    setRecipient(selectedRecipient);
    // Clear recipient error when user selects
    if (errors.recipient) {
      setErrors((prev) => ({ ...prev, recipient: undefined }));
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-MY", {
      style: "currency",
      currency: "MYR",
    }).format(value);
  };

  return (
    <>
      <PinModal
        visible={showPinModal}
        onSuccess={handlePinSuccess}
        onCancel={handlePinCancel}
        title="Secure Transfer Access"
        subtitle="Enter your PIN to access transfer features"
      />

      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Transfer Money</Text>
          <Text style={styles.subtitle}>
            Perform your money transfers here.
          </Text>
        </View>

        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <RecipientSelector
              onSelect={handleRecipientSelect}
              selectedAccountNumber={recipient?.accountNumber}
            />

            {errors.recipient && (
              <Text style={styles.errorText}>{errors.recipient}</Text>
            )}

            <AmountInput
              amount={amount}
              onAmountChange={handleAmountChange}
              error={errors.amount}
            />

            <Card style={styles.noteCard}>
              <Input
                label="Note (Optional)"
                placeholder="Add a note for this transfer"
                value={note}
                onChangeText={setNote}
                multiline
                style={styles.noteInput}
              />
            </Card>

            {recipient && amount && !errors.amount && !errors.recipient && (
              <Card style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Transfer Summary</Text>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>To:</Text>
                  <Text style={styles.summaryValue}>{recipient.name}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Amount:</Text>
                  <Text style={styles.summaryAmount}>
                    {formatCurrency(parseFloat(amount))}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Bank:</Text>
                  <Text style={styles.summaryValue}>{recipient.bank}</Text>
                </View>
              </Card>
            )}

            {errors.general && (
              <Text style={styles.errorText}>{errors.general}</Text>
            )}
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <Button
            title="Continue"
            onPress={handleContinue}
            disabled={
              !recipient || !amount || !!errors.amount || !!errors.recipient
            }
            size="large"
            style={styles.continueButton}
          />
        </View>

        <View style={styles.bottomSpacing} />
      </View>
    </>
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
  content: {
    padding: 20,
  },
  noteCard: {
    marginBottom: 16,
  },
  noteInput: {
    marginBottom: 0,
  },
  summaryCard: {
    marginBottom: 16,
    backgroundColor: "#F0F8FF",
    borderWidth: 1,
    borderColor: "#E3F2FD",
  },
  summaryTitle: {
    fontSize: 16,
    fontFamily: "Inter-Bold",
    color: "#333333",
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#666666",
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
    color: "#333333",
  },
  summaryAmount: {
    fontSize: 16,
    fontFamily: "Inter-Bold",
    color: "#1565C0",
  },
  errorText: {
    fontSize: 14,
    color: "#D32F2F",
    marginBottom: 16,
    fontFamily: "Inter-Regular",
  },
  footer: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  continueButton: {
    width: "100%",
  },
  bottomSpacing: {
    height: 80,
  },
});
