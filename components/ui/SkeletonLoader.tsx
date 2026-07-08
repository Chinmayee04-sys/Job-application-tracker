import { View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/useTheme";

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export function Skeleton({
  width = "100%",
  height = 20,
  borderRadius = 8,
  style,
}: SkeletonProps) {
  const { isDark } = useColorScheme();
  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: colors.surfaceTertiary,
          opacity: 0.5,
        },
        style,
      ]}
    />
  );
}

export function SkeletonLoader({ count = 3 }: { count?: number }) {
  return (
    <View style={{ gap: 12, padding: 20 }}>
      {Array.from({ length: count }).map((_, i) => (
        <Animated.View
          key={i}
          entering={FadeInUp.duration(300).delay(i * 80)}
          style={{
            backgroundColor: "transparent",
            borderRadius: 16,
            padding: 16,
            gap: 10,
          }}
        >
          <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
            <Skeleton width={44} height={44} borderRadius={12} />
            <View style={{ gap: 6, flex: 1 }}>
              <Skeleton width="60%" height={16} />
              <Skeleton width="40%" height={12} />
            </View>
          </View>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Skeleton width={70} height={24} borderRadius={8} />
            <Skeleton width={50} height={24} borderRadius={8} />
          </View>
        </Animated.View>
      ))}
    </View>
  );
}
