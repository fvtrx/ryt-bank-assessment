import useAccountValidation from "@/hooks/transfer/useAccountValidation";
import { apiService } from "@/services/mock/api";
import useAuthStore from "@/store/authStore";
import { Contact } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Clock, Search, User } from "lucide-react-native";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Card from "../ui/Card";
import Input from "../ui/Input";

interface RecipientSelectorProps {
  onSelect: (recipient: {
    name: string;
    accountNumber: string;
    bank: string;
  }) => void;
  selectedAccountNumber?: string;
}

export const RecipientSelector: FC<RecipientSelectorProps> = ({
  onSelect,
  selectedAccountNumber,
}) => {
  const [searchMode, setSearchMode] = useState(false);
  const [accountNumber, setAccountNumber] = useState("");
  const [validationError, setValidationError] = useState<
    string | null | undefined
  >(null);
  const { hasValidatedBiometric } = useAuthStore();

  const { data: favoriteRecipients } = useQuery({
    queryKey: ["favoriteRecipients"],
    queryFn: () => apiService.getFavoriteRecipients(),
    staleTime: 10 * 60 * 1000,
  });

  const {
    data: accountValidation,
    isLoading: isValidating,
    error: accountValidationError,
  } = useAccountValidation(accountNumber);

  // Memoize validation state to avoid unnecessary re-renders
  const validationState = useMemo(() => {
    if (isValidating) return { status: "loading" };
    if (accountValidationError)
      return { status: "error", message: "Network error occurred" };
    if (!accountValidation) return { status: "idle" };
    if (accountValidation.success)
      return { status: "success", data: accountValidation.data };
    return {
      status: "error",
      message: accountValidation.error || "Account not found",
    };
  }, [accountValidation, isValidating, accountValidationError]);

  useEffect(() => {
    if (validationState.status === "error") {
      setValidationError(validationState.message);
    } else if (validationState.status === "success") {
      setValidationError(null);
    }
  }, [validationState]);

  const handleAccountNumberChange = useCallback((text: string) => {
    setAccountNumber(text);
    setValidationError(null);
  }, []);

  const handleAccountSelect = useCallback(() => {
    if (validationState.status === "success" && validationState.data) {
      onSelect({
        name: validationState.data.name,
        accountNumber: accountNumber,
        bank: validationState.data.bank,
      });
      setSearchMode(false);
    }
  }, [validationState, accountNumber, onSelect]);

  const handleContactSelect = useCallback(
    (contact: Contact) => {
      onSelect({
        name: contact.name,
        accountNumber: contact.accountNumber,
        bank: contact.bank,
      });
    },
    [onSelect]
  );

  const toggleSearchMode = useCallback(() => {
    setSearchMode((prev) => !prev);
  }, []);

  const filteredFavorites = useMemo(() => {
    return favoriteRecipients?.data?.filter((c) => c.isFrequent) || [];
  }, [favoriteRecipients?.data]);

  const renderContact = useCallback(
    ({ item }: { item: Contact & { isRecent?: boolean } }) => (
      <TouchableOpacity
        style={[
          styles.contactItem,
          selectedAccountNumber === item.accountNumber &&
            styles.selectedContact,
        ]}
        onPress={() => handleContactSelect(item)}
      >
        <View style={styles.contactIcon}>
          {item.isRecent ? (
            <Clock size={20} color="#1565C0" />
          ) : (
            <User size={20} color="#1565C0" />
          )}
        </View>
        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>{item.name}</Text>
          <Text style={styles.contactDetails}>
            {!hasValidatedBiometric
              ? `****${item.accountNumber.slice(-4)}`
              : item.accountNumber}
            • {item.bank}
          </Text>
        </View>
      </TouchableOpacity>
    ),
    [selectedAccountNumber, hasValidatedBiometric, handleContactSelect]
  );

  const keyExtractor = useCallback(
    (item: Contact) => `favorite-${item.id}`,
    []
  );

  const isSelectButtonEnabled = validationState.status === "success";

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Select Recipient</Text>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={toggleSearchMode}
        >
          <Search size={20} color="#1565C0" />
        </TouchableOpacity>
      </View>

      {searchMode && (
        <View style={styles.searchContainer}>
          <Input
            label="Account Number"
            placeholder="Enter account number"
            value={accountNumber}
            onChangeText={handleAccountNumberChange}
            keyboardType="numeric"
            error={validationError}
          />

          {/* Show loading indicator */}
          {validationState.status === "loading" && (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Searching...</Text>
            </View>
          )}

          {/* Show validation result */}
          {validationState.status === "success" && validationState.data && (
            <View style={styles.validationResult}>
              <Text style={styles.validatedName}>
                {validationState.data.name}
              </Text>
              <Text style={styles.validatedBank}>
                {validationState.data.bank}
              </Text>
              <TouchableOpacity
                style={[
                  styles.selectButton,
                  !isSelectButtonEnabled && styles.selectButtonDisabled,
                ]}
                onPress={handleAccountSelect}
                disabled={!isSelectButtonEnabled}
              >
                <Text style={styles.selectButtonText}>Select</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* Show selected account if it's not from favorites */}
      {selectedAccountNumber &&
        !filteredFavorites.some(
          (contact) => contact.accountNumber === selectedAccountNumber
        ) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Selected Recipient</Text>
            <View style={[styles.contactItem, styles.selectedContact]}>
              <View style={styles.contactIcon}>
                <User size={20} color="#1565C0" />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>
                  {accountValidation?.success
                    ? accountValidation?.data?.name
                    : "Selected Account"}
                </Text>
                <Text style={styles.contactDetails}>
                  {!hasValidatedBiometric
                    ? `****${selectedAccountNumber.slice(-4)}`
                    : selectedAccountNumber}
                  {accountValidation?.success
                    ? ` • ${accountValidation?.data?.bank}`
                    : ""}
                </Text>
              </View>
            </View>
          </View>
        )}

      {filteredFavorites.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Favorites</Text>
          <FlatList
            data={filteredFavorites}
            renderItem={renderContact}
            keyExtractor={keyExtractor}
            scrollEnabled={false}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={10}
            initialNumToRender={10}
            getItemLayout={
              (data, index) => ({
                length: 72,
                offset: 72 * index,
                index,
              }) // Assuming item height is 72
            }
          />
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: "Inter-Bold",
    color: "#333333",
  },
  searchButton: {
    padding: 8,
  },
  searchContainer: {
    marginBottom: 16,
  },
  loadingContainer: {
    backgroundColor: "transparent",
    padding: 16,
    marginTop: 8,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#0100E7",
    textAlign: "center",
  },
  validationResult: {
    backgroundColor: "#F0F8FF",
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#E3F2FD",
  },
  validatedName: {
    fontSize: 16,
    fontFamily: "Inter-Bold",
    color: "#333333",
  },
  validatedBank: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#666666",
    marginBottom: 12,
  },
  selectButton: {
    backgroundColor: "#1565C0",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  selectButtonDisabled: {
    backgroundColor: "#CCCCCC",
  },
  selectButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "Inter-Medium",
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Inter-Bold",
    color: "#333333",
    marginBottom: 12,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#F8F9FA",
    marginBottom: 8,
  },
  selectedContact: {
    backgroundColor: "#E3F2FD",
    borderWidth: 2,
    borderColor: "#1565C0",
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontFamily: "Inter-Bold",
    color: "#333333",
    marginBottom: 4,
  },
  contactDetails: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#666666",
  },
});
