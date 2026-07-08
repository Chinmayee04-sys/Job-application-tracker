import { View, type ViewStyle } from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";
import { Shadow } from "@/constants/theme";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/useTheme";

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  index?: number;
  animate?: "up" | "down";
  noShadow?: boolean;
  onPress?: () => void;
}

export function Card({
  children,
  style,
  index = 0,
  animate = "up",
  noShadow = false,
}: CardProps) {
  const { isDark } = useColorScheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const FadeIn = animate === "up" ? FadeInUp : FadeInDown;

  return (
    <Animated.View
      entering={FadeIn.duration(400).delay(index * 80).springify().damping(15)}
      style={[
        {
          backgroundColor: colors.surface,
          borderRadius: 16,
          padding: 16,
          borderWidth: 1,
          borderColor: colors.borderLight,
        },
        !noShadow && Shadow.md,
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}
