import { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Platform,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeInUp, FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { format, parseISO } from "date-fns";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { useApplications } from "@/hooks/useApplications";
import { useJobs } from "@/hooks/useJobs";
import { StatisticsCard } from "@/components/ui/StatisticsCard";
import { SearchBar } from "@/components/ui/SearchBar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { FAB } from "@/components/ui/FAB";
import { SkeletonLoader } from "@/components/ui/SkeletonLoader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Card } from "@/components/ui/Card";
import { Header } from "@/components/ui/Header";
import { Shadow } from "@/constants/theme";
import { JobApplication, JobOpportunity } from "@/types";
import { formatSalary, timeAgo } from "@/services/jobs";
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { statistics, applications, isLoading, isRefreshing, refresh } =
    useApplications();
  const { data: jobs = [], isLoading: jobsLoading } = useJobs();
  const { isDark } = useColorScheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const [search, setSearch] = useState("");
  const recentApplications = applications.slice(0, 5);
  const filteredRecent = search
    ? recentApplications.filter(
        (a) =>
          a.company.toLowerCase().includes(search.toLowerCase()) ||
          a.role.toLowerCase().includes(search.toLowerCase())
      )
    : recentApplications;
  const statCards = [
    { title: "Total", value: statistics.total, icon: "briefcase" as const, color: colors.primary },
    { title: "Applied", value: statistics.applied, icon: "send" as const, color: "#3B82F6" },
    {
      title: "Interview",
      value: statistics.interview,
      icon: "calendar" as const,
      color: "#F59E0B",
    },
    {
      title: "Rejected",
      value: statistics.rejected,
      icon: "close-circle" as const,
      color: "#EF4444",
    },
    { title: "Offer", value: statistics.offer, icon: "trophy" as const, color: "#22C55E" },
  ];
  if (isLoading) {
    return (
<View style={{ flex: 1, backgroundColor: colors.background }}>
<Header title="Dashboard" />
<SkeletonLoader count={5} />
</View>
    );
  }
  return (
<View style={{ flex: 1, backgroundColor: colors.background }}>
<ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={
<RefreshControl
            refreshing={isRefreshing}
            onRefresh={refresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
<Animated.View entering={FadeInDown.duration(400).springify()}>
<Header
            title={`${getGreeting()},`}
            subtitle={user?.name || "User"}
            rightIcon="notifications-outline"
            rightAction={() => {}}
          />
</Animated.View>
<View style={{ paddingHorizontal: 20, marginBottom: 16, gap: 16 }}>
<SearchBar value={search} onChangeText={setSearch} />
</View>
<Animated.View
          entering={FadeInUp.duration(500).delay(100)}
          style={{ paddingHorizontal: 20, marginBottom: 20 }}
        >
<ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10 }}
          >
            {statCards.map((stat, i) => (
<View key={stat.title} style={{ width: 130 }}>
<StatisticsCard
                  title={stat.title}
                  value={stat.value}
                  icon={stat.icon}
                  color={stat.color}
                  index={i}
                />
</View>
            ))}
</ScrollView>
</Animated.View>
<View style={{ paddingHorizontal: 20, marginBottom: 12 }}>
<View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
<Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: colors.text,
              }}
            >
              Recent Applications
</Text>
<TouchableOpacity onPress={() => router.push("/(tabs)/applications")}>
<Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: colors.primary,
                }}
              >
                See all
</Text>
</TouchableOpacity>
</View>
</View>
        {filteredRecent.length === 0 ? (
<EmptyState
            title="No applications yet"
            message="Tap the + button to add your first job application"
            icon="document-text-outline"
          />
        ) : (
<View style={{ paddingHorizontal: 20, gap: 12 }}>
            {filteredRecent.map((app: JobApplication, i: number) => (
<TouchableOpacity
                key={app.id}
                onPress={() => router.push(`/application/${app.id}`)}
                activeOpacity={0.95}
              >
<Card index={i}>
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
                        {app.company.charAt(0).toUpperCase()}
</Text>
</View>
<View style={{ flex: 1, gap: 3 }}>
<Text
                        style={{
                          fontSize: 15,
                          fontWeight: "700",
                          color: colors.text,
                        }}
                        numberOfLines={1}
                      >
                        {app.company}
</Text>
<Text
                        style={{
                          fontSize: 13,
                          color: colors.textSecondary,
                        }}
                        numberOfLines={1}
                      >
                        {app.role}
</Text>
</View>
<StatusBadge status={app.status} />
</View>
<View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: 8,
                    }}
                  >
<Text
                      style={{
                        fontSize: 11,
                        color: colors.textTertiary,
                        fontWeight: "500",
                      }}
                    >
                      {app.appliedDate
                        ? format(parseISO(app.appliedDate), "MMM d, yyyy")
                        : ""}
</Text>
                    {app.isFavorite && (
<Ionicons name="heart" size={14} color="#F43F5E" />
                    )}
</View>
</Card>
</TouchableOpacity>
            ))}
</View>
        )}
        <View style={{ paddingHorizontal: 20, marginTop: 24, marginBottom: 12 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: colors.text,
              }}
            >
              Job Opportunities
            </Text>
            {!jobsLoading && jobs.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  const first = jobs[0];
                  if (first.jobUrl) Linking.openURL(first.jobUrl);
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: colors.primary,
                  }}
                >
                  View all
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        {jobsLoading ? (
          <View style={{ paddingHorizontal: 20 }}>
            <SkeletonLoader count={3} />
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
          >
            {jobs.slice(0, 10).map((job: JobOpportunity, i: number) => (
              <TouchableOpacity
                key={job.jobId}
                activeOpacity={0.9}
                onPress={() => router.push(`/job/${job.jobId}`)}
              >
                <Animated.View
                  entering={FadeInUp.duration(400).delay(i * 60)}
                  style={{
                    width: 260,
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
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      backgroundColor: colors.primaryLight,
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 10,
                    }}
                  >
                    <Ionicons
                      name="briefcase"
                      size={20}
                      color={colors.primary}
                    />
                  </View>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "700",
                      color: colors.text,
                    }}
                    numberOfLines={1}
                  >
                    {job.jobTitle}
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      color: colors.textSecondary,
                      marginTop: 2,
                    }}
                    numberOfLines={1}
                  >
                    {job.employerName}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                      marginTop: 8,
                    }}
                  >
                    <Ionicons
                      name="location-outline"
                      size={12}
                      color={colors.textTertiary}
                    />
                    <Text
                      style={{
                        fontSize: 11,
                        color: colors.textTertiary,
                        flex: 1,
                      }}
                      numberOfLines={1}
                    >
                      {job.locationName}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: 6,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
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
                        fontSize: 11,
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
        <View style={{ height: 16 }} />
      </ScrollView>
      <FAB onPress={() => router.push("/application/add")} />
    </View>
  );
}
