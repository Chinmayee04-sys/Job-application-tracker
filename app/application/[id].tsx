import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { format, parseISO } from "date-fns";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/useTheme";
import { useApplications } from "@/hooks/useApplications";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { Loader } from "@/components/ui/Loader";
import { JobApplication } from "@/types";
export default function ApplicationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { applications, remove, update } = useApplications();
  const { isDark } = useColorScheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const [showDelete, setShowDelete] = useState(false);
  const application = applications.find((a) => a.id === id);
  if (!application) {
    return (
<View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
<Text style={{ fontSize: 16, color: colors.textSecondary }}>
          Application not found
</Text>
</View>
    );
  }
  const handleDelete = async () => {
    await remove(id);
    router.back();
  };
  const handleShare = () => {
    // Share functionality placeholder
  };
  const infoRows = [
    { icon: "location-outline" as const, label: "Location", value: application.location },
    { icon: "cash-outline" as const, label: "Salary", value: application.salary },
    {
      icon: "calendar-outline" as const,
      label: "Applied",
      value: application.appliedDate
        ? format(parseISO(application.appliedDate), "MMM d, yyyy")
        : "",
    },
    {
      icon: "time-outline" as const,
      label: "Last Updated",
      value: format(parseISO(application.updatedAt), "MMM d, yyyy"),
    },
  ].filter((r) => r.value);
  return (
<View style={{ flex: 1, backgroundColor: colors.background }}>
<Animated.View
        entering={FadeInUp.duration(300)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          paddingVertical: 12,
        }}
      >
<TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: colors.surfaceSecondary,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
<Ionicons name="chevron-back" size={22} color={colors.text} />
</TouchableOpacity>
<View style={{ flexDirection: "row", gap: 8 }}>
<TouchableOpacity
            onPress={handleShare}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: colors.surfaceSecondary,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
<Ionicons name="share-outline" size={20} color={colors.text} />
</TouchableOpacity>
<TouchableOpacity
            onPress={() => router.push(`/application/add`)}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: colors.surfaceSecondary,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
<Ionicons name="create-outline" size={20} color={colors.text} />
</TouchableOpacity>
<TouchableOpacity
            onPress={() => setShowDelete(true)}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: colors.error + "15",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
<Ionicons name="trash-outline" size={20} color={colors.error} />
</TouchableOpacity>
</View>
</Animated.View>
<ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 40, gap: 20 }}
      >
<Animated.View
          entering={FadeInUp.duration(400).delay(100)}
          style={{ gap: 12 }}
        >
<View
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              backgroundColor: colors.primaryLight,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
<Text
              style={{
                fontSize: 28,
                fontWeight: "800",
                color: colors.primary,
              }}
            >
              {application.company.charAt(0).toUpperCase()}
</Text>
</View>
<View style={{ gap: 4 }}>
<Text
              style={{
                fontSize: 28,
                fontWeight: "800",
                color: colors.text,
                letterSpacing: -0.5,
              }}
            >
              {application.company}
</Text>
<Text
              style={{
                fontSize: 18,
                color: colors.textSecondary,
                fontWeight: "500",
              }}
            >
              {application.role}
</Text>
</View>
<StatusBadge status={application.status} size="md" />
</Animated.View>
<Animated.View
          entering={FadeInUp.duration(400).delay(200)}
          style={{ gap: 10 }}
        >
          {infoRows.map(
            (row) =>
              row.value && (
<View
                  key={row.label}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
<View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      backgroundColor: colors.surfaceSecondary,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
<Ionicons
                      name={row.icon}
                      size={18}
                      color={colors.textSecondary}
                    />
</View>
<View style={{ gap: 1 }}>
<Text
                      style={{
                        fontSize: 12,
                        color: colors.textTertiary,
                        fontWeight: "500",
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                      }}
                    >
                      {row.label}
</Text>
<Text
                      style={{
                        fontSize: 15,
                        color: colors.text,
                        fontWeight: "600",
                      }}
                    >
                      {row.value}
</Text>
</View>
</View>
              )
          )}
</Animated.View>
        {application.jobUrl && (
<Animated.View entering={FadeInUp.duration(400).delay(250)}>
<Button
              title="Open Job Posting"
              variant="secondary"
              onPress={() => Linking.openURL(application.jobUrl)}
              icon={<Ionicons name="open-outline" size={18} color={colors.primary} />}
            />
</Animated.View>
        )}
        {application.interviewDate && (
<Animated.View entering={FadeInUp.duration(400).delay(300)}>
<Card>
<View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
<View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    backgroundColor: "#F59E0B15",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
<Ionicons name="calendar" size={22} color="#F59E0B" />
</View>
<View style={{ gap: 2 }}>
<Text
                    style={{
                      fontSize: 13,
                      color: "#F59E0B",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    Interview
</Text>
<Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: colors.text,
                    }}
                  >
                    {format(parseISO(application.interviewDate), "MMMM d, yyyy 'at' h:mm a")}
</Text>
</View>
</View>
</Card>
</Animated.View>
        )}
        {application.notes && (
<Animated.View entering={FadeInUp.duration(400).delay(350)}>
<Text
              style={{
                fontSize: 13,
                fontWeight: "600",
                color: colors.textSecondary,
                textTransform: "uppercase",
                letterSpacing: 0.5,
                marginBottom: 8,
              }}
            >
              Notes
</Text>
<Card>
<Text
                style={{
                  fontSize: 15,
                  color: colors.text,
                  lineHeight: 22,
                }}
              >
                {application.notes}
</Text>
</Card>
</Animated.View>
        )}
<Animated.View
          entering={FadeInUp.duration(400).delay(400)}
          style={{ gap: 10 }}
        >
<Text
            style={{
              fontSize: 13,
              fontWeight: "600",
              color: colors.textSecondary,
              textTransform: "uppercase",
              letterSpacing: 0.5,
              marginBottom: 4,
            }}
          >
            Status Timeline
</Text>
<Card>
<View style={{ gap: 12 }}>
<View style={{ flexDirection: "row", gap: 12 }}>
<View style={{ alignItems: "center", gap: 4 }}>
<View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: colors.primary + "20",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
<Ionicons name="checkmark" size={18} color={colors.primary} />
</View>
<View
                    style={{
                      width: 2,
                      flex: 1,
                      backgroundColor: colors.borderLight,
                    }}
                  />
</View>
<View style={{ gap: 2, paddingBottom: 12 }}>
<Text
                    style={{
                      fontSize: 15,
                      fontWeight: "600",
                      color: colors.text,
                    }}
                  >
                    Application Submitted
</Text>
<Text
                    style={{
                      fontSize: 13,
                      color: colors.textTertiary,
                    }}
                  >
                    {format(parseISO(application.createdAt), "MMM d, yyyy")}
</Text>
</View>
</View>
<View style={{ flexDirection: "row", gap: 12 }}>
<View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor:
                      application.status !== "wishlist"
                        ? colors.primary + "20"
                        : colors.surfaceTertiary,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
<Ionicons
                    name={
                      application.status !== "wishlist"
                        ? "checkmark"
                        : "ellipse"
                    }
                    size={18}
                    color={
                      application.status !== "wishlist"
                        ? colors.primary
                        : colors.textTertiary
                    }
                  />
</View>
<View style={{ gap: 2 }}>
<Text
                    style={{
                      fontSize: 15,
                      fontWeight: "600",
                      color:
                        application.status !== "wishlist"
                          ? colors.text
                          : colors.textTertiary,
                    }}
                  >
                    Current: {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
</Text>
</View>
</View>
</View>
</Card>
</Animated.View>
</ScrollView>
<ConfirmationDialog
        visible={showDelete}
        title="Delete Application"
        message={`Are you sure you want to delete the application at ${application.company}?`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
      />
</View>
  );
}
