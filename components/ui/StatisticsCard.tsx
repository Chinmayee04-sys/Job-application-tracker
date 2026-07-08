import { View, Text } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/useTheme";
import { Shadow } from "@/constants/theme";

interface StatisticsCardProps {
  title: string;
  value: number;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  index?: number;
}

export function StatisticsCard({
  title,
  value,
  icon,
  color,
  index = 0,
}: StatisticsCardProps) {
  const { isDark } = useColorScheme();
  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <Animated.View
      entering={FadeInUp.duration(400).delay(index * 100).springify()}
      style={[
        {
          flex: 1,
          backgroundColor: colors.surface,
          borderRadius: 16,
          padding: 16,
          borderWidth: 1,
          borderColor: colors.borderLight,
          gap: 10,
        },
        Shadow.md,
      ]}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          backgroundColor: color + "15",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View style={{ gap: 2 }}>
        <Text
          style={{
            fontSize: 22,
            fontWeight: "800",
            color: colors.text,
            letterSpacing: -0.5,
          }}
        >
          {value}
        </Text>
        <Text
          style={{
            fontSize: 12,
            fontWeight: "500",
            color: colors.textTertiary,
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          {title}
        </Text>
      </View>
    </Animated.View>
  );
}
