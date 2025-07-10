import { TransactionSummary } from "@/components/transfer/TransactionSummary";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { PinModal } from "@/components/ui/PinModal";
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

  const [showPinModal, setShowPinModal] = useState(false);

  const transferMutation = useMutation({
    mutationFn: async (transferData: any) => {
      setProcessing(true);
      const result = await apiService.processTransfer(transferData);
      return result;
    },
    onSuccess: (result) => {
      if (result.success && result.data) {
        const newBalance =
          (user?.balance || 0) - (currentTransfer?.amount || 0);

        // Update user balance and add transaction
        updateBalance(newBalance);
        addTransaction(result.data);
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
    setShowPinModal(true);
  };

  const handlePinSuccess = () => {
    setShowPinModal(false);
    processTransfer();
  };

  const handlePinCancel = () => {
    setShowPinModal(false);
  };

  const processTransfer = () => {
    if (currentTransfer) {
      transferMutation.mutate(currentTransfer);
    }
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
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Confirm Transfer</Text>
          <Text style={styles.subtitle}>
            Please review the details before confirming
          </Text>
        </View>

        <View style={styles.content}>
          <TransactionSummary transferData={currentTransfer} />

          <Card style={styles.securityCard}>
            <View style={styles.securityHeader}>
              <Shield size={24} color="#2E7D32" />
              <Text style={styles.securityTitle}>Security Notice</Text>
            </View>
            <Text style={styles.securityText}>
              You will be prompted to enter your PIN to complete this transfer.
            </Text>
            <Text style={styles.securitySubtext}>
              This transfer cannot be cancelled once confirmed.
            </Text>
          </Card>

          <Card style={styles.disclaimerCard}>
            <Text style={styles.disclaimerTitle}>Important Information</Text>
            <Text style={styles.disclaimerText}>
              • Ensure recipient details are correct{"\n"}• Transfer may take up
              to 2 hours to process{"\n"}• Transaction fees may apply for
              interbank transfers{"\n"}• Keep this reference for your records
            </Text>
          </Card>
        </View>

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
      </ScrollView>

      <PinModal
        visible={showPinModal}
        onSuccess={handlePinSuccess}
        onCancel={handlePinCancel}
        title="Confirm Transfer"
        subtitle="Enter your PIN to complete the transfer"
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
    borderColor: "#E0E0E0",
  },
  confirmButton: {
    flex: 2,
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
