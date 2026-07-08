import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/store/AuthContext";
import { AuthGuard } from "@/components/AuthGuard";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useNotificationSetup } from "@/services/notifications";
import { useTheme } from "@/hooks/useTheme";
import "../global.css";

const queryClient = new QueryClient();

function AppContent({ children }: { children: React.ReactNode }) {
  const { isDark } = useTheme();
  useNotificationSetup();

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style={isDark ? "light" : "dark"} />
        <AuthProvider>
          <AuthGuard>{children}</AuthGuard>
        </AuthProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent>
        <Slot />
      </AppContent>
    </QueryClientProvider>
  );
}
