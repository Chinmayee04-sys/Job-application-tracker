import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/useTheme";
import { useApplications } from "@/hooks/useApplications";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ApplicationStatus } from "@/types";
const applicationSchema = z.object({
  company: z.string().min(1, "Company is required"),
  role: z.string().min(1, "Role is required"),
  location: z.string().optional(),
  salary: z.string().optional(),
  jobUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  status: z.enum(["wishlist", "applied", "interview", "rejected", "offer"]),
  notes: z.string().optional(),
  interviewDate: z.string().optional(),
  isFavorite: z.boolean(),
});
type ApplicationForm = z.infer<typeof applicationSchema>;
const statuses: ApplicationStatus[] = [
  "wishlist",
  "applied",
  "interview",
  "rejected",
  "offer",
];
export default function AddApplicationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    company?: string;
    role?: string;
    location?: string;
    salary?: string;
    url?: string;
  }>();
  const { add } = useApplications();
  const { isDark } = useColorScheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const [isLoading, setIsLoading] = useState(false);
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ApplicationForm>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      company: params.company || "",
      role: params.role || "",
      location: params.location || "",
      salary: params.salary || "",
      jobUrl: params.url || "",
      status: "applied",
      notes: "",
      interviewDate: "",
      isFavorite: false,
    },
  });
  const selectedStatus = watch("status");
  const isFavorite = watch("isFavorite");
  const onSubmit = async (data: ApplicationForm) => {
    setIsLoading(true);
    try {
      await add({
        company: data.company,
        role: data.role,
        location: data.location || "",
        salary: data.salary || "",
        jobUrl: data.jobUrl || "",
        status: data.status,
        notes: data.notes || "",
        interviewDate: data.interviewDate || null,
        isFavorite: data.isFavorite,
      });
      router.back();
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };
  return (
<KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
<ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
<Animated.View
          entering={FadeInUp.duration(400)}
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
<Ionicons name="close" size={22} color={colors.text} />
</TouchableOpacity>
<Text
            style={{
              fontSize: 17,
              fontWeight: "700",
              color: colors.text,
            }}
          >
            New Application
</Text>
<View style={{ width: 40 }} />
</Animated.View>
<View style={{ padding: 20, gap: 20 }}>
<Animated.View entering={FadeInUp.duration(300).delay(100)}>
<Controller
              control={control}
              name="company"
              render={({ field: { onChange, value } }) => (
<Input
                  label="Company *"
                  placeholder="e.g. Google, Stripe"
                  value={value}
                  onChangeText={onChange}
                  error={errors.company?.message}
                  leftIcon={
<Ionicons name="business-outline" size={18} color={colors.textTertiary} />
                  }
                />
              )}
            />
</Animated.View>
<Animated.View entering={FadeInUp.duration(300).delay(150)}>
<Controller
              control={control}
              name="role"
              render={({ field: { onChange, value } }) => (
<Input
                  label="Role *"
                  placeholder="e.g. Senior Frontend Engineer"
                  value={value}
                  onChangeText={onChange}
                  error={errors.role?.message}
                  leftIcon={
<Ionicons name="code-slash-outline" size={18} color={colors.textTertiary} />
                  }
                />
              )}
            />
</Animated.View>
<Animated.View
            entering={FadeInUp.duration(300).delay(200)}
            style={{ flexDirection: "row", gap: 10 }}
          >
<View style={{ flex: 1 }}>
<Controller
                control={control}
                name="location"
                render={({ field: { onChange, value } }) => (
<Input
                    label="Location"
                    placeholder="Remote / NYC"
                    value={value}
                    onChangeText={onChange}
                    leftIcon={
<Ionicons name="location-outline" size={18} color={colors.textTertiary} />
                    }
                  />
                )}
              />
</View>
<View style={{ flex: 1 }}>
<Controller
                control={control}
                name="salary"
                render={({ field: { onChange, value } }) => (
<Input
                    label="Salary"
                    placeholder="$120k"
                    value={value}
                    onChangeText={onChange}
                    leftIcon={
<Ionicons name="cash-outline" size={18} color={colors.textTertiary} />
                    }
                  />
                )}
              />
</View>
</Animated.View>
<Animated.View entering={FadeInUp.duration(300).delay(250)}>
<Controller
              control={control}
              name="jobUrl"
              render={({ field: { onChange, value } }) => (
<Input
                  label="Job URL"
                  placeholder="https://company.com/jobs/..."
                  value={value}
                  onChangeText={onChange}
                  autoCapitalize="none"
                  error={errors.jobUrl?.message}
                  leftIcon={
<Ionicons name="link-outline" size={18} color={colors.textTertiary} />
                  }
                />
              )}
            />
</Animated.View>
<Animated.View entering={FadeInUp.duration(300).delay(300)}>
<Text
              style={{
                fontSize: 13,
                fontWeight: "600",
                color: colors.textSecondary,
                letterSpacing: 0.3,
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Status
</Text>
<View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              {statuses.map((status) => (
<TouchableOpacity
                  key={status}
                  onPress={() => setValue("status", status)}
                  style={{
                    opacity: selectedStatus === status ? 1 : 0.5,
                  }}
                >
<StatusBadge status={status} size="md" />
</TouchableOpacity>
              ))}
</View>
            {errors.status && (
<Text style={{ fontSize: 12, color: colors.error, marginTop: 4 }}>
                {errors.status.message}
</Text>
            )}
</Animated.View>
<Animated.View entering={FadeInUp.duration(300).delay(350)}>
<Controller
              control={control}
              name="interviewDate"
              render={({ field: { onChange, value } }) => (
<Input
                  label="Interview Date"
                  placeholder="2026-07-15T14:00:00.000Z"
                  value={value}
                  onChangeText={onChange}
                  autoCapitalize="none"
                  leftIcon={
<Ionicons name="calendar-outline" size={18} color={colors.textTertiary} />
                  }
                />
              )}
            />
</Animated.View>
<Animated.View entering={FadeInUp.duration(300).delay(400)}>
<Controller
              control={control}
              name="notes"
              render={({ field: { onChange, value } }) => (
<Input
                  label="Notes"
                  placeholder="Round 1 completed, waiting for feedback..."
                  value={value}
                  onChangeText={onChange}
                  multiline
                  numberOfLines={4}
                  style={{ minHeight: 80, textAlignVertical: "top" }}
                  leftIcon={
<Ionicons name="document-text-outline" size={18} color={colors.textTertiary} />
                  }
                />
              )}
            />
</Animated.View>
<Animated.View entering={FadeInUp.duration(300).delay(450)}>
<TouchableOpacity
              onPress={() => setValue("isFavorite", !isFavorite)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                padding: 14,
                borderRadius: 14,
                backgroundColor: colors.surfaceSecondary,
                borderWidth: 1,
                borderColor: colors.borderLight,
              }}
            >
<Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={22}
                color={isFavorite ? "#F43F5E" : colors.textTertiary}
              />
<Text
                style={{
                  fontSize: 15,
                  fontWeight: "600",
                  color: isFavorite ? "#F43F5E" : colors.text,
                }}
              >
                {isFavorite ? "Favorited" : "Add to Favorites"}
</Text>
</TouchableOpacity>
</Animated.View>
<Animated.View entering={FadeInUp.duration(300).delay(500)}>
<Button
              title="Save Application"
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
              size="lg"
              style={{ marginTop: 8 }}
            />
</Animated.View>
</View>
</ScrollView>
</KeyboardAvoidingView>
  );
}
