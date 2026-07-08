import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/useTheme";
import { useJobs } from "@/hooks/useJobs";
import { SkeletonLoader } from "@/components/ui/SkeletonLoader";
import { Shadow } from "@/constants/theme";
import { formatSalary, timeAgo } from "@/services/jobs";
import { JobOpportunity } from "@/types";
export default function JobsScreen() {
  const router = useRouter();
  const { data: jobs = [], isLoading } = useJobs();
  const { isDark } = useColorScheme();
  const colors = isDark ? Colors.dark : Colors.light;
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Animated.View
        entering={FadeInUp.duration(300)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
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
            fontSize: 20,
            fontWeight: "700",
            color: colors.text,
          }}
        >
          Job Opportunities
        </Text>
      </Animated.View>
      {isLoading ? (
        <View style={{ padding: 20 }}>
          <SkeletonLoader count={6} />
        </View>
      ) : jobs.length === 0 ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <Ionicons name="briefcase-outline" size={64} color={colors.textTertiary} />
          <Text
            style={{
              fontSize: 16,
              color: colors.textSecondary,
              marginTop: 16,
              textAlign: "center",
            }}
          >
            No jobs found
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 20, gap: 12, paddingBottom: 40 }}
        >
          {jobs.map((job: JobOpportunity, i: number) => (
            <TouchableOpacity
              key={job.jobId}
              activeOpacity={0.9}
              onPress={() => router.push(`/job/${job.jobId}`)}
            >
              <Animated.View
                entering={FadeInUp.duration(400).delay(i * 50)}
                style={{
                  padding: 16,
                  borderRadius: 16,
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.borderLight,
                  ...Shadow.md,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
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
                    <Ionicons name="briefcase" size={22} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "700",
                        color: colors.text,
                      }}
                      numberOfLines={1}
                    >
                      {job.jobTitle}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: colors.textSecondary,
                      }}
                      numberOfLines={1}
                    >
                      {job.employerName}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 12,
                        marginTop: 4,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 3,
                        }}
                      >
                        <Ionicons
                          name="location-outline"
                          size={11}
                          color={colors.textTertiary}
                        />
                        <Text
                          style={{
                            fontSize: 11,
                            color: colors.textTertiary,
                          }}
                          numberOfLines={1}
                        >
                          {job.locationName}
                        </Text>
                      </View>
                      {job.jobType && (
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 3,
                          }}
                        >
                          <Ionicons
                            name="briefcase-outline"
                            size={11}
                            color={colors.textTertiary}
                          />
                          <Text
                            style={{
                              fontSize: 11,
                              color: colors.textTertiary,
                            }}
                          >
                            {job.jobType}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: 12,
                    paddingTop: 12,
                    borderTopWidth: 1,
                    borderTopColor: colors.borderLight,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: colors.success,
                    }}
                  >
                    {formatSalary(
                      job.minimumSalary,
                      job.maximumSalary,
                      job.currency
                    )}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.textTertiary,
                    }}
                  >
                    {timeAgo(job.datePosted)}
                  </Text>
                </View>
              </Animated.View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
