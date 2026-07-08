import { View, Text, Image } from "react-native";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/useTheme";

interface AvatarProps {
  name: string;
  size?: number;
  imageUrl?: string;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

function getColor(name: string): string {
  const colors = [
    "#6366F1",
    "#8B5CF6",
    "#EC4899",
    "#F43F5E",
    "#F97316",
    "#22C55E",
    "#3B82F6",
    "#14B8A6",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function Avatar({ name, size = 48, imageUrl }: AvatarProps) {
  const { isDark } = useColorScheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const bgColor = getColor(name);

  if (imageUrl) {
    return (
      <Image
        source={{ uri: imageUrl }}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
        }}
      />
    );
  }

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: bgColor + "20",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          fontSize: size * 0.4,
          fontWeight: "700",
          color: bgColor,
        }}
      >
        {getInitials(name)}
      </Text>
    </View>
  );
}
