import { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/useTheme";
import { useApplications } from "@/hooks/useApplications";
import { ApplicationCard } from "@/components/ApplicationCard";
import { SearchBar } from "@/components/ui/SearchBar";
import { FilterModal } from "@/components/ui/FilterModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { Loader } from "@/components/ui/Loader";
import { Header } from "@/components/ui/Header";
import { FAB } from "@/components/ui/FAB";
import { SkeletonLoader } from "@/components/ui/SkeletonLoader";
import { ApplicationStatus, SortField } from "@/types";
const statusFilters = [
  { key: "all", label: "All" },
  { key: "wishlist", label: "Wishlist" },
  { key: "applied", label: "Applied" },
  { key: "interview", label: "Interview" },
  { key: "rejected", label: "Rejected" },
  { key: "offer", label: "Offer" },
];
const sortOptions = [
  { key: "date", label: "Date" },
  { key: "company", label: "Company" },
  { key: "status", label: "Status" },
  { key: "salary", label: "Salary" },
];
export default function ApplicationsScreen() {
  const router = useRouter();
  const { applications, isLoading, isRefreshing, refresh, remove, toggleFavorite } =
    useApplications();
  const { isDark } = useColorScheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("date");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const filtered = useMemo(() => {
    let result = [...applications];
    if (statusFilter !== "all") {
      result = result.filter((a) => a.status === statusFilter);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.company.toLowerCase().includes(q) ||
          a.role.toLowerCase().includes(q) ||
          a.location.toLowerCase().includes(q)
      );
    }
    result.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "date":
          cmp =
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          break;
        case "company":
          cmp = a.company.localeCompare(b.company);
          break;
        case "status": {
          const order = ["wishlist", "applied", "interview", "rejected", "offer"];
          cmp = order.indexOf(a.status) - order.indexOf(b.status);
          break;
        }
        case "salary": {
          const sa = parseInt(a.salary.replace(/[^0-9]/g, "")) || 0;
          const sb = parseInt(b.salary.replace(/[^0-9]/g, "")) || 0;
          cmp = sb - sa;
          break;
        }
      }
      return cmp;
    });
    return result;
  }, [applications, search, statusFilter, sortField]);
  const handleDelete = async (id: string) => {
    await remove(id);
  };
  const handleFavorite = async (id: string) => {
    await toggleFavorite(id);
  };
  if (isLoading) {
    return (
<View style={{ flex: 1, backgroundColor: colors.background }}>
<Header title="Applications" />
<SkeletonLoader count={5} />
</View>
    );
  }
  return (
<View style={{ flex: 1, backgroundColor: colors.background }}>
<Animated.View entering={FadeInDown.duration(400)}>
<Header
          title="Applications"
          subtitle={`${filtered.length} total`}
        />
</Animated.View>
<View style={{ paddingHorizontal: 20, gap: 10, marginBottom: 12 }}>
<SearchBar value={search} onChangeText={setSearch} />
<View style={{ flexDirection: "row", gap: 8 }}>
<TouchableOpacity
            onPress={() => setShowStatusModal(true)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 10,
              backgroundColor: colors.surfaceSecondary,
              borderWidth: 1,
              borderColor: colors.borderLight,
            }}
          >
<Ionicons name="funnel" size={14} color={colors.textSecondary} />
<Text
              style={{
                fontSize: 13,
                fontWeight: "600",
                color: colors.textSecondary,
              }}
            >
              {statusFilters.find((f) => f.key === statusFilter)?.label ||
                "Status"}
</Text>
</TouchableOpacity>
<TouchableOpacity
            onPress={() => setShowSortModal(true)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 10,
              backgroundColor: colors.surfaceSecondary,
              borderWidth: 1,
              borderColor: colors.borderLight,
            }}
          >
<Ionicons name="swap-vertical" size={14} color={colors.textSecondary} />
<Text
              style={{
                fontSize: 13,
                fontWeight: "600",
                color: colors.textSecondary,
              }}
            >
              {sortOptions.find((s) => s.key === sortField)?.label || "Sort"}
</Text>
</TouchableOpacity>
</View>
</View>
<ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 120,
          flexGrow: 1,
        }}
        refreshControl={
<RefreshControl
            refreshing={isRefreshing}
            onRefresh={refresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {filtered.length === 0 ? (
<EmptyState
            title="No applications found"
            message={
              search || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "Tap the + button to add your first application"
            }
            icon="folder-open-outline"
          />
        ) : (
<View style={{ gap: 4 }}>
            {filtered.map((app, i) => (
<ApplicationCard
                key={app.id}
                application={app}
                index={i}
                onPress={() => router.push(`/application/${app.id}`)}
                onDelete={() => handleDelete(app.id)}
                onFavorite={() => handleFavorite(app.id)}
                onEdit={() => router.push(`/application/${app.id}`)}
              />
            ))}
</View>
        )}
</ScrollView>
<FAB onPress={() => router.push("/application/add")} />
<FilterModal
        visible={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title="Filter by Status"
        options={statusFilters}
        selected={statusFilter}
        onSelect={setStatusFilter}
      />
<FilterModal
        visible={showSortModal}
        onClose={() => setShowSortModal(false)}
        title="Sort by"
        options={sortOptions}
        selected={sortField}
        onSelect={(key) => setSortField(key as SortField)}
      />
</View>
  );
}
