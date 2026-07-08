import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/useTheme";

interface HeaderProps {
  title: string;
  subtitle?: string;
  leftAction?: () => void;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightAction?: () => void;
  rightIcon?: keyof typeof Ionicons.glyphMap;
}

export function Header({
  title,
  subtitle,
  leftAction,
  leftIcon,
  rightAction,
  rightIcon,
}: HeaderProps) {
  const { isDark } = useColorScheme();
  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 12,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        {leftAction && leftIcon && (
          <TouchableOpacity
            onPress={leftAction}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: colors.surfaceSecondary,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name={leftIcon} size={22} color={colors.text} />
          </TouchableOpacity>
        )}
        <View style={{ gap: 2 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "800",
              color: colors.text,
              letterSpacing: -0.5,
            }}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              style={{
                fontSize: 14,
                color: colors.textSecondary,
                fontWeight: "500",
              }}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {rightAction && rightIcon && (
        <TouchableOpacity
          onPress={rightAction}
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: colors.surfaceSecondary,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name={rightIcon} size={22} color={colors.text} />
        </TouchableOpacity>
      )}
    </View>
  );
}
