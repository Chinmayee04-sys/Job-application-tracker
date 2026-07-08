import { TouchableOpacity } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/useTheme";
import { Shadow } from "@/constants/theme";

interface FABProps {
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function FAB({ onPress, icon = "add" }: FABProps) {
  const { isDark } = useColorScheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const scale = useSharedValue(1);
  const rotate = useSharedValue("0deg");

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: rotate.value }],
  }));

  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.9);
        rotate.value = withSpring("45deg");
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
        rotate.value = withSpring("0deg");
      }}
      activeOpacity={0.9}
      style={[
        {
          position: "absolute",
          bottom: 24,
          right: 20,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: colors.primary,
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100,
        },
        Shadow.lg,
        animatedStyle,
      ]}
    >
      <Ionicons name={icon} size={26} color="#FFF" />
    </AnimatedTouchable>
  );
}
