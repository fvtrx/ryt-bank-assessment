import { Eye, EyeOff, ShieldAlert, X } from "lucide-react-native";
import React, { FC, useEffect, useRef, useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import Button from "./Button";

interface PinModalProps {
  visible: boolean;
  onSuccess: () => void;
  onCancel: () => void;
  title?: string;
  subtitle?: string;
}

export const PinModal: FC<PinModalProps> = ({
  visible,
  onSuccess,
  onCancel,
  title = "Enter Your PIN",
  subtitle = "Please enter your 6-digit PIN to continue",
}) => {
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRefs = useRef<(TextInput | null)[]>([]);
  const maxAttempts = 3;
  // Using a hardcoded PIN for demo/testing purposes only
  const correctPin = "123456";

  useEffect(() => {
    if (visible) {
      // Reset state when modal opens
      setPin("");
      setError(null);
      setAttempts(0);
      // Focus first input after a short delay
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 300);
    }
  }, [visible]);

  const handlePinChange = (value: string, index: number) => {
    if (value.length > 1) return; // Prevent multiple characters

    const newPin = pin.split("");
    newPin[index] = value;
    const updatedPin = newPin.join("");

    setPin(updatedPin);
    setError(null);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when PIN is complete
    if (updatedPin.length === 6) {
      setTimeout(() => validatePin(updatedPin), 100);
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !pin[index] && index > 0) {
      // Focus previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const validatePin = async (pinToValidate: string) => {
    setIsLoading(true);
    setError(null);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (pinToValidate === correctPin) {
      setIsLoading(false);
      onSuccess();
      // Reset for next time
      setPin("");
      setAttempts(0);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setIsLoading(false);

      // Trigger haptic feedback on error
      if (Platform.OS !== "web") {
        Vibration.vibrate(200);
      }

      if (newAttempts >= maxAttempts) {
        setError(`Too many failed attempts. Please try again later.`);
        setTimeout(() => {
          onCancel();
          Alert.alert(
            "Access Denied",
            "Too many failed PIN attempts. Please try again later or contact support.",
            [{ text: "OK" }]
          );
        }, 2000);
      } else {
        setError(
          `Incorrect PIN. ${maxAttempts - newAttempts} attempt${
            maxAttempts - newAttempts !== 1 ? "s" : ""
          } remaining.`
        );
        // Clear PIN for retry
        setPin("");
        setTimeout(() => {
          inputRefs.current[0]?.focus();
        }, 500);
      }
    }
  };

  const handleManualSubmit = () => {
    if (pin.length === 6) {
      validatePin(pin);
    }
  };

  const renderPinInput = (index: number) => (
    <TextInput
      key={index}
      ref={(ref) => {
        inputRefs.current[index] = ref;
      }}
      style={[
        styles.pinInput,
        error && styles.pinInputError,
        pin[index] && styles.pinInputFilled,
      ]}
      value={showPin ? pin[index] || "" : pin[index] ? "•" : ""}
      onChangeText={(value) => handlePinChange(value, index)}
      onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
      keyboardType="numeric"
      maxLength={1}
      secureTextEntry={false} // We handle masking manually
      textAlign="center"
      editable={!isLoading && attempts < maxAttempts}
      selectTextOnFocus
    />
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onCancel}>
              <X size={24} color="#666666" />
            </TouchableOpacity>
          </View>

          {/* Title and Subtitle */}
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>

          {/* PIN Input */}
          <View style={styles.pinContainer}>
            {Array.from({ length: 6 }, (_, index) => renderPinInput(index))}
          </View>

          {/* Show/Hide PIN Toggle */}
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => setShowPin(!showPin)}
          >
            {showPin ? (
              <EyeOff size={20} color="#666666" />
            ) : (
              <Eye size={20} color="#666666" />
            )}
            <Text style={styles.toggleText}>
              {showPin ? "Hide PIN" : "Show PIN"}
            </Text>
          </TouchableOpacity>

          {/* Error Message */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Submit Button */}
          <View style={styles.buttonContainer}>
            <Button
              title={isLoading ? "Verifying..." : "Verify PIN"}
              onPress={handleManualSubmit}
              loading={isLoading}
              disabled={
                pin.length !== 6 || isLoading || attempts >= maxAttempts
              }
              style={styles.submitButton}
            />
          </View>

          {/* Security Notice */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginInline: 8,
            }}
          >
            <ShieldAlert
              size={24}
              color={"#999999"}
              style={{ marginRight: 8 }}
            />

            <Text style={styles.securityNotice}>
              Your PIN is encrypted and secure. Never share it with anyone.
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    minWidth: 320,
    maxWidth: 400,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
    marginBottom: 24,
  },
  closeButton: {
    padding: 8,
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
    marginBottom: 32,
    lineHeight: 24,
  },
  pinContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    gap: 12,
  },
  pinInput: {
    width: 45,
    height: 55,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    fontSize: 24,
    fontFamily: "Inter-Bold",
    color: "#333333",
    backgroundColor: "#F8F9FA",
  },
  pinInputFilled: {
    borderColor: "#1565C0",
    backgroundColor: "#E3F2FD",
  },
  pinInputError: {
    borderColor: "#D32F2F",
    backgroundColor: "#FFEBEE",
  },
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#F8F9FA",
    marginBottom: 24,
  },
  toggleText: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
    color: "#666666",
    marginLeft: 8,
  },
  errorContainer: {
    backgroundColor: "#FFEBEE",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    width: "100%",
  },
  errorText: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
    color: "#D32F2F",
    textAlign: "center",
    lineHeight: 20,
  },
  buttonContainer: {
    width: "100%",
    marginBottom: 16,
  },
  submitButton: {
    width: "100%",
  },
  securityNotice: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    color: "#999999",

    lineHeight: 18,
  },
});
