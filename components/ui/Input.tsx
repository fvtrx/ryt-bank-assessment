import React, { FC } from "react";
import { StyleSheet, Text, TextInput, View, ViewStyle } from "react-native";

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string | null;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  secureTextEntry?: boolean;
  multiline?: boolean;
  style?: ViewStyle;
}

const Input: FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  keyboardType = "default",
  secureTextEntry = false,
  multiline = false,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          multiline && styles.multilineInput,
        ]}
        placeholder={placeholder}
        placeholderTextColor="#999999"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
    color: "#333333",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: "Inter-Regular",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  inputError: {
    borderColor: "#D32F2F",
  },
  multilineInput: {
    height: 80,
    textAlignVertical: "top",
  },
  errorText: {
    fontSize: 12,
    color: "#D32F2F",
    marginTop: 4,
    fontFamily: "Inter-Regular",
  },
});

export default Input;
