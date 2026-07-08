import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Animated, { FadeInUp, FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { useColorScheme } from "@/hooks/useTheme";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const { isDark } = useColorScheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    setError("");
    try {
      await register(data.name, data.email, data.password);
      router.replace("/");
    } catch (e: any) {
      setError(e.message || "Registration failed");
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
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ padding: 24, gap: 32 }}>
          <Animated.View
            entering={FadeInDown.duration(600).springify()}
            style={{ gap: 8, paddingTop: 40 }}
          >
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                backgroundColor: colors.primary + "15",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 8,
              }}
            >
              <Ionicons name="briefcase" size={28} color={colors.primary} />
            </View>
            <Text
              style={{
                fontSize: 32,
                fontWeight: "800",
                color: colors.text,
                letterSpacing: -1,
              }}
            >
              Create account
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: colors.textSecondary,
                lineHeight: 22,
              }}
            >
              Start tracking your job search journey
            </Text>
          </Animated.View>
          <Animated.View
            entering={FadeInUp.duration(600).delay(200).springify()}
            style={{ gap: 16 }}
          >
            {error && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  padding: 12,
                  borderRadius: 12,
                  backgroundColor: colors.error + "15",
                }}
              >
                <Ionicons name="alert-circle" size={18} color={colors.error} />
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.error,
                    fontWeight: "500",
                    flex: 1,
                  }}
                >
                  {error}
                </Text>
              </View>
            )}

            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Full Name"
                  placeholder="John Doe"
                  value={value}
                  onChangeText={onChange}
                  error={errors.name?.message}
                  leftIcon={
                    <Ionicons name="person-outline" size={18} color={colors.textTertiary} />
                  }
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Email"
                  placeholder="you@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                  error={errors.email?.message}
                  leftIcon={
                    <Ionicons name="mail-outline" size={18} color={colors.textTertiary} />
                  }
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Password"
                  placeholder="At least 6 characters"
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                  error={errors.password?.message}
                  leftIcon={
                    <Ionicons name="lock-closed-outline" size={18} color={colors.textTertiary} />
                  }
                />
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Confirm Password"
                  placeholder="Repeat your password"
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                  error={errors.confirmPassword?.message}
                  leftIcon={
                    <Ionicons name="lock-closed-outline" size={18} color={colors.textTertiary} />
                  }
                />
              )}
            />

            <Button
              title="Create Account"
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
              size="lg"
              style={{ marginTop: 8 }}
            />
          </Animated.View>
          <Animated.View
            entering={FadeInUp.duration(600).delay(400)}
            style={{
              flexDirection: "row",
              justifyContent: "center",
              gap: 4,
            }}
          >
            <Text style={{ fontSize: 15, color: colors.textSecondary }}>
              Already have an account?
            </Text>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "700",
                  color: colors.primary,
                }}
              >
                Sign In
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
