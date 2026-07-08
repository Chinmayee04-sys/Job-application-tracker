import { type ReactNode } from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  type ViewStyle,
  type TextStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from "react-native-reanimated";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/useTheme";

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function Button({
  onPress,
  title,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
}: ButtonProps) {
  const scale = useSharedValue(1);
  const { isDark } = useColorScheme();
  const colors = isDark ? Colors.dark : Colors.light;

  const sizeStyles: Record<string, { px: number; py: number; fs: number }> = {
    sm: { px: 14, py: 8, fs: 13 },
    md: { px: 20, py: 14, fs: 15 },
    lg: { px: 24, py: 16, fs: 16 },
  };

  const variantStyles: Record<string, { bg: string; text: string; border?: string }> = {
    primary: { bg: colors.primary, text: "#FFFFFF" },
    secondary: {
      bg: "transparent",
      text: colors.primary,
      border: colors.primary,
    },
    ghost: { bg: "transparent", text: colors.textSecondary },
    danger: { bg: colors.error, text: "#FFFFFF" },
  };

  const s = sizeStyles[size];
  const v = variantStyles[variant];

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={() => (scale.value = withSpring(0.96))}
      onPressOut={() => (scale.value = withSpring(1))}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: s.px,
          paddingVertical: s.py,
          borderRadius: 14,
          backgroundColor: v.bg,
          borderWidth: v.border ? 1.5 : 0,
          borderColor: v.border,
          opacity: disabled ? 0.5 : 1,
          gap: 8,
        },
        animatedStyle,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "primary" ? "#FFF" : colors.primary}
        />
      ) : (
        <>
          {icon}
          <Text
            style={[
              {
                color: v.text,
                fontSize: s.fs,
                fontFamily: "System",
                fontWeight: "600",
                letterSpacing: 0.3,
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </AnimatedTouchable>
  );
}
