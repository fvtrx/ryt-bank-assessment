import { CreditCard as Edit, Eye, EyeOff, Shield } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Card from "@/components/ui/Card";
import { biometricService } from "@/services/biometrics";
import { useAuthStore } from "@/store/authStore";

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const [balanceVisible, setBalanceVisible] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(true);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-MY", {
      style: "currency",
      currency: "MYR",
    }).format(value);
  };

  const handleBiometricToggle = async () => {
    if (!biometricEnabled) {
      // Enabling biometric - verify first
      const result = await biometricService.authenticate(
        "Enable biometric authentication for your account"
      );
      if (result.success) {
        setBiometricEnabled(true);
        Alert.alert("Success", "Biometric authentication has been enabled");
      } else {
        Alert.alert(
          "Error",
          result.error || "Failed to enable biometric authentication"
        );
      }
    } else {
      // Disabling biometric
      Alert.alert(
        "Disable Biometric Authentication",
        "Are you sure you want to disable biometric authentication? You will need to use your PIN for future transactions.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Disable",
            style: "destructive",
            onPress: () => {
              setBiometricEnabled(false);
              Alert.alert(
                "Disabled",
                "Biometric authentication has been disabled"
              );
            },
          },
        ]
      );
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      {/* User Info Card */}
      <Card style={styles.userCard}>
        <View style={styles.userHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {user?.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            <Text style={styles.userPhone}>{user?.phone}</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Edit size={16} color="#1565C0" />
          </TouchableOpacity>
        </View>

        <View style={styles.userStats}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Account Number</Text>
            <Text style={styles.statValue}>{user?.accountNumber}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <View style={styles.balanceHeader}>
              <Text style={styles.statLabel}>Balance</Text>
              <TouchableOpacity
                onPress={() => setBalanceVisible(!balanceVisible)}
                style={styles.visibilityButton}
              >
                {balanceVisible ? (
                  <EyeOff size={16} color="#666666" />
                ) : (
                  <Eye size={16} color="#666666" />
                )}
              </TouchableOpacity>
            </View>
            <Text style={styles.balanceValue}>
              {balanceVisible ? formatCurrency(user?.balance || 0) : "••••••"}
            </Text>
          </View>
        </View>
      </Card>

      {/* Quick Security Toggle */}
      <Card style={styles.securityCard}>
        <View style={styles.securityHeader}>
          <View style={styles.securityIcon}>
            <Shield size={20} color="#2E7D32" />
          </View>
          <View style={styles.securityInfo}>
            <Text style={styles.securityTitle}>Biometric Authentication</Text>
            <Text style={styles.securitySubtitle}>
              {biometricEnabled ? "Enabled" : "Disabled"} • Touch/Face ID
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              biometricEnabled && styles.toggleButtonActive,
            ]}
            onPress={handleBiometricToggle}
          >
            <View
              style={[
                styles.toggleHandle,
                biometricEnabled && styles.toggleHandleActive,
              ]}
            />
          </TouchableOpacity>
        </View>
      </Card>

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
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  title: {
    fontSize: 24,
    fontFamily: "Inter-Bold",
    color: "#0100E7",
  },
  userCard: {
    margin: 20,
    marginBottom: 16,
  },
  userHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#1565C0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontFamily: "Inter-Bold",
    color: "#FFFFFF",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontFamily: "Inter-Bold",
    color: "#333333",
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#666666",
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#666666",
  },
  editButton: {
    padding: 8,
  },
  userStats: {
    flexDirection: "row",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 16,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    color: "#666666",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontFamily: "Inter-Bold",
    color: "#333333",
  },
  balanceHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  visibilityButton: {
    marginLeft: 4,
    padding: 2,
  },
  balanceValue: {
    fontSize: 14,
    fontFamily: "Inter-Bold",
    color: "#2E7D32",
  },
  securityCard: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  securityHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  securityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F8E9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  securityInfo: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 16,
    fontFamily: "Inter-Medium",
    color: "#333333",
    marginBottom: 2,
  },
  securitySubtitle: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#666666",
  },
  toggleButton: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#E0E0E0",
    padding: 2,
    justifyContent: "center",
  },
  toggleButtonActive: {
    backgroundColor: "#2E7D32",
  },
  toggleHandle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleHandleActive: {
    transform: [{ translateX: 20 }],
  },
  bottomSpacing: {
    height: 100,
  },
});
