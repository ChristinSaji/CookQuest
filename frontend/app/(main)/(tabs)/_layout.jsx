import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#D1D5DB",
        tabBarStyle: {
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          height: 65,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginBottom: 5,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="recipes"
        options={{
          title: "Recipes",
          tabBarIcon: ({ color }) => (
            <Ionicons name="restaurant-outline" color={color} size={22} />
          ),
        }}
      />
      <Tabs.Screen
        name="social"
        options={{
          title: "Social",
          tabBarIcon: ({ color }) => (
            <Ionicons name="people-outline" color={color} size={22} />
          ),
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: "Leaderboard",
          tabBarIcon: ({ color }) => (
            <Ionicons name="trophy-outline" color={color} size={22} />
          ),
        }}
      />
    </Tabs>
  );
}
