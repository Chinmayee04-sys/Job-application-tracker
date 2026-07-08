import { View, ActivityIndicator } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/useTheme";

interface LoaderProps {
  fullScreen?: boolean;
  size?: "small" | "large";
}

export function Loader({ fullScreen = false, size = "large" }: LoaderProps) {
  const { isDark } = useColorScheme();
  const colors = isDark ? Colors.dark : Colors.light;

  if (fullScreen) {
    return (
      <Animated.View
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size={size} color={colors.primary} />
      </Animated.View>
    );
  }

  return (
    <View style={{ paddingVertical: 40, alignItems: "center" }}>
      <ActivityIndicator size={size} color={colors.primary} />
    </View>
  );
}
