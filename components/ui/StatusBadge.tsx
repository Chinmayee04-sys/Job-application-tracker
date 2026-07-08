import { View, Text } from "react-native";
import { ApplicationStatus } from "@/types";
import { useColorScheme } from "@/hooks/useTheme";
import { Colors } from "@/constants/colors";

const statusConfig: Record<
  ApplicationStatus,
  { label: string; color: string }
> = {
  wishlist: { label: "Wishlist", color: "#8B5CF6" },
  applied: { label: "Applied", color: "#3B82F6" },
  interview: { label: "Interview", color: "#F59E0B" },
  rejected: { label: "Rejected", color: "#EF4444" },
  offer: { label: "Offer", color: "#22C55E" },
};

interface StatusBadgeProps {
  status: ApplicationStatus;
  size?: "sm" | "md" | "lg";
}

export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const config = statusConfig[status];
  const { isDark } = useColorScheme();
  const colors = isDark ? Colors.dark : Colors.light;

  const sizeMap = {
    sm: { px: 10, py: 4, fs: 11 },
    md: { px: 12, py: 5, fs: 12 },
    lg: { px: 14, py: 6, fs: 13 },
  };

  const s = sizeMap[size];

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        paddingHorizontal: s.px,
        paddingVertical: s.py,
        borderRadius: 8,
        backgroundColor: config.color + "18",
        alignSelf: "flex-start",
      }}
    >
      <View
        style={{
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: config.color,
        }}
      />
      <Text
        style={{
          fontSize: s.fs,
          fontWeight: "600",
          color: config.color,
          letterSpacing: 0.3,
        }}
      >
        {config.label}
      </Text>
    </View>
  );
}
