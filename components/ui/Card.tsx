import { FC, ReactNode } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

interface CardProps {
  children: ReactNode;
  padding?: boolean;
  style?: ViewStyle;
}

const Card: FC<CardProps> = ({ children, padding = true, style }) => {
  return (
    <View style={[styles.card, padding && styles.cardPadding, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardPadding: {
    padding: 20,
  },
});

export default Card;
