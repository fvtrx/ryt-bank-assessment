import Card from "@/components/ui/Card";
import { CircleCheck as CheckCircle, Clock, Zap } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface TransferTypeSelectorProps {
  selectedType: "duitnow" | "interbank" | null;
  onSelect: (type: "duitnow" | "interbank") => void;
}

export const TransferTypeSelector: React.FC<TransferTypeSelectorProps> = ({
  selectedType,
  onSelect,
}) => {
  const transferTypes = [
    {
      id: "duitnow" as const,
      title: "DuitNow Transfer",
      subtitle: "Instant transfer • Real-time processing",
      description:
        "Transfer money instantly to any participating bank in Malaysia",
      icon: <Zap size={24} color="#2E7D32" />,
      processingTime: "Instant",
    },
    {
      id: "interbank" as const,
      title: "Interbank GIRO",
      subtitle: "Standard transfer • 1-2 business days",
      description: "Traditional bank transfer with standard processing time",
      icon: <Clock size={24} color="#1565C0" />,
      processingTime: "1-2 business days",
    },
  ];

  const renderTransferType = (type: (typeof transferTypes)[0]) => (
    <TouchableOpacity
      key={type.id}
      style={[
        styles.typeCard,
        selectedType === type.id && styles.selectedTypeCard,
      ]}
      onPress={() => onSelect(type.id)}
      activeOpacity={0.7}
    >
      <View style={styles.typeHeader}>
        <View style={styles.typeIconContainer}>{type.icon}</View>
        <View style={styles.typeInfo}>
          <View style={styles.typeTitleRow}>
            <Text style={styles.typeTitle}>{type.title}</Text>
          </View>
          <Text style={styles.typeSubtitle}>{type.subtitle}</Text>
        </View>
        {selectedType === type.id && (
          <View style={styles.selectedIcon}>
            <CheckCircle size={20} color="#2E7D32" />
          </View>
        )}
      </View>

      <Text style={styles.typeDescription}>{type.description}</Text>

      <View style={styles.typeDetails}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Processing Time:</Text>
          <Text style={styles.detailValue}>{type.processingTime}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <Card style={styles.container}>
      <Text style={styles.title}>Transfer Type</Text>
      <Text style={styles.subtitle}>
        Choose how you want to send your money
      </Text>

      <View style={styles.typesContainer}>
        {transferTypes.map(renderTransferType)}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: "Inter-Bold",
    color: "#333333",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#666666",
    marginBottom: 20,
  },
  typesContainer: {
    gap: 12,
  },
  typeCard: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: "#E0E0E0",
  },
  selectedTypeCard: {
    backgroundColor: "#F0F8FF",
    borderColor: "#1565C0",
  },
  typeHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  typeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  typeInfo: {
    flex: 1,
  },
  typeTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  typeTitle: {
    fontSize: 16,
    fontFamily: "Inter-Bold",
    color: "#333333",
    marginRight: 8,
  },
  recommendedBadge: {
    backgroundColor: "#E8F5E8",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#C8E6C9",
  },
  recommendedText: {
    fontSize: 10,
    fontFamily: "Inter-Bold",
    color: "#2E7D32",
    textTransform: "uppercase",
  },
  typeSubtitle: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#666666",
  },
  selectedIcon: {
    marginLeft: 8,
  },
  typeDescription: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#333333",
    lineHeight: 20,
    marginBottom: 12,
  },
  typeDetails: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  detailItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    color: "#666666",
  },
  detailValue: {
    fontSize: 12,
    fontFamily: "Inter-Bold",
    color: "#333333",
  },
  freeText: {
    color: "#2E7D32",
  },
});
