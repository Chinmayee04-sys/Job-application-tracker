import { View, Text, TouchableOpacity } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { format, parseISO } from "date-fns";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/useTheme";
import { StatusBadge } from "./ui/StatusBadge";
import { Card } from "./ui/Card";
import { JobApplication } from "@/types";
import { Shadow } from "@/constants/theme";

interface ApplicationCardProps {
  application: JobApplication;
  index: number;
  onPress: () => void;
  onDelete: () => void;
  onFavorite: () => void;
  onEdit: () => void;
}

const DELETE_THRESHOLD = -80;

export function ApplicationCard({
  application,
  index,
  onPress,
  onDelete,
  onFavorite,
  onEdit,
}: ApplicationCardProps) {
  const { isDark } = useColorScheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const translateX = useSharedValue(0);
  const isDeleted = useSharedValue(false);

  const swipeGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationX < 0) {
        translateX.value = e.translationX;
      }
    })
    .onEnd(() => {
      if (translateX.value < DELETE_THRESHOLD) {
        translateX.value = withTiming(-200);
        isDeleted.value = true;
        runOnJS(onDelete)();
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const animatedContainer = useAnimatedStyle(() => ({
    opacity: isDeleted.value ? 0 : 1,
    height: isDeleted.value ? 0 : undefined,
    marginBottom: isDeleted.value ? 0 : 12,
    transform: [{ scale: isDeleted.value ? 0.8 : 1 }],
  }));

  const formattedDate = application.appliedDate
    ? format(parseISO(application.appliedDate), "MMM d, yyyy")
    : "";

  return (
    <Animated.View style={animatedContainer}>
      <View
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: 80,
          borderRadius: 16,
          backgroundColor: colors.error,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name="trash-outline" size={22} color="#FFF" />
      </View>
      <GestureDetector gesture={swipeGesture}>
        <Animated.View style={animatedStyle}>
          <TouchableOpacity onPress={onPress} activeOpacity={0.95}>
            <Card index={index}>
              <View style={{ gap: 12 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      backgroundColor: colors.primaryLight,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "700",
                        color: colors.primary,
                      }}
                    >
                      {application.company.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={{ flex: 1, gap: 3 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "700",
                        color: colors.text,
                      }}
                      numberOfLines={1}
                    >
                      {application.company}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: colors.textSecondary,
                      }}
                      numberOfLines={1}
                    >
                      {application.role}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={onFavorite} hitSlop={10}>
                    <Ionicons
                      name={
                        application.isFavorite ? "heart" : "heart-outline"
                      }
                      size={22}
                      color={
                        application.isFavorite
                          ? "#F43F5E"
                          : colors.textTertiary
                      }
                    />
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <StatusBadge status={application.status} />
                  {application.location && (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <Ionicons
                        name="location-outline"
                        size={12}
                        color={colors.textTertiary}
                      />
                      <Text
                        style={{
                          fontSize: 12,
                          color: colors.textTertiary,
                        }}
                        numberOfLines={1}
                      >
                        {application.location}
                      </Text>
                    </View>
                  )}
                  {application.salary && (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <Ionicons
                        name="cash-outline"
                        size={12}
                        color={colors.textTertiary}
                      />
                      <Text
                        style={{
                          fontSize: 12,
                          color: colors.textTertiary,
                        }}
                      >
                        {application.salary}
                      </Text>
                    </View>
                  )}
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      color: colors.textTertiary,
                      fontWeight: "500",
                    }}
                  >
                    Applied {formattedDate}
                  </Text>
                  <View style={{ flexDirection: "row", gap: 4 }}>
                    <TouchableOpacity
                      onPress={onEdit}
                      hitSlop={8}
                      style={{
                        padding: 6,
                        borderRadius: 8,
                        backgroundColor: colors.surfaceSecondary,
                      }}
                    >
                      <Ionicons
                        name="create-outline"
                        size={16}
                        color={colors.textSecondary}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {application.notes && (
                  <Text
                    style={{
                      fontSize: 13,
                      color: colors.textSecondary,
                      lineHeight: 18,
                    }}
                    numberOfLines={2}
                  >
                    {application.notes}
                  </Text>
                )}
              </View>
            </Card>
          </TouchableOpacity>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}
