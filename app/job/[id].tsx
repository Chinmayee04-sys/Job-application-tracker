import { useState } from "react";
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
import { useJobs } from "@/hooks/useJobs";
import { Button } from "@/components/ui/Button";
import { Loader } from "@/components/ui/Loader";
import { formatSalary, timeAgo } from "@/services/jobs";
export default function JobDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: jobs = [], isLoading } = useJobs();
  const { isDark } = useColorScheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const job = jobs.find((j) => String(j.jobId) === id);
  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <Loader />
      </View>
    );
  }
  if (!job) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <Ionicons name="briefcase-outline" size={64} color={colors.textTertiary} />
        <Text
          style={{
            fontSize: 18,
            color: colors.textSecondary,
            marginTop: 16,
            textAlign: "center",
          }}
        >
          Job not found
        </Text>
        <View style={{ marginTop: 20 }}>
          <Button title="Go Back" onPress={() => router.back()} />
        </View>
      </View>
    );
  }
  const infoRows = [
    { icon: "business-outline" as const, label: "Company", value: job.employerName },
    { icon: "location-outline" as const, label: "Location", value: job.locationName },
    {
      icon: "cash-outline" as const,
      label: "Salary",
      value: formatSalary(job.minimumSalary, job.maximumSalary, job.currency),
    },
    {
      icon: "calendar-outline" as const,
      label: "Posted",
      value: timeAgo(job.datePosted),
    },
    {
      icon: "briefcase-outline" as const,
      label: "Type",
      value: job.jobType,
    },
    {
      icon: "people-outline" as const,
      label: "Applicants",
      value: String(job.applicationCount),
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
        <Text
          style={{
            fontSize: 17,
            fontWeight: "700",
            color: colors.text,
          }}
          numberOfLines={1}
        >
          Job Details
        </Text>
        <View style={{ width: 40 }} />
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
              {job.employerName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={{ gap: 4 }}>
            <Text
              style={{
                fontSize: 22,
                fontWeight: "800",
                color: colors.text,
                letterSpacing: -0.5,
              }}
            >
              {job.jobTitle}
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: colors.textSecondary,
                fontWeight: "500",
              }}
            >
              {job.employerName}
            </Text>
          </View>
          {job.minimumSalary > 0 && (
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: colors.success,
              }}
            >
              {formatSalary(job.minimumSalary, job.maximumSalary, job.currency)}
            </Text>
          )}
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
        {job.jobDescription && (
          <Animated.View entering={FadeInUp.duration(400).delay(250)}>
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
              Description
            </Text>
            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: colors.borderLight,
                padding: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  color: colors.text,
                  lineHeight: 22,
                }}
              >
                {job.jobDescription}
              </Text>
            </View>
          </Animated.View>
        )}
        <Animated.View entering={FadeInUp.duration(400).delay(300)} style={{ gap: 10 }}>
          {job.jobUrl && (
            <Button
              title="Apply on Reed"
              onPress={() => Linking.openURL(job.jobUrl)}
              icon={<Ionicons name="open-outline" size={18} color="#fff" />}
            />
          )}
          <Button
            title="Save to Applications"
            variant="secondary"
            onPress={() =>
              router.push(
                `/application/add?company=${encodeURIComponent(job.employerName)}&role=${encodeURIComponent(job.jobTitle)}&location=${encodeURIComponent(job.locationName)}&salary=${encodeURIComponent(formatSalary(job.minimumSalary, job.maximumSalary, job.currency))}&url=${encodeURIComponent(job.jobUrl || "")}`
              )
            }
            icon={<Ionicons name="bookmark-outline" size={18} color={colors.primary} />}
          />
        </Animated.View>
      </ScrollView>
    </View>
  );
}
