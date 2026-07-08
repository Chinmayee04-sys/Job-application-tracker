import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Switch } from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { useApplications } from "@/hooks/useApplications";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { applications, statistics } = useApplications();
  const { isDark, toggle } = useColorScheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const [showLogout, setShowLogout] = useState(false);
  const [showClear, setShowClear] = useState(false);
  const menuItems = [
    {
      icon: "moon-outline" as const,
      label: "Dark Mode",
      right: (
<Switch
          value={isDark}
          onValueChange={toggle}
          trackColor={{ false: colors.surfaceTertiary, true: colors.primary + "60" }}
          thumbColor={isDark ? colors.primary : colors.textTertiary}
        />
      ),
    },
    {
      icon: "download-outline" as const,
      label: "Export Data",
      onPress: () => {},
    },
    {
      icon: "trash-outline" as const,
      label: "Clear All Data",
      labelColor: colors.error,
      onPress: () => setShowClear(true),
    },
  ];
  const handleLogout = () => {
    logout();
    router.replace("/(auth)/login");
  };
  return (
<View style={{ flex: 1, backgroundColor: colors.background }}>
<ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
<Animated.View entering={FadeInUp.duration(400)}>
<View
            style={{
              alignItems: "center",
              paddingVertical: 40,
              paddingHorizontal: 20,
              gap: 12,
            }}
          >
<Avatar name={user?.name || "User"} size={80} />
<View style={{ alignItems: "center", gap: 4 }}>
<Text
                style={{
                  fontSize: 24,
                  fontWeight: "800",
                  color: colors.text,
                  letterSpacing: -0.5,
                }}
              >
                {user?.name || "User"}
</Text>
<Text
                style={{
                  fontSize: 15,
                  color: colors.textSecondary,
                }}
              >
                {user?.email || "user@example.com"}
</Text>
</View>
<View
              style={{
                flexDirection: "row",
                gap: 8,
                marginTop: 8,
              }}
            >
<View
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 12,
                  backgroundColor: colors.surfaceSecondary,
                  alignItems: "center",
                }}
              >
<Text
                  style={{
                    fontSize: 20,
                    fontWeight: "800",
                    color: colors.primary,
                  }}
                >
                  {statistics.total}
</Text>
<Text
                  style={{
                    fontSize: 12,
                    color: colors.textTertiary,
                    fontWeight: "500",
                  }}
                >
                  Applications
</Text>
</View>
<View
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 12,
                  backgroundColor: colors.surfaceSecondary,
                  alignItems: "center",
                }}
              >
<Text
                  style={{
                    fontSize: 20,
                    fontWeight: "800",
                    color: "#22C55E",
                  }}
                >
                  {statistics.offer}
</Text>
<Text
                  style={{
                    fontSize: 12,
                    color: colors.textTertiary,
                    fontWeight: "500",
                  }}
                >
                  Offers
</Text>
</View>
<View
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 12,
                  backgroundColor: colors.surfaceSecondary,
                  alignItems: "center",
                }}
              >
<Text
                  style={{
                    fontSize: 20,
                    fontWeight: "800",
                    color: "#F59E0B",
                  }}
                >
                  {statistics.interview}
</Text>
<Text
                  style={{
                    fontSize: 12,
                    color: colors.textTertiary,
                    fontWeight: "500",
                  }}
                >
                  Interviews
</Text>
</View>
</View>
</View>
</Animated.View>
<View style={{ paddingHorizontal: 20, gap: 10 }}>
          {menuItems.map((item, i) => (
<Animated.View
              key={item.label}
              entering={FadeInUp.duration(300).delay(i * 80 + 200)}
            >
<TouchableOpacity
                onPress={(item as any).onPress}
                activeOpacity={0.7}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 16,
                  borderRadius: 14,
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.borderLight,
                }}
              >
<View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
<Ionicons
                    name={item.icon}
                    size={20}
                    color={(item as any).labelColor || colors.textSecondary}
                  />
<Text
                    style={{
                      fontSize: 15,
                      fontWeight: "600",
                      color: (item as any).labelColor || colors.text,
                    }}
                  >
                    {item.label}
</Text>
</View>
                {item.right || (
<Ionicons
                    name="chevron-forward"
                    size={18}
                    color={colors.textTertiary}
                  />
                )}
</TouchableOpacity>
</Animated.View>
          ))}
</View>
<View style={{ paddingHorizontal: 20, marginTop: 32 }}>
<Button
            title="Logout"
            onPress={() => setShowLogout(true)}
            variant="danger"
            size="lg"
          />
</View>
<Text
          style={{
            textAlign: "center",
            marginTop: 24,
            fontSize: 12,
            color: colors.textTertiary,
            fontWeight: "500",
          }}
        >
          JobTrack v1.0.0
</Text>
</ScrollView>
<ConfirmationDialog
        visible={showLogout}
        title="Logout"
        message="Are you sure you want to logout? Your data will be saved."
        confirmLabel="Logout"
        variant="danger"
        onConfirm={handleLogout}
        onCancel={() => setShowLogout(false)}
      />
<ConfirmationDialog
        visible={showClear}
        title="Clear All Data"
        message="This will permanently delete all your job applications. This action cannot be undone."
        confirmLabel="Delete All"
        variant="danger"
        onConfirm={() => {
          setShowClear(false);
        }}
        onCancel={() => setShowClear(false)}
      />
</View>
  );
}
