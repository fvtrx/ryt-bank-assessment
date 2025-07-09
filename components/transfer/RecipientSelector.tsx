import { useQuery } from "@tanstack/react-query";
import { Clock, Search, User } from "lucide-react-native";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { apiService } from "@/services/mock/api";
import useTransferStore from "@/store/transferStore";
import { Contact } from "@/types";
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

export const RecipientSelector: React.FC<RecipientSelectorProps> = ({
  onSelect,
  selectedAccountNumber,
}) => {
  const [searchMode, setSearchMode] = useState(false);
  const [accountNumber, setAccountNumber] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const { favoriteContacts, recentTransactions } = useTransferStore();

  const { data: contacts } = useQuery({
    queryKey: ["contacts"],
    queryFn: () => apiService.getContacts(),
  });

  const { data: validation, isLoading: isValidating } = useQuery({
    queryKey: ["validateAccount", accountNumber],
    queryFn: () => apiService.validateAccountNumber(accountNumber),
    enabled: accountNumber.length >= 10,
    retry: false,
  });

  const handleAccountNumberChange = (text: string) => {
    setAccountNumber(text);
    setValidationError(null);

    if (validation && !validation.success) {
      setValidationError(validation.error || "Account not found");
    }
  };

  const handleAccountSelect = () => {
    if (validation?.success && validation.data) {
      onSelect({
        name: validation.data.name,
        accountNumber: accountNumber,
        bank: validation.data.bank,
      });
      setSearchMode(false);
    }
  };

  const handleContactSelect = (contact: Contact) => {
    onSelect({
      name: contact.name,
      accountNumber: contact.accountNumber,
      bank: contact.bank,
    });
  };

  const recentRecipients = recentTransactions.slice(0, 3).map((t) => ({
    id: t.id,
    name: t.recipientName,
    accountNumber: t.recipientAccountNumber,
    bank: t.bank,
    isRecent: true,
  }));

  const renderContact = ({
    item,
  }: {
    item: Contact & { isRecent?: boolean };
  }) => (
    <TouchableOpacity
      style={[
        styles.contactItem,
        selectedAccountNumber === item.accountNumber && styles.selectedContact,
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
          {item.accountNumber} • {item.bank}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Select Recipient</Text>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => setSearchMode(!searchMode)}
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

          {validation?.success && validation.data && (
            <View style={styles.validationResult}>
              <Text style={styles.validatedName}>{validation.data.name}</Text>
              <Text style={styles.validatedBank}>{validation.data.bank}</Text>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={handleAccountSelect}
              >
                <Text style={styles.selectButtonText}>Select</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
      {/* 
      {recentRecipients.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent</Text>
          <FlatList
            data={recentRecipients}
            renderItem={renderContact}
            keyExtractor={(item) => `recent-${item.id}`}
            scrollEnabled={false}
          />
        </View>
      )} */}

      {contacts?.data && contacts.data.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Favorites</Text>
          <FlatList
            data={contacts.data.filter((c) => c.isFrequent)}
            renderItem={renderContact}
            keyExtractor={(item) => `favorite-${item.id}`}
            scrollEnabled={false}
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
