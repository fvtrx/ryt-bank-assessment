import { Tabs } from "expo-router";
import { ArrowUpRight, Clock, Home, User } from "lucide-react-native";
import { Platform } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#0100E7",
        tabBarInactiveTintColor: "#666666",

        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
            backgroundColor: "#FFFFFF",
            borderTopWidth: 0,
          },
          default: {
            backgroundColor: "#FFFFFF",
            borderTopWidth: 0,
            borderTopColor: "#E0E0E0",
            height: 88,
            paddingBottom: 20,
            paddingTop: 8,
          },
        }),
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: "Inter-Medium",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ size, color }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="transfer"
        options={{
          title: "Transfer",
          tabBarIcon: ({ size, color }) => (
            <ArrowUpRight size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ size, color }) => <Clock size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ size, color }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
