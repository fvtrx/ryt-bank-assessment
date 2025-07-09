import { biometricService } from "@/services/biometrics";
import { Fingerprint } from "lucide-react-native";
import React, { FC, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Button from "./Button";

interface BiometricModalProps {
  visible: boolean;
  onAuthenticate: (success: boolean) => void;
  onCancel: () => void;
  reason?: string;
}

const BiometricModal: FC<BiometricModalProps> = ({
  visible,
  onAuthenticate,
  onCancel,
  reason = "Verify your identity to proceed with the transfer",
}) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuthenticate = async () => {
    setIsAuthenticating(true);
    setError(null);

    try {
      const result = await biometricService.authenticate(reason);

      if (result.success) {
        onAuthenticate(true);
      } else {
        setError(result.error || "Authentication failed");
      }
    } catch (err) {
      setError("An error occurred during authentication");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const getBiometricIcon = () => {
    return <Fingerprint size={64} color="#1565C0" />;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.iconContainer}>{getBiometricIcon()}</View>

          <Text style={styles.title}>Biometric Authentication</Text>
          <Text style={styles.subtitle}>{reason}</Text>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <View style={styles.buttonContainer}>
            <Button
              title={isAuthenticating ? "Authenticating..." : "Authenticate"}
              onPress={handleAuthenticate}
              loading={isAuthenticating}
              style={styles.authenticateButton}
            />

            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    minWidth: 300,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: "Inter-Bold",
    color: "#333333",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    color: "#666666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  errorText: {
    fontSize: 14,
    color: "#D32F2F",
    marginBottom: 16,
    textAlign: "center",
    fontFamily: "Inter-Regular",
  },
  buttonContainer: {
    width: "100%",
  },
  authenticateButton: {
    marginBottom: 12,
  },
  cancelButton: {
    padding: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#666666",
    fontFamily: "Inter-Regular",
  },
});

export default BiometricModal;
