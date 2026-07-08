import { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { Loader } from "@/components/ui/Loader";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments?.[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      setTimeout(() => router.replace("/login"), 50);
    } else if (isAuthenticated && inAuthGroup) {
      setTimeout(() => router.replace("/"), 50);
    }
  }, [isAuthenticated, isLoading, segments?.[0]]);

  if (isLoading) {
    return <Loader fullScreen />;
  }

  return <>{children}</>;
}
