import { TransactionSummary } from "@/components/transfer/TransactionSummary";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";

import BiometricModal from "@/components/ui/BiometricModal";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { biometricService } from "@/services/biometrics";
import { apiService } from "@/services/mock/api";
import useAuthStore from "@/store/authStore";
import useTransferStore from "@/store/transferStore";
import { TriangleAlert as AlertTriangle, Shield } from "lucide-react-native";

export default function TransferConfirmScreen() {
  const router = useRouter();
  const { user, updateBalance } = useAuthStore();
  const {
    currentTransfer,
    addTransaction,
    clearTransfer,
    setProcessing,
    isProcessing,
  } = useTransferStore();

  const [showBiometric, setShowBiometric] = useState(false);
  const [biometricError, setBiometricError] = useState<string | null>(null);

  // Check if biometric authentication is available
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  const checkBiometricAvailability = async () => {
    const available = await biometricService.isAvailable();
    setBiometricAvailable(available);
  };

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const transferMutation = useMutation({
    mutationFn: async (transferData: any) => {
      setProcessing(true);
      const result = await apiService.processTransfer(transferData);
      return result;
    },
    onSuccess: (result) => {
      if (result.success && result.data) {
        // Update user balance
        const newBalance =
          (user?.balance || 0) - (currentTransfer?.amount || 0);
        updateBalance(newBalance);

        // Add transaction to history
        addTransaction(result.data);

        // Clear current transfer
        clearTransfer();

        // Navigate to success screen
        router.push({
          pathname: "/transfer/success",
          params: { transactionId: result.data.id },
        });
      } else {
        Alert.alert(
          "Transfer Failed",
          result.error || "Unknown error occurred"
        );
      }
    },
    onError: () => {
      Alert.alert(
        "Transfer Failed",
        "Network error occurred. Please try again."
      );
    },
    onSettled: () => {
      setProcessing(false);
    },
  });

  const handleConfirmTransfer = async () => {
    if (!currentTransfer) {
      Alert.alert("Error", "Transfer data not found");
      return;
    }

    if (biometricAvailable) {
      setShowBiometric(true);
      setBiometricError(null);
    } else {
      // Fallback: Show confirmation dialog
      Alert.alert(
        "Confirm Transfer",
        `Are you sure you want to transfer ${formatCurrency(
          Number(currentTransfer.amount)
        )} to ${currentTransfer.recipientName}?`,
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Confirm",
            style: "default",
            onPress: () => processTransfer(),
          },
        ]
      );
    }
  };

  const handleBiometricResult = (success: boolean) => {
    if (success) {
      setShowBiometric(false);
      processTransfer();
    } else {
      setBiometricError("Authentication failed. Please try again.");
    }
  };

  const processTransfer = () => {
    if (currentTransfer) {
      transferMutation.mutate(currentTransfer);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-MY", {
      style: "currency",
      currency: "MYR",
    }).format(value);
  };

  if (!currentTransfer) {
    return (
      <View style={styles.errorContainer}>
        <AlertTriangle size={64} color="#D32F2F" />
        <Text style={styles.errorTitle}>Transfer Data Not Found</Text>
        <Text style={styles.errorSubtitle}>
          Please go back and start the transfer process again.
        </Text>
        <Button
          title="Back to Transfer"
          onPress={() => router.push("/transfer")}
          style={styles.errorButton}
        />
      </View>
    );
  }

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>Confirm Transfer</Text>
        <Text style={styles.subtitle}>
          Please review the details before confirming
        </Text>
      </View>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <TransactionSummary transferData={currentTransfer} />

          <Card style={styles.securityCard}>
            <View style={styles.securityHeader}>
              <Shield size={24} color="#2E7D32" />
              <Text style={styles.securityTitle}>Security Notice</Text>
            </View>
            <Text style={styles.securityText}>
              {biometricAvailable
                ? "You will be prompted to verify your identity using biometric authentication."
                : "You will need to confirm this transfer manually."}
            </Text>
            <Text style={styles.securitySubtext}>
              This transfer cannot be cancelled once confirmed.
            </Text>
          </Card>

          {biometricError && (
            <View style={styles.errorCard}>
              <Text style={styles.errorText}>{biometricError}</Text>
            </View>
          )}

          <Card style={styles.disclaimerCard}>
            <Text style={styles.disclaimerTitle}>Important Information</Text>
            <Text style={styles.disclaimerText}>
              • Ensure recipient details are correct{"\n"}• Transfer may take up
              to 2 hours to process{"\n"}• Transaction fees may apply for
              interbank transfers{"\n"}• Keep this reference for your records
            </Text>
          </Card>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.buttonContainer}>
          <Button
            title="Cancel"
            variant="outline"
            onPress={() => router.back()}
            style={styles.cancelButton}
            disabled={isProcessing}
          />
          <Button
            title="Confirm Transfer"
            onPress={handleConfirmTransfer}
            loading={isProcessing}
            style={styles.confirmButton}
            disabled={isProcessing}
          />
        </View>
      </View>

      <View style={styles.bottomSpacing} />

      <BiometricModal
        visible={showBiometric}
        onAuthenticate={handleBiometricResult}
        onCancel={() => setShowBiometric(false)}
        reason="Verify your identity to complete the transfer"
      />
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
  securityCard: {
    marginBottom: 16,
    backgroundColor: "#F1F8E9",
    borderWidth: 1,
    borderColor: "#C8E6C9",
  },
  securityHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  securityTitle: {
    fontSize: 16,
    fontFamily: "Inter-Bold",
    color: "#2E7D32",
    marginLeft: 8,
  },
  securityText: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#333333",
    lineHeight: 20,
    marginBottom: 8,
  },
  securitySubtext: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    color: "#666666",
    fontStyle: "italic",
  },
  errorCard: {
    backgroundColor: "#FFEBEE",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#FFCDD2",
  },
  errorText: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#D32F2F",
    textAlign: "center",
  },
  disclaimerCard: {
    backgroundColor: "#FFF3E0",
    borderWidth: 1,
    borderColor: "#FFE0B2",
  },
  disclaimerTitle: {
    fontSize: 16,
    fontFamily: "Inter-Bold",
    color: "#E65100",
    marginBottom: 12,
  },
  disclaimerText: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#333333",
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
  confirmButton: {
    flex: 2,
  },
  bottomSpacing: {
    height: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    backgroundColor: "#F5F7FA",
  },
  errorTitle: {
    fontSize: 24,
    fontFamily: "Inter-Bold",
    color: "#333333",
    marginTop: 24,
    marginBottom: 8,
    textAlign: "center",
  },
  errorSubtitle: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    color: "#666666",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  errorButton: {
    minWidth: 200,
  },
});
