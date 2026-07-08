import { View, Text, TextInput, type TextInputProps } from "react-native";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/useTheme";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from "react-native-reanimated";
import { useState } from "react";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export function Input({
  label,
  error,
  leftIcon,
  style,
  ...props
}: InputProps) {
  const { isDark } = useColorScheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const [isFocused, setIsFocused] = useState(false);
  const borderScale = useSharedValue(1);

  const borderStyle = useAnimatedStyle(() => ({
    borderWidth: isFocused ? 2 : 1.5,
    borderColor: error
      ? colors.error
      : isFocused
      ? colors.primary
      : colors.border,
    transform: [{ scale: borderScale.value }],
  }));

  return (
    <View style={{ gap: 6, marginBottom: 4 }}>
      {label && (
        <Text
          style={{
            fontSize: 13,
            fontWeight: "600",
            color: colors.textSecondary,
            letterSpacing: 0.3,
            textTransform: "uppercase",
          }}
        >
          {label}
        </Text>
      )}
      <Animated.View
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.surfaceSecondary,
            borderRadius: 14,
            paddingHorizontal: 16,
            minHeight: 52,
            gap: 10,
          },
          borderStyle,
        ]}
      >
        {leftIcon && (
          <View style={{ opacity: 0.5 }}>{leftIcon}</View>
        )}
        <TextInput
          placeholderTextColor={colors.textTertiary}
          style={[
            {
              flex: 1,
              fontSize: 16,
              color: colors.text,
              paddingVertical: 14,
              fontFamily: "System",
            },
            style,
          ]}
          onFocus={() => {
            setIsFocused(true);
            borderScale.value = withSpring(1.01);
          }}
          onBlur={() => {
            setIsFocused(false);
            borderScale.value = withSpring(1);
          }}
          {...props}
        />
      </Animated.View>
      {error && (
        <Text
          style={{
            fontSize: 12,
            color: colors.error,
            fontWeight: "500",
            paddingLeft: 4,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
}
