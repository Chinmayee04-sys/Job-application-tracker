import { View, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/useTheme";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from "react-native-reanimated";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = "Search applications...",
}: SearchBarProps) {
  const { isDark } = useColorScheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: colors.surfaceSecondary,
          borderRadius: 14,
          paddingHorizontal: 16,
          height: 48,
          gap: 10,
          borderWidth: 1.5,
          borderColor: colors.borderLight,
        },
        animatedStyle,
      ]}
    >
      <Ionicons
        name="search"
        size={18}
        color={colors.textTertiary}
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        style={{
          flex: 1,
          fontSize: 15,
          color: colors.text,
          fontFamily: "System",
        }}
        onFocus={() => (scale.value = withSpring(1.01))}
        onBlur={() => (scale.value = withSpring(1))}
      />
      {value.length > 0 && (
        <Ionicons
          name="close-circle"
          size={18}
          color={colors.textTertiary}
          onPress={() => onChangeText("")}
        />
      )}
    </Animated.View>
  );
}
