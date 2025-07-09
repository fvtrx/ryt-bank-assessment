import { BiometricResult } from "@/types";
import * as LocalAuthentication from "expo-local-authentication";
import { Platform } from "react-native";

class BiometricService {
  async isAvailable(): Promise<boolean> {
    if (Platform.OS === "web") {
      return false;
    }

    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    return compatible && enrolled;
  }

  async getSupportedTypes(): Promise<LocalAuthentication.AuthenticationType[]> {
    if (Platform.OS === "web") {
      return [];
    }

    return await LocalAuthentication.supportedAuthenticationTypesAsync();
  }

  async authenticate(
    reason: string = "Verify your identity"
  ): Promise<BiometricResult> {
    if (Platform.OS === "web") {
      // Web fallback - simulate biometric authentication
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true, biometricType: "fingerprint" });
        }, 1000);
      });
    }

    try {
      const isAvailable = await this.isAvailable();

      if (!isAvailable) {
        return {
          success: false,
          error: "Biometric authentication is not available on this device",
        };
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: reason,
        cancelLabel: "Cancel",
        fallbackLabel: "Use Passcode",
      });

      if (result.success) {
        const supportedTypes = await this.getSupportedTypes();
        let biometricType: "fingerprint" | "face" | "iris" = "fingerprint";

        if (
          supportedTypes.includes(
            LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
          )
        ) {
          biometricType = "face";
        } else if (
          supportedTypes.includes(LocalAuthentication.AuthenticationType.IRIS)
        ) {
          biometricType = "iris";
        }

        return {
          success: true,
          biometricType,
        };
      }

      return {
        success: false,
        error: result.error || "Authentication failed",
      };
    } catch (error) {
      return {
        success: false,
        error: "An error occurred during biometric authentication",
      };
    }
  }
}

export const biometricService = new BiometricService();
