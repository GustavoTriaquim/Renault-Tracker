import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Platform } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { HapticTab } from "@/components/haptic-tab";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 8);
  const tabBarHeight = 58 + bottomPadding;
  const icon = (name: React.ComponentProps<typeof MaterialIcons>["name"]) => ({ color }: { color: string }) => <MaterialIcons name={name} size={23} color={color} />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: "#141414",
        tabBarInactiveTintColor: "#8A8A8A",
        tabBarStyle: {
          paddingTop: 8,
          paddingBottom: bottomPadding,
          height: tabBarHeight,
          backgroundColor: "#FFFFFF",
          borderTopColor: "#E6E6E6",
          borderTopWidth: 1,
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: "800", marginTop: 2 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Operação", tabBarIcon: icon("qr-code-scanner") }} />
      <Tabs.Screen name="alerts" options={{ title: "Alertas", tabBarIcon: icon("notifications-none") }} />
    </Tabs>
  );
}
